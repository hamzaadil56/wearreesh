import { BaseViewModel } from "../core/BaseViewModel";
import { Cart, CartItem } from "@/models/cart/Cart.model";
import { Product } from "@/models/product/Product.model";

export interface CartItemViewModel {
	id: string;
	quantity: number;
	merchandiseId: string;
	merchandiseTitle: string;
	selectedOptions: string;
	productId: string;
	productTitle: string;
	productHandle: string;
	productImageUrl: string;
	productImageAlt: string;
	unitPrice: string;
	totalPrice: string;
	maxQuantity?: number;
}

export interface CartViewState {
	items: CartItemViewModel[];
	totalQuantity: number;
	subtotal: string;
	tax: string;
	total: string;
	checkoutUrl?: string;
	isEmpty: boolean;
	isOpen: boolean;
	isLoading: boolean;
}

export class CartViewModel extends BaseViewModel {
	private _cart: Cart | null = null;
	private _viewState: CartViewState = {
		items: [],
		totalQuantity: 0,
		subtotal: "$0.00",
		tax: "$0.00",
		total: "$0.00",
		isEmpty: true,
		isOpen: false,
		isLoading: false,
	};

	/**
	 * Get current view state
	 */
	get viewState(): CartViewState {
		return { ...this._viewState };
	}

	/**
	 * Get cart items
	 */
	get items(): CartItemViewModel[] {
		return this._viewState.items;
	}

	/**
	 * Get total quantity
	 */
	get totalQuantity(): number {
		return this._viewState.totalQuantity;
	}

	/**
	 * Get formatted total
	 */
	get total(): string {
		return this._viewState.total;
	}

	/**
	 * Check if cart is empty
	 */
	get isEmpty(): boolean {
		return this._viewState.isEmpty;
	}

	/**
	 * Check if cart is open
	 */
	get isOpen(): boolean {
		return this._viewState.isOpen;
	}

	/**
	 * Get checkout URL
	 */
	get checkoutUrl(): string | undefined {
		return this._viewState.checkoutUrl;
	}

	/**
	 * Initialize cart with data
	 */
	setCart(cart: Cart | null): void {
		this._cart = cart;
		this.updateViewStateFromCart();
	}

	/**
	 * Add item to cart
	 */
	async addItem(merchandiseId: string, quantity: number = 1): Promise<void> {
		this.setLoading(true);

		try {
			// This would typically call a cart service/repository
			// For now, we'll simulate the operation
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Update local state optimistically
			// In a real implementation, this would update the cart through an API
			this.setLoading(false);
		} catch (error) {
			this.setError("Failed to add item to cart");
		}
	}

	/**
	 * Remove item from cart
	 */
	async removeItem(lineId: string): Promise<void> {
		this.setLoading(true);

		try {
			// This would typically call a cart service/repository
			await new Promise((resolve) => setTimeout(resolve, 500));

			this.setLoading(false);
		} catch (error) {
			this.setError("Failed to remove item from cart");
		}
	}

	/**
	 * Update item quantity
	 */
	async updateItemQuantity(lineId: string, quantity: number): Promise<void> {
		if (quantity <= 0) {
			return this.removeItem(lineId);
		}

		this.setLoading(true);

		try {
			// This would typically call a cart service/repository
			await new Promise((resolve) => setTimeout(resolve, 500));

			this.setLoading(false);
		} catch (error) {
			this.setError("Failed to update item quantity");
		}
	}

	/**
	 * Clear entire cart
	 */
	async clearCart(): Promise<void> {
		this.setLoading(true);

		try {
			// This would typically call a cart service/repository
			await new Promise((resolve) => setTimeout(resolve, 500));

			this._cart = null;
			this.updateViewStateFromCart();
			this.setLoading(false);
		} catch (error) {
			this.setError("Failed to clear cart");
		}
	}

	/**
	 * Open cart drawer
	 */
	openCart(): void {
		this.updateViewState({
			isOpen: true,
		});
	}

	/**
	 * Close cart drawer
	 */
	closeCart(): void {
		this.updateViewState({
			isOpen: false,
		});
	}

	/**
	 * Toggle cart drawer
	 */
	toggleCart(): void {
		this.updateViewState({
			isOpen: !this._viewState.isOpen,
		});
	}

	/**
	 * Get item quantity by merchandise ID
	 */
	getItemQuantity(merchandiseId: string): number {
		return this._cart?.getItemQuantity(merchandiseId) || 0;
	}

	/**
	 * Check if item exists in cart
	 */
	hasItem(merchandiseId: string): boolean {
		return this._cart?.hasItem(merchandiseId) || false;
	}

	/**
	 * Get item by merchandise ID
	 */
	getItem(merchandiseId: string): CartItemViewModel | null {
		return (
			this._viewState.items.find(
				(item) => item.merchandiseId === merchandiseId
			) || null
		);
	}

	/**
	 * Calculate estimated shipping
	 */
	getEstimatedShipping(): string {
		// Simple logic - free shipping over $100
		if (!this._cart) return "$0.00";

		const subtotal = parseFloat(this._cart.cost.subtotalAmount.amount);
		return subtotal >= 100 ? "FREE" : "$9.99";
	}

	/**
	 * Check if eligible for free shipping
	 */
	isEligibleForFreeShipping(): boolean {
		if (!this._cart) return false;

		const subtotal = parseFloat(this._cart.cost.subtotalAmount.amount);
		return subtotal >= 100;
	}

	/**
	 * Get amount needed for free shipping
	 */
	getAmountForFreeShipping(): string {
		if (!this._cart || this.isEligibleForFreeShipping()) return "$0.00";

		const subtotal = parseFloat(this._cart.cost.subtotalAmount.amount);
		const needed = 100 - subtotal;

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: this._cart.cost.subtotalAmount.currencyCode,
		}).format(needed);
	}

	/**
	 * Map cart item to view model
	 */
	private mapItemToViewModel(item: CartItem): CartItemViewModel {
		const product = item.merchandise.product;
		const primaryImage = product.primaryImage;

		return {
			id: item.id,
			quantity: item.quantity,
			merchandiseId: item.merchandise.id,
			merchandiseTitle: item.merchandise.title,
			selectedOptions: item.selectedOptionsText,
			productId: product.id,
			productTitle: product.title,
			productHandle: product.handle,
			productImageUrl: primaryImage?.url || "/placeholder-image.jpg",
			productImageAlt: primaryImage?.altText || product.title,
			unitPrice: item.formattedUnitPrice,
			totalPrice: item.formattedTotal,
		};
	}

	/**
	 * Update view state from cart model
	 */
	private updateViewStateFromCart(): void {
		if (!this._cart) {
			this.updateViewState({
				items: [],
				totalQuantity: 0,
				subtotal: "$0.00",
				tax: "$0.00",
				total: "$0.00",
				checkoutUrl: undefined,
				isEmpty: true,
			});
			return;
		}

		this.updateViewState({
			items: this._cart.lines.map((item) =>
				this.mapItemToViewModel(item)
			),
			totalQuantity: this._cart.totalQuantity,
			subtotal: this._cart.formattedSubtotal,
			tax: this._cart.formattedTax,
			total: this._cart.formattedTotal,
			checkoutUrl: this._cart.checkoutUrl,
			isEmpty: this._cart.isEmpty,
		});
	}

	/**
	 * Update view state
	 */
	private updateViewState(updates: Partial<CartViewState>): void {
		this._viewState = {
			...this._viewState,
			...updates,
		};
	}
}
