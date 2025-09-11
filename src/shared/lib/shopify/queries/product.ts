import { productFragment } from "../fragments/product";
import { optionFragment } from "../fragments/option";
import { imageFragment } from "../fragments/image";
import { seoFragment } from "../fragments/seo";

export const getProductQuery = /* GraphQL */ `
	query getProduct($handle: String!) {
		product(handle: $handle) {
			...product
		}
	}
	${productFragment}
	${optionFragment}
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
	${optionFragment}
	${imageFragment}
	${seoFragment}
`;

// NEW: Dedicated query for getting all product options
export const getProductsOptionsQuery = /* GraphQL */ `
	query getProductsOptions(
		$sortKey: ProductSortKeys
		$reverse: Boolean
		$query: String
		$first: Int = 100
	) {
		products(
			sortKey: $sortKey
			reverse: $reverse
			query: $query
			first: $first
		) {
			edges {
				node {
					id
					handle
					title
					availableForSale
					options {
						...option
					}
				}
			}
		}
	}
	${optionFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
	query getProductRecommendations($productId: ID!) {
		productRecommendations(productId: $productId) {
			...product
		}
	}
	${productFragment}
	${optionFragment}
	${imageFragment}
	${seoFragment}
`;
