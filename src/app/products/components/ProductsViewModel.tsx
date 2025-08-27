import { Product, ProductsData } from "./ProductsData";

export interface ProductViewModel {
	id: string;
	title: string;
	description: string;
	handle: string;
	imageUrl: string;
	imageAlt: string;
	price: string;
	currencyCode: string;
	shortDescription: string;
}

export class ProductsViewModel {
	private productsData: ProductsData;

	constructor(productsData: ProductsData) {
		this.productsData = productsData;
	}

	getProducts(): ProductViewModel[] {
		return this.productsData.products.map((product) => ({
			id: product.id,
			title: product.title || "Untitled Product",
			description: product.description || "No description available",
			handle: product.handle || `product-${product.id}`,
			imageUrl:
				product.images?.edges?.[0]?.node?.url ||
				"/placeholder-image.jpg",
			imageAlt:
				product.images?.edges?.[0]?.node?.altText ||
				product.title ||
				"Product Image",
			price: product.priceRange?.minVariantPrice?.amount || "0.00",
			currencyCode:
				product.priceRange?.minVariantPrice?.currencyCode || "USD",
			shortDescription: this.truncateDescription(
				product.description || "No description available",
				100
			),
		}));
	}

	getTotalCount(): number {
		return (
			this.productsData.totalCount || this.productsData.products.length
		);
	}

	getProductsCount(): number {
		return this.productsData.products?.length || 0;
	}

	private truncateDescription(
		description: string,
		maxLength: number
	): string {
		if (!description || description.length <= maxLength) return description;
		return description.substring(0, maxLength).trim() + "...";
	}

	formatPrice(amount: string, currencyCode: string): string {
		if (!amount || amount === "0.00") return "Price not available";

		const numericAmount = parseFloat(amount);
		if (isNaN(numericAmount)) return "Price not available";

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currencyCode,
		}).format(numericAmount);
	}
}
