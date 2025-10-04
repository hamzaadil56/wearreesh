"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import type { ProductOptionsProps } from "@/shared/types/props";
import { useProductViewModel } from "@/viewmodels/products/useProductViewModel";
import { useCart } from "@/shared/components/cart";
import { useLoadingStates } from "@/shared/hooks/useLoadingStates";

export default function ProductOptions({ viewModel }: ProductOptionsProps) {
	const {
		selectedOptions,
		quantity,
		isLoading,
		product,
		selectOption,
		decrementQuantity,
		incrementQuantity,
		selectedVariant,
	} = useProductViewModel(viewModel);

	const { addToCart, items: cartItems, isAddingToCart } = useCart();

	// Loading states hook
	const { isLoading: isOperationLoading } = useLoadingStates();

	// State for button animation and text
	const [showSelectVariant, setShowSelectVariant] = useState(false);
	const [isShaking, setIsShaking] = useState(false);

	// Calculate available inventory by subtracting cart quantity from variant's quantityAvailable
	const getAvailableInventory = useCallback(() => {
		if (!selectedVariant) {
			return product?.totalInventory ?? 0;
		}

		// Get quantity already in cart for this specific variant
		const cartQuantityForVariant = cartItems
			.filter((item) => item.merchandiseId === selectedVariant.id)
			.reduce((total, item) => total + item.quantity, 0);

		// Calculate remaining available inventory for this variant
		const remainingInventory = Math.max(
			0,
			selectedVariant.quantityAvailable - cartQuantityForVariant
		);

		return remainingInventory;
	}, [selectedVariant, cartItems, product?.totalInventory]);

	const availableInventory = getAvailableInventory();

	// Custom quantity functions that respect available inventory
	const handleIncrementQuantity = useCallback(() => {
		if (quantity < Math.min(10, availableInventory)) {
			incrementQuantity();
		}
	}, [quantity, availableInventory, incrementQuantity]);

	const handleDecrementQuantity = useCallback(() => {
		if (quantity > 1) {
			decrementQuantity();
		}
	}, [quantity, decrementQuantity]);

	// Reset the "select variant" message when a variant is selected
	useEffect(() => {
		if (selectedVariant) {
			setShowSelectVariant(false);
		}
	}, [selectedVariant]);

	const handleAddToCart = async () => {
		// If no variant is selected and product has options, show "Select variant" message
		if (!selectedVariant && product && product.options.length > 0) {
			setShowSelectVariant(true);
			setIsShaking(true);

			// Reset animation after it completes
			setTimeout(() => {
				setIsShaking(false);
			}, 500);

			// Reset message after 3 seconds
			setTimeout(() => {
				setShowSelectVariant(false);
			}, 3000);

			return;
		}

		if (selectedVariant && product) {
			// Check if requested quantity exceeds available inventory
			if (quantity > availableInventory) {
				alert(`Only ${availableInventory} items available in stock`);
				return;
			}

			const addToCartPayload = {
				lines: [
					{
						merchandiseId: selectedVariant.id,
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
			};

			// Add to cart - inventory will be automatically calculated from cart state
			await addToCart(addToCartPayload);
		}
	};

	if (!product) return null;

	return (
		<div className="space-y-6">
			{/* Product Options */}
			{product.options.length > 0 && (
				<div className="space-y-4">
					{product.options.map((option) => (
						<div key={option.name} className="space-y-2">
							<h3 className="text-sm font-medium text-foreground">
								{option.name}
							</h3>
							<div className="flex flex-wrap gap-2">
								{option.values.map((value) => (
									<button
										key={value}
										onClick={() =>
											selectOption(option.name, value)
										}
										className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
											selectedOptions[option.name] ===
											value
												? "border-primary bg-primary text-primary-foreground"
												: "border-border hover:border-muted-foreground/50"
										}`}
									>
										{value}
									</button>
								))}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Quantity and Add to Cart */}
			<div className="space-y-4">
				{/* Quantity Selector */}
				<div className="flex items-center gap-4">
					<label
						htmlFor="quantity"
						className="text-sm font-medium text-foreground"
					>
						Quantity
					</label>
					<div className="flex items-center border rounded-md">
						<button
							onClick={handleDecrementQuantity}
							disabled={quantity <= 1}
							className="px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
						>
							−
						</button>
						<span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
							{quantity}
						</span>
						<button
							onClick={handleIncrementQuantity}
							disabled={
								quantity >= Math.min(10, availableInventory)
							}
							className="px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
						>
							+
						</button>
					</div>
				</div>

				{/* Inventory Information */}
				{availableInventory <= 5 && availableInventory > 0 && (
					<p className="text-sm text-orange-600 font-medium">
						Only {availableInventory} left in stock
					</p>
				)}

				{/* Add to Cart Button */}
				<Button
					onClick={handleAddToCart}
					disabled={
						isAddingToCart ||
						availableInventory === 0 ||
						(selectedVariant
							? !selectedVariant.availableForSale
							: false) ||
						quantity > availableInventory
					}
					className={`w-full h-12 text-base transition-all duration-300 ${
						isShaking ? "animate-shake" : ""
					}`}
					size="lg"
				>
					{isAddingToCart ? (
						<>
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
							Adding to Cart...
						</>
					) : availableInventory === 0 ? (
						"Out of Stock"
					) : showSelectVariant ? (
						<>
							<span className="inline-flex items-center gap-2">
								<svg
									className="w-4 h-4 animate-pulse"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
								Select Variant
							</span>
						</>
					) : selectedVariant && !selectedVariant.availableForSale ? (
						"Unavailable"
					) : (
						"Add to Cart"
					)}
				</Button>

				{/* Out of stock message */}
				{availableInventory === 0 && (
					<p className="text-sm text-red-600 font-medium">
						This item is currently out of stock
					</p>
				)}
			</div>
		</div>
	);
}
