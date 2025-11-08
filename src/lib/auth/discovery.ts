/**
 * Shopify Discovery Endpoints
 * Based on: https://shopify.dev/docs/api/customer/latest#step-authorization
 */

interface OpenIDConfiguration {
	authorization_endpoint: string;
	token_endpoint: string;
	end_session_endpoint: string;
	jwks_uri: string;
	issuer: string;
}

interface CustomerAccountApiConfiguration {
	graphql_api_endpoint: string;
}

/**
 * Discover authentication endpoints using OpenID configuration
 * Endpoint: GET /.well-known/openid-configuration
 */
export async function discoverAuthenticationEndpoints(
	shopDomain: string
): Promise<OpenIDConfiguration> {
	const discoveryUrl = `https://${shopDomain}/.well-known/openid-configuration`;

	console.log(
		"[Discovery] Fetching OpenID configuration from:",
		discoveryUrl
	);

	try {
		const response = await fetch(discoveryUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(
				`Failed to discover authentication endpoints: ${response.statusText}`
			);
		}

		const config: OpenIDConfiguration = await response.json();
		console.log("[Discovery] Successfully discovered endpoints:", {
			authorization_endpoint: config.authorization_endpoint,
			token_endpoint: config.token_endpoint,
			end_session_endpoint: config.end_session_endpoint,
		});

		return config;
	} catch (error) {
		console.error(
			"[Discovery] Error discovering authentication endpoints:",
			error
		);
		throw error;
	}
}

/**
 * Discover Customer Account API endpoints
 * Endpoint: GET /.well-known/customer-account-api
 */
export async function discoverCustomerAccountApiEndpoints(
	shopDomain: string
): Promise<CustomerAccountApiConfiguration> {
	if (!shopDomain) {
		throw new Error(
			"Shop domain is required for Customer Account API discovery"
		);
	}

	const discoveryUrl = `https://${shopDomain}/.well-known/customer-account-api`;

	console.log(
		"[Discovery] Fetching Customer Account API configuration from:",
		discoveryUrl
	);

	try {
		const response = await fetch(discoveryUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("[Discovery] Response error:", {
				status: response.status,
				statusText: response.statusText,
				body: errorText,
			});
			throw new Error(
				`Failed to discover Customer Account API endpoints: ${response.status} ${response.statusText}`
			);
		}

		const config: CustomerAccountApiConfiguration = await response.json();

		if (!config || !config.graphql_api_endpoint) {
			console.error("[Discovery] Invalid discovery response:", config);
			throw new Error("Discovery response missing graphql_api_endpoint");
		}

		console.log(
			"[Discovery] Customer Account API endpoint:",
			config.graphql_api_endpoint
		);

		return config;
	} catch (error) {
		console.error(
			"[Discovery] Error discovering Customer Account API endpoints:",
			error
		);
		throw error;
	}
}

/**
 * Get shop domain from environment variables
 */
export function getShopDomain(): string {
	const domain = process.env.SHOPIFY_STORE_DOMAIN || "";

	console.log("[Discovery] Environment check:", {
		hasShopifyStoreDomain: !!process.env.SHOPIFY_STORE_DOMAIN,
		rawDomain: process.env.SHOPIFY_STORE_DOMAIN || "(not set)",
	});

	if (!domain) {
		throw new Error(
			"SHOPIFY_STORE_DOMAIN is not set in environment variables. " +
				"Please add SHOPIFY_STORE_DOMAIN=your-store.myshopify.com to your .env.local file"
		);
	}

	// Remove protocol (http:// or https://) and trailing slash
	const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
	console.log("[Discovery] Clean shop domain:", cleanDomain);
	return cleanDomain;
}
