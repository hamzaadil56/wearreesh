export const customerFragment = /* GraphQL */ `
	fragment customer on Customer {
		id
		email
		firstName
		lastName
		phone
		acceptsMarketing
		createdAt
		updatedAt
		numberOfOrders
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
					province
					country
					zip
					phone
				}
			}
		}
		defaultAddress {
			id
			firstName
			lastName
			company
			address1
			address2
			city
			province
			country
			zip
			phone
		}
	}
`;

export const customerAccessTokenFragment = /* GraphQL */ `
	fragment customerAccessToken on CustomerAccessToken {
		accessToken
		expiresAt
	}
`;
