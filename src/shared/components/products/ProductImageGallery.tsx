"use client";

import { useState, useRef, useEffect } from "react";
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
	const [isZoomed, setIsZoomed] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isImageLoaded, setIsImageLoaded] = useState(false);
	const imageRef = useRef<HTMLDivElement>(null);

	const displayImage = images[selectedImageIndex] || primaryImage;

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!imageRef.current) return;

		const rect = imageRef.current.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;

		setMousePosition({ x, y });
	};

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
			if (e.key === "Escape") setIsZoomed(false);
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className="space-y-6">
			{/* Main Image */}
			<div className="relative group">
				<div
					ref={imageRef}
					className="aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/30 to-muted/60 shadow-2xl border border-border/20 relative"
					onMouseMove={handleMouseMove}
					onMouseEnter={() => setIsZoomed(true)}
					onMouseLeave={() => setIsZoomed(false)}
				>
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
							className={`h-full w-full object-cover object-center transition-all duration-700 ease-out ${
								isImageLoaded ? "opacity-100" : "opacity-0"
							} ${isZoomed ? "scale-150" : "scale-100"}`}
							style={
								isZoomed
									? {
											transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
									  }
									: {}
							}
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

					{/* Zoom indicator */}
					{displayImage && (
						<div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<svg
								className="w-4 h-4 inline mr-1.5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
								/>
							</svg>
							Hover to zoom
						</div>
					)}

					{/* Navigation arrows */}
					{images.length > 1 && (
						<>
							<button
								onClick={() => handleImageNavigation("prev")}
								className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
								aria-label="Previous image"
							>
								<svg
									className="w-6 h-6 text-foreground"
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
								className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
								aria-label="Next image"
							>
								<svg
									className="w-6 h-6 text-foreground"
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
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h4 className="text-sm font-medium text-muted-foreground">
							Product Images
						</h4>
						<div className="flex space-x-2">
							<button
								onClick={() => handleImageNavigation("prev")}
								className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
								disabled={selectedImageIndex === 0}
							>
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
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>
							<button
								onClick={() => handleImageNavigation("next")}
								className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
								disabled={
									selectedImageIndex === images.length - 1
								}
							>
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
							</button>
						</div>
					</div>

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
				</div>
			)}

			{/* Image details */}
			{displayImage && (
				<div className="bg-muted/30 rounded-xl p-4 space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-foreground">
							Image Details
						</span>
						<button className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
							View full size
						</button>
					</div>
					{displayImage.altText && (
						<p className="text-sm text-muted-foreground">
							{displayImage.altText}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
