"use client";

import { useState, useCallback, useMemo } from "react";
import { Cart, CartItem } from "@/models/cart/Cart.model";
import {
	createCart,
	addToCart as addToCartAction,
	removeFromCart as removeFromCartAction,
} from "@/models/cart/Cart.actions";
import { Cart as ShopifyCart, CartInput } from "@/shared/lib/shopify/types";

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
	cart: Cart | null;
	items: CartItemViewModel[];
	totalQuantity: number;
	subtotal: string;
	tax: string;
	total: string;
	checkoutUrl?: string;
	isEmpty: boolean;
	isOpen: boolean;
	isLoading: boolean;
	error: string | null;
}

export interface UseCartViewModelReturn {
	// State
	cart: Cart | null;
	items: CartItemViewModel[];
	totalQuantity: number;
	subtotal: string;
	tax: string;
	total: string;
	checkoutUrl?: string;
	isEmpty: boolean;
	isOpen: boolean;
	isLoading: boolean;
	error: string | null;

	// Actions
	setCart: (cart: Cart | null) => void;
	removeItem: (lineId: string) => Promise<void>;
	updateItemQuantity: (lineId: string, quantity: number) => Promise<void>;
	clearCart: () => Promise<void>;
	openCart: () => void;
	closeCart: () => void;
	toggleCart: () => void;
	clearError: () => void;
	createCartClient: (variantId: string, quantity: number) => Promise<void>;
	addToCart: (cartInput: CartInput) => Promise<void>;

	// Computed properties
	getItemQuantity: (merchandiseId: string) => number;
	hasItem: (merchandiseId: string) => boolean;
	getItem: (merchandiseId: string) => CartItemViewModel | null;
	getEstimatedShipping: () => string;
	isEligibleForFreeShipping: () => boolean;
	getAmountForFreeShipping: () => string;
}

// Helper function to convert Shopify Cart to Model Cart
const convertShopifyCartToModel = (shopifyCart: ShopifyCart): Cart => {
	// For now, we'll create a basic cart structure
	// TODO: Implement proper conversion when we have the full product data
	return new Cart({
		id: shopifyCart.id,
		checkoutUrl: shopifyCart.checkoutUrl,
		cost: {
			subtotalAmount: shopifyCart.cost.subtotalAmount,
			totalAmount: shopifyCart.cost.totalAmount,
			totalTaxAmount: shopifyCart.cost.totalTaxAmount,
		},
		lines: [], // Will be populated when we have proper product data
		totalQuantity: shopifyCart.totalQuantity || 0,
	});
};

