"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
	EffectCreative,
	EffectFade,
	EffectCoverflow,
	Navigation,
	Pagination,
	Autoplay,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { cn } from "@/shared/lib/utils";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/effect-fade";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export interface CarouselItem {
	id?: string | number;
	[key: string]: any;
}

export type CarouselEffect = "creative" | "fade" | "coverflow" | "slide";

export interface CarouselProps<T extends CarouselItem = CarouselItem> {
	items: T[];
	renderSlide: (item: T, index: number) => React.ReactNode;
	
	// Pagination options
	pagination?: "default" | "custom" | "none";
	renderCustomPagination?: (
		items: T[],
		activeIndex: number,
		onItemClick: (index: number) => void
	) => React.ReactNode;
	
	// Navigation
	showNavigation?: boolean;
	navigationStyle?: "default" | "custom";
	renderCustomNavigation?: (swiper: SwiperType | null) => React.ReactNode;
	
	// Counter
	showCounter?: boolean;
	counterPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	counterClassName?: string;
	
	// Carousel behavior
	loop?: boolean;
	autoplay?: boolean | { delay: number; disableOnInteraction?: boolean };
	effect?: CarouselEffect;
	slidesPerView?: number | "auto";
	spaceBetween?: number;
	centeredSlides?: boolean;
	
	// Custom creative effect
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
	
	// Callbacks
	onSlideChange?: (index: number) => void;
	onSwiperInit?: (swiper: SwiperType) => void;
	
	// Styling
	className?: string;
	slideClassName?: string;
	wrapperClassName?: string;
	
	// Animation
	animateEntrance?: boolean;
	entranceDelay?: number;
}

export function Carousel<T extends CarouselItem = CarouselItem>({
	items,
	renderSlide,
	pagination = "default",
	renderCustomPagination,
	showNavigation = true,
	navigationStyle = "default",
	renderCustomNavigation,
	showCounter = false,
	counterPosition = "bottom-right",
	counterClassName = "",
	loop = true,
	autoplay = false,
	effect = "slide",
	slidesPerView = 1,
	spaceBetween = 0,
	centeredSlides = false,
	creativeEffect,
	onSlideChange,
	onSwiperInit,
	className = "",
	slideClassName = "",
	wrapperClassName = "",
	animateEntrance = true,
	entranceDelay = 0.1,
}: CarouselProps<T>) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(
		null
	);

	const handleSlideChange = (swiper: SwiperType) => {
		const index = swiper.realIndex;
		setActiveIndex(index);
		if (onSlideChange) onSlideChange(index);
	};

	const handleSwiperInit = (swiper: SwiperType) => {
		setSwiperInstance(swiper);
		if (onSwiperInit) onSwiperInit(swiper);
	};

	const goToSlide = (index: number) => {
		if (swiperInstance) {
			swiperInstance.slideToLoop(index);
		}
	};

	const counterPositionClasses = {
		"top-left": "top-4 left-4",
		"top-right": "top-4 right-4",
		"bottom-left": "bottom-4 left-4",
		"bottom-right": "bottom-4 right-4",
	};

	// Default creative effect
	const defaultCreativeEffect = {
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
	};

	const effectConfig =
		effect === "creative"
			? creativeEffect || defaultCreativeEffect
			: undefined;

	const css = `
		.carousel-generic .swiper-button-next,
		.carousel-generic .swiper-button-prev {
			width: 2.5rem;
			height: 2.5rem;
			background: rgba(255, 255, 255, 0.9);
			border-radius: 50%;
			box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
			transition: all 0.2s;
		}

		.carousel-generic .swiper-button-next svg,
		.carousel-generic .swiper-button-prev svg {
			width: auto;
			height: auto;
			fill: none;
		}

		@media (max-width: 768px) {
			.carousel-generic .swiper-button-next,
			.carousel-generic .swiper-button-prev {
				background: rgba(255, 255, 255, 0.95);
			}
		}

		.carousel-generic .swiper-button-next:hover,
		.carousel-generic .swiper-button-prev:hover {
			background: rgba(255, 255, 255, 1);
			transform: scale(1.05);
		}

		.carousel-generic .swiper-button-next::after,
		.carousel-generic .swiper-button-prev::after {
			display: none;
		}

		.carousel-generic .swiper-pagination-bullet {
			background: rgba(255, 255, 255, 0.5);
			width: 0.5rem;
			height: 0.5rem;
			opacity: 1;
		}

		.carousel-generic .swiper-pagination-bullet-active {
			background: rgba(255, 255, 255, 1);
			width: 1.5rem;
			border-radius: 0.25rem;
		}
	`;

	const Wrapper = animateEntrance ? motion.div : "div";
	const wrapperProps = animateEntrance
		? {
				initial: { opacity: 0, translateY: 20 },
				animate: { opacity: 1, translateY: 0 },
				transition: {
					duration: 0.3,
					delay: entranceDelay,
				},
		  }
		: {};

	return (
		<Wrapper
			className={cn("relative w-full", wrapperClassName)}
			{...wrapperProps}
		>
			<style>{css}</style>

			<Swiper
				onSwiper={handleSwiperInit}
				onSlideChange={handleSlideChange}
				effect={effect}
				grabCursor={true}
				loop={loop && items.length > 2}
				autoplay={
					autoplay
						? typeof autoplay === "boolean"
							? { delay: 3000, disableOnInteraction: false }
							: autoplay
						: false
				}
				slidesPerView={slidesPerView}
				spaceBetween={spaceBetween}
				centeredSlides={centeredSlides}
				navigation={
					showNavigation && navigationStyle === "default"
						? {
								nextEl: ".swiper-button-next",
								prevEl: ".swiper-button-prev",
						  }
						: false
				}
				pagination={
					pagination === "default"
						? {
								clickable: true,
								dynamicBullets: items.length > 5,
						  }
						: false
				}
				className={cn("carousel-generic", className)}
				creativeEffect={effectConfig}
				modules={[
					EffectCreative,
					EffectFade,
					EffectCoverflow,
					Navigation,
					Pagination,
					Autoplay,
				]}
			>
				{items.map((item, index) => (
					<SwiperSlide key={item.id || index} className={slideClassName}>
						{renderSlide(item, index)}
					</SwiperSlide>
				))}

				{/* Default Navigation Buttons */}
				{showNavigation &&
					navigationStyle === "default" &&
					items.length > 1 && (
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

			{/* Custom Navigation */}
			{showNavigation &&
				navigationStyle === "custom" &&
				renderCustomNavigation &&
				renderCustomNavigation(swiperInstance)}

			{/* Counter */}
			{showCounter && items.length > 1 && (
				<div
					className={cn(
						"absolute z-10 bg-black/60 md:backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium",
						counterPositionClasses[counterPosition],
						counterClassName
					)}
				>
					{activeIndex + 1} / {items.length}
				</div>
			)}

			{/* Custom Pagination */}
			{pagination === "custom" && renderCustomPagination && (
				<div className="mt-4">
					{renderCustomPagination(items, activeIndex, goToSlide)}
				</div>
			)}
		</Wrapper>
	);
}

// Export types for external use
export type { SwiperType };

