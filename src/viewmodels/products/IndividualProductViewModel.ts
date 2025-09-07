import { BaseViewModel } from "../core/BaseViewModel";
import { Product, ProductVariant } from "@/models/product/Product.model";
import { ProductRepository } from "@/models/product/ProductRepository";

export interface IndividualProductViewState {
	product: Product | null;
	selectedVariant: ProductVariant | null;
	selectedOptions: Record<string, string>;
	quantity: number;
	isLoading: boolean;
	error: string | null;
}

export interface IIndividualProductViewModel {
	viewState: IndividualProductViewState;
	product: Product | null;
	selectedVariant: ProductVariant | null;
	selectedOptions: Record<string, string>;
	quantity: number;
	isAvailableForSale: boolean;
	isSelectedVariantAvailable: boolean;
	formattedPrice: string;
	formattedCompareAtPrice: string | null;
	hasCompareAtPrice: boolean;
	selectOption(optionName: string, value: string): void;
	updateQuantity(quantity: number): void;
	incrementQuantity(): void;
	decrementQuantity(): void;
	addToCart(): Promise<void>;
}

export class IndividualProductViewModel
	extends BaseViewModel
	implements IIndividualProductViewModel
{
	private _viewState: IndividualProductViewState = {
		product: null,
		selectedVariant: null,
		selectedOptions: {},
		quantity: 1,
		isLoading: false,
		error: null,
	};

	constructor(private repository: ProductRepository) {
		super();
	}

	/**
	 * Get current view state
	 */
	get viewState(): IndividualProductViewState {
		return { ...this._viewState };
	}

	/**
	 * Get current product
	 */
	get product(): Product | null {
		return this._viewState.product;
	}

	/**
	 * Get selected variant
	 */
	get selectedVariant(): ProductVariant | null {
		return this._viewState.selectedVariant;
	}

	/**
	 * Get selected options
	 */
	get selectedOptions(): Record<string, string> {
		return { ...this._viewState.selectedOptions };
	}

	/**
	 * Get quantity
	 */
	get quantity(): number {
		return this._viewState.quantity;
	}

	/**
	 * Check if product is available for sale
	 */
	get isAvailableForSale(): boolean {
		return this._viewState.product?.availableForSale || false;
	}

	/**
	 * Check if selected variant is available
	 */
	get isSelectedVariantAvailable(): boolean {
		return this._viewState.selectedVariant?.availableForSale || false;
	}

	/**
	 * Get formatted price
	 */
	get formattedPrice(): string {
		if (!this._viewState.selectedVariant) {
			return this._viewState.product?.formattedPriceRange || "$0.00";
		}

		const { amount, currencyCode } = this._viewState.selectedVariant.price;
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currencyCode,
		}).format(parseFloat(amount));
	}

	/**
	 * Get formatted compare at price
	 */
	get formattedCompareAtPrice(): string | null {
		if (!this._viewState.selectedVariant?.compareAtPrice) return null;

		const { amount, currencyCode } =
			this._viewState.selectedVariant.compareAtPrice;
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currencyCode,
		}).format(parseFloat(amount));
	}

	/**
	 * Check if product has compare at price
	 */
	get hasCompareAtPrice(): boolean {
		return !!this._viewState.selectedVariant?.compareAtPrice;
	}

	/**
	 * Load product by handle
	 */
	async loadProduct(handle: string): Promise<void> {
		this.setLoading(true);
		this.setError(null);

		try {
			const product = await this.repository.findByHandle(handle);

			if (!product) {
				this.setError("Product not found");
				return;
			}

			this.updateViewState({
				product,
				selectedVariant: product.variants[0] || null,
				selectedOptions: this.getDefaultOptions(product),
			});
		} catch (error) {
			this.setError("Failed to load product");
			console.error("Error loading product:", error);
		} finally {
			this.setLoading(false);
		}
	}

	/**
	 * Select product option
	 */
	selectOption(optionName: string, value: string): void {
		if (!this._viewState.product) return;

		const newSelectedOptions = {
			...this._viewState.selectedOptions,
			[optionName]: value,
		};

		// Find matching variant
		const matchingVariant = this.findMatchingVariant(newSelectedOptions);

		this.updateViewState({
			selectedOptions: newSelectedOptions,
			selectedVariant: matchingVariant,
		});
	}

	/**
	 * Update quantity
	 */
	updateQuantity(quantity: number): void {
		if (quantity < 1) return;

		this.updateViewState({
			quantity: Math.min(quantity, 10), // Max quantity of 10
		});
	}

	/**
	 * Increment quantity
	 */
	incrementQuantity(): void {
		this.updateQuantity(this._viewState.quantity + 1);
	}

	/**
	 * Decrement quantity
	 */
	decrementQuantity(): void {
		this.updateQuantity(this._viewState.quantity - 1);
	}

	/**
	 * Add to cart
	 */
	async addToCart(): Promise<void> {
		if (!this._viewState.product || !this._viewState.selectedVariant)
			return;

		this.setLoading(true);

		try {
			// This would typically call a cart service
			// For now, we'll simulate the operation
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Reset quantity after successful add
			this.updateViewState({ quantity: 1 });
		} catch (error) {
			this.setError("Failed to add item to cart");
		} finally {
			this.setLoading(false);
		}
	}

	/**
	 * Get default options for product
	 */
	private getDefaultOptions(product: Product): Record<string, string> {
		const defaultOptions: Record<string, string> = {};

		product.options.forEach((option) => {
			if (option.values.length > 0) {
				defaultOptions[option.name] = option.values[0];
			}
		});

		return defaultOptions;
	}

	/**
	 * Find matching variant based on selected options
	 */
	private findMatchingVariant(
		selectedOptions: Record<string, string>
	): ProductVariant | null {
		if (!this._viewState.product) return null;

		return (
			this._viewState.product.variants.find((variant) => {
				return variant.selectedOptions.every((option) => {
					return selectedOptions[option.name] === option.value;
				});
			}) || null
		);
	}

	/**
	 * Update view state
	 */
	private updateViewState(
		updates: Partial<IndividualProductViewState>
	): void {
		this._viewState = {
			...this._viewState,
			...updates,
		};
	}
}
