import { BaseRepository } from "../core/Repository";
import { Product } from "./Product.model";
import { PaginatedResult, SearchParams } from "../core/types";
// Import from shared/lib (using the alias)
import {
	getProducts,
	getProduct,
	getCollectionProducts,
	getProductsOptions,
} from "@/shared/lib/shopify";
import type {
	ProductOption,
	Product as ShopifyProduct,
} from "@/shared/lib/shopify/types";

export class ProductRepository extends BaseRepository<Product> {
	async findById(id: string): Promise<Product | null> {
		// Check cache first
		const cached = this.getCached(id);
		if (cached) return cached;

		const result = await this.safeOperation(async () => {
			const shopifyProduct = await getProduct(id);
			if (!shopifyProduct) return null;

			const product = this.mapShopifyToProduct(shopifyProduct);
			this.setCached(id, product);
			return product;
		}, `Failed to fetch product with id: ${id}`);

		return result.success ? result.data : null;
	}

	async findAll(): Promise<Product[]> {
		const result = await this.safeOperation(async () => {
			const shopifyProducts = await getProducts({});
			return shopifyProducts.map((p) => this.mapShopifyToProduct(p));
		}, "Failed to fetch products");

		return result.success ? result.data : [];
	}

	async findByHandle(handle: string): Promise<Product | null> {
		const result = await this.safeOperation(async () => {
			const shopifyProduct = await getProduct(handle);
			if (!shopifyProduct) return null;

			return this.mapShopifyToProduct(shopifyProduct);
		}, `Failed to fetch product with handle: ${handle}`);

		return result.success ? result.data : null;
	}

	async search(params: SearchParams): Promise<PaginatedResult<Product>> {
		const result = await this.safeOperation(async () => {
			const shopifyProducts = await getProducts({
				query: params.query,
				sortKey: params.pagination?.sortBy,
				reverse: params.pagination?.sortOrder === "desc",
			});

			const products = shopifyProducts.map((p) =>
				this.mapShopifyToProduct(p)
			);

			// Simple pagination (Shopify API handles the actual pagination)
			const page = params.pagination?.page || 1;
			const limit = params.pagination?.limit || 20;
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedProducts = products.slice(startIndex, endIndex);

			return {
				items: paginatedProducts,
				totalCount: products.length,
				currentPage: page,
				totalPages: Math.ceil(products.length / limit),
				hasNextPage: endIndex < products.length,
				hasPreviousPage: page > 1,
			};
		}, "Failed to search products");

		return result.success
			? result.data
			: {
					items: [],
					totalCount: 0,
					currentPage: 1,
					totalPages: 0,
					hasNextPage: false,
					hasPreviousPage: false,
			  };
	}

	async findByCollection(collectionHandle: string): Promise<Product[]> {
		const result = await this.safeOperation(async () => {
			const shopifyProducts = await getCollectionProducts({
				collection: collectionHandle,
			});
			return shopifyProducts.map((p) => this.mapShopifyToProduct(p));
		}, `Failed to fetch products for collection: ${collectionHandle}`);

		return result.success ? result.data : [];
	}

	// Not applicable for read-only product data
	async create(): Promise<Product> {
		throw new Error(
			"Product creation not supported through Shopify Storefront API"
		);
	}

	async update(): Promise<Product> {
		throw new Error(
			"Product updates not supported through Shopify Storefront API"
		);
	}

	async delete(): Promise<void> {
		throw new Error(
			"Product deletion not supported through Shopify Storefront API"
		);
	}

	async getProductsOptions(): Promise<{
		options: Array<{
			name: string;
			values: Array<{ value: string; count: number }>;
		}>;
	}> {
		const result = await this.safeOperation(async () => {
			const productsWithOptions = await getProductsOptions({});

			// Extract and aggregate all unique options
			const optionsMap = new Map<string, Map<string, number>>();

			productsWithOptions.forEach((product) => {
				// Only count available products
				if (!product.availableForSale) return;

				product.options.forEach((option) => {
					if (!optionsMap.has(option.name)) {
						optionsMap.set(option.name, new Map());
					}

					const valuesMap = optionsMap.get(option.name)!;
					option.values.forEach((value) => {
						valuesMap.set(value, (valuesMap.get(value) || 0) + 1);
					});
				});
			});

			// Convert to the expected format
			const options = Array.from(optionsMap.entries()).map(
				([name, valuesMap]) => ({
					name,
					values: Array.from(valuesMap.entries()).map(
						([value, count]) => ({
							value,
							count,
						})
					),
				})
			);

			return { options };
		}, "Failed to fetch products options");
		return result.success ? result.data : { options: [] };
	}

	/**
	 * Map Shopify product to domain model
	 */
	private mapShopifyToProduct(shopifyProduct: ShopifyProduct): Product {
		return new Product({
			id: shopifyProduct.id,
			title: shopifyProduct.title,
			description: shopifyProduct.description,
			descriptionHtml: shopifyProduct.descriptionHtml,
			handle: shopifyProduct.handle,
			totalInventory: shopifyProduct.totalInventory,
			images: shopifyProduct.images || [],
			variants: shopifyProduct.variants || [],
			priceRange: shopifyProduct.priceRange,
			availableForSale: shopifyProduct.availableForSale,
			tags: shopifyProduct.tags,
			seo: shopifyProduct.seo,
			featuredImage: shopifyProduct.featuredImage,
			createdAt: new Date(shopifyProduct.updatedAt),
			updatedAt: new Date(shopifyProduct.updatedAt),
			options: shopifyProduct.options || [],
		});
	}
}
