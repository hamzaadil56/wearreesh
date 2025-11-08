/**
 * OAuth 2.0 Callback Route (Confidential Client)
 * Handles the authorization callback and exchanges code for tokens
 * Based on: https://shopify.dev/docs/api/customer/latest#step-authorization
 */

import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/shared/lib/auth/oauth";
import {
	verifyOAuthState,
	clearOAuthState,
	storeSession,
} from "@/shared/lib/auth/session";
import { OAUTH_CONFIG } from "@/shared/lib/auth/config";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const code = searchParams.get("code");
		const state = searchParams.get("state");
		const error = searchParams.get("error");
		const errorDescription = searchParams.get("error_description");

		console.log("[OAuth Callback] Received callback", {
			hasCode: !!code,
			hasState: !!state,
			error,
			errorDescription,
		});

		// Check for OAuth errors from Shopify
		if (error) {
			console.error(
				"[OAuth Callback] OAuth error:",
				error,
				errorDescription
			);
			const errorUrl = process.env.SHOPIFY_APP_URL
				? `${
						process.env.SHOPIFY_APP_URL
				  }/account?error=${encodeURIComponent(
						errorDescription || error
				  )}`
				: new URL(
						`/account?error=${encodeURIComponent(
							errorDescription || error
						)}`,
						request.url
				  ).toString();
			return NextResponse.redirect(errorUrl);
		}

		// Validate required parameters
		if (!code || !state) {
			console.error("[OAuth Callback] Missing code or state parameter");
			const errorUrl = process.env.SHOPIFY_APP_URL
				? `${process.env.SHOPIFY_APP_URL}/account?error=Invalid callback parameters`
				: new URL(
						"/account?error=Invalid callback parameters",
						request.url
				  ).toString();
			return NextResponse.redirect(errorUrl);
		}

		// Verify state (CSRF protection)
		const isStateValid = await verifyOAuthState(state);
		if (!isStateValid) {
			console.error("[OAuth Callback] State verification failed");
			const errorUrl = process.env.SHOPIFY_APP_URL
				? `${process.env.SHOPIFY_APP_URL}/account?error=Invalid state (CSRF protection)`
				: new URL(
						"/account?error=Invalid state (CSRF protection)",
						request.url
				  ).toString();
			return NextResponse.redirect(errorUrl);
		}

		console.log(
			"[OAuth Callback] Exchanging authorization code for tokens"
		);

		// Exchange authorization code for access token
		// Confidential clients use client_secret (no PKCE needed)
		const tokenResponse = await exchangeCodeForToken({
			tokenEndpoint: OAUTH_CONFIG.TOKEN_ENDPOINT,
			clientId: OAUTH_CONFIG.CLIENT_ID,
			clientSecret: OAUTH_CONFIG.CLIENT_SECRET,
			code,
			redirectUri: OAUTH_CONFIG.REDIRECT_URI,
		});

		console.log("[OAuth Callback] Successfully received tokens", {
			hasAccessToken: !!tokenResponse.access_token,
			hasRefreshToken: !!tokenResponse.refresh_token,
			hasIdToken: !!tokenResponse.id_token,
			expiresIn: tokenResponse.expires_in,
		});

		// Store tokens in HTTP-only cookies
		await storeSession({
			accessToken: tokenResponse.access_token,
			refreshToken: tokenResponse.refresh_token,
			idToken: tokenResponse.id_token,
			expiresIn: tokenResponse.expires_in,
		});

		// Clear OAuth state cookies (no longer needed)
		await clearOAuthState();

		console.log(
			"[OAuth Callback] Authentication successful, redirecting to account page"
		);

		// Redirect to account page using the configured app URL
		// This ensures we redirect to the correct domain (ngrok URL in development)
		const accountUrl = process.env.SHOPIFY_APP_URL
			? `${process.env.SHOPIFY_APP_URL}/account`
			: new URL("/account", request.url).toString();

		console.log("[OAuth Callback] Redirecting to:", accountUrl);
		return NextResponse.redirect(accountUrl);
	} catch (error) {
		console.error("[OAuth Callback] Error:", error);
		const errorUrl = process.env.SHOPIFY_APP_URL
			? `${
					process.env.SHOPIFY_APP_URL
			  }/account?error=${encodeURIComponent(
					error instanceof Error
						? error.message
						: "Authentication failed"
			  )}`
			: new URL(
					`/account?error=${encodeURIComponent(
						error instanceof Error
							? error.message
							: "Authentication failed"
					)}`,
					request.url
			  ).toString();
		return NextResponse.redirect(errorUrl);
	}
}
