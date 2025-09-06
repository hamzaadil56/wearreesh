import { BaseViewModel } from "../core/BaseViewModel";
import { Product } from "@/models/product/Product.model";
import { ProductRepository } from "@/models/product/ProductRepository";
import { SearchParams, PaginatedResult } from "@/models/core/types";

export interface ProductViewModel {
	id: string;
	title: string;
	description: string;
	handle: string;
	imageUrl: string;
	imageAlt: string;
	price: string;
	currencyCode: string;
	shortDescription: string;
	formattedPrice: string;
	availableForSale: boolean;
	hasMultipleVariants: boolean;
	tags: string[];
}

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

export class ProductsViewModel extends BaseViewModel {
	private repository: ProductRepository;
	private _viewState: ProductsViewState = {
		products: [],
		totalCount: 0,
		currentPage: 1,
		totalPages: 0,
		hasNextPage: false,
		hasPreviousPage: false,
		searchQuery: "",
		sortBy: "TITLE",
		sortOrder: "asc",
	};

	constructor(repository?: ProductRepository) {
		super();
		this.repository = repository || new ProductRepository();
	}

	/**
	 * Get current view state
	 */
	get viewState(): ProductsViewState {
		return { ...this._viewState };
	}

	/**
	 * Get products
	 */
	get products(): ProductViewModel[] {
		return this._viewState.products;
	}

	/**
	 * Get total count
	 */
	get totalCount(): number {
		return this._viewState.totalCount;
	}

	/**
	 * Get current page
	 */
	get currentPage(): number {
		return this._viewState.currentPage;
	}

	/**
	 * Load products with optional search and pagination
	 */
	async loadProducts(params?: Partial<SearchParams>): Promise<void> {
		const searchParams: SearchParams = {
			query: params?.query || this._viewState.searchQuery,
			pagination: {
				page: params?.pagination?.page || this._viewState.currentPage,
				limit: params?.pagination?.limit || 20,
				sortBy: params?.pagination?.sortBy || this._viewState.sortBy,
				sortOrder:
					params?.pagination?.sortOrder || this._viewState.sortOrder,
			},
		};

		const result = await this.executeOperation(
			() => this.repository.search(searchParams),
			"Failed to load products"
		);

		if (result.success) {
			this.updateViewState({
				products: result.data.items.map((p) => this.mapToViewModel(p)),
				totalCount: result.data.totalCount,
				currentPage: result.data.currentPage,
				totalPages: result.data.totalPages,
				hasNextPage: result.data.hasNextPage,
				hasPreviousPage: result.data.hasPreviousPage,
				searchQuery: searchParams.query || "",
				sortBy: searchParams.pagination?.sortBy || "title",
				sortOrder: searchParams.pagination?.sortOrder || "asc",
			});
		}
	}

	/**
	 * Load products by collection
	 */
	async loadProductsByCollection(collectionHandle: string): Promise<void> {
		const result = await this.executeOperation(
			() => this.repository.findByCollection(collectionHandle),
			"Failed to load products for collection"
		);

		if (result.success) {
			this.updateViewState({
				products: result.data.map((p) => this.mapToViewModel(p)),
				totalCount: result.data.length,
				currentPage: 1,
				totalPages: 1,
				hasNextPage: false,
				hasPreviousPage: false,
				selectedCollection: collectionHandle,
			});
		}
	}

	/**
	 * Search products
	 */
	async searchProducts(query: string): Promise<void> {
		await this.loadProducts({
			query,
			pagination: {
				page: 1,
				limit: 20,
				sortBy: this._viewState.sortBy,
				sortOrder: this._viewState.sortOrder,
			},
		});
	}

	/**
	 * Load next page
	 */
	async loadNextPage(): Promise<void> {
		if (!this._viewState.hasNextPage) return;

		await this.loadProducts({
			query: this._viewState.searchQuery,
			pagination: {
				page: this._viewState.currentPage + 1,
				limit: 20,
				sortBy: this._viewState.sortBy,
				sortOrder: this._viewState.sortOrder,
			},
		});
	}

	/**
	 * Load previous page
	 */
	async loadPreviousPage(): Promise<void> {
		if (!this._viewState.hasPreviousPage) return;

		await this.loadProducts({
			query: this._viewState.searchQuery,
			pagination: {
				page: this._viewState.currentPage - 1,
				limit: 20,
				sortBy: this._viewState.sortBy,
				sortOrder: this._viewState.sortOrder,
			},
		});
	}

	/**
	 * Change sort order
	 */
	async changeSortOrder(
		sortBy: string,
		sortOrder: "asc" | "desc"
	): Promise<void> {
		await this.loadProducts({
			query: this._viewState.searchQuery,
			pagination: {
				page: 1,
				limit: 20,
				sortBy,
				sortOrder,
			},
		});
	}

	/**
	 * Clear search and reset
	 */
	async clearSearch(): Promise<void> {
		await this.loadProducts({
			query: "",
			pagination: {
				page: 1,
				limit: 20,
				sortBy: "title",
				sortOrder: "asc",
			},
		});
	}

	/**
	 * Get product by handle
	 */
	async getProduct(handle: string): Promise<ProductViewModel | null> {
		const result = await this.executeOperation(
			() => this.repository.findByHandle(handle),
			"Failed to load product"
		);

		return result.success && result.data
			? this.mapToViewModel(result.data)
			: null;
	}

	/**
	 * Map domain model to view model
	 */
	private mapToViewModel(product: Product): ProductViewModel {
		const primaryImage = product.primaryImage;

		return {
			id: product.id,
			title: product.title,
			description: product.description,
			handle: product.handle,
			imageUrl: primaryImage?.url || "/placeholder-image.jpg",
			imageAlt: primaryImage?.altText || product.title,
			price: product.priceRange.minVariantPrice.amount,
			currencyCode: product.priceRange.minVariantPrice.currencyCode,
			shortDescription: product.getShortDescription(100),
			formattedPrice: product.formattedPriceRange,
			availableForSale: product.availableForSale,
			hasMultipleVariants: product.hasMultipleVariants,
			tags: product.tags,
		};
	}

	/**
	 * Update view state
	 */
	private updateViewState(updates: Partial<ProductsViewState>): void {
		this._viewState = {
			...this._viewState,
			...updates,
		};
	}
}
