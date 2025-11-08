/**
 * OAuth 2.0 Configuration for Confidential Client
 */

// OAuth configuration
export const OAUTH_CONFIG = {
	// OAuth scope for Customer Account API
	// See: https://shopify.dev/docs/api/customer/latest#step-authorization
	SCOPE: "openid email customer-account-api:full",

	// Client ID from Shopify Admin
	CLIENT_ID: process.env.SHOPIFY_CUSTOMER_API_CLIENT_ID || "",

	// Client Secret from Shopify Admin (CONFIDENTIAL - server-side only!)
	CLIENT_SECRET: process.env.SHOPIFY_CUSTOMER_API_CLIENT_SECRET || "",

	// Redirect URI (must match Shopify Admin configuration)
	REDIRECT_URI: process.env.SHOPIFY_APP_URL
		? `${process.env.SHOPIFY_APP_URL}/api/auth/callback`
		: "/api/auth/callback",

	// Logout redirect URI
	POST_LOGOUT_REDIRECT_URI:
		process.env.SHOPIFY_APP_URL || "http://localhost:3000",

	// OAuth endpoints from environment variables
	AUTHORIZATION_ENDPOINT: process.env.SHOPIFY_AUTHORIZATION_ENDPOINT || "",
	TOKEN_ENDPOINT: process.env.SHOPIFY_TOKEN_ENDPOINT || "",
	END_SESSION_ENDPOINT: process.env.SHOPIFY_END_SESSION_ENDPOINT || "",

	// Customer Account API GraphQL endpoint
	CUSTOMER_ACCOUNT_API_ENDPOINT:
		process.env.SHOPIFY_CUSTOMER_API_ENDPOINT || "",
} as const;

/**
 * Validate OAuth configuration
 */
export function validateOAuthConfig() {
	const errors: string[] = [];

	if (!OAUTH_CONFIG.CLIENT_ID) {
		errors.push("SHOPIFY_CUSTOMER_API_CLIENT_ID is not set");
	}

	if (!OAUTH_CONFIG.CLIENT_SECRET) {
		errors.push("SHOPIFY_CUSTOMER_API_CLIENT_SECRET is not set");
	}

	if (!OAUTH_CONFIG.AUTHORIZATION_ENDPOINT) {
		errors.push("SHOPIFY_AUTHORIZATION_ENDPOINT is not set");
	}

	if (!OAUTH_CONFIG.TOKEN_ENDPOINT) {
		errors.push("SHOPIFY_TOKEN_ENDPOINT is not set");
	}

	if (!OAUTH_CONFIG.END_SESSION_ENDPOINT) {
		errors.push("SHOPIFY_END_SESSION_ENDPOINT is not set");
	}

	if (!OAUTH_CONFIG.CUSTOMER_ACCOUNT_API_ENDPOINT) {
		errors.push("SHOPIFY_CUSTOMER_ACCOUNT_API_ENDPOINT is not set");
	}

	if (!process.env.SHOPIFY_APP_URL) {
		console.warn(
			"[OAuth Config] SHOPIFY_APP_URL not set, using default localhost:3000"
		);
	}

	if (errors.length > 0) {
		throw new Error(
			`OAuth configuration errors:\n${errors
				.map((e) => `- ${e}`)
				.join("\n")}`
		);
	}

	console.log("[OAuth Config] Configuration validated successfully", {
		hasClientId: !!OAUTH_CONFIG.CLIENT_ID,
		hasClientSecret: !!OAUTH_CONFIG.CLIENT_SECRET,
		hasAuthorizationEndpoint: !!OAUTH_CONFIG.AUTHORIZATION_ENDPOINT,
		hasTokenEndpoint: !!OAUTH_CONFIG.TOKEN_ENDPOINT,
		hasEndSessionEndpoint: !!OAUTH_CONFIG.END_SESSION_ENDPOINT,
		hasCustomerAccountApiEndpoint:
			!!OAUTH_CONFIG.CUSTOMER_ACCOUNT_API_ENDPOINT,
		redirectUri: OAUTH_CONFIG.REDIRECT_URI,
	});
}
