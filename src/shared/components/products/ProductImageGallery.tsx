"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { ProductImage } from "@/models/product/Product.model";
import { motion } from "framer-motion";
import type { Swiper as SwiperType } from "swiper";
import { cn } from "@/shared/lib/utils";
import { ProductCarousel, type CarouselImage } from "./ProductCarousel";
import { Carousel_004 } from "../ui/skiper-ui/skiper50";

interface ProductImageGalleryProps {
	images: ProductImage[];
	primaryImage: ProductImage | null;
	productTitle: string;
}

export default function ProductImageGallery({
	images,
	primaryImage,
	productTitle,
}: ProductImageGalleryProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const swiperRef = useRef<SwiperType | null>(null);

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

	// Convert ProductImage to CarouselImage format
	const carouselImages: CarouselImage[] = displayImages.map((image) => ({
		src: image.url,
		alt: image.altText || productTitle,
	}));

	// Custom slide renderer with Next.js Image optimization
	const renderSlide = (image: CarouselImage, index: number) => (
		<div className="aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/30 to-muted/60 shadow-2xl border border-border/20">
			<Image
				src={image.src}
				alt={image.alt}
				width={800}
				height={800}
				className="h-full w-full object-cover object-center"
				priority={index === 0}
				loading={index === 0 ? undefined : "lazy"}
			/>
		</div>
	);

	return (
		<div className="w-full space-y-4">
			{/* Product Carousel */}
			<ProductCarousel
				images={carouselImages}
				loop={displayImages.length > 2}
				showNavigation={displayImages.length > 1}
				showCounter={displayImages.length > 1}
				activeIndex={activeIndex}
				onSlideChange={(index) => setActiveIndex(index)}
				onSwiperInit={(swiper) => {
					swiperRef.current = swiper;
				}}
				aspectRatio="square"
				renderSlide={renderSlide}
			/>

			{/* Custom Thumbnail Pagination */}
			{displayImages.length > 1 && (
				<div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
					{displayImages.map((image, index) => (
						<motion.button
							key={index}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: index * 0.05 }}
							onClick={() => {
								if (swiperRef.current) {
									swiperRef.current.slideToLoop(index);
								}
							}}
							className={cn(
								"aspect-square overflow-hidden rounded-xl transition-all duration-300 relative",
								"md:hover:scale-105 cursor-pointer",
								activeIndex === index
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
			)}
		</div>
	);
}
