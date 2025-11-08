/**
 * Server Actions for Customer Data
 * Uses OAuth 2.0 session to fetch customer data from Customer Account API
 */

"use server";

import { getSession, isSessionValid } from "@/shared/lib/auth/session";
import { customerAccountApiFetch } from "@/shared/lib/customer/api-client";
import { GET_CUSTOMER_QUERY } from "@/shared/lib/shopify/queries/customer";
import {
	type Customer,
	type CustomerAccountApiCustomer,
	transformCustomer,
} from "@/models/customer/types";

/**
 * Get current authenticated customer
 */
export async function getCustomer(): Promise<Customer | null> {
	try {
		console.log("[Customer Actions] Fetching customer data");

		// Check if session is valid
		const sessionValid = await isSessionValid();
		if (!sessionValid) {
			console.log("[Customer Actions] No valid session found");
			return null;
		}

		// Get access token from session
		const session = await getSession();
		if (!session.accessToken) {
			console.log("[Customer Actions] No access token found");
			return null;
		}

		console.log("[Customer Actions] Making API request with access token");

		// Fetch customer data from Customer Account API
		const response = await customerAccountApiFetch<{
			data: { customer: CustomerAccountApiCustomer };
		}>({
			query: GET_CUSTOMER_QUERY,
			accessToken: session.accessToken,
		});

		if (!response.body.data.customer) {
			console.log("[Customer Actions] No customer data returned");
			return null;
		}

		// Transform API response to our Customer type
		const customer = transformCustomer(response.body.data.customer);

		console.log("[Customer Actions] Successfully fetched customer:", {
			id: customer.id,
			email: customer.email,
			name: `${customer.firstName} ${customer.lastName}`.trim(),
		});

		return customer;
	} catch (error) {
		console.error("[Customer Actions] Error fetching customer:", error);
		return null;
	}
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
	return await isSessionValid();
}
