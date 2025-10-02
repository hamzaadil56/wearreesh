export const cartFragment = /* GraphQL */ `
	fragment cart on Cart {
		id
		checkoutUrl
		cost {
			subtotalAmount {
				amount
				currencyCode
			}
			totalAmount {
				amount
				currencyCode
			}
			totalTaxAmount {
				amount
				currencyCode
			}
		}
		lines(first: 100) {
			edges {
				node {
					id
					quantity
					cost {
						totalAmount {
							amount
							currencyCode
						}
					}
					merchandise {
						... on ProductVariant {
							id
							title
							availableForSale
							quantityAvailable
							price {
								amount
								currencyCode
							}
							selectedOptions {
								name
								value
							}
							product {
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
											...variant
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
		}
		totalQuantity
	}
`;
