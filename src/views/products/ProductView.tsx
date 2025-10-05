import type { IIndividualProductViewModel } from "@/viewmodels/products/IndividualProductViewModel";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ProductImageGallery } from "@/shared/components/products";
import Link from "next/link";

interface ProductViewProps {
	viewModel: IIndividualProductViewModel;
}

export default function ProductView({ viewModel }: ProductViewProps) {
	const { product } = viewModel.viewState;

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
						primaryImage={product.primaryImage}
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
									{viewModel.formattedPrice}
								</span>
								{viewModel.hasCompareAtPrice && (
									<>
										<span className="text-lg text-muted-foreground line-through">
											{viewModel.formattedCompareAtPrice}
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
								{viewModel.isAvailableForSale ? (
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
						{/* <ProductOptions viewModel={viewModel} /> */}

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
