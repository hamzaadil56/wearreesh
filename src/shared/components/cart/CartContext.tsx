"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";
import { Cart, CartRepository } from "@/models/cart";
import { CartViewModel } from "@/viewmodels/cart/CartViewModel";
import { addToCart, createCart } from "@/models/cart/Cart.actions";

interface CartContextType {
	// State
	cart: Cart | null;
	viewModel: CartViewModel;
	isLoading: boolean;
	error: string | null;

	// Actions
	createCartClient: (variantId: string, quantity: number) => Promise<void>;
	// addToCart: (variantId: string, quantity: number) => Promise<void>;
	// updateCartItem: (lineId: string, quantity: number) => Promise<void>;
	// removeCartItem: (lineId: string) => Promise<void>;
	// clearCart: () => Promise<void>;
	// refreshCart: () => Promise<void>;
	// toggleCartDrawer: () => void;
	// closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};

interface CartProviderProps {
	children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
	const [cart, setCart] = useState<Cart | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [viewModel] = useState(() => new CartViewModel());

	// Load cart from localStorage on mount
	// useEffect(() => {
	// 	const loadPersistedCart = async () => {
	// 		const cartId = localStorage.getItem("cartId");
	// 		if (cartId) {
	// 			await refreshCart();
	// 		}
	// 	};

	// 	loadPersistedCart();
	// }, []);

	// Update view model when cart changes
	useEffect(() => {
		viewModel.setCart(cart);
	}, [cart, viewModel]);

	const createCartClient = async (variantId: string, quantity: number) => {
		try {
			// Create cart with full structure matching your Postman example
			const newCart = await createCart({
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
						value: "clothing", // You can customize this based on product type
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

			if (newCart) {
				console.log("newCart", newCart);
				localStorage.setItem("cartId", newCart.id);
			} else {
				throw new Error("Failed to create cart");
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to create cart";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	// const addToCart = useCallback(
	// 	async (variantId: string, quantity: number) => {
	// 		setIsLoading(true);
	// 		setError(null);

	// 		try {
	// 			let updatedCart: Cart | null;
	// 			if (cart) {
	// 				// Add to existing cart
	// 				updatedCart = await addToCart(cart.id, [
	// 					{
	// 						merchandiseId: variantId,
	// 						quantity: quantity,
	// 						attributes: [
	// 							{
	// 								key: "product_type",
	// 								value: "clothing",
	// 							},
	// 						],
	// 					},
	// 				]);
	// 			} else {
	// 				// Create new cart with full structure
	// 				updatedCart = await repository.createCartWithAttributes({
	// 					merchandiseId: variantId,
	// 					quantity: quantity,
	// 					itemAttributes: [
	// 						{
	// 							key: "product_type",
	// 							value: "clothing",
	// 						},
	// 					],
	// 					cartAttributes: [
	// 						{
	// 							key: "customersFirstOrder",
	// 							value: "true",
	// 						},
	// 					],
	// 					deliveryCountryCode: "PK",
	// 					note: "",
	// 				});
	// 			}

	// 			if (updatedCart) {
	// 				setCart(updatedCart);
	// 				localStorage.setItem("cartId", updatedCart.id);
	// 			} else {
	// 				throw new Error("Failed to add item to cart");
	// 			}
	// 		} catch (err) {
	// 			const errorMessage =
	// 				err instanceof Error
	// 					? err.message
	// 					: "Failed to add item to cart";
	// 			setError(errorMessage);
	// 			console.log(errorMessage);
	// 			throw new Error(errorMessage);
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	},
	// 	[cart, repository]
	// );

	// const updateCartItem = useCallback(
	// 	async (lineId: string, quantity: number) => {
	// 		if (!cart) return;

	// 		setIsLoading(true);
	// 		setError(null);

	// 		try {
	// 			const updatedCart = await repository.updateCartItem(
	// 				cart.id,
	// 				lineId,
	// 				quantity
	// 			);

	// 			if (updatedCart) {
	// 				setCart(updatedCart);
	// 			} else {
	// 				throw new Error("Failed to update cart item");
	// 			}
	// 		} catch (err) {
	// 			const errorMessage =
	// 				err instanceof Error
	// 					? err.message
	// 					: "Failed to update cart item";
	// 			setError(errorMessage);
	// 			throw new Error(errorMessage);
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	},
	// 	[cart, repository]
	// );

	// const removeCartItem = useCallback(
	// 	async (lineId: string) => {
	// 		if (!cart) return;

	// 		setIsLoading(true);
	// 		setError(null);

	// 		try {
	// 			const updatedCart = await repository.removeFromCart(cart.id, [
	// 				lineId,
	// 			]);

	// 			if (updatedCart) {
	// 				setCart(updatedCart);
	// 			} else {
	// 				throw new Error("Failed to remove cart item");
	// 			}
	// 		} catch (err) {
	// 			const errorMessage =
	// 				err instanceof Error
	// 					? err.message
	// 					: "Failed to remove cart item";
	// 			setError(errorMessage);
	// 			throw new Error(errorMessage);
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	},
	// 	[cart, repository]
	// );

	// const clearCart = useCallback(async () => {
	// 	if (!cart) return;

	// 	setIsLoading(true);
	// 	setError(null);

	// 	try {
	// 		const success = await repository.clearCart(cart.id);

	// 		if (success) {
	// 			setCart(null);
	// 			localStorage.removeItem("cartId");
	// 		} else {
	// 			throw new Error("Failed to clear cart");
	// 		}
	// 	} catch (err) {
	// 		const errorMessage =
	// 			err instanceof Error ? err.message : "Failed to clear cart";
	// 		setError(errorMessage);
	// 		throw new Error(errorMessage);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// }, [cart, repository]);

	// const refreshCart = useCallback(async () => {
	// 	const cartId = localStorage.getItem("cartId");
	// 	if (!cartId) return;

	// 	setIsLoading(true);
	// 	setError(null);

	// 	try {
	// 		const refreshedCart = await repository.findById(cartId);

	// 		if (refreshedCart) {
	// 			setCart(refreshedCart);
	// 		} else {
	// 			throw new Error("Cart not found");
	// 		}
	// 	} catch (err) {
	// 		const errorMessage =
	// 			err instanceof Error ? err.message : "Failed to refresh cart";
	// 		setError(errorMessage);
	// 		// Clear invalid cart ID from localStorage
	// 		localStorage.removeItem("cartId");
	// 		setCart(null);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// }, [repository]);

	// const toggleCartDrawer = useCallback(() => {
	// 	viewModel.toggleCart();
	// }, [viewModel]);

	// const closeCartDrawer = useCallback(() => {
	// 	viewModel.closeCart();
	// }, [viewModel]);

	const contextValue: CartContextType = {
		cart,
		viewModel,
		isLoading,
		error,
		createCartClient,
	};

	return (
		<CartContext.Provider value={contextValue}>
			{children}
		</CartContext.Provider>
	);
}
