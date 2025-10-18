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
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
				<div className="text-center max-w-md mx-auto p-8">
					<div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
						<svg
							className="w-12 h-12 text-muted-foreground"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
							/>
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
						Product Not Found
					</h1>
					<p className="text-muted-foreground mb-8 leading-relaxed">
						The product you're looking for doesn't exist or may have
						been removed.
					</p>
					<Button asChild size="lg" className="rounded-full px-8">
						<Link href="/products">
							<svg
								className="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16l-4-4m0 0l4-4m-4 4h18"
								/>
							</svg>
							Back to Products
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	// Calculate discount percentage
	const discountPercentage =
		viewModel.hasCompareAtPrice &&
		viewModel.formattedPrice &&
		viewModel.formattedCompareAtPrice
			? Math.round(
					((parseFloat(
						viewModel.formattedCompareAtPrice.replace(
							/[^0-9.]/g,
							""
						)
					) -
						parseFloat(
							viewModel.formattedPrice.replace(/[^0-9.]/g, "")
						)) /
						parseFloat(
							viewModel.formattedCompareAtPrice.replace(
								/[^0-9.]/g,
								""
							)
						)) *
						100
			  )
			: null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
			{/* Breadcrumb */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
				<nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
					<Link
						href="/"
						className="hover:text-foreground transition-colors duration-200"
					>
						Home
					</Link>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
					<Link
						href="/products"
						className="hover:text-foreground transition-colors duration-200"
					>
						Products
					</Link>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
					<span className="text-foreground font-medium">
						{product.title}
					</span>
				</nav>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
					{/* Image Gallery */}
					<div className="order-1 lg:order-1">
						<ProductImageGallery
							images={product.images}
							primaryImage={product.primaryImage}
							productTitle={product.title}
						/>
					</div>

					{/* Product Information */}
					<div className="order-2 lg:order-2 space-y-8">
						{/* Header Section */}
						<div className="space-y-4">
							{/* Product badges */}
							<div className="flex flex-wrap gap-2">
								{product.tags.includes("new") && (
									<Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
										<svg
											className="w-3 h-3 mr-1"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										New Arrival
									</Badge>
								)}
								{discountPercentage &&
									discountPercentage > 0 && (
										<Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 animate-pulse">
											<svg
												className="w-3 h-3 mr-1"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
													clipRule="evenodd"
												/>
											</svg>
											{discountPercentage}% OFF
										</Badge>
									)}
								{product.tags.includes("bestseller") && (
									<Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
										<svg
											className="w-3 h-3 mr-1"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										Bestseller
									</Badge>
								)}
							</div>

							{/* Title */}
							<h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
								{product.title}
							</h1>

							{/* Rating and reviews - commented out until reviews are implemented */}
							{/*
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-1">
									{[...Array(5)].map((_, i) => (
										<svg
											key={i}
											className={`w-5 h-5 ${
												i < 4
													? "text-yellow-400"
													: "text-gray-300"
											}`}
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									))}
								</div>
								<span className="text-sm text-muted-foreground">
									4.0 (127 reviews)
								</span>
								<button className="text-sm text-primary hover:underline">
									Write a review
								</button>
							</div>
							*/}
						</div>

						{/* Price Section */}
						<div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-6 border border-border/20">
							<div className="flex items-center justify-between mb-4">
								<div className="space-y-2">
									{viewModel.hasCompareAtPrice && (
										<div className="flex items-center space-x-3">
											<span className="text-2xl text-muted-foreground line-through">
												{
													viewModel.formattedCompareAtPrice
												}
											</span>
											{discountPercentage && (
												<span className="text-sm font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
													Save {discountPercentage}%
												</span>
											)}
										</div>
									)}
									<div className="flex items-baseline space-x-2">
										<span
											className={`text-4xl font-black ${
												viewModel.hasCompareAtPrice
													? "text-red-600 dark:text-red-400"
													: "text-primary"
											}`}
										>
											{viewModel.formattedPrice}
										</span>
										<span className="text-sm text-muted-foreground">
											per item
										</span>
									</div>
								</div>

								{/* Availability Status */}
								<div className="text-right">
									{viewModel.isAvailableForSale ? (
										<div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
											<div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
											<span className="font-medium">
												In Stock
											</span>
										</div>
									) : (
										<div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
											<div className="w-3 h-3 rounded-full bg-red-500" />
											<span className="font-medium">
												Out of Stock
											</span>
										</div>
									)}
								</div>
							</div>

							{/* Trust indicators */}
							<div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/20">
								<div className="text-center">
									<div className="w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
										<svg
											className="w-4 h-4 text-primary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
											/>
										</svg>
									</div>
									<p className="text-xs text-muted-foreground">
										Free Shipping
									</p>
								</div>
								<div className="text-center">
									<div className="w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
										<svg
											className="w-4 h-4 text-primary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											/>
										</svg>
									</div>
									<p className="text-xs text-muted-foreground">
										Secure Payment
									</p>
								</div>
								<div className="text-center">
									<div className="w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
										<svg
											className="w-4 h-4 text-primary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
											/>
										</svg>
									</div>
									<p className="text-xs text-muted-foreground">
										Easy Returns
									</p>
								</div>
							</div>
						</div>

						{/* Description */}
						{product.description && (
							<div className="space-y-4">
								<h3 className="text-xl font-bold text-foreground">
									Description
								</h3>
								<div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed bg-muted/20 rounded-xl p-6">
									<p>{product.description}</p>
								</div>
							</div>
						)}

						{/* Product Options and Add to Cart */}
						{/* <ProductOptions viewModel={viewModel} /> */}

						{/* Product Tags */}
						{product.tags.length > 0 && (
							<div className="space-y-4">
								<h3 className="text-xl font-bold text-foreground">
									Product Tags
								</h3>
								<div className="flex flex-wrap gap-2">
									{product.tags.map((tag) => (
										<Badge
											key={tag}
											variant="outline"
											className="text-sm px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer"
										>
											#{tag}
										</Badge>
									))}
								</div>
							</div>
						)}

						{/* Share section */}
						<div className="space-y-4 pt-6 border-t border-border/20">
							<h3 className="text-lg font-semibold text-foreground">
								Share this product
							</h3>
							<div className="flex space-x-3">
								<button className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
								<button className="p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								</button>
								<button className="p-3 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-200">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
								<button className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
