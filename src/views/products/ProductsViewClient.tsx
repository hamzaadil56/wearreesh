"use client";

import { useEffect } from "react";
import { useProductsViewModel } from "@/viewmodels/products/useProductsViewModel";
import { ProductsWithFilter } from "@/shared/components/layout";
import { ProductViewModel } from "@/shared/types/viewModels";

interface ProductsViewClientProps {
	// Optional initial data for SSR hydration
	initialProducts?: ProductViewModel[];
	initialTotalCount?: number;
}

export default function ProductsViewClient({
	initialProducts = [],
	initialTotalCount = 0,
}: ProductsViewClientProps) {
	const { products, totalCount, isLoading, error, loadProducts, clearError } =
		useProductsViewModel(initialProducts);

	// Use initial data if available, otherwise use hook state

	if (isLoading && products.length === 0) {
		return <ProductsLoadingView />;
	}

	if (error) {
		return (
			<ProductsErrorView
				error={error}
				onRetry={() => {
					clearError();
					loadProducts();
				}}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-background py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						Our Products
					</h1>
					<p className="text-lg text-muted-foreground">
						Discover our amazing collection of{" "}
						{totalCount || "many"} products
					</p>
				</div>

				{/* Products with Filters */}
				<ProductsWithFilter
					products={products}
					totalCount={totalCount}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}

function ProductsLoadingView() {
	return (
		<div className="min-h-screen bg-background py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<div className="h-10 bg-muted rounded w-64 mx-auto mb-4 animate-pulse" />
					<div className="h-6 bg-muted rounded w-96 mx-auto animate-pulse" />
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className="bg-card rounded-lg shadow-sm border overflow-hidden"
						>
							<div className="aspect-square bg-muted animate-pulse" />
							<div className="p-4">
								<div className="h-6 bg-muted rounded mb-2 animate-pulse" />
								<div className="h-4 bg-muted rounded mb-3 animate-pulse" />
								<div className="h-6 bg-muted rounded w-24 animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

interface ProductsErrorViewProps {
	error: string | null;
	onRetry: () => void;
}

function ProductsErrorView({ error, onRetry }: ProductsErrorViewProps) {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="text-center">
				<div className="text-destructive text-6xl mb-4">⚠️</div>
				<h1 className="text-2xl font-bold text-foreground mb-2">
					Something went wrong
				</h1>
				<p className="text-muted-foreground mb-4">
					{error ||
						"We're having trouble loading the products right now."}
				</p>
				<button
					onClick={onRetry}
					className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
				>
					Try Again
				</button>
			</div>
		</div>
	);
}
