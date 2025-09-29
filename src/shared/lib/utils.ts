import { Product } from "@/models/product/Product.model";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProductViewModel } from "../types/viewModels";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const mapToViewModel = (product: Product): ProductViewModel => {
	const primaryImage = product.primaryImage;

	return {
		id: product.id,
		title: product.title,
		description: product.description,
		totalInventory: product.totalInventory,
		images: product.images,
		variants: product.variants,
		primaryImage: primaryImage || product.images?.[0],
		handle: product.handle,
		imageUrl: primaryImage?.url || "/placeholder-image.jpg",
		imageAlt: primaryImage?.altText || product.title,
		price: product.priceRange.minVariantPrice.amount,
		currencyCode: product.priceRange.minVariantPrice.currencyCode,
		shortDescription: product.getShortDescription(100),
		formattedPrice: product.formattedPriceRange,
		formattedCompareAtPrice: product.formattedCompareAtPrice || undefined,
		availableForSale: product.availableForSale,
		hasMultipleVariants: product.hasMultipleVariants,
		tags: product.tags,
		options: product.options,
	};
};
