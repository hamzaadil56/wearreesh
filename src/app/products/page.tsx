import { Suspense } from "react";
import { ProductsViewModel } from "@/viewmodels/products/ProductsViewModel";
import { ProductRepository } from "@/models/product/ProductRepository";
import ProductsView from "@/views/products/ProductsView";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default async function ProductsPage() {
	try {
		// Fetch data on the server side using the service

		// Create repository and ViewModel instances
		const repository = new ProductRepository();
		const viewModel = new ProductsViewModel(repository);

		// Initialize ViewModel with data
		await viewModel.loadProducts();

		return (
			<Suspense fallback={<ProductsLoadingView />}>
				<ProductsView viewModel={viewModel} />
			</Suspense>
		);
	} catch (error) {
		console.error("Error in ProductsPage:", error);

		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="text-destructive text-6xl mb-4">⚠️</div>
					<h1 className="text-2xl font-bold text-foreground mb-2">
						Something went wrong
					</h1>
					<p className="text-muted-foreground mb-4">
						We're having trouble loading the products right now.
					</p>
					<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
						Try Again
					</button>
				</div>
			</div>
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
