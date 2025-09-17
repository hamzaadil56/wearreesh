import { BaseRepository } from "../core/Repository";
import { Cart, CartData } from "./Cart.model";
import {
	addToCart,
	updateCart,
	removeFromCart,
	getCart,
} from "@/shared/lib/shopify";
import type { CartLineInput } from "@/shared/lib/shopify/types";

interface CartLineUpdateInput {
	id: string;
	quantity: number;
}

export class CartRepository extends BaseRepository<Cart> {
	/**
	 * Create a cart with full input structure (matching your Postman example)
	 */

	/**
	 * Get cart by ID
	 */
	async findById(id: string): Promise<Cart | null> {
		// Check cache first
		const cached = this.getCached(id);
		if (cached) return cached;

		const result = await this.safeOperation(async () => {
			const cartData = await getCart(id);
			if (!cartData) return null;

			return this.mapShopifyToCart(cartData);
		}, `Failed to fetch cart with id: ${id}`);

		if (result.success && result.data) {
			this.setCached(id, result.data);
		}

		return result.success ? result.data : null;
	}

	/**
	 * Add items to existing cart
	 */
	async addToCart(
		cartId: string,
		lines: CartLineInput[]
	): Promise<Cart | null> {
		const result = await this.safeOperation(async () => {
			const cartData = await addToCart(cartId, lines);
			if (!cartData) {
				throw new Error("Failed to add items to cart");
			}
			return this.mapShopifyToCart(cartData);
		}, "Failed to add items to cart");

		if (result.success && result.data) {
			this.setCached(cartId, result.data);
		}

		return result.success ? result.data : null;
	}

	/**
	 * Update cart item quantity
	 */
	async updateCartItem(
		cartId: string,
		lineId: string,
		quantity: number
	): Promise<Cart | null> {
		const result = await this.safeOperation(async () => {
			const cartData = await updateCart(cartId, [
				{
					id: lineId,
					quantity: quantity,
				},
			]);
			if (!cartData) {
				throw new Error("Failed to update cart item");
			}
			return this.mapShopifyToCart(cartData);
		}, "Failed to update cart item");

		if (result.success && result.data) {
			this.setCached(cartId, result.data);
		}

		return result.success ? result.data : null;
	}

	/**
	 * Remove items from cart
	 */
	async removeFromCart(
		cartId: string,
		lineIds: string[]
	): Promise<Cart | null> {
		const result = await this.safeOperation(async () => {
			const cartData = await removeFromCart(cartId, lineIds);
			if (!cartData) {
				throw new Error("Failed to remove items from cart");
			}
			return this.mapShopifyToCart(cartData);
		}, "Failed to remove items from cart");

		if (result.success && result.data) {
			this.setCached(cartId, result.data);
		}

		return result.success ? result.data : null;
	}

	/**
	 * Clear entire cart (remove all items)
	 */
	async clearCart(cartId: string): Promise<boolean> {
		// First get the cart to get all line IDs
		const cart = await this.findById(cartId);
		if (!cart || cart.lines.length === 0) {
			return true; // Cart is already empty
		}

		const lineIds = cart.lines.map((line) => line.id);
		const result = await this.safeOperation(async () => {
			const cartData = await removeFromCart(cartId, lineIds);
			return !!cartData;
		}, "Failed to clear cart");

		if (result.success && result.data) {
			// Clear cache since cart is now empty or modified
			this.clearCache();
		}

		return result.success && result.data;
	}

	// Not applicable for cart operations - carts don't have a traditional "findAll"
	async findAll(): Promise<Cart[]> {
		throw new Error("Cart repository does not support findAll operation");
	}

	// Not applicable for cart operations - carts are created through Shopify API
	async create(): Promise<Cart> {
		throw new Error("Use createCart method instead");
	}

	// Not applicable for cart operations - cart updates are handled through specific methods
	async update(): Promise<Cart> {
		throw new Error(
			"Use specific cart methods (addToCart, updateCartItem, etc.)"
		);
	}

	// Not applicable for cart operations - carts are managed by Shopify
	async delete(): Promise<void> {
		throw new Error("Cart deletion not supported through repository");
	}

	/**
	 * Map Shopify cart data to domain model
	 */
	private mapShopifyToCart(cartData: any): Cart {
		return new Cart({
			id: cartData.id,
			checkoutUrl: cartData.checkoutUrl,
			cost: {
				subtotalAmount: {
					amount: cartData.cost.subtotalAmount.amount,
					currencyCode: cartData.cost.subtotalAmount.currencyCode,
				},
				totalAmount: {
					amount: cartData.cost.totalAmount.amount,
					currencyCode: cartData.cost.totalAmount.currencyCode,
				},
				totalTaxAmount: {
					amount: cartData.cost.totalTaxAmount.amount,
					currencyCode: cartData.cost.totalTaxAmount.currencyCode,
				},
			},
			lines: cartData.lines.map((line: any) => ({
				id: line.id,
				quantity: line.quantity,
				merchandise: {
					id: line.merchandise.id,
					title: line.merchandise.title,
					selectedOptions: line.merchandise.selectedOptions,
					product: {
						id: line.merchandise.product.id,
						handle: line.merchandise.product.handle,
						availableForSale:
							line.merchandise.product.availableForSale,
						title: line.merchandise.product.title,
						description: line.merchandise.product.description,
						descriptionHtml:
							line.merchandise.product.descriptionHtml,
						options: line.merchandise.product.options,
						priceRange: line.merchandise.product.priceRange,
						variants: line.merchandise.product.variants.edges.map(
							(edge: any) => ({
								id: edge.node.id,
								title: edge.node.title,
								availableForSale: edge.node.availableForSale,
								selectedOptions: edge.node.selectedOptions,
								price: edge.node.price,
							})
						),
						featuredImage: line.merchandise.product.featuredImage,
						images: line.merchandise.product.images.edges.map(
							(edge: any) => edge.node
						),
						seo: line.merchandise.product.seo,
						tags: line.merchandise.product.tags,
						updatedAt: line.merchandise.product.updatedAt,
					},
				},
				cost: {
					totalAmount: {
						amount: line.cost.totalAmount.amount,
						currencyCode: line.cost.totalAmount.currencyCode,
					},
				},
			})),
			totalQuantity: cartData.totalQuantity,
		});
	}
}
