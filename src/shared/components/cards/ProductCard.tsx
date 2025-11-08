// src/shared/components/cards/ProductCard.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductCardProps } from "@/shared/types/props";

export function ProductCard({ product }: ProductCardProps) {
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	// Calculate discount percentage if compare-at price exists
	const discountPercentage =
		product.formattedCompareAtPrice && product.formattedPrice
			? Math.round(
					((parseFloat(
						product.formattedCompareAtPrice.replace(/[^0-9.]/g, "")
					) -
						parseFloat(
							product.formattedPrice.replace(/[^0-9.]/g, "")
						)) /
						parseFloat(
							product.formattedCompareAtPrice.replace(
								/[^0-9.]/g,
								""
							)
						)) *
						100
			  )
			: null;

	return (
		<Link
			href={`/products/${product.handle}`}
			className="group relative bg-gradient-to-br from-card to-card/80 rounded-2xl shadow-lg transition-shadow duration-300 overflow-hidden border border-border/50 
			md:hover:shadow-2xl md:hover:border-primary/30 md:hover:-translate-y-1 md:hover:scale-[1.02] 
			product-card-animate"
		>
			{/* Discount Badge - Remove animate-pulse on mobile */}
			{discountPercentage && discountPercentage > 0 && (
				<div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[9px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-full shadow-lg md:animate-pulse">
					-{discountPercentage}%
				</div>
			)}

			{/* New Badge for recent products */}
			{product.tags.includes("new") && (
				<div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-full shadow-lg">
					NEW
				</div>
			)}

			<div className="aspect-[3/4] relative overflow-hidden rounded-t-2xl">
				{/* Loading skeleton */}
				{!isImageLoaded && (
					<div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted animate-pulse" />
				)}

				<Image
					width={500}
					height={500}
					src={product.imageUrl}
					alt={product.imageAlt}
					loading="lazy"
					className={`h-full w-full object-cover md:group-hover:scale-110 transition-transform duration-700 ease-out ${
						isImageLoaded ? "opacity-100" : "opacity-0"
					}`}
					onLoad={() => setIsImageLoaded(true)}
				/>

				{/* Gradient overlay on hover - only on desktop */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

				{/* Out of Stock Overlay */}
				{!product.availableForSale && (
					<div className="absolute inset-0 bg-black/70 flex items-center justify-center md:backdrop-blur-sm">
						<div className="text-center">
							<div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
								<svg
									className="w-8 h-8 text-white"
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
							</div>
							<span className="text-white font-semibold text-lg">
								Out of Stock
							</span>
						</div>
					</div>
				)}

				{/* Quick view button on hover - only show on desktop */}
				<div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
					<button className="bg-white/90 dark:bg-zinc-900/90 text-foreground px-6 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-white dark:hover:bg-zinc-900 transition-colors duration-200 hover:scale-105 transform">
						Quick View
					</button>
				</div>
			</div>

			<div className="p-3 sm:p-4 space-y-2">
				<h3 className="text-xs sm:text-sm md:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
					<span className="line-clamp-2">{product.title}</span>
				</h3>

				{/* Price section with improved styling */}
				<div className="flex items-center justify-between">
					<div className="flex items-baseline space-x-2">
						<span
							className={`font-semibold text-xs sm:text-lg md:text-xl ${
								product.formattedCompareAtPrice
									? "text-red-600 dark:text-red-400"
									: "text-primary"
							}`}
						>
							{product.formattedPrice}
						</span>
						{product.formattedCompareAtPrice && (
							<span className="text-[8px] sm:text-xs text-muted-foreground line-through">
								{product.formattedCompareAtPrice}
							</span>
						)}
					</div>
				</div>

				{/* Enhanced tags section */}
				{product.tags.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-2">
						{product.tags.slice(0, 2).map((tag) => (
							<span
								key={tag}
								className="text-[7px] sm:text-[10px] md:text-xs bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium hover:from-primary hover:to-primary/80 hover:text-primary-foreground transition-all duration-200"
							>
								{tag}
							</span>
						))}
						{product.tags.length > 2 && (
							<span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground font-medium px-1.5 sm:px-2 py-0.5 sm:py-1">
								+{product.tags.length - 2} more
							</span>
						)}
					</div>
				)}
			</div>
		</Link>
	);
}
