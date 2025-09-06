import { imageFragment } from "../fragments/image";
import { seoFragment } from "../fragments/seo";

export const getCollectionQuery = /* GraphQL */ `
	query getCollection($handle: String!) {
		collection(handle: $handle) {
			id
			handle
			title
			description
			seo {
				...seo
			}
			image {
				...image
			}
			updatedAt
		}
	}
	${imageFragment}
	${seoFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
	query getCollections {
		collections(first: 100, sortKey: UPDATED_AT, reverse: true) {
			edges {
				node {
					id
					title
					handle
					description
					seo {
						...seo
					}
					image {
						...image
					}
					updatedAt
				}
			}
		}
	}
	${imageFragment}
	${seoFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
	query getCollectionProducts(
		$handle: String!
		$sortKey: ProductCollectionSortKeys
		$reverse: Boolean
		$first: Int
	) {
		collection(handle: $handle) {
			products(sortKey: $sortKey, reverse: $reverse, first: $first) {
				edges {
					node {
						id
						handle
						availableForSale
						title
						description
						descriptionHtml
						options {
							id
							name
							values
						}
						priceRange {
							maxVariantPrice {
								amount
								currencyCode
							}
							minVariantPrice {
								amount
								currencyCode
							}
						}
						variants(first: 250) {
							edges {
								node {
									id
									title
									availableForSale
									selectedOptions {
										name
										value
									}
									price {
										amount
										currencyCode
									}
								}
							}
						}
						featuredImage {
							...image
						}
						images(first: 20) {
							edges {
								node {
									...image
								}
							}
						}
						seo {
							...seo
						}
						tags
						updatedAt
					}
				}
			}
		}
	}
	${imageFragment}
	${seoFragment}
`;
