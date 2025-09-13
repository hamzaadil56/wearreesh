// src/shared/components/cards/ProductCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductCardProps } from "@/shared/types/props";

export function ProductCard({ product }: ProductCardProps) {
	// Calculate discount percentage if compare-at price exists

	return (
		<Link
			href={`/products/${product.handle}`}
			className="group bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border hover:border-primary/20"
		>
			<div className="aspect-square relative overflow-hidden">
				<Image
					width={500}
					height={500}
					src={product.imageUrl}
					alt={product.imageAlt}
					className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
				/>

				{/* Out of Stock Overlay */}
				{!product.availableForSale && (
					<div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
						<span className="text-white font-semibold text-lg">
							Out of Stock
						</span>
					</div>
				)}
			</div>

			<div className="p-4">
				<h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 mb-2">
					{product.title}
				</h3>

				<div className="flex items-end justify-between">
					<div className="flex flex-col">
						{product.formattedCompareAtPrice && (
							<span className="text-sm text-muted-foreground line-through mb-1">
								{product.formattedCompareAtPrice}
							</span>
						)}
						<span
							className={`font-bold ${
								product.formattedCompareAtPrice
									? "text-2xl text-destructive"
									: "text-xl text-primary"
							}`}
						>
							{product.formattedPrice}
						</span>
					</div>

					{product.availableForSale && (
						<span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
							In Stock
						</span>
					)}
				</div>

				{product.tags.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-2">
						{product.tags.slice(0, 2).map((tag) => (
							<span
								key={tag}
								className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
							>
								{tag}
							</span>
						))}
						{product.tags.length > 2 && (
							<span className="text-xs text-muted-foreground">
								+{product.tags.length - 2} more
							</span>
						)}
					</div>
				)}
			</div>
		</Link>
	);
}
