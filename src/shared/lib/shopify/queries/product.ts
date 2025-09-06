import { productFragment } from "../fragments/product";
import { imageFragment } from "../fragments/image";
import { seoFragment } from "../fragments/seo";

export const getProductQuery = /* GraphQL */ `
	query getProduct($handle: String!) {
		product(handle: $handle) {
			...product
		}
	}
	${productFragment}
	${imageFragment}
	${seoFragment}
`;

export const getProductsQuery = /* GraphQL */ `
	query getProducts(
		$sortKey: ProductSortKeys
		$reverse: Boolean
		$query: String
	) {
		products(
			sortKey: $sortKey
			reverse: $reverse
			query: $query
			first: 100
		) {
			edges {
				node {
					...product
				}
			}
		}
	}
	${productFragment}
	${imageFragment}
	${seoFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
	query getProductRecommendations($productId: ID!) {
		productRecommendations(productId: $productId) {
			...product
		}
	}
	${productFragment}
	${imageFragment}
	${seoFragment}
`;
