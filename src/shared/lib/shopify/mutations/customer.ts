import { customerFragment } from "../fragments/customer";
import { customerAccessTokenFragment } from "../fragments/customer";

export const customerCreateMutation = /* GraphQL */ `
	mutation customerCreate($input: CustomerCreateInput!) {
		customerCreate(input: $input) {
			customer {
				...customer
			}
			customerUserErrors {
				code
				field
				message
			}
		}
	}
	${customerFragment}
`;

export const customerAccessTokenCreateMutation = /* GraphQL */ `
	mutation customerAccessTokenCreate(
		$input: CustomerAccessTokenCreateInput!
	) {
		customerAccessTokenCreate(input: $input) {
			customerAccessToken {
				...customerAccessToken
			}
			customerUserErrors {
				code
				field
				message
			}
		}
	}
	${customerAccessTokenFragment}
`;

export const customerAccessTokenDeleteMutation = /* GraphQL */ `
	mutation customerAccessTokenDelete($customerAccessToken: String!) {
		customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
			deletedAccessToken
			deletedCustomerAccessTokenId
			userErrors {
				field
				message
			}
		}
	}
`;

export const customerRecoverMutation = /* GraphQL */ `
	mutation customerRecover($email: String!) {
		customerRecover(email: $email) {
			customerUserErrors {
				code
				field
				message
			}
		}
	}
`;
