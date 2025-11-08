/**
 * Customer Account API Client
 * Based on: https://shopify.dev/docs/api/customer/latest
 */

import { OAUTH_CONFIG } from "@/shared/lib/auth/config";

/**
 * Fetch from Customer Account API with access token
 */
export async function customerAccountApiFetch<T>({
	query,
	variables,
	accessToken,
}: {
	query: string;
	variables?: Record<string, unknown>;
	accessToken: string;
}): Promise<{ status: number; body: T }> {
	try {
		const endpoint = OAUTH_CONFIG.CUSTOMER_ACCOUNT_API_ENDPOINT;

		if (!endpoint) {
			throw new Error(
				"Customer Account API endpoint is not configured. Please set SHOPIFY_CUSTOMER_ACCOUNT_API_ENDPOINT in your environment variables."
			);
		}

		console.log("[Customer API] Making request to:", endpoint);

		const result = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${accessToken}`,
			},
			body: JSON.stringify({
				query,
				operationName: "getCustomer",
				...(variables && { variables }),
			}),
		});

		// Check if response is OK
		if (!result.ok) {
			const errorText = await result.text();
			console.error("[Customer API] HTTP error:", {
				status: result.status,
				statusText: result.statusText,
				url: result.url,
				body: errorText.substring(0, 500),
			});
			throw new Error(
				`Customer Account API request failed: ${result.status} ${result.statusText}`
			);
		}

		// Check content type to ensure we're getting JSON
		const contentType = result.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			const text = await result.text();
			console.error("[Customer API] Unexpected content type:", {
				contentType,
				url: result.url,
				responsePreview: text.substring(0, 500),
			});
			throw new Error(
				`Expected JSON response but got ${contentType}. The endpoint may be incorrect or the request was redirected.`
			);
		}

		const body = await result.json();

		if (body.errors) {
			console.error("[Customer API] GraphQL errors:", body.errors);
			throw new Error(body.errors[0]?.message || "API request failed");
		}

		console.log("[Customer API] Request successful");

		return {
			status: result.status,
			body,
		};
	} catch (error) {
		console.error("[Customer API] Fetch error:", error);
		throw error;
	}
}
