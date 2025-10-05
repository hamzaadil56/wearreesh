"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
	useCartViewModel,
	UseCartViewModelReturn,
} from "@/viewmodels/cart/CartViewModel";
import { Cart } from "@/shared/lib/shopify/types";
interface CartContextType extends UseCartViewModelReturn {}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};

interface CartProviderProps {
	children: ReactNode;
	initialCart?: Cart | null;
}

export function CartProvider({ children, initialCart }: CartProviderProps) {
	// Use the existing useCartViewModel hook
	const cartViewModel = useCartViewModel();

	// Set initial cart if provided
	React.useEffect(() => {
		if (initialCart) {
			cartViewModel.setCart(initialCart);
		}
	}, [initialCart]);

	const contextValue: CartContextType = {
		...cartViewModel,
	};

	return (
		<CartContext.Provider value={contextValue}>
			{children}
		</CartContext.Provider>
	);
}
