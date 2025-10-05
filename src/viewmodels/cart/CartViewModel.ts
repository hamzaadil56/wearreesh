"use client";

import { useState, useCallback, useMemo } from "react";
import {
	createCart,
	addToCart as addToCartAction,
	removeFromCart as removeFromCartAction,
} from "@/models/cart/Cart.actions";
import {
	Cart as ShopifyCart,
	CartInput,
	ShopifyCartItem,
} from "@/shared/lib/shopify/types";
import { useLoadingStates } from "@/shared/hooks/useLoadingStates";

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
	cart: ShopifyCart | null;
	items: CartItemViewModel[];
	totalQuantity: number;
	subtotal: string;
	tax: string;
	total: string;
	checkoutUrl?: string;
	isEmpty: boolean;
	isOpen: boolean;
	error: string | null;
}

export interface UseCartViewModelReturn {
	// State
	cart: ShopifyCart | null;
	items: CartItemViewModel[];
	totalQuantity: number;
	subtotal: string;
	tax: string;
	total: string;
	checkoutUrl?: string;
	isEmpty: boolean;
	isOpen: boolean;
	error: string | null;

	// Loading states
	isAddingToCart: boolean;
	isUpdatingItem: boolean;
	isRemovingItem: boolean;
	isCreatingCart: boolean;
	isClearingCart: boolean;
	isRemovingSpecificItem: (itemId: string) => boolean;
	isUpdatingSpecificItem: (itemId: string) => boolean;

