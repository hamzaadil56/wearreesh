import { shopifyFetch } from "@/shared/lib/shopify";

/**
 * Shopify API Client
 * Wrapper around the existing shopify fetch utility
 */
export class ShopifyApiClient {
	private static instance: ShopifyApiClient;

	private constructor() {}

	/**
	 * Get singleton instance
	 */
	static getInstance(): ShopifyApiClient {
		if (!ShopifyApiClient.instance) {
			ShopifyApiClient.instance = new ShopifyApiClient();
		}
		return ShopifyApiClient.instance;
	}

	/**
	 * Execute GraphQL query
	 */
	async query<T>(
		query: string,
		variables?: any,
		options?: {
			cache?: RequestCache;
			tags?: string[];
		}
	): Promise<T> {
		const response = await shopifyFetch<T>({
			query,
			variables,
			cache: options?.cache || "force-cache",
			tags: options?.tags,
		});

		return response.body;
	}

	/**
	 * Execute GraphQL mutation
	 */
	async mutate<T>(mutation: string, variables?: any): Promise<T> {
		const response = await shopifyFetch<T>({
			query: mutation,
			variables,
			cache: "no-store",
		});

		return response.body;
	}
}

// Export singleton instance
export const shopifyClient = ShopifyApiClient.getInstance();
