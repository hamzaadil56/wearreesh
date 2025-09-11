import { getProducts, getProductsOptions } from "@/shared/lib/shopify";
import { Product } from "@/models/product/Product.model";
import type {
	Product as ShopifyProduct,
	ProductOption,
} from "@/shared/lib/shopify/types";

/**
 * Products Service
 * Bridges the gap between Shopify API and domain models
 */
export class ProductsService {
	private static instance: ProductsService;

	private constructor() {}

	static getInstance(): ProductsService {
		if (!ProductsService.instance) {
			ProductsService.instance = new ProductsService();
		}
		return ProductsService.instance;
	}

	/**
	 * Fetch products from Shopify and convert to domain models
	 */
	async fetchProducts(): Promise<{
		products: Product[];
		totalCount: number;
	}> {
		try {
			const shopifyProducts = await getProducts({});

			const products = shopifyProducts.map((p) =>
				this.mapShopifyToProduct(p)
			);

			return {
				products,
				totalCount: products.length,
			};
		} catch (error) {
			console.error("Error fetching products:", error);
			throw new Error("Failed to fetch products");
		}
	}

	/**
	 * Fetch product options for filtering
	 */
	async fetchProductsOptions(): Promise<
		Array<{
			name: string;
			values: Array<{ value: string; count: number }>;
		}>
	> {
		try {
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
			return Array.from(optionsMap.entries()).map(
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
		} catch (error) {
			console.error("Error fetching product options:", error);
			throw new Error("Failed to fetch product options");
		}
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

export const productsService = ProductsService.getInstance();