	// Actions
	setCart: (cart: ShopifyCart | null) => void;
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
	getItem: (merchandiseId: string) => CartItemViewModel | null;
	getEstimatedShipping: () => string;
	isEligibleForFreeShipping: () => boolean;
	getAmountForFreeShipping: () => string;
}

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
		error: null,
	});

	// Loading states hook
	const { isLoading, executeWithLoading } = useLoadingStates();

	// Define operation names as constants
	const OPERATIONS = {
		ADD_TO_CART: "addToCart",
		UPDATE_ITEM: "updateItem",
		REMOVE_ITEM: "removeItem",
		CREATE_CART: "createCart",
		CLEAR_CART: "clearCart",
	} as const;

	// Helper function to handle errors
	const handleError = useCallback((error: Error, message: string) => {
		setViewState((prev) => ({
			...prev,
			error: error.message || message,
		}));
	}, []);

	// Initialize cart with data
	const setCart = useCallback((cart: ShopifyCart | null) => {
		setViewState((prev) => {
			const newState = { ...prev, cart };
			return updateViewStateFromCart(newState, cart);
		});
	}, []);

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
			const result = await executeWithLoading(
				OPERATIONS.CREATE_CART,
				async () => {
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
				}
			);

			if (result.success && result.data) {
				// For now, we'll set the cart directly and handle conversion later
				// TODO: Implement proper Shopify to Model cart conversion
				setViewState((prev) => {
					const newState = {
						...prev,
						cart: result.data as ShopifyCart,
					};
					return updateViewStateFromCart(
						newState,
						result.data as ShopifyCart
					);
				});
			} else if (result.error) {
				handleError(result.error, "Failed to create cart");
			}
		},
		[executeWithLoading, handleError]
	);

	// Add to cart - uses the smart addToCart function from actions
	const addToCart = useCallback(
		async (cartInput: CartInput): Promise<void> => {
			const result = await executeWithLoading(
				OPERATIONS.ADD_TO_CART,
				async () => {
					// Use the smart addToCart function that handles cart creation/addition logic
					const shopifyCart = await addToCartAction(cartInput);
					return shopifyCart;
				}
			);

			if (result.success && result.data) {
				// Convert Shopify Cart to Model Cart and update state
				setViewState((prev) => {
					const newState = {
						...prev,
						cart: result.data as ShopifyCart,
					};
					return updateViewStateFromCart(
						newState,
						result.data as ShopifyCart
					);
				});
			} else if (result.error) {
				handleError(result.error, "Failed to add item to cart");
			}
		},
		[executeWithLoading, handleError]
	);

	// Add missing functions using the new loading states
	const removeItem = useCallback(
		async (lineId: string): Promise<void> => {
			const result = await executeWithLoading(
				OPERATIONS.REMOVE_ITEM,
				async () => {
					if (!viewState.cart?.id) {
						throw new Error("No cart found");
					}
					const shopifyCart = await removeFromCartAction(
						viewState.cart.id,
						[lineId]
					);
					return shopifyCart;
				},
				lineId // Pass the lineId as itemId for specific loading state
			);

			if (result.success && result.data) {
				setViewState((prev) => {
					const newState = {
						...prev,
						cart: result.data as ShopifyCart,
					};
					return updateViewStateFromCart(
						newState,
						result.data as ShopifyCart
					);
				});
			} else if (result.error) {
				handleError(result.error, "Failed to remove item from cart");
			}
		},
		[executeWithLoading, handleError, viewState.cart?.id]
	);

	const updateItemQuantity = useCallback(
		async (lineId: string, quantity: number): Promise<void> => {
			// This would need to be implemented in Cart.actions.ts
			// For now, we'll use a placeholder
			console.warn("updateItemQuantity not yet implemented");
		},
		[]
	);

	const clearCart = useCallback(async (): Promise<void> => {
		const result = await executeWithLoading(
			OPERATIONS.CLEAR_CART,
			async () => {
				if (!viewState.cart?.id || viewState.cart.lines.length === 0) {
					// No cart or cart is already empty, just return null
					return null;
				}

				// Get all line IDs from the current cart
				const allLineIds = viewState.cart.lines.map((line) => line.id);

				// Use removeFromCartAction to remove all items from the backend
				const shopifyCart = await removeFromCartAction(
					viewState.cart.id,
					allLineIds
				);

				return shopifyCart;
			}
		);

		if (result.success) {
			if (result.data) {
				// Update with the cleared cart from backend
				setViewState((prev) => {
					const newState = {
						...prev,
						cart: result.data as ShopifyCart,
					};
					return updateViewStateFromCart(
						newState,
						result.data as ShopifyCart
					);
				});
			} else {
				// No cart data returned, clear local state
				setViewState((prev) => ({
					...prev,
					cart: null,
					items: [],
					totalQuantity: 0,
					subtotal: "$0.00",
					tax: "$0.00",
					total: "$0.00",
					isEmpty: true,
				}));
			}
		} else if (result.error) {
			handleError(result.error, "Failed to clear cart");
		}
	}, [executeWithLoading, handleError, viewState.cart]);

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
		error: viewState.error,

		// Loading states
		isAddingToCart: isLoading(OPERATIONS.ADD_TO_CART),
		isUpdatingItem: isLoading(OPERATIONS.UPDATE_ITEM),
		isRemovingItem: isLoading(OPERATIONS.REMOVE_ITEM),
		isCreatingCart: isLoading(OPERATIONS.CREATE_CART),
		isClearingCart: isLoading(OPERATIONS.CLEAR_CART),
		isRemovingSpecificItem: (itemId: string) =>
			isLoading(OPERATIONS.REMOVE_ITEM, itemId),
		isUpdatingSpecificItem: (itemId: string) =>
			isLoading(OPERATIONS.UPDATE_ITEM, itemId),

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
		getItem,
		getEstimatedShipping,
		isEligibleForFreeShipping,
		getAmountForFreeShipping,
	};
}

// Helper function to update view state from cart model
const updateViewStateFromCart = (
	currentState: CartViewState,
	cart: ShopifyCart | null
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

	const mapItemToViewModel = (item: ShopifyCartItem): CartItemViewModel => {
		const product = item.merchandise.product;
		const primaryImage = product.featuredImage;

		return {
			id: item.id,
			quantity: item.quantity,
			merchandiseId: item.merchandise.id,
			merchandiseTitle: item.merchandise.title,
			selectedOptions: item.merchandise.selectedOptions
				.map((option) => option.value)
				.join(", "),
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
		items: cart.lines.map((line) => mapItemToViewModel(line)),
		totalQuantity: cart.totalQuantity,
		subtotal: cart.cost.subtotalAmount.amount,
		tax: cart.cost.totalTaxAmount.amount,
		total: cart.cost.totalAmount.amount,
		checkoutUrl: cart.checkoutUrl || "",
		isEmpty: cart.lines.length === 0,
	};
};
