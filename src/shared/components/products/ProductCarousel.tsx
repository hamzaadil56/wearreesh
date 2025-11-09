"use client";

import Image from "next/image";
import {
	Carousel,
	type CarouselItem,
	type SwiperType,
} from "@/shared/components/ui/carousel";

export interface CarouselImage extends CarouselItem {
	src: string;
	alt: string;
}

export interface ProductCarouselProps {
	images: CarouselImage[];
	loop?: boolean;
	showNavigation?: boolean;
	showCounter?: boolean;
	activeIndex?: number;
	onSlideChange?: (index: number) => void;
	onSwiperInit?: (swiper: SwiperType) => void;
	className?: string;
	slideClassName?: string;
	navigationClassName?: string;
	counterClassName?: string;
	aspectRatio?: "square" | "video" | "auto";
	renderSlide?: (image: CarouselImage, index: number) => React.ReactNode;
	creativeEffect?: {
		prev: {
			shadow?: boolean;
			origin?: string;
			translate?: [string | number, string | number, string | number];
			rotate?: [number, number, number];
		};
		next: {
			origin?: string;
			translate?: [string | number, string | number, string | number];
			rotate?: [number, number, number];
		};
	};
}

export function ProductCarousel({
	images,
	loop = true,
	showNavigation = true,
	showCounter = true,
	activeIndex = 0,
	onSlideChange,
	onSwiperInit,
	className = "",
	slideClassName = "",
	counterClassName = "",
	aspectRatio = "square",
	renderSlide,
	creativeEffect,
}: ProductCarouselProps) {
	const aspectRatioClass =
		aspectRatio === "square"
			? "aspect-square"
			: aspectRatio === "video"
			? "aspect-video"
			: "";

	// Default slide renderer
	const defaultRenderSlide = (image: CarouselImage, index: number) => (
		<div
			className={`${aspectRatioClass} w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/30 to-muted/60 shadow-2xl border border-border/20 ${slideClassName}`}
		>
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

	const slideRenderer = renderSlide || defaultRenderSlide;

	return (
		<Carousel
			items={images}
			renderSlide={slideRenderer}
			loop={loop}
			showNavigation={showNavigation}
			showCounter={showCounter}
			counterPosition="bottom-right"
			counterClassName={counterClassName}
			effect="creative"
			creativeEffect={creativeEffect}
			onSlideChange={onSlideChange}
			onSwiperInit={onSwiperInit}
			className={className}
			pagination="none"
		/>
	);
}
