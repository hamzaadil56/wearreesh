import { Badge } from "@/shared/components/ui/badge";
import {
	ProductImageGallery,
	ProductOptions,
} from "@/shared/components/products";
import { ProductViewModel } from "@/shared/types/viewModels";

interface ProductViewClientProps {
	product: ProductViewModel;
}

export default function ProductViewClient({ product }: ProductViewClientProps) {
	const hasCompareAtPrice = !!product.formattedCompareAtPrice;

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
					{/* Image Gallery */}
					<ProductImageGallery
						images={product.images}
						primaryImage={product.primaryImage || product.images[0]}
						productTitle={product.title}
					/>

					{/* Product Information */}
					<div className="space-y-4">
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
