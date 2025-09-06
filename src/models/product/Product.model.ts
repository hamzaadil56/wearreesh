import { BaseModel } from "../core/BaseModel";

export interface ProductImage {
	url: string;
	altText: string;
	width?: number;
	height?: number;
}

export interface ProductVariant {
	id: string;
	title: string;
	price: {
		amount: string;
		currencyCode: string;
	};
	availableForSale: boolean;
	selectedOptions: {
		name: string;
		value: string;
	}[];
}

export interface ProductSEO {
	title: string;
	description: string;
}

export interface ProductData {
	id: string;
	title: string;
	description: string;
	descriptionHtml?: string;
	handle: string;
	images: ProductImage[];
	variants: ProductVariant[];
	priceRange: {
		minVariantPrice: {
			amount: string;
			currencyCode: string;
		};
		maxVariantPrice: {
			amount: string;
			currencyCode: string;
		};
	};
	availableForSale: boolean;
	tags: string[];
	seo?: ProductSEO;
	featuredImage?: ProductImage;
	createdAt?: Date;
	updatedAt?: Date;
}

export class Product extends BaseModel {
	public readonly title: string;
	public readonly description: string;
	public readonly descriptionHtml?: string;
	public readonly handle: string;
	public readonly images: ProductImage[];
	public readonly variants: ProductVariant[];
	public readonly priceRange: ProductData["priceRange"];
	public readonly availableForSale: boolean;
	public readonly tags: string[];
	public readonly seo?: ProductSEO;
	public readonly featuredImage?: ProductImage;

	constructor(data: ProductData) {
		super({
			id: data.id,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});

		this.title = data.title;
		this.description = data.description;
		this.descriptionHtml = data.descriptionHtml;
		this.handle = data.handle;
		this.images = data.images;
		this.variants = data.variants;
		this.priceRange = data.priceRange;
		this.availableForSale = data.availableForSale;
		this.tags = data.tags;
		this.seo = data.seo;
		this.featuredImage = data.featuredImage || data.images[0];
	}

	/**
	 * Get the primary image for the product
	 */
	get primaryImage(): ProductImage | null {
		return this.featuredImage || this.images[0] || null;
	}

	/**
	 * Get formatted price range
	 */
	get formattedPriceRange(): string {
		const min = this.formatPrice(
			this.priceRange.minVariantPrice.amount,
			this.priceRange.minVariantPrice.currencyCode
		);
		const max = this.formatPrice(
			this.priceRange.maxVariantPrice.amount,
			this.priceRange.maxVariantPrice.currencyCode
		);

		return min === max ? min : `${min} - ${max}`;
	}

	/**
	 * Get the cheapest variant
	 */
	get cheapestVariant(): ProductVariant | null {
		if (this.variants.length === 0) return null;

		return this.variants.reduce((cheapest, variant) => {
			const cheapestPrice = parseFloat(cheapest.price.amount);
			const variantPrice = parseFloat(variant.price.amount);
			return variantPrice < cheapestPrice ? variant : cheapest;
		});
	}

	/**
	 * Get available variants
	 */
	get availableVariants(): ProductVariant[] {
		return this.variants.filter((variant) => variant.availableForSale);
	}

	/**
	 * Check if product has multiple variants
	 */
	get hasMultipleVariants(): boolean {
		return this.variants.length > 1;
	}

	/**
	 * Get short description (truncated)
	 */
	getShortDescription(maxLength: number = 150): string {
		if (!this.description) return "";
		if (this.description.length <= maxLength) return this.description;
		return this.description.substring(0, maxLength).trim() + "...";
	}

	/**
	 * Check if product has a specific tag
	 */
	hasTag(tag: string): boolean {
		return this.tags.includes(tag);
	}

	/**
	 * Format price with currency
	 */
	private formatPrice(amount: string, currencyCode: string): string {
		const numericAmount = parseFloat(amount);
		if (isNaN(numericAmount)) return "Price unavailable";

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currencyCode,
		}).format(numericAmount);
	}

	protected getSerializableData(): Record<string, any> {
		return {
			title: this.title,
			description: this.description,
			descriptionHtml: this.descriptionHtml,
			handle: this.handle,
			images: this.images,
			variants: this.variants,
			priceRange: this.priceRange,
			availableForSale: this.availableForSale,
			tags: this.tags,
			seo: this.seo,
			featuredImage: this.featuredImage,
		};
	}

	clone(updates?: Partial<ProductData>): this {
		return new Product({
			...this.getSerializableData(),
			id: this.id,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			...updates,
		} as ProductData) as this;
	}

	validate(): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];

		if (!this.title.trim()) {
			errors.push("Product title is required");
		}

		if (!this.handle.trim()) {
			errors.push("Product handle is required");
		}

		if (this.variants.length === 0) {
			errors.push("Product must have at least one variant");
		}

		if (
			!this.priceRange.minVariantPrice.amount ||
			parseFloat(this.priceRange.minVariantPrice.amount) < 0
		) {
			errors.push("Product must have a valid price");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}
