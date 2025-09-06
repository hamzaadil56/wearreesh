import { getCollections } from "@/shared/lib/shopify";
import { Collection } from "@/models/collection/Collection.model";
import type { Collection as ShopifyCollection } from "@/shared/lib/shopify/types";

/**
 * Collections Service
 * Bridges the gap between Shopify API and domain models
 */
export class CollectionsService {
	private static instance: CollectionsService;

	private constructor() {}

	static getInstance(): CollectionsService {
		if (!CollectionsService.instance) {
			CollectionsService.instance = new CollectionsService();
		}
		return CollectionsService.instance;
	}

	/**
	 * Fetch collections from Shopify and convert to domain models
	 */
	async fetchCollections(): Promise<Collection[]> {
		try {
			const shopifyCollections = await getCollections();

			return shopifyCollections.map((c) =>
				this.mapShopifyToCollection(c)
			);
		} catch (error) {
			console.error("Error fetching collections:", error);
			throw new Error("Failed to fetch collections");
		}
	}

	/**
	 * Map Shopify collection to domain model
	 */
	private mapShopifyToCollection(
		shopifyCollection: ShopifyCollection
	): Collection {
		return new Collection({
			id: shopifyCollection.handle || shopifyCollection.id || "",
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

export const collectionsService = CollectionsService.getInstance();
