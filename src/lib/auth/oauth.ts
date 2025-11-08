/**
 * OAuth 2.0 Utilities for Confidential Client
 * Based on: https://shopify.dev/docs/api/customer/latest#step-authorization
 *
 * Confidential clients can securely store client_secret on the server
 * and don't need PKCE (Proof Key for Code Exchange)
 */

import crypto from "crypto";

/**
 * Generate a random state parameter for CSRF protection
 */
export function generateState(): string {
	return crypto.randomBytes(32).toString("base64url");
}

/**
 * Generate a random nonce for replay attack mitigation
 */
export function generateNonce(): string {
	return crypto.randomBytes(16).toString("base64url");
}

/**
 * Build authorization URL for OAuth 2.0 flow (Confidential Client)
 */
export function buildAuthorizationUrl({
	authorizationEndpoint,
	clientId,
	redirectUri,
	scope,
	state,
	nonce,
}: {
	authorizationEndpoint: string;
	clientId: string;
	redirectUri: string;
	scope: string;
	state: string;
	nonce: string;
}): string {
	const params = new URLSearchParams({
		scope,
		client_id: clientId,
		response_type: "code",
		redirect_uri: redirectUri,
		state,
		nonce,
	});

	return `${authorizationEndpoint}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token (Confidential Client)
 * Uses client_secret for authentication (not PKCE)
 */
export async function exchangeCodeForToken({
	tokenEndpoint,
	clientId,
	clientSecret,
	code,
	redirectUri,
}: {
	tokenEndpoint: string;
	clientId: string;
	clientSecret: string;
	code: string;
	redirectUri: string;
}): Promise<{
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	id_token?: string;
	token_type: string;
}> {
	// Confidential clients send client_id and client_secret in Authorization header
	const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
		"base64"
	);

	const response = await fetch(tokenEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${credentials}`,
		},
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: redirectUri,
		}).toString(),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error("[OAuth] Token exchange failed:", errorText);
		throw new Error(
			`Token exchange failed: ${response.status} ${errorText}`
		);
	}

	return response.json();
}

/**
 * Refresh access token using refresh token (Confidential Client)
 */
export async function refreshAccessToken({
	tokenEndpoint,
	clientId,
	clientSecret,
	refreshToken,
}: {
	tokenEndpoint: string;
	clientId: string;
	clientSecret: string;
	refreshToken: string;
}): Promise<{
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	token_type: string;
}> {
	const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
		"base64"
	);

	const response = await fetch(tokenEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${credentials}`,
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
		}).toString(),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error("[OAuth] Token refresh failed:", errorText);
		throw new Error(
			`Token refresh failed: ${response.status} ${errorText}`
		);
	}

	return response.json();
}
