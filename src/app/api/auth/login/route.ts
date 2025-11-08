/**
 * OAuth 2.0 Login Route (Confidential Client)
 * Initiates the authorization code flow
 * Based on: https://shopify.dev/docs/api/customer/latest#step-authorization
 */

import { NextRequest, NextResponse } from "next/server";
import {
	buildAuthorizationUrl,
	generateState,
	generateNonce,
} from "@/shared/lib/auth/oauth";
import { storeOAuthState } from "@/shared/lib/auth/session";
import { OAUTH_CONFIG, validateOAuthConfig } from "@/shared/lib/auth/config";

export async function GET(request: NextRequest) {
	try {
		console.log("[OAuth Login] Starting OAuth 2.0 authorization flow");

		// Validate configuration
		validateOAuthConfig();

		// Generate state and nonce for security
		const state = generateState();
		const nonce = generateNonce();

		// Store state and nonce in session (for verification in callback)
		await storeOAuthState(state, nonce);

		// Build authorization URL using endpoint from config
		const authorizationUrl = buildAuthorizationUrl({
			authorizationEndpoint: OAUTH_CONFIG.AUTHORIZATION_ENDPOINT,
			clientId: OAUTH_CONFIG.CLIENT_ID,
			redirectUri: OAUTH_CONFIG.REDIRECT_URI,
			scope: OAUTH_CONFIG.SCOPE,
			state,
			nonce,
		});

		console.log("[OAuth Login] Built authorization URL:", authorizationUrl);

		// Check if this is a fetch request (from JavaScript) or direct browser navigation
		const acceptHeader = request.headers.get("accept");
		const isJsonRequest = acceptHeader?.includes("application/json");

		if (isJsonRequest) {
			// Return JSON response for programmatic requests
			return NextResponse.json({
				authUrl: authorizationUrl,
				success: true,
			});
		} else {
			// Direct redirect for browser navigation
			return NextResponse.redirect(authorizationUrl);
		}
	} catch (error) {
		console.error("[OAuth Login] Error:", error);

		const acceptHeader = request.headers.get("accept");
		const isJsonRequest = acceptHeader?.includes("application/json");

		if (isJsonRequest) {
			// Return JSON error for programmatic requests
			return NextResponse.json(
				{
					error:
						error instanceof Error
							? error.message
							: "OAuth initialization failed",
					success: false,
				},
				{ status: 500 }
			);
		} else {
			// Redirect to error page for browser navigation
			const errorUrl = process.env.SHOPIFY_APP_URL
				? `${
						process.env.SHOPIFY_APP_URL
				  }/account?error=${encodeURIComponent(
						error instanceof Error
							? error.message
							: "OAuth initialization failed"
				  )}`
				: new URL(
						`/account?error=${encodeURIComponent(
							error instanceof Error
								? error.message
								: "OAuth initialization failed"
						)}`,
						request.url
				  ).toString();
			return NextResponse.redirect(errorUrl);
		}
	}
}
