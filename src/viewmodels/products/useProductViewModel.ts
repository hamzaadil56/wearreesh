"use client";

import { useState, useCallback, useMemo } from "react";
import { Product, ProductVariant } from "@/models/product/Product.model";
import { ProductRepository } from "@/models/product/ProductRepository";
import { ProductData } from "@/models/product/Product.model";
import { ProductViewModel } from "@/shared/types/viewModels";

export interface ProductViewState {
	product: ProductViewModel | null;
	selectedVariant: ProductVariant | null;
	selectedOptions: Record<string, string>;
	quantity: number;
	isLoading: boolean;
	error: string | null;
}

export interface UseProductViewModelReturn {
	// State
	product: ProductViewModel | null;
	selectedVariant: ProductVariant | null;
	selectedOptions: Record<string, string>;
	quantity: number;
	isAvailableForSale: boolean;
	isSelectedVariantAvailable: boolean;
	hasCompareAtPrice: boolean;
	isLoading: boolean;
	error: string | null;

	// Actions
	loadProduct: (handle: string) => Promise<void>;
	selectOption: (optionName: string, value: string) => void;
	updateQuantity: (quantity: number) => void;
	incrementQuantity: () => void;
	decrementQuantity: () => void;
	addToCart: () => Promise<void>;
	clearError: () => void;
}

export function useProductViewModel(
	product?: ProductViewModel
): UseProductViewModelReturn {
	// Initialize repository
	const repo = useMemo(() => new ProductRepository(), []);

	// State management using React hooks
	const [viewState, setViewState] = useState<ProductViewState>({
		product: product || null,
		selectedVariant: null,
		selectedOptions: {},
		quantity: 1,
		isLoading: false,
		error: null,
	});

	const mapToViewModel = useCallback((product: Product): ProductViewModel => {
		const primaryImage = product.primaryImage;

		return {
			id: product.id,
			title: product.title,
			description: product.description,
			totalInventory: product.totalInventory,
			variants: product.variants,
			primaryImage: primaryImage || product.images?.[0],
			images: product.images,
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
			setViewState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await operation();
				setViewState((prev) => ({ ...prev, isLoading: false }));
				return { success: true, data: result };
			} catch (err) {
				const errorMsg =
					err instanceof Error ? err.message : errorMessage;
				setViewState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMsg,
				}));
				return {
					success: false,
					error: err instanceof Error ? err : new Error(errorMessage),
				};
			}
		},
		[]
	);

	// Load product by handle
	const loadProduct = useCallback(
		async (handle: string) => {
			const result = await executeOperation(
				() => repo.findByHandle(handle),
				"Failed to load product"
			);

			if (result?.success && result?.data) {
				const product = result.data;
				const productViewModel = mapToViewModel(product);
				const defaultOptions = getDefaultOptions(product);
				const selectedVariant = findMatchingVariant(
					productViewModel,
					defaultOptions
				);

				setViewState((prev) => ({
					...prev,
					product: mapToViewModel(product),
					selectedVariant,
					selectedOptions: defaultOptions,
					error: null,
				}));
			}
		},
		[executeOperation, repo]
	);

	// Select product option
	const selectOption = useCallback(
		(optionName: string, value: string) => {
			if (!viewState.product) return;

			const newSelectedOptions = {
				...viewState.selectedOptions,
				[optionName]: value,
			};

			// Find matching variant
			const matchingVariant = findMatchingVariant(
				viewState.product,
				newSelectedOptions
			);

			setViewState((prev) => ({
				...prev,
				selectedOptions: newSelectedOptions,
				selectedVariant: matchingVariant,
			}));
		},
		[viewState.product, viewState.selectedOptions]
	);

	// Update quantity
	const updateQuantity = useCallback((quantity: number) => {
		if (quantity < 1) return;

		setViewState((prev) => {
			const maxQuantity = prev.product?.totalInventory
				? Math.min(10, prev.product.totalInventory)
				: 10;

			return {
				...prev,
				quantity: Math.min(quantity, maxQuantity),
			};
		});
	}, []);

	// Increment quantity
	const incrementQuantity = useCallback(() => {
		updateQuantity(viewState.quantity + 1);
	}, [viewState.quantity, updateQuantity]);

	// Decrement quantity
	const decrementQuantity = useCallback(() => {
		updateQuantity(viewState.quantity - 1);
	}, [viewState.quantity, updateQuantity]);

	// Add to cart
	const addToCart = useCallback(async () => {
		if (!viewState.product || !viewState.selectedVariant) return;

		setViewState((prev) => ({ ...prev, isLoading: true }));

		try {
			// This would typically call a cart service
			// For now, we'll simulate the operation
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Reset quantity after successful add
			setViewState((prev) => ({
				...prev,
				quantity: 1,
				isLoading: false,
			}));
		} catch (error) {
			setViewState((prev) => ({
				...prev,
				isLoading: false,
				error: "Failed to add item to cart",
			}));
		}
	}, [viewState.product, viewState.selectedVariant]);

	// Clear error
	const clearError = useCallback(() => {
		setViewState((prev) => ({ ...prev, error: null }));
	}, []);

	// Computed properties
	const isAvailableForSale = useMemo(() => {
		return viewState.product?.availableForSale || false;
	}, [viewState.product]);

	const isSelectedVariantAvailable = useMemo(() => {
		return viewState.selectedVariant?.availableForSale || false;
	}, [viewState.selectedVariant]);

	const formattedCompareAtPrice = useMemo(() => {
		if (!viewState.selectedVariant?.compareAtPrice) return null;

		const { amount, currencyCode } =
			viewState.selectedVariant.compareAtPrice;
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currencyCode,
		}).format(parseFloat(amount));
	}, [viewState.selectedVariant]);

	const hasCompareAtPrice = useMemo(() => {
		return !!viewState.selectedVariant?.compareAtPrice;
	}, [viewState.selectedVariant]);

	// Helper functions
	const getDefaultOptions = useCallback(
		(product: Product): Record<string, string> => {
			const defaultOptions: Record<string, string> = {};

			product.options.forEach((option) => {
				if (option.values.length > 0) {
					defaultOptions[option.name] = option.values[0];
				}
			});

			return defaultOptions;
		},
		[]
	);

	const findMatchingVariant = useCallback(
		(
			product: ProductViewModel,
			selectedOptions: Record<string, string>
		): ProductVariant | null => {
			return (
				product.variants.find((variant) => {
					return variant.selectedOptions.every((option) => {
						return selectedOptions[option.name] === option.value;
					});
				}) || null
			);
		},
		[]
	);

	// Return state and actions
	return {
		// State
		product: viewState?.product,
		selectedVariant: viewState.selectedVariant,
		selectedOptions: viewState.selectedOptions,
		quantity: viewState.quantity,
		isAvailableForSale,
		isSelectedVariantAvailable,
		hasCompareAtPrice,
		isLoading: viewState.isLoading,
		error: viewState.error,

		// Actions
		loadProduct,
		selectOption,
		updateQuantity,
		incrementQuantity,
		decrementQuantity,
		addToCart,
		clearError,
	};
}
