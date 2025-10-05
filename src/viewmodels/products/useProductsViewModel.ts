"use client";

import { useState, useCallback, useMemo } from "react";
import { Product } from "@/models/product/Product.model";
import { ProductRepository } from "@/models/product/ProductRepository";
import { SearchParams, PaginatedResult } from "@/models/core/types";
import type { ProductOption } from "@/shared/lib/shopify/types";
import { ProductViewModel } from "@/shared/types/viewModels";

export interface ProductsViewState {
	products: ProductViewModel[];
	totalCount: number;
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	searchQuery: string;
	sortBy: string;
	sortOrder: "asc" | "desc";
	selectedCollection?: string;
}

export interface UseProductsViewModelReturn {
	// State
	products: ProductViewModel[];
	totalCount: number;
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	searchQuery: string;
	sortBy: string;
	sortOrder: "asc" | "desc";
	selectedCollection?: string;
	isLoading: boolean;
	error: string | null;

	// Actions
	loadProducts: (params?: Partial<SearchParams>) => Promise<void>;
	loadProductsByCollection: (collectionHandle: string) => Promise<void>;
	searchProducts: (query: string) => Promise<void>;
	loadNextPage: () => Promise<void>;
	loadPreviousPage: () => Promise<void>;
	changeSortOrder: (
		sortBy: string,
		sortOrder: "asc" | "desc"
	) => Promise<void>;
	clearSearch: () => Promise<void>;
	getProduct: (handle: string) => Promise<ProductViewModel | null>;
	clearError: () => void;
}

