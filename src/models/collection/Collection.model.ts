import { BaseModel } from "../core/BaseModel";
import { ProductImage, ProductSEO } from "../product/Product.model";

export interface CollectionData {
	id: string;
	handle: string;
	title: string;
	description: string;
	image?: ProductImage;
	seo?: ProductSEO;
	path?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export class Collection extends BaseModel {
	public readonly handle: string;
	public readonly title: string;
	public readonly description: string;
	public readonly image?: ProductImage;
	public readonly seo?: ProductSEO;
	public readonly path: string;

	constructor(data: CollectionData) {
		super({
			id: data.id,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});

		this.handle = data.handle;
		this.title = data.title;
		this.description = data.description;
		this.image = data.image;
		this.seo = data.seo;
		this.path = data.path || `/search/${data.handle}`;
	}

	/**
	 * Get collection URL
	 */
	get url(): string {
		return this.path;
	}

	/**
	 * Get SEO title (fallback to title)
	 */
	get seoTitle(): string {
		return this.seo?.title || this.title;
	}

	/**
	 * Get SEO description (fallback to description)
	 */
	get seoDescription(): string {
		return this.seo?.description || this.description;
	}

	/**
	 * Get short description
	 */
	getShortDescription(maxLength: number = 100): string {
		if (!this.description) return "";
		if (this.description.length <= maxLength) return this.description;
		return this.description.substring(0, maxLength).trim() + "...";
	}

	/**
	 * Check if collection is the "All" collection
	 */
	get isAllCollection(): boolean {
		return this.handle === "" || this.handle === "all";
	}

	protected getSerializableData(): Record<string, any> {
		return {
			handle: this.handle,
			title: this.title,
			description: this.description,
			image: this.image,
			seo: this.seo,
			path: this.path,
		};
	}

	clone(updates?: Partial<CollectionData>): this {
		return new Collection({
			...this.getSerializableData(),
			id: this.id,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			...updates,
		} as CollectionData) as this;
	}

	validate(): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];

		if (!this.title.trim()) {
			errors.push("Collection title is required");
		}

		if (!this.handle.trim() && !this.isAllCollection) {
			errors.push("Collection handle is required");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}
