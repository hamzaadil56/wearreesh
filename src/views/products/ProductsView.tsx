// "use client";

import Link from "next/link";
import Image from "next/image";
import {
	ProductsViewModel,
	ProductViewModel,
} from "@/viewmodels/products/ProductsViewModel";

interface ProductsViewProps {
	viewModel: ProductsViewModel;
}

export default function ProductsView({ viewModel }: ProductsViewProps) {
	const { products, totalCount } = viewModel.viewState;
	const { loading, error } = viewModel.state;

	if (loading) {
		return <ProductsLoadingView />;
	}

	if (error) {
		return (
			<ProductsErrorView
				error={error}
				onRetry={() => viewModel.loadProducts()}
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
					{totalCount > 0 && (
						<p className="text-sm text-muted-foreground mt-2">
							Showing {products.length} of {totalCount} products
						</p>
					)}
				</div>

				{/* Products Grid */}
				{products.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				) : (
					<EmptyProductsView />
				)}
			</div>
		</div>
	);
}

interface ProductCardProps {
	product: ProductViewModel;
}

function ProductCard({ product }: ProductCardProps) {
	return (
		<Link
			href={`/products/${product.handle}`}
			className="group bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border"
		>
			<div className="aspect-square relative overflow-hidden">
				<Image
					width={500}
					height={500}
					src={product.imageUrl}
					alt={product.imageAlt}
					className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
				/>
				{!product.availableForSale && (
					<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
						<span className="text-white font-semibold">
							Out of Stock
						</span>
					</div>
				)}
			</div>

			<div className="p-4">
				<h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 mb-2">
					{product.title}
				</h3>

				<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
					{product.shortDescription}
				</p>

				<div className="flex items-center justify-between">
					<span className="text-xl font-bold text-primary">
						{product.formattedPrice}
					</span>

					{product.hasMultipleVariants && (
						<span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
							Multiple Options
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

function EmptyProductsView() {
	return (
		<div className="text-center py-12">
			<div className="text-muted-foreground text-6xl mb-4">📦</div>
			<h3 className="text-lg font-medium text-foreground mb-2">
				No products found
			</h3>
			<p className="text-muted-foreground">
				We couldn't find any products at the moment.
			</p>
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
