"use client";

import { useCart } from "./CartContext";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/shared/components/ui/drawer";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
	const cart = useCart();
	const {
		isOpen,
		items,
		totalQuantity,
		subtotal,
		tax,
		total,
		checkoutUrl,
		isEmpty,
		updateItemQuantity,
		removeItem,
		clearCart,
		closeCart,
	} = cart;

	const handleUpdateQuantity = async (
		lineId: string,
		newQuantity: number
	) => {
		if (newQuantity <= 0) {
			await removeItem(lineId);
		} else {
			await updateItemQuantity(lineId, newQuantity);
		}
	};

	const handleRemoveItem = async (lineId: string) => {
		await removeItem(lineId);
	};

	const handleClearCart = async () => {
		await clearCart();
	};

	return (
		<Drawer
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					closeCart();
				}
			}}
			direction="right"
		>
			<DrawerContent className="!w-full sm:!max-w-md h-full flex flex-col">
				<DrawerHeader className="border-b flex-shrink-0">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<ShoppingBag className="h-5 w-5" />
							<DrawerTitle>Shopping Cart</DrawerTitle>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={closeCart}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
					<DrawerDescription>
						{totalQuantity > 0
							? `${totalQuantity} item${
									totalQuantity > 1 ? "s" : ""
							  } in your cart`
							: "Your cart is empty"}
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 flex flex-col min-h-0">
					{isEmpty ? (
						<div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
							<ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">
								Your cart is empty
							</h3>
							<p className="text-muted-foreground mb-6">
								Add some items to get started
							</p>
							<Button asChild onClick={closeCart}>
								<Link href="/shop">Continue Shopping</Link>
							</Button>
						</div>
					) : (
						<>
							{/* Cart Items */}
							<ScrollArea className="flex-1 min-h-0">
								<div className="space-y-4 p-4">
									{items.map((item) => (
										<div
											key={item.id}
											className="flex gap-3 p-3 border rounded-lg"
										>
											{/* Product Image */}
											<div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
												<Image
													src={item.productImageUrl}
													alt={item.productImageAlt}
													fill
													className="object-cover"
													sizes="64px"
												/>
											</div>

											{/* Product Details */}
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-2">
													<div className="min-w-0 flex-1">
														<h4 className="font-medium text-sm leading-tight truncate">
															{item.productTitle}
														</h4>
														<p className="text-xs text-muted-foreground mt-1">
															{
																item.selectedOptions
															}
														</p>
														<p className="text-sm font-semibold text-primary mt-1">
															{item.unitPrice}
														</p>
													</div>

													{/* Remove Button */}
													<Button
														variant="ghost"
														size="icon"
														className="h-6 w-6 flex-shrink-0"
														onClick={() =>
															handleRemoveItem(
																item.id
															)
														}
													>
														<Trash2 className="h-3 w-3" />
													</Button>
												</div>

												{/* Quantity Controls */}
												<div className="flex items-center justify-between mt-3">
													<div className="flex items-center border rounded-md">
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
															onClick={() =>
																handleUpdateQuantity(
																	item.id,
																	item.quantity -
																		1
																)
															}
															disabled={
																item.quantity <=
																1
															}
														>
															<Minus className="h-3 w-3" />
														</Button>
														<span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">
															{item.quantity}
														</span>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
															onClick={() =>
																handleUpdateQuantity(
																	item.id,
																	item.quantity +
																		1
																)
															}
															disabled={
																item.quantity >=
																(item.maxQuantity ||
																	10)
															}
														>
															<Plus className="h-3 w-3" />
														</Button>
													</div>

													<div className="text-sm font-semibold">
														{item.totalPrice}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</ScrollArea>

							{/* Cart Summary */}
							<div className="border-t p-4 space-y-4 flex-shrink-0">
								{/* Subtotal */}
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										Subtotal
									</span>
									<span className="font-medium">
										{subtotal}
									</span>
								</div>

								{/* Tax */}
								{tax !== "$0.00" && (
									<div className="flex justify-between items-center">
										<span className="text-sm text-muted-foreground">
											Tax
										</span>
										<span className="font-medium">
											{tax}
										</span>
									</div>
								)}

								<Separator />

								{/* Total */}
								<div className="flex justify-between items-center">
									<span className="text-lg font-semibold">
										Total
									</span>
									<span className="text-lg font-bold text-primary">
										{total}
									</span>
								</div>

								{/* Actions */}
								<div className="space-y-3">
									{/* Checkout Button */}
									{checkoutUrl && (
										<Button
											asChild
											className="w-full h-12"
											size="lg"
										>
											<a
												href={checkoutUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												Proceed to Checkout
											</a>
										</Button>
									)}

									{/* Clear Cart */}
									<Button
										variant="outline"
										onClick={handleClearCart}
										className="w-full"
										size="sm"
									>
										Clear Cart
									</Button>
								</div>

								{/* Continue Shopping */}
								<div className="text-center">
									<Button
										variant="ghost"
										size="sm"
										asChild
										onClick={closeCart}
									>
										<Link href="/shop">
											Continue Shopping
										</Link>
									</Button>
								</div>
							</div>
						</>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
