"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/models/product/Product.model";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Carousel } from "@/shared/components/ui/carousel";
import type { CarouselItem } from "@/shared/components/ui/carousel";

interface ProductImageGalleryProps {
	images: ProductImage[];
	primaryImage: ProductImage | null;
	productTitle: string;
}

interface ImageCarouselItem extends CarouselItem {
	url: string;
	altText: string | null;
}

export default function ProductImageGallery({
	images,
	primaryImage,
	productTitle,
}: ProductImageGalleryProps) {
	const [activeIndex, setActiveIndex] = useState(0);

	// Prepare images array
	const displayImages =
		images.length > 0 ? images : primaryImage ? [primaryImage] : [];

	if (displayImages.length === 0) {
		return (
			<div className="aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/30 to-muted/60 shadow-2xl border border-border/20">
				<div className="h-full w-full flex items-center justify-center text-muted-foreground">
					<div className="text-center space-y-3">
						<div className="w-20 h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
							<svg
								className="w-10 h-10"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<p className="font-medium">No image available</p>
					</div>
				</div>
			</div>
		);
	}

	// Single image display
	if (displayImages.length === 1) {
		return (
			<div className="space-y-4">
				<div className="aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/30 to-muted/60 shadow-2xl border border-border/20">
					<Image
						src={displayImages[0].url}
						alt={displayImages[0].altText || productTitle}
						width={800}
						height={800}
						className="h-full w-full object-cover object-center"
						priority
					/>
				</div>
			</div>
		);
	}

	// Convert ProductImage to CarouselItem format
	const carouselImages: ImageCarouselItem[] = displayImages.map(
		(image, index) => ({
			id: index,
			url: image.url,
			altText: image.altText,
		})
	);

	// Custom slide renderer with Next.js Image optimization
	const renderSlide = (image: ImageCarouselItem, index: number) => (
		<div className="aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/30 to-muted/60 shadow-2xl border border-border/20">
			<Image
				src={image.url}
				alt={image.altText || productTitle}
				width={800}
				height={800}
				className="h-full w-full object-cover object-center"
				priority={index === 0}
				loading={index === 0 ? undefined : "lazy"}
			/>
		</div>
	);

	// Custom thumbnail pagination
	const renderCustomPagination = (
		items: ImageCarouselItem[],
		activeIdx: number,
		onItemClick: (index: number) => void
	) => (
		<div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
			{items.map((image, index) => (
				<motion.button
					key={index}
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: index * 0.05 }}
					onClick={() => onItemClick(index)}
					className={cn(
						"aspect-square overflow-hidden rounded-xl transition-all duration-300 relative cursor-pointer",
						"md:hover:scale-105",
						activeIdx === index
							? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
							: "ring-1 ring-border/20 md:hover:ring-border/40 shadow-sm md:hover:shadow-md"
					)}
				>
					<Image
						src={image.url}
						alt={image.altText || `Thumbnail ${index + 1}`}
						width={120}
						height={120}
						className="h-full w-full object-cover object-center"
						loading="lazy"
					/>
				</motion.button>
			))}
		</div>
	);

	return (
		<Carousel
			items={carouselImages}
			renderSlide={renderSlide}
			pagination="custom"
			renderCustomPagination={renderCustomPagination}
			showNavigation={displayImages.length > 1}
			showCounter={displayImages.length > 1}
			counterPosition="bottom-right"
			loop={displayImages.length > 2}
			effect="creative"
			onSlideChange={(index) => setActiveIndex(index)}
			wrapperClassName="space-y-4"
		/>
	);
}
