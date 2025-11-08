/**
 * OAuth 2.0 Logout Route (Confidential Client)
 * Clears session and redirects to Shopify logout
 * Based on: https://shopify.dev/docs/api/customer/latest#step-authorization
 */

import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "@/shared/lib/auth/session";
import { OAUTH_CONFIG } from "@/shared/lib/auth/config";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/shared/lib/auth/session";

export async function GET(request: NextRequest) {
	try {
		console.log("[OAuth Logout] Starting logout process");
		const cookieStore = await cookies();
		const idToken = cookieStore.get(COOKIE_NAMES.ID_TOKEN)?.value;
		// Clear all session cookies

		// Build logout URL with post-logout redirect using endpoint from config
		const logoutUrl = new URL(OAUTH_CONFIG.END_SESSION_ENDPOINT);
		logoutUrl.searchParams.set(
			"post_logout_redirect_uri",
			OAUTH_CONFIG.POST_LOGOUT_REDIRECT_URI
		);
		logoutUrl.searchParams.set("id_token_hint", idToken || "");
		console.log(
			"[OAuth Logout] Redirecting to Shopify logout:",
			OAUTH_CONFIG.END_SESSION_ENDPOINT
		);
		await clearSession();

		// Redirect to Shopify's logout endpoint
		return NextResponse.redirect(logoutUrl.toString());
	} catch (error) {
		console.error("[OAuth Logout] Error:", error);

		// Even if there's an error, clear session and redirect to home
		await clearSession();
		const homeUrl =
			process.env.SHOPIFY_APP_URL || new URL("/", request.url).toString();
		return NextResponse.redirect(homeUrl);
	}
}
