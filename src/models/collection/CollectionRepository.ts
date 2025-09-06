import { BaseRepository } from "../core/Repository";
import { Collection, CollectionData } from "./Collection.model";
import { getCollections, getCollection } from "@/shared/lib/shopify";
import type { Collection as ShopifyCollection } from "@/shared/lib/shopify/types";

export class CollectionRepository extends BaseRepository<Collection> {
	async findById(id: string): Promise<Collection | null> {
		// Check cache first
		const cached = this.getCached(id);
		if (cached) return cached;

		const result = await this.safeOperation(async () => {
			const shopifyCollection = await getCollection(id);
			if (!shopifyCollection) return null;

			const collection = this.mapShopifyToCollection(shopifyCollection);
			this.setCached(id, collection);
			return collection;
		}, `Failed to fetch collection with id: ${id}`);

		return result.success ? result.data : null;
	}

	async findAll(): Promise<Collection[]> {
		const result = await this.safeOperation(async () => {
			const shopifyCollections = await getCollections();
			return shopifyCollections.map((c) =>
				this.mapShopifyToCollection(c)
			);
		}, "Failed to fetch collections");

		return result.success ? result.data : [];
	}

	async findByHandle(handle: string): Promise<Collection | null> {
		const result = await this.safeOperation(async () => {
			const shopifyCollection = await getCollection(handle);
			if (!shopifyCollection) return null;

			return this.mapShopifyToCollection(shopifyCollection);
		}, `Failed to fetch collection with handle: ${handle}`);

		return result.success ? result.data : null;
	}

	// Not applicable for read-only collection data
	async create(
		entity: Omit<Collection, "id" | "createdAt" | "updatedAt">
	): Promise<Collection> {
		throw new Error(
			"Collection creation not supported through Shopify Storefront API"
		);
	}

	async update(
		id: string,
		updates: Partial<Collection>
	): Promise<Collection> {
		throw new Error(
			"Collection updates not supported through Shopify Storefront API"
		);
	}

	async delete(id: string): Promise<void> {
		throw new Error(
			"Collection deletion not supported through Shopify Storefront API"
		);
	}

	/**
	 * Map Shopify collection to domain model
	 */
	private mapShopifyToCollection(
		shopifyCollection: ShopifyCollection
	): Collection {
		return new Collection({
			id: shopifyCollection.handle || shopifyCollection.id || "", // Use handle as ID for consistency
			handle: shopifyCollection.handle,
			title: shopifyCollection.title,
			description: shopifyCollection.description,
			image: shopifyCollection.image,
			seo: shopifyCollection.seo,
			path: shopifyCollection.path,
			createdAt: new Date(shopifyCollection.updatedAt),
			updatedAt: new Date(shopifyCollection.updatedAt),
		});
	}
}
