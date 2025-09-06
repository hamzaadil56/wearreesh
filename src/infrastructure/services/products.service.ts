import { getProducts } from "@/shared/lib/shopify";
import { Product, ProductData } from "@/models/product/Product.model";
import type { Product as ShopifyProduct } from "@/shared/lib/shopify/types";

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
		});
	}
}

export const productsService = ProductsService.getInstance();
