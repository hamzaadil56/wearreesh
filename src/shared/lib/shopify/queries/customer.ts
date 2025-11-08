/**
 * Customer Account API GraphQL Queries
 * Based on: https://shopify.dev/docs/api/customer
 */

export const GET_CUSTOMER_QUERY = /* GraphQL */ `
	query GetCustomer {
		customer {
			id
			emailAddress {
				emailAddress
			}
			firstName
			lastName
			phoneNumber {
				phoneNumber
			}
			defaultAddress {
				id
				firstName
				lastName
				company
				address1
				address2
				city
				zip
				phoneNumber
			}
			addresses(first: 10) {
				edges {
					node {
						id
						firstName
						lastName
						company
						address1
						address2
						city
						zip
						phoneNumber
					}
				}
			}
		}
	}
`;
