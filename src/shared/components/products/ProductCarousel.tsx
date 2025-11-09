"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface CarouselImage {
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
	navigationClassName = "",
	counterClassName = "",
	aspectRatio = "square",
	renderSlide,
	creativeEffect = {
		prev: {
			shadow: true,
			origin: "left center",
			translate: ["-5%", 0, -100],
			rotate: [0, 50, 0],
		},
		next: {
			origin: "right center",
			translate: ["5%", 0, -100],
			rotate: [0, -50, 0],
		},
	},
}: ProductCarouselProps) {
	const aspectRatioClass =
		aspectRatio === "square"
			? "aspect-square"
			: aspectRatio === "video"
			? "aspect-video"
			: "";

	const css = `
		.product-carousel-generic {
			width: 100%;
			height: auto;
			${aspectRatio === "square" ? "aspect-ratio: 1;" : ""}
			${aspectRatio === "video" ? "aspect-ratio: 16/9;" : ""}
			padding-bottom: 0 !important;
		}
		
		.product-carousel-generic .swiper-slide {
			background-position: center;
			background-size: cover;
			border-radius: 1rem;
			overflow: hidden;
		}

		.product-carousel-generic .swiper-button-next,
		.product-carousel-generic .swiper-button-prev {
			width: 2.5rem;
			height: 2.5rem;
			background: rgba(255, 255, 255, 0.9);
			border-radius: 50%;
			box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
			transition: all 0.2s;
		}

		.product-carousel-generic .swiper-button-next svg,
		.product-carousel-generic .swiper-button-prev svg {
			width: auto;
			height: auto;
			fill: none;
		}

		@media (max-width: 768px) {
			.product-carousel-generic .swiper-button-next,
			.product-carousel-generic .swiper-button-prev {
				background: rgba(255, 255, 255, 0.95);
			}
		}

		.product-carousel-generic .swiper-button-next:hover,
		.product-carousel-generic .swiper-button-prev:hover {
			background: rgba(255, 255, 255, 1);
			transform: scale(1.05);
		}

		.product-carousel-generic .swiper-button-next::after,
		.product-carousel-generic .swiper-button-prev::after {
			display: none;
		}

		.product-carousel-generic .swiper-pagination {
			position: relative;
			margin-top: 1rem;
			display: none;
		}
	`;

	// Default slide renderer
	const defaultRenderSlide = (image: CarouselImage, index: number) => (
		<div
			className={`${aspectRatioClass} w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/30 to-muted/60 shadow-2xl border border-border/20 ${slideClassName}`}
		>
			<img
				src={image.src}
				alt={image.alt}
				className="h-full w-full object-cover object-center"
				loading={index === 0 ? "eager" : "lazy"}
			/>
		</div>
	);

	const slideRenderer = renderSlide || defaultRenderSlide;

	return (
		<motion.div
			initial={{ opacity: 0, translateY: 20 }}
			animate={{ opacity: 1, translateY: 0 }}
			transition={{
				duration: 0.3,
				delay: 0.1,
			}}
			className={`relative w-full ${className}`}
		>
			<style>{css}</style>

			<Swiper
				onSwiper={(swiper) => {
					if (onSwiperInit) onSwiperInit(swiper);
				}}
				onSlideChange={(swiper) => {
					if (onSlideChange) onSlideChange(swiper.activeIndex);
				}}
				effect="creative"
				grabCursor={true}
				loop={loop && images.length > 2}
				navigation={
					showNavigation
						? {
								nextEl: ".swiper-button-next",
								prevEl: ".swiper-button-prev",
						  }
						: false
				}
				className={`product-carousel-generic ${navigationClassName}`}
				creativeEffect={creativeEffect}
				modules={[EffectCreative, Navigation, Pagination]}
			>
				{images.map((image, index) => (
					<SwiperSlide key={index}>
						{slideRenderer(image, index)}
					</SwiperSlide>
				))}

				{/* Navigation Buttons */}
				{showNavigation && images.length > 1 && (
					<>
						<div className="swiper-button-prev md:flex items-center justify-center">
							<ArrowLeft className="h-5 w-5 text-foreground" />
						</div>
						<div className="swiper-button-next md:flex items-center justify-center">
							<ArrowRight className="h-5 w-5 text-foreground" />
						</div>
					</>
				)}
			</Swiper>

			{/* Image Counter */}
			{showCounter && images.length > 1 && (
				<div
					className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 md:backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium z-10 ${counterClassName}`}
				>
					{activeIndex + 1} / {images.length}
				</div>
			)}
		</motion.div>
	);
}
