export const productFragment = /* GraphQL */ `
	fragment product on Product {
		id
		handle
		availableForSale
		title
		description
		descriptionHtml
		totalInventory
		options {
			...option
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
					compareAtPrice {
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
`;
