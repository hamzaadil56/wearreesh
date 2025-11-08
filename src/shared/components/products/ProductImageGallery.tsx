"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ProductImage } from "@/models/product/Product.model";

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
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	const displayImage = images[selectedImageIndex] || primaryImage;

	const handleImageNavigation = (direction: "prev" | "next") => {
		if (images.length <= 1) return;

		if (direction === "prev") {
			setSelectedImageIndex((prev) =>
				prev === 0 ? images.length - 1 : prev - 1
			);
		} else {
			setSelectedImageIndex((prev) =>
				prev === images.length - 1 ? 0 : prev + 1
			);
		}
		setIsImageLoaded(false);
	};

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") handleImageNavigation("prev");
			if (e.key === "ArrowRight") handleImageNavigation("next");
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<div className="relative">
				<div className="aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/30 to-muted/60 shadow-2xl border border-border/20 relative">
					{/* Loading skeleton */}
					{!isImageLoaded && (
						<div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted animate-pulse rounded-2xl" />
					)}

					{displayImage ? (
						<Image
							src={displayImage.url}
							alt={displayImage.altText || productTitle}
							width={800}
							height={800}
							className={`h-full w-full object-cover object-center transition-opacity duration-700 ease-out ${
								isImageLoaded ? "opacity-100" : "opacity-0"
							}`}
							priority
							onLoad={() => setIsImageLoaded(true)}
						/>
					) : (
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
								<p className="font-medium">
									No image available
								</p>
							</div>
						</div>
					)}

					{/* Navigation arrows */}
					{images.length > 1 && (
						<>
							<button
								onClick={() => handleImageNavigation("prev")}
								className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 hover:bg-white"
								aria-label="Previous image"
							>
								<svg
									className="w-5 h-5 text-foreground"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>
							<button
								onClick={() => handleImageNavigation("next")}
								className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 hover:bg-white"
								aria-label="Next image"
							>
								<svg
									className="w-5 h-5 text-foreground"
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
							</button>
						</>
					)}

					{/* Image counter */}
					{images.length > 1 && (
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
							{selectedImageIndex + 1} / {images.length}
						</div>
					)}
				</div>
			</div>

			{/* Thumbnail Images */}
			{images.length > 1 && (
				<div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => {
								setSelectedImageIndex(index);
								setIsImageLoaded(false);
							}}
							className={`aspect-square overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 ${
								selectedImageIndex === index
									? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
									: "ring-1 ring-border/20 hover:ring-border/40 shadow-sm hover:shadow-md"
							}`}
						>
							<Image
								src={image.url}
								alt={image.altText || productTitle}
								width={120}
								height={120}
								className="h-full w-full object-cover object-center"
							/>

							{/* Selected indicator */}
							{selectedImageIndex === index && (
								<div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
									<div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
										<svg
											className="w-3 h-3 text-primary-foreground"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