export function useCartViewModel(): UseCartViewModelReturn {
	// State management using React hooks
	const [viewState, setViewState] = useState<CartViewState>({
		cart: null,
		items: [],
		totalQuantity: 0,
		subtotal: "$0.00",
		tax: "$0.00",
		total: "$0.00",
		isEmpty: true,
		isOpen: false,
		isLoading: false,
		error: null,
	});

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

	// Initialize cart with data
	const setCart = useCallback((cart: Cart | null) => {
		setViewState((prev) => {
			const newState = { ...prev, cart };
			return updateViewStateFromCart(newState, cart);
		});
	}, []);

	// Remove item from cart
	const removeItem = useCallback(
		async (lineId: string): Promise<void> => {
			const result = await executeOperation(async () => {
				if (!viewState.cart?.id) {
					throw new Error("No cart found");
				}

				const shopifyCart = await removeFromCartAction(
					viewState.cart.id,
					[lineId]
				);
				const updatedCart = convertShopifyCartToModel(shopifyCart);

				// Update the cart state with the response
				setViewState((prev) => {
					const newState = { ...prev, cart: updatedCart };
					return updateViewStateFromCart(newState, updatedCart);
				});

				return updatedCart;
			}, "Failed to remove item from cart");
		},
		[executeOperation, viewState.cart?.id]
	);

	// Update item quantity
	const updateItemQuantity = useCallback(
		async (lineId: string, quantity: number): Promise<void> => {
			if (quantity <= 0) {
				return removeItem(lineId);
			}

			const result = await executeOperation(async () => {
				// This would typically call a cart service/repository
				await new Promise((resolve) => setTimeout(resolve, 500));
				return true;
			}, "Failed to update item quantity");
		},
		[executeOperation, removeItem]
	);

	// Clear entire cart
	const clearCart = useCallback(async (): Promise<void> => {
		const result = await executeOperation(async () => {
			if (!viewState.cart?.id) {
				throw new Error("No cart found");
			}

			// Get all line IDs from current cart items
			const lineIds = viewState.cart.lines.map((line) => line.id);

			if (lineIds.length === 0) {
				// Cart is already empty
				return viewState.cart;
			}

			// Remove all items using removeFromCart action
			const shopifyCart = await removeFromCartAction(
				viewState.cart.id,
				lineIds
			);
			const updatedCart = convertShopifyCartToModel(shopifyCart);

			// Update the cart state with the response
			setViewState((prev) => {
				const newState = { ...prev, cart: updatedCart };
				return updateViewStateFromCart(newState, updatedCart);
			});

			return updatedCart;
		}, "Failed to clear cart");
	}, [executeOperation, viewState.cart]);

	// Open cart drawer
	const openCart = useCallback((): void => {
		setViewState((prev) => ({
			...prev,
			isOpen: true,
		}));
	}, []);

	// Close cart drawer
	const closeCart = useCallback((): void => {
		setViewState((prev) => ({
			...prev,
			isOpen: false,
		}));
	}, []);

	// Toggle cart drawer
	const toggleCart = useCallback((): void => {
		setViewState((prev) => ({
			...prev,
			isOpen: !prev.isOpen,
		}));
	}, []);

	// Clear error
	const clearError = useCallback(() => {
		setViewState((prev) => ({ ...prev, error: null }));
	}, []);

	// Get item quantity by merchandise ID
	const getItemQuantity = useCallback(
		(merchandiseId: string): number => {
			return viewState.cart?.getItemQuantity(merchandiseId) || 0;
		},
		[viewState.cart]
	);

	// Check if item exists in cart
	const hasItem = useCallback(
		(merchandiseId: string): boolean => {
			return viewState.cart?.hasItem(merchandiseId) || false;
		},
		[viewState.cart]
	);

	// Get item by merchandise ID
	const getItem = useCallback(
		(merchandiseId: string): CartItemViewModel | null => {
			return (
				viewState.items.find(
					(item) => item.merchandiseId === merchandiseId
				) || null
			);
		},
		[viewState.items]
	);

	// Calculate estimated shipping
	const getEstimatedShipping = useCallback((): string => {
		// Simple logic - free shipping over $100
		if (!viewState.cart) return "$0.00";

		const subtotal = parseFloat(viewState.cart.cost.subtotalAmount.amount);
		return subtotal >= 100 ? "FREE" : "$9.99";
	}, [viewState.cart]);

	// Check if eligible for free shipping
	const isEligibleForFreeShipping = useCallback((): boolean => {
		if (!viewState.cart) return false;

		const subtotal = parseFloat(viewState.cart.cost.subtotalAmount.amount);
		return subtotal >= 100;
	}, [viewState.cart]);

	// Get amount needed for free shipping
	const getAmountForFreeShipping = useCallback((): string => {
		if (!viewState.cart) return "$0.00";

		const subtotal = parseFloat(viewState.cart.cost.subtotalAmount.amount);
		if (subtotal >= 100) return "$0.00";

		const needed = 100 - subtotal;

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: viewState.cart.cost.subtotalAmount.currencyCode,
		}).format(needed);
	}, [viewState.cart]);

	// Create cart client - handles cart creation with Shopify
	const createCartClient = useCallback(
		async (variantId: string, quantity: number): Promise<void> => {
			const result = await executeOperation(async () => {
				// Create cart with full structure matching Postman example
				const shopifyCart = await createCart({
					lines: [
						{
							merchandiseId: variantId,
							quantity: quantity,
							attributes: [
								{
									key: "product_type",
									value: "clothing",
								},
							],
						},
					],
					attributes: [
						{
							key: "product_type",
							value: "clothing",
						},
					],
					discountCodes: [],
					giftCardCodes: [],
					buyerIdentity: {},
					delivery: {
						addresses: [
							{
								address: {
									deliveryAddress: {
										countryCode: "PK",
									},
								},
							},
						],
					},
				});

				if (shopifyCart) {
					return shopifyCart;
				} else {
					throw new Error("Failed to create cart");
				}
			}, "Failed to create cart");

			if (result.success && result.data) {
				// For now, we'll set the cart directly and handle conversion later
				// TODO: Implement proper Shopify to Model cart conversion
				const modelCart = convertShopifyCartToModel(result.data);
				setViewState((prev) => {
					const newState = { ...prev, cart: modelCart };
					return updateViewStateFromCart(newState, modelCart);
				});
			}
		},
		[executeOperation]
	);

	// Add to cart - uses the smart addToCart function from actions
	const addToCart = useCallback(
		async (cartInput: CartInput): Promise<void> => {
			const result = await executeOperation(async () => {
				// Use the smart addToCart function that handles cart creation/addition logic
				const shopifyCart = await addToCartAction(cartInput);
				return shopifyCart;
			}, "Failed to add item to cart");

			if (result.success && result.data) {
				// Convert Shopify Cart to Model Cart and update state
				const modelCart = convertShopifyCartToModel(result.data);
				setViewState((prev) => {
					const newState = { ...prev, cart: modelCart };
					return updateViewStateFromCart(newState, modelCart);
				});
			}
		},
		[executeOperation]
	);

	// Helper functions
	const mapItemToViewModel = useCallback(
		(item: CartItem): CartItemViewModel => {
			const product = item.merchandise.product;
			const primaryImage = product.featuredImage;

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
		},
		[]
	);

	// Return state and actions
	return {
		// State
		cart: viewState.cart,
		items: viewState.items,
		totalQuantity: viewState.totalQuantity,
		subtotal: viewState.subtotal,
		tax: viewState.tax,
		total: viewState.total,
		checkoutUrl: viewState.checkoutUrl,
		isEmpty: viewState.isEmpty,
		isOpen: viewState.isOpen,
		isLoading: viewState.isLoading,
		error: viewState.error,

		// Actions
		setCart,
		removeItem,
		updateItemQuantity,
		clearCart,
		openCart,
		closeCart,
		toggleCart,
		clearError,
		createCartClient,
		addToCart,

		// Computed properties
		getItemQuantity,
		hasItem,
		getItem,
		getEstimatedShipping,
		isEligibleForFreeShipping,
		getAmountForFreeShipping,
	};
}

// Helper function to update view state from cart model
const updateViewStateFromCart = (
	currentState: CartViewState,
	cart: Cart | null
): CartViewState => {
	if (!cart) {
		return {
			...currentState,
			cart: null,
			items: [],
			totalQuantity: 0,
			subtotal: "$0.00",
			tax: "$0.00",
			total: "$0.00",
			checkoutUrl: undefined,
			isEmpty: true,
		};
	}

	const mapItemToViewModel = (item: CartItem): CartItemViewModel => {
		const product = item.merchandise.product;
		const primaryImage = product.featuredImage;

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
			unitPrice: item.merchandise?.price?.amount,
			totalPrice: item.cost.totalAmount?.amount,
		};
	};

	return {
		...currentState,
		cart,
		items: cart.lines.map((item) => mapItemToViewModel(item)),
		totalQuantity: cart.totalQuantity,
		subtotal: cart.formattedSubtotal,
		tax: cart.formattedTax,
		total: cart.formattedTotal,
		checkoutUrl: cart.checkoutUrl,
		isEmpty: cart.isEmpty,
	};
};
