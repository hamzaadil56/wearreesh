"use client";

import { useEffect } from "react";
import { useProductViewModel } from "@/viewmodels/products/useProductViewModel";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import {
	ProductImageGallery,
	ProductOptions,
} from "@/shared/components/products";
import { ProductViewModel } from "@/shared/types/viewModels";
import { ProductData } from "@/models/product/Product.model";

interface ProductViewClientProps {
	handle?: string;
	product: ProductViewModel;
}

export default function ProductViewClient({ product }: ProductViewClientProps) {
	const {
		selectedVariant,
		selectedOptions,
		quantity,
		isAvailableForSale,
		isSelectedVariantAvailable,
		hasCompareAtPrice,
		isLoading,
		error,
		loadProduct,
		selectOption,
		updateQuantity,
		incrementQuantity,
		decrementQuantity,
		addToCart,
		clearError,
	} = useProductViewModel();

	// Load product when component mounts or handle changes

	if (isLoading && !product) {
		return <ProductLoadingView />;
	}

	// if (error) {
	// 	return (
	// 		<ProductErrorView
	// 			error={error}
	// 			onRetry={() => {
	// 				clearError();
	// 				loadProduct(handle);
	// 			}}
	// 		/>
	// 	);
	// }

	if (!product) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-foreground mb-2">
						Product not found
					</h1>
					<p className="text-muted-foreground mb-4">
						The product you're looking for doesn't exist.
					</p>
					<Button asChild>
						<Link href="/products">Back to Products</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Image Gallery */}
					<ProductImageGallery
						images={product.images}
						primaryImage={product.primaryImage || product.images[0]}
						productTitle={product.title}
					/>

					{/* Product Information */}
					<div className="space-y-6">
						{/* Title and Price */}
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tight text-foreground">
								{product.title}
							</h1>

							{/* Price */}
							<div className="flex items-center gap-2">
								<span className="text-2xl font-semibold text-foreground">
									{product.formattedPrice}
								</span>
								{hasCompareAtPrice && (
									<>
										<span className="text-lg text-muted-foreground line-through">
											{product.formattedCompareAtPrice}
										</span>
										<Badge
											variant="destructive"
											className="text-xs"
										>
											Sale
										</Badge>
									</>
								)}
							</div>

							{/* Availability */}
							<div className="flex items-center gap-2">
								{product.availableForSale ? (
									<>
										<div className="h-2 w-2 rounded-full bg-green-500" />
										<span className="text-sm text-green-600 dark:text-green-400">
											In Stock
										</span>
									</>
								) : (
									<>
										<div className="h-2 w-2 rounded-full bg-red-500" />
										<span className="text-sm text-red-600 dark:text-red-400">
											Out of Stock
										</span>
									</>
								)}
							</div>
						</div>

						{/* Description */}
						{product.description && (
							<div className="prose prose-sm max-w-none text-muted-foreground">
								<p>{product.description}</p>
							</div>
						)}

						{/* Product Options and Add to Cart */}
						<ProductOptions viewModel={product} />

						{/* Product Tags */}
						{product.tags.length > 0 && (
							<div className="space-y-2">
								<h3 className="text-sm font-medium text-foreground">
									Tags
								</h3>
								<div className="flex flex-wrap gap-2">
									{product.tags.map((tag) => (
										<Badge
											key={tag}
											variant="outline"
											className="text-xs"
										>
											{tag}
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function ProductLoadingView() {
	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Image Gallery Skeleton */}
					<div className="space-y-4">
						<div className="aspect-square w-full bg-muted rounded-lg animate-pulse" />
						<div className="grid grid-cols-4 gap-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="aspect-square bg-muted rounded-md animate-pulse"
								/>
							))}
						</div>
					</div>

					{/* Product Info Skeleton */}
					<div className="space-y-6">
						<div className="space-y-2">
							<div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
							<div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
						</div>
						<div className="h-4 w-full bg-muted rounded animate-pulse" />
						<div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
						<div className="h-4 w-1/2 bg-muted rounded animate-pulse" />

						<div className="space-y-4">
							<div className="h-10 w-full bg-muted rounded animate-pulse" />
							<div className="h-10 w-full bg-muted rounded animate-pulse" />
						</div>

						<div className="h-12 w-full bg-muted rounded animate-pulse" />
					</div>
				</div>
			</div>
		</div>
	);
}

interface ProductErrorViewProps {
	error: string | null;
	onRetry: () => void;
}

function ProductErrorView({ error, onRetry }: ProductErrorViewProps) {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="text-center">
				<div className="text-destructive text-6xl mb-4">⚠️</div>
				<h1 className="text-2xl font-bold text-foreground mb-2">
					Something went wrong
				</h1>
				<p className="text-muted-foreground mb-4">
					{error ||
						"We're having trouble loading the product right now."}
				</p>
				<Button onClick={onRetry}>Try Again</Button>
			</div>
		</div>
	);
}
