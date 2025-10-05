"use client";

import { Button } from "@/shared/components/ui/button";
import { CartItemViewModel } from "@/viewmodels";
import { Plus, Minus, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/shared/components/cart";

export interface CartItemProps {
	item: CartItemViewModel;
	onUpdateQuantity: (lineId: string, newQuantity: number) => void;
	onRemoveItem: (lineId: string) => void;
}

export function CartItem({
	item,
	onUpdateQuantity,
	onRemoveItem,
}: CartItemProps) {
	// Get loading states from cart context
	const { isRemovingSpecificItem, isUpdatingSpecificItem } = useCart();

	// Check if this specific item is being removed or updated
	const isItemBeingRemoved = isRemovingSpecificItem(item.id);
	const isItemBeingUpdated = isUpdatingSpecificItem(item.id);

	const handleUpdateQuantity = (newQuantity: number) => {
		onUpdateQuantity(item.id, newQuantity);
	};

	const handleRemoveItem = () => {
		onRemoveItem(item.id);
	};
	console.log(item, "item");

	return (
		<div className="flex gap-3 p-3 border rounded-lg">
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
							{item.merchandiseTitle}
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
						onClick={handleRemoveItem}
						disabled={isItemBeingRemoved}
					>
						{isItemBeingRemoved ? (
							<Loader2 className="h-3 w-3 animate-spin" />
						) : (
							<Trash2 className="h-3 w-3" />
						)}
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
								handleUpdateQuantity(item.quantity - 1)
							}
							disabled={item.quantity <= 1 || isItemBeingUpdated}
						>
							{isItemBeingUpdated ? (
								<Loader2 className="h-3 w-3 animate-spin" />
							) : (
								<Minus className="h-3 w-3" />
							)}
						</Button>
						<span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">
							{item.quantity}
						</span>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={() =>
								handleUpdateQuantity(item.quantity + 1)
							}
							disabled={
								item.quantity >= (item.maxQuantity || 10) ||
								isItemBeingUpdated
							}
						>
							{isItemBeingUpdated ? (
								<Loader2 className="h-3 w-3 animate-spin" />
							) : (
								<Plus className="h-3 w-3" />
							)}
						</Button>
					</div>

					<div className="text-sm font-semibold">
						{item.totalPrice}
					</div>
				</div>
			</div>
		</div>
	);
}
