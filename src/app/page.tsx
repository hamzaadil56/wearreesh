import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getCollection, getCollectionProducts } from "@/shared/lib/shopify";
import { ProductCard } from "@/shared/components/cards/ProductCard";
import { ProductViewModel } from "@/shared/types/viewModels";
import Image from "next/image";
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
	// Fetch the frontpage collection for hero image
	const heroCollection = await getCollection("frontpage");

	// Fetch featured products (you can change this to any collection you want)
	const featuredProducts = await getCollectionProducts({
		collection: "featured-products", // Change this to your desired collection handle
		sortKey: "CREATED_AT",
		reverse: true,
	});

	// Transform products to ProductViewModel format
	const productViewModels: ProductViewModel[] = featuredProducts
		.slice(0, 8)
		.map((product) => ({
			id: product.id,
			handle: product.handle,
			title: product.title,
			description: product.description,
			totalInventory: product.totalInventory,
			options: product.options,
			variants: product.variants.map((edge) => edge),
			primaryImage: product.featuredImage
				? {
						url: product.featuredImage.url,
						altText: product.featuredImage.altText,
						width: product.featuredImage.width,
						height: product.featuredImage.height,
				  }
				: {
						url: "",
						altText: product.title,
						width: 0,
						height: 0,
				  },
			images: product.images.map((edge) => ({
				url: edge.url,
				altText: edge.altText,
				width: edge.width,
				height: edge.height,
			})),
			imageUrl: product.featuredImage?.url || "",
			imageAlt: product.featuredImage?.altText || product.title,
			price: product.priceRange.minVariantPrice.amount,
			currencyCode: product.priceRange.minVariantPrice.currencyCode,
			shortDescription: product.description.slice(0, 100) + "...",
			formattedPrice: `PKR ${product.priceRange.minVariantPrice.amount}`,
			availableForSale: product.availableForSale,
			hasMultipleVariants: product.variants.length > 1,
			tags: product.tags,
		}));

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Banner Card Section */}
			<section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-background">
				<div className="container mx-auto px-4">
					{/* Hero Banner Card - Clickable */}
					<Link
						href="/products"
						className="group relative block w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl transition-all duration-300 hover:shadow-3xl md:hover:scale-[1.02] cursor-pointer"
					>
						{/* Banner Image Container */}
						<div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden">
							{heroCollection?.image ? (
								<>
									<Image
										src={heroCollection.image.url}
										alt={heroCollection.title || "Shop Now"}
										fill
										priority
										quality={85}
										className="object-cover transition-transform duration-500 group-hover:scale-110"
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
									/>
									{/* Gradient Overlay */}
									<div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
									<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
								</>
							) : (
								<div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
							)}

							{/* Banner Content */}
							<div className="absolute inset-0 flex flex-col items-start justify-center p-6 sm:p-8 md:p-12 lg:p-16 text-white z-10">
								<div className="max-w-2xl">
									<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-3 sm:mb-4 md:mb-6 drop-shadow-2xl">
										Welcome to
										<br />
										<span className="text-primary-foreground">
											WearReesh
										</span>
									</h1>
									{heroCollection?.description && (
										<p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 max-w-xl drop-shadow-lg line-clamp-2 sm:line-clamp-3">
											{heroCollection.description}
										</p>
									)}
									<div className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold group-hover:gap-3 transition-all duration-300">
										<span>Shop Now</span>
										<ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1" />
									</div>
								</div>
							</div>

							{/* Hover Overlay Effect */}
							<div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
						</div>
					</Link>
				</div>
			</section>

			{/* Featured Products Section */}
			{productViewModels.length > 0 && (
				<section className="py-20 bg-background">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16 animate-slide-up">
							<h2 className="text-3xl md:text-4xl font-bold mb-4">
								Featured Products
							</h2>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								Discover our handpicked selection of premium
								products
							</p>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-12">
							{productViewModels.map((product, index) => (
								<ProductCard
									key={product.id}
									product={product}
								/>
							))}
						</div>

						<div className="text-center">
							<Button
								size="lg"
								asChild
								className="text-lg px-8 py-6"
							>
								<Link href="/products">
									View All Products
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
