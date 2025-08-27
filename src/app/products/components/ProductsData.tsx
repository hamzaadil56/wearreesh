import { shopifyFetch } from "@/utils/shopifyFetch";

export interface Product {
	id: string;
	title: string;
	description: string;
	handle: string;
	images: {
		edges: Array<{
			node: {
				url: string;
				altText?: string;
			};
		}>;
	};
	priceRange?: {
		minVariantPrice: {
			amount: string;
			currencyCode: string;
		};
	};
}

export interface ProductsData {
	products: Product[];
	totalCount: number;
}

export async function fetchProducts(): Promise<ProductsData> {
	try {
		const response = await shopifyFetch({
			query: `{
        products(first: 100) {
          edges{
            node {
              id
              title
              description
              images(first:2){
                edges{
                    node{
                        url
                    }
                }
              }
            }
          }
        }
}`,
			variables: {},
		});

		if (response.status !== 200) {
			throw new Error(`Failed to fetch products: ${response.status}`);
		}

		const data = await response.body;

		if (!data?.data?.products) {
			throw new Error("Invalid response structure from Shopify");
		}

		const products = data.data.products.edges.map((edge: any) => edge.node);

		return {
			products,
			totalCount: data.data.products.totalCount || products.length,
		};
	} catch (error) {
		console.error("Error fetching products:", error);
		throw new Error("Failed to fetch products");
	}
}
