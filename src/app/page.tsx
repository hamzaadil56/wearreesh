import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getCollection, getCollectionProducts } from "@/shared/lib/shopify";
import { ProductCard } from "@/shared/components/cards/ProductCard";
import { ProductViewModel } from "@/shared/types/viewModels";

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
			formattedPrice: `$${product.priceRange.minVariantPrice.amount}`,
			availableForSale: product.availableForSale,
			hasMultipleVariants: product.variants.length > 1,
			tags: product.tags,
		}));

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section with Collection Image Background */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
				{/* Background Image */}
				{heroCollection?.image && (
					<div className="absolute inset-0 z-0">
						<div
							className="absolute inset-0 bg-cover bg-center bg-no-repeat"
							style={{
								backgroundImage: `url(${heroCollection.image.url})`,
							}}
						/>
					</div>
				)}

				{/* Fallback gradient background if no collection image */}
				{!heroCollection?.image && (
					<div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
				)}

				{/* Hero Content */}
				<div className="relative z-10 container mx-auto px-4 text-center">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl animate-fade-in">
							Welcome to
							<br className="sm:hidden" />
							<span className="sm:ml-4 text-white ">
								WearReesh
							</span>
						</h1>
						{/* <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto drop-shadow-lg animate-fade-in-delay-1">
							{heroCollection?.description ||
								"Discover premium outdoor gear and apparel designed for your adventures. Quality that endures, style that inspires."}
						</p> */}
						<div className="flex justify-center animate-fade-in-delay-2">
							<Button
								size="lg"
								asChild
								className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 backdrop-blur-sm shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-primary-foreground/20"
							>
								<Link href="/products">
									Shop Now
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Scroll indicator */}
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
					<div className="w-6 h-10 border-2 border-white rounded-full flex justify-center bg-black/20 backdrop-blur-sm">
						<div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
					</div>
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
