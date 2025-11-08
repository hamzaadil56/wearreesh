"use server";

import {
	customerCreateMutation,
	customerAccessTokenCreateMutation,
	customerAccessTokenDeleteMutation,
	customerRecoverMutation,
} from "@/shared/lib/shopify/mutations/customer";
import { getCustomerQuery } from "@/shared/lib/shopify/queries/customer";
import { shopifyFetch } from "@/shared/lib/shopify";
import {
	Customer,
	CustomerAccessToken,
	CustomerCreateInput,
	CustomerAccessTokenCreateInput,
	ShopifyCustomerCreateOperation,
	ShopifyCustomerAccessTokenCreateOperation,
	ShopifyCustomerAccessTokenDeleteOperation,
	ShopifyCustomerRecoverOperation,
	ShopifyCustomerOperation,
	ShopifyCustomer,
} from "@/shared/lib/shopify/types";
import { cookies } from "next/headers";

const CUSTOMER_ACCESS_TOKEN_COOKIE = "customer_access_token";

/**
 * Reshape Shopify customer data to our Customer type
 */
function reshapeCustomer(
	customer: ShopifyCustomer | null | undefined
): Customer | null {
	if (!customer) {
		return null;
	}

	return {
		...customer,
		addresses: customer.addresses.edges.map((edge) => edge.node),
	};
}

/**
 * Register a new customer
 */
export async function registerCustomer(
	input: CustomerCreateInput
): Promise<{ customer: Customer | null; errors: string[] }> {
	try {
		const res = await shopifyFetch<ShopifyCustomerCreateOperation>({
			query: customerCreateMutation,
			variables: {
				input,
			},
			cache: "no-store",
		});

		const { customer, customerUserErrors } = res.body.data.customerCreate;

		if (customerUserErrors.length > 0) {
			return {
				customer: null,
				errors: customerUserErrors.map((error) => error.message),
			};
		}

		if (!customer) {
			return {
				customer: null,
				errors: ["Failed to create customer account"],
			};
		}

		return {
			customer: reshapeCustomer(customer),
			errors: [],
		};
	} catch (error) {
		return {
			customer: null,
			errors: [
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
			],
		};
	}
}

/**
 * Login customer and create access token
 */
export async function loginCustomer(
	input: CustomerAccessTokenCreateInput
): Promise<{ accessToken: CustomerAccessToken | null; errors: string[] }> {
	try {
		const res =
			await shopifyFetch<ShopifyCustomerAccessTokenCreateOperation>({
				query: customerAccessTokenCreateMutation,
				variables: {
					input,
				},
				cache: "no-store",
			});

		const { customerAccessToken, customerUserErrors } =
			res.body.data.customerAccessTokenCreate;

		if (customerUserErrors.length > 0) {
			return {
				accessToken: null,
				errors: customerUserErrors.map((error) => error.message),
			};
		}

		if (!customerAccessToken) {
			return {
				accessToken: null,
				errors: ["Failed to create access token"],
			};
		}

		// Store access token in cookie
		const cookieStore = await cookies();
		cookieStore.set(
			CUSTOMER_ACCESS_TOKEN_COOKIE,
			customerAccessToken.accessToken,
			{
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 30, // 30 days
			}
		);

		return {
			accessToken: customerAccessToken,
			errors: [],
		};
	} catch (error) {
		return {
			accessToken: null,
			errors: [
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
			],
		};
	}
}

/**
 * Logout customer by deleting access token
 */
export async function logoutCustomer(): Promise<{
	success: boolean;
	errors: string[];
}> {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get(
			CUSTOMER_ACCESS_TOKEN_COOKIE
		)?.value;

		if (!accessToken) {
			return {
				success: true,
				errors: [],
			};
		}

		const res =
			await shopifyFetch<ShopifyCustomerAccessTokenDeleteOperation>({
				query: customerAccessTokenDeleteMutation,
				variables: {
					customerAccessToken: accessToken,
				},
				cache: "no-store",
			});

		// Delete cookie regardless of API response
		cookieStore.delete(CUSTOMER_ACCESS_TOKEN_COOKIE);

		if (res.body.data.customerAccessTokenDelete.userErrors.length > 0) {
			return {
				success: false,
				errors: res.body.data.customerAccessTokenDelete.userErrors.map(
					(error) => error.message
				),
			};
		}

		return {
			success: true,
			errors: [],
		};
	} catch (error) {
		// Still delete cookie even if API call fails
		const cookieStore = await cookies();
		cookieStore.delete(CUSTOMER_ACCESS_TOKEN_COOKIE);

		return {
			success: false,
			errors: [
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
			],
		};
	}
}

/**
 * Recover customer password (send reset email)
 */
export async function recoverCustomerPassword(
	email: string
): Promise<{ success: boolean; errors: string[] }> {
	try {
		const res = await shopifyFetch<ShopifyCustomerRecoverOperation>({
			query: customerRecoverMutation,
			variables: {
				email,
			},
			cache: "no-store",
		});

		const { customerUserErrors } = res.body.data.customerRecover;

		if (customerUserErrors.length > 0) {
			return {
				success: false,
				errors: customerUserErrors.map((error) => error.message),
			};
		}

		// Always return success for security (don't reveal if email exists)
		return {
			success: true,
			errors: [],
		};
	} catch (error) {
		return {
			success: false,
			errors: [
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
			],
		};
	}
}

/**
 * Get current customer from access token
 */
export async function getCustomer(): Promise<Customer | null> {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get(
			CUSTOMER_ACCESS_TOKEN_COOKIE
		)?.value;
		console.log("accessToken", accessToken);

		if (!accessToken) {
			return null;
		}

		const res = await shopifyFetch<ShopifyCustomerOperation>({
			query: getCustomerQuery,
			variables: {
				customerAccessToken: accessToken,
			},
			cache: "no-store",
		});
		console.log("res", res);

		return reshapeCustomer(res.body.data.customer || null);
	} catch (error) {
		console.error("Error fetching customer:", error);
		return null;
	}
}
/**
 * Get customer access token from cookies
 */
export async function getCustomerAccessToken(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value || null;
}
