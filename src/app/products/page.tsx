import { Suspense } from "react";
import { ProductRepository } from "@/models/product/ProductRepository";
import ProductsViewClient from "@/views/products/ProductsViewClient";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default async function ProductsPage() {
	try {
		// Optionally fetch initial data on the server for better SEO and initial load
		const repository = new ProductRepository();
		const initialData = await repository.search({
			pagination: {
				page: 1,
				limit: 20,
				sortBy: "TITLE",
				sortOrder: "asc",
			},
		});

		// Map to view models for initial hydration
		const initialProducts = initialData.items.map((product) => ({
			id: product.id,
			title: product.title,
			description: product.description,
			handle: product.handle,
			imageUrl: product.primaryImage?.url || "/placeholder-image.jpg",
			imageAlt: product.primaryImage?.altText || product.title,
			price: product.priceRange.minVariantPrice.amount,
			currencyCode: product.priceRange.minVariantPrice.currencyCode,
			shortDescription: product.getShortDescription(100),
			formattedPrice: product.formattedPriceRange,
			formattedCompareAtPrice:
				product.formattedCompareAtPrice || undefined,
			availableForSale: product.availableForSale,
			hasMultipleVariants: product.hasMultipleVariants,
			tags: product.tags,
			options: product.options,
		}));

		return (
			<Suspense fallback={<ProductsLoadingView />}>
				<ProductsViewClient
					initialProducts={initialProducts}
					initialTotalCount={initialData.totalCount}
				/>
			</Suspense>
		);
	} catch (error) {
		console.error("Error in ProductsPage:", error);

		// Return client-side component without initial data - it will load on client
		return (
			<Suspense fallback={<ProductsLoadingView />}>
				<ProductsViewClient />
			</Suspense>
		);
	}
}

function ProductsLoadingView() {
	return (
		<div className="min-h-screen bg-background py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header Skeleton */}
				<div className="text-center mb-12">
					<Skeleton className="h-10 w-64 mx-auto mb-4" />
					<Skeleton className="h-6 w-96 mx-auto mb-2" />
					<Skeleton className="h-4 w-48 mx-auto" />
				</div>

				{/* Products Grid Skeleton */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className="bg-card rounded-lg shadow-sm border overflow-hidden"
						>
							<Skeleton className="aspect-square w-full" />
							<div className="p-4 space-y-3">
								<Skeleton className="h-6 w-full" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-6 w-24" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
