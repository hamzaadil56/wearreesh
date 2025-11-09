/**
 * CAROUSEL COMPONENT - USAGE EXAMPLES
 * 
 * This file contains examples of how to use the generic Carousel component
 * in different scenarios throughout your application.
 */

import { Carousel, type CarouselItem } from "./carousel";
import Image from "next/image";
import { motion } from "framer-motion";

// ============================================
// EXAMPLE 1: Simple Image Carousel with Default Pagination
// ============================================

interface SimpleImageItem extends CarouselItem {
	imageUrl: string;
	title: string;
}

export function SimpleImageCarousel() {
	const images: SimpleImageItem[] = [
		{ id: 1, imageUrl: "/hero1.jpg", title: "Hero 1" },
		{ id: 2, imageUrl: "/hero2.jpg", title: "Hero 2" },
		{ id: 3, imageUrl: "/hero3.jpg", title: "Hero 3" },
	];

	return (
		<Carousel
			items={images}
			renderSlide={(item) => (
				<div className="relative h-[500px] w-full">
					<img
						src={item.imageUrl}
						alt={item.title}
						className="h-full w-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
						<h2 className="text-white text-4xl font-bold p-8">
							{item.title}
						</h2>
					</div>
				</div>
			)}
			pagination="default"
			showNavigation={true}
			showCounter={false}
			autoplay={{ delay: 5000 }}
			loop={true}
		/>
	);
}

// ============================================
// EXAMPLE 2: Product Gallery with Custom Thumbnail Pagination
// ============================================

interface ProductImageItem extends CarouselItem {
	url: string;
	alt: string;
	thumbnail: string;
}