export function useProductsViewModel(
	products?: ProductViewModel[]
): UseProductsViewModelReturn {
	// Initialize repository
	const repo = useMemo(() => new ProductRepository(), []);

	// State management using React hooks
	const [viewState, setViewState] = useState<ProductsViewState>({
		products: products ?? [],
		totalCount: products?.length ?? 0,
		currentPage: 1,
		totalPages: 0,
		hasNextPage: false,
		hasPreviousPage: false,
		searchQuery: "",
		sortBy: "TITLE",
		sortOrder: "asc",
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Helper function to map domain model to view model
	const mapToViewModel = useCallback((product: Product): ProductViewModel => {
		const primaryImage = product.primaryImage;

		return {
			id: product.id,
			title: product.title,
			description: product.description,
			totalInventory: product.totalInventory,
			variants: product.variants,
			images: product.images,
			primaryImage: primaryImage || product.images?.[0],
			handle: product.handle,
			imageUrl: primaryImage?.url || "/placeholder-image.jpg",
			imageAlt: primaryImage?.altText || product.title,
			price: product.priceRange.minVariantPrice.amount,
			currencyCode: product.priceRange.minVariantPrice.currencyCode,
			shortDescription: product.getShortDescription(100),
			formattedPrice: product.formattedPriceRange,
			formattedCompareAtPrice:
				product.formattedCompareAtPrice || undefined,
			availableForSale: product.availableForSale,
			hasMultipleVariants: product.hasMultipleVariants,
			tags: product.tags,
			options: product.options,
		};
	}, []);

	// Helper function to execute operations with loading and error handling
	const executeOperation = useCallback(
		async <T>(
			operation: () => Promise<T>,
			errorMessage: string
		): Promise<{ success: boolean; data?: T; error?: Error }> => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await operation();
				setIsLoading(false);
				return { success: true, data: result };
			} catch (err) {
				setIsLoading(false);
				const errorMsg =
					err instanceof Error ? err.message : errorMessage;
				setError(errorMsg);
				return {
					success: false,
					error: err instanceof Error ? err : new Error(errorMessage),
				};
			}
		},
		[]
	);

	// Load products with optional search and pagination
	const loadProducts = useCallback(
		async (params?: Partial<SearchParams>) => {
			const searchParams: SearchParams = {
				query: params?.query || viewState.searchQuery,
				pagination: {
					page: params?.pagination?.page || viewState.currentPage,
					limit: params?.pagination?.limit || 20,
					sortBy: params?.pagination?.sortBy || viewState.sortBy,
					sortOrder:
						params?.pagination?.sortOrder || viewState.sortOrder,
				},
			};

			const result = await executeOperation(
				() => repo.search(searchParams),
				"Failed to load products"
			);

			if (result?.success && result?.data) {
				setViewState((prev) => ({
					...prev,
					products:
						result.data?.items.map(mapToViewModel) ?? prev.products,
					totalCount: result.data?.totalCount ?? prev.totalCount,
					currentPage: result.data?.currentPage ?? prev.currentPage,
					totalPages: result.data?.totalPages ?? prev.totalPages,
					hasNextPage: result.data?.hasNextPage ?? prev.hasNextPage,
					hasPreviousPage:
						result.data?.hasPreviousPage ?? prev.hasPreviousPage,
					searchQuery: searchParams.query || "",
					sortBy: searchParams.pagination?.sortBy || "title",
					sortOrder: searchParams.pagination?.sortOrder || "asc",
				}));
			}
		},
		[
			viewState.searchQuery,
			viewState.currentPage,
			viewState.sortBy,
			viewState.sortOrder,
			executeOperation,
			repo,
			mapToViewModel,
		]
	);

	// Load products by collection
	const loadProductsByCollection = useCallback(
		async (collectionHandle: string) => {
			const result = await executeOperation(
				() => repo.findByCollection(collectionHandle),
				"Failed to load products for collection"
			);

			if (result.success && result.data) {
				setViewState((prev) => ({
					...prev,
					products: result.data?.map(mapToViewModel) ?? prev.products,
					totalCount: result.data?.length ?? prev.totalCount,
					currentPage: 1,
					totalPages: 1,
					hasNextPage: false,
					hasPreviousPage: false,
					selectedCollection: collectionHandle,
				}));
			}
		},
		[executeOperation, repo, mapToViewModel]
	);

	// Search products
	const searchProducts = useCallback(
		async (query: string) => {
			await loadProducts({
				query,
				pagination: {
					page: 1,
					limit: 20,
					sortBy: viewState.sortBy,
					sortOrder: viewState.sortOrder,
				},
			});
		},
		[loadProducts, viewState.sortBy, viewState.sortOrder]
	);

	// Load next page
	const loadNextPage = useCallback(async () => {
		if (!viewState.hasNextPage) return;

		await loadProducts({
			query: viewState.searchQuery,
			pagination: {
				page: viewState.currentPage + 1,
				limit: 20,
				sortBy: viewState.sortBy,
				sortOrder: viewState.sortOrder,
			},
		});
	}, [
		loadProducts,
		viewState.hasNextPage,
		viewState.searchQuery,
		viewState.currentPage,
		viewState.sortBy,
		viewState.sortOrder,
	]);

	// Load previous page
	const loadPreviousPage = useCallback(async () => {
		if (!viewState.hasPreviousPage) return;

		await loadProducts({
			query: viewState.searchQuery,
			pagination: {
				page: viewState.currentPage - 1,
				limit: 20,
				sortBy: viewState.sortBy,
				sortOrder: viewState.sortOrder,
			},
		});
	}, [
		loadProducts,
		viewState.hasPreviousPage,
		viewState.searchQuery,
		viewState.currentPage,
		viewState.sortBy,
		viewState.sortOrder,
	]);

	// Change sort order
	const changeSortOrder = useCallback(
		async (sortBy: string, sortOrder: "asc" | "desc") => {
			await loadProducts({
				query: viewState.searchQuery,
				pagination: {
					page: 1,
					limit: 20,
					sortBy,
					sortOrder,
				},
			});
		},
		[loadProducts, viewState.searchQuery]
	);

	// Clear search and reset
	const clearSearch = useCallback(async () => {
		await loadProducts({
			query: "",
			pagination: {
				page: 1,
				limit: 20,
				sortBy: "title",
				sortOrder: "asc",
			},
		});
	}, [loadProducts]);

	// Get product by handle
	const getProduct = useCallback(
		async (handle: string): Promise<ProductViewModel | null> => {
			const result = await executeOperation(
				() => repo.findByHandle(handle),
				"Failed to load product"
			);

			return result.success && result.data
				? mapToViewModel(result.data)
				: null;
		},
		[executeOperation, repo, mapToViewModel]
	);

	// Clear error
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	// Return state and actions
	return {
		// State
		products: viewState.products,
		totalCount: viewState.totalCount,
		currentPage: viewState.currentPage,
		totalPages: viewState.totalPages,
		hasNextPage: viewState.hasNextPage,
		hasPreviousPage: viewState.hasPreviousPage,
		searchQuery: viewState.searchQuery,
		sortBy: viewState.sortBy,
		sortOrder: viewState.sortOrder,
		selectedCollection: viewState.selectedCollection,
		isLoading,
		error,

		// Actions
		loadProducts,
		loadProductsByCollection,
		searchProducts,
		loadNextPage,
		loadPreviousPage,
		changeSortOrder,
		clearSearch,
		getProduct,
		clearError,
	};
}
