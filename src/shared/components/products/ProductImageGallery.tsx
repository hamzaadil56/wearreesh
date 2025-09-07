"use client";

import { useState } from "react";
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

	const displayImage = images[selectedImageIndex] || primaryImage;

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
				{displayImage ? (
					<Image
						src={displayImage.url}
						alt={displayImage.altText || productTitle}
						width={600}
						height={600}
						className="h-full w-full object-cover object-center"
						priority
					/>
				) : (
					<div className="h-full w-full flex items-center justify-center text-muted-foreground">
						No image available
					</div>
				)}
			</div>

			{/* Thumbnail Images */}
			{images.length > 1 && (
				<div className="grid grid-cols-4 gap-2">
					{images.slice(0, 4).map((image, index) => (
						<button
							key={index}
							onClick={() => setSelectedImageIndex(index)}
							className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
								selectedImageIndex === index
									? "border-primary"
									: "border-transparent hover:border-muted-foreground/50"
							}`}
						>
							<Image
								src={image.url}
								alt={image.altText || productTitle}
								width={150}
								height={150}
								className="h-full w-full object-cover object-center"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