export function ProductGalleryCarousel() {
	const images: ProductImageItem[] = [
		{
			id: 1,
			url: "/product1.jpg",
			alt: "Product 1",
			thumbnail: "/thumb1.jpg",
		},
		{
			id: 2,
			url: "/product2.jpg",
			alt: "Product 2",
			thumbnail: "/thumb2.jpg",
		},
		{
			id: 3,
			url: "/product3.jpg",
			alt: "Product 3",
			thumbnail: "/thumb3.jpg",
		},
	];

	return (
		<Carousel
			items={images}
			renderSlide={(item) => (
				<div className="aspect-square w-full">
					<Image
						src={item.url}
						alt={item.alt}
						width={800}
						height={800}
						className="h-full w-full object-cover rounded-lg"
					/>
				</div>
			)}
			pagination="custom"
			renderCustomPagination={(items, activeIndex, onItemClick) => (
				<div className="grid grid-cols-4 gap-2">
					{items.map((item, index) => (
						<button
							key={item.id}
							onClick={() => onItemClick(index)}
							className={`aspect-square rounded-lg overflow-hidden transition-all ${
								activeIndex === index
									? "ring-2 ring-primary"
									: "opacity-60 hover:opacity-100"
							}`}
						>
							<img
								src={item.thumbnail}
								alt={item.alt}
								className="h-full w-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
			showNavigation={true}
			showCounter={true}
			effect="creative"
			loop={true}
		/>
	);
}

// ============================================
// EXAMPLE 3: Testimonials Carousel with Fade Effect
// ============================================

interface TestimonialItem extends CarouselItem {
	name: string;
	quote: string;
	avatar: string;
	role: string;
}

export function TestimonialsCarousel() {
	const testimonials: TestimonialItem[] = [
		{
			id: 1,
			name: "John Doe",
			quote: "This product changed my life!",
			avatar: "/avatar1.jpg",
			role: "CEO, Company",
		},
		{
			id: 2,
			name: "Jane Smith",
			quote: "Amazing experience from start to finish.",
			avatar: "/avatar2.jpg",
			role: "Designer, Agency",
		},
	];

	return (
		<Carousel
			items={testimonials}
			renderSlide={(item) => (
				<div className="bg-card p-8 rounded-2xl shadow-lg text-center max-w-2xl mx-auto">
					<img
						src={item.avatar}
						alt={item.name}
						className="w-20 h-20 rounded-full mx-auto mb-4"
					/>
					<p className="text-lg italic mb-4">"{item.quote}"</p>
					<h4 className="font-bold">{item.name}</h4>
					<p className="text-sm text-muted-foreground">{item.role}</p>
				</div>
			)}
			pagination="default"
			showNavigation={false}
			effect="fade"
			autoplay={{ delay: 4000 }}
			loop={true}
		/>
	);
}

// ============================================
// EXAMPLE 4: Hero Carousel with Custom Navigation
// ============================================

interface HeroSlideItem extends CarouselItem {
	backgroundImage: string;
	title: string;
	subtitle: string;
	ctaText: string;
	ctaLink: string;
}

export function HeroCarousel() {
	const slides: HeroSlideItem[] = [
		{
			id: 1,
			backgroundImage: "/hero-bg-1.jpg",
			title: "Welcome to Our Store",
			subtitle: "Discover amazing products",
			ctaText: "Shop Now",
			ctaLink: "/shop",
		},
		{
			id: 2,
			backgroundImage: "/hero-bg-2.jpg",
			title: "New Collection",
			subtitle: "Fresh arrivals for this season",
			ctaText: "View Collection",
			ctaLink: "/collections",
		},
	];

	return (
		<Carousel
			items={slides}
			renderSlide={(item) => (
				<div
					className="relative h-screen w-full bg-cover bg-center"
					style={{ backgroundImage: `url(${item.backgroundImage})` }}
				>
					<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
						<div className="text-center text-white">
							<h1 className="text-6xl font-bold mb-4">
								{item.title}
							</h1>
							<p className="text-2xl mb-8">{item.subtitle}</p>
							<a
								href={item.ctaLink}
								className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition"
							>
								{item.ctaText}
							</a>
						</div>
					</div>
				</div>
			)}
			pagination="default"
			showNavigation={true}
			navigationStyle="default"
			showCounter={false}
			autoplay={{ delay: 6000, disableOnInteraction: false }}
			loop={true}
			effect="fade"
		/>
	);
}

// ============================================
// EXAMPLE 5: Mobile/Desktop Responsive Card Carousel
// ============================================

interface CardItem extends CarouselItem {
	title: string;
	description: string;
	image: string;
	link: string;
}

export function ResponsiveCardCarousel() {
	const cards: CardItem[] = [
		{
			id: 1,
			title: "Feature 1",
			description: "Amazing feature description",
			image: "/feature1.jpg",
			link: "/feature-1",
		},
		{
			id: 2,
			title: "Feature 2",
			description: "Another great feature",
			image: "/feature2.jpg",
			link: "/feature-2",
		},
		{
			id: 3,
			title: "Feature 3",
			description: "Yet another feature",
			image: "/feature3.jpg",
			link: "/feature-3",
		},
	];

	return (
		<Carousel
			items={cards}
			renderSlide={(item) => (
				<a
					href={item.link}
					className="block bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
				>
					<img
						src={item.image}
						alt={item.title}
						className="w-full h-48 object-cover"
					/>
					<div className="p-4">
						<h3 className="text-xl font-bold mb-2">{item.title}</h3>
						<p className="text-muted-foreground">
							{item.description}
						</p>
					</div>
				</a>
			)}
			pagination="default"
			showNavigation={true}
			slidesPerView="auto"
			spaceBetween={16}
			centeredSlides={false}
			loop={false}
			className="px-4"
			slideClassName="w-[280px] md:w-[320px]"
		/>
	);
}

// ============================================
// EXAMPLE 6: Gallery with Custom Counter Position
// ============================================

export function GalleryWithTopCounter() {
	const images = [
		{ id: 1, src: "/gallery1.jpg", alt: "Gallery 1" },
		{ id: 2, src: "/gallery2.jpg", alt: "Gallery 2" },
		{ id: 3, src: "/gallery3.jpg", alt: "Gallery 3" },
	];

	return (
		<Carousel
			items={images}
			renderSlide={(item) => (
				<img
					src={item.src}
					alt={item.alt}
					className="w-full h-[600px] object-cover rounded-lg"
				/>
			)}
			pagination="none"
			showNavigation={true}
			showCounter={true}
			counterPosition="top-right"
			counterClassName="bg-white/90 text-black"
			effect="creative"
			loop={true}
		/>
	);
}

/**
 * PROPS REFERENCE:
 * 
 * items: T[] - Array of items to display
 * renderSlide: (item: T, index: number) => ReactNode - Custom slide renderer
 * 
 * pagination: "default" | "custom" | "none"
 *   - "default": Built-in bullet pagination
 *   - "custom": Use renderCustomPagination to provide your own
 *   - "none": No pagination
 * 
 * showNavigation: boolean - Show/hide arrow navigation
 * navigationStyle: "default" | "custom"
 * 
 * showCounter: boolean - Show/hide slide counter (e.g., "1 / 5")
 * counterPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right"
 * 
 * loop: boolean - Enable infinite loop
 * autoplay: boolean | { delay: number, disableOnInteraction?: boolean }
 * effect: "creative" | "fade" | "coverflow" | "slide"
 * 
 * slidesPerView: number | "auto" - Number of slides visible at once
 * spaceBetween: number - Space between slides in px
 * centeredSlides: boolean - Center the active slide
 * 
 * onSlideChange: (index: number) => void
 * onSwiperInit: (swiper: SwiperType) => void
 * 
 * className: string - Wrapper className
 * slideClassName: string - Individual slide className
 * wrapperClassName: string - Outer wrapper className
 * 
 * animateEntrance: boolean - Animate carousel entrance
 * entranceDelay: number - Delay before entrance animation
 */

