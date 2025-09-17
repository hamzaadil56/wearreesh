"use client";

import { Button } from "@/shared/components/ui/button";
import type { ProductOptionsProps } from "@/shared/types/props";
import { useProductViewModel } from "@/viewmodels/products/useProductViewModel";
import { useCart } from "@/shared/components/cart";

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

	const { addToCart, isLoading: cartLoading } = useCart();

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
							onClick={() => decrementQuantity()}
							disabled={quantity <= 1}
							className="px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
						>
							−
						</button>
						<span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
							{quantity}
						</span>
						<button
							onClick={() => incrementQuantity()}
							disabled={quantity >= 10}
							className="px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
						>
							+
						</button>
					</div>
				</div>

				{/* Add to Cart Button */}
				<Button
					onClick={async () => {
						if (selectedVariant) {
							await addToCart(selectedVariant.id, quantity);
						}
					}}
					disabled={
						!selectedVariant ||
						!selectedVariant.availableForSale ||
						cartLoading
					}
					className="w-full h-12 text-base"
					size="lg"
				>
					{cartLoading ? (
						<>
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
							Adding to Cart...
						</>
					) : !selectedVariant ||
					  !selectedVariant.availableForSale ? (
						"Out of Stock"
					) : (
						"Add to Cart"
					)}
				</Button>
			</div>
		</div>
	);
}
