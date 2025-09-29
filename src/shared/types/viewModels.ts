import { ProductOption, ProductVariant } from "../lib/shopify/types";
import { ProductImage } from "@/models/product/Product.model";

export interface ProductViewModel {
	id: string;
	title: string;
	description: string;
	totalInventory: number;
	options: ProductOption[];
	variants: ProductVariant[];
	primaryImage: ProductImage;
	handle: string;
	images: ProductImage[];
	imageUrl: string;
	imageAlt: string;
	price: string;
	currencyCode: string;
	shortDescription: string;
	formattedPrice: string;
	formattedCompareAtPrice?: string;
	availableForSale: boolean;
	hasMultipleVariants: boolean;
	tags: string[];
}
