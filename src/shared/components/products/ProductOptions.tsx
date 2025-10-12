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
	const [addedToCart, setAddedToCart] = useState(false);

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

			// Show success animation
			setAddedToCart(true);
			setTimeout(() => setAddedToCart(false), 2000);
		}
	};

	if (!product) return null;

	return (
		<div className="space-y-8">
			{/* Product Options */}
			{product.options.length > 0 && (
				<div className="space-y-6">
					<h3 className="text-xl font-bold text-foreground mb-4">
						Product Options
					</h3>
					{product.options.map((option) => (
						<div key={option.name} className="space-y-4">
							<div className="flex items-center justify-between">
								<h4 className="text-lg font-semibold text-foreground">
									{option.name}
								</h4>
								{selectedOptions[option.name] && (
									<span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
										Selected: {selectedOptions[option.name]}
									</span>
								)}
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
								{option.values.map((value) => {
									const isSelected =
										selectedOptions[option.name] === value;
									return (
										<button
											key={value}
											onClick={() =>
												selectOption(option.name, value)
											}
											className={`relative group px-4 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
												isSelected
													? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
													: "border-border/30 hover:border-primary/50 bg-card hover:bg-muted/50"
											}`}
										>
											<span className="relative z-10">
												{value}
											</span>

											{/* Selection indicator */}
											{isSelected && (
												<div className="absolute top-2 right-2 w-4 h-4 bg-primary-foreground rounded-full flex items-center justify-center">
													<svg
														className="w-2.5 h-2.5 text-primary"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clipRule="evenodd"
														/>
													</svg>
												</div>
											)}

											{/* Hover effect */}
											<div
												className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
													isSelected
														? "bg-white/10"
														: "bg-primary/5"
												}`}
											/>
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Quantity and Add to Cart */}
			<div className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-2xl p-6 border border-border/20 space-y-6">
				<h3 className="text-xl font-bold text-foreground">
					Add to Cart
				</h3>

				{/* Quantity Selector */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<label
							htmlFor="quantity"
							className="text-sm font-semibold text-foreground"
						>
							Quantity
						</label>
						<span className="text-xs text-muted-foreground">
							Max: {Math.min(10, availableInventory)} items
						</span>
					</div>

					<div className="flex items-center space-x-4">
						<div className="flex items-center bg-card rounded-xl border border-border/30 shadow-sm">
							<button
								onClick={handleDecrementQuantity}
								disabled={quantity <= 1}
								className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-muted/50 rounded-l-xl"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M20 12H4"
									/>
								</svg>
							</button>

							<div className="px-6 py-3 text-lg font-bold text-foreground min-w-[4rem] text-center bg-muted/30">
								{quantity}
							</div>

							<button
								onClick={handleIncrementQuantity}
								disabled={
									quantity >= Math.min(10, availableInventory)
								}
								className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-muted/50 rounded-r-xl"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
							</button>
						</div>

						{/* Quantity info */}
						<div className="flex-1">
							{availableInventory <= 5 &&
								availableInventory > 0 && (
									<div className="flex items-center space-x-2 text-orange-600">
										<svg
											className="w-4 h-4"
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
										<span className="text-sm font-medium">
											Only {availableInventory} left!
										</span>
									</div>
								)}

							{availableInventory > 5 && (
								<div className="flex items-center space-x-2 text-green-600">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span className="text-sm font-medium">
										In stock
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

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
					className={`w-full h-14 text-lg font-bold transition-all duration-500 rounded-xl ${
						isShaking ? "animate-shake" : ""
					} ${addedToCart ? "bg-green-500 hover:bg-green-600" : ""}`}
					size="lg"
				>
					{isAddingToCart ? (
						<div className="flex items-center space-x-3">
							<div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
							<span>Adding to Cart...</span>
						</div>
					) : addedToCart ? (
						<div className="flex items-center space-x-3">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span>Added to Cart!</span>
						</div>
					) : availableInventory === 0 ? (
						<div className="flex items-center space-x-3">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
								/>
							</svg>
							<span>Out of Stock</span>
						</div>
					) : showSelectVariant ? (
						<div className="flex items-center space-x-3">
							<svg
								className="w-5 h-5 animate-pulse"
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
							<span>Please Select Options</span>
						</div>
					) : selectedVariant && !selectedVariant.availableForSale ? (
						<div className="flex items-center space-x-3">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
								/>
							</svg>
							<span>Unavailable</span>
						</div>
					) : (
						<div className="flex items-center space-x-3">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h12M7 13v4a2 2 0 002 2h8a2 2 0 002-2v-4m-4 4h.01M13 17h.01"
								/>
							</svg>
							<span>Add to Cart</span>
						</div>
					)}
				</Button>

				{/* Out of stock message */}
				{availableInventory === 0 && (
					<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
								<svg
									className="w-4 h-4 text-red-600"
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
							</div>
							<div>
								<p className="text-sm font-semibold text-red-800 dark:text-red-200">
									This item is currently out of stock
								</p>
								<p className="text-xs text-red-600 dark:text-red-300 mt-1">
									Get notified when it's back in stock
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Additional features */}
				<div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
					<button className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-200 hover:bg-muted/30">
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
						<span className="text-sm font-medium">
							Add to Wishlist
						</span>
					</button>

					<button className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-200 hover:bg-muted/30">
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
							/>
						</svg>
						<span className="text-sm font-medium">Share</span>
					</button>
				</div>
			</div>
		</div>
	);
}
