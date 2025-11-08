/**
 * Session Management for OAuth 2.0 (Confidential Client)
 * Stores tokens in HTTP-only cookies for security
 */

import { cookies } from "next/headers";

// Cookie names
export const COOKIE_NAMES = {
	ACCESS_TOKEN: "customer_access_token",
	REFRESH_TOKEN: "customer_refresh_token",
	ID_TOKEN: "customer_id_token",
	OAUTH_STATE: "oauth_state",
	OAUTH_NONCE: "oauth_nonce",
	TOKEN_EXPIRES_AT: "token_expires_at",
} as const;

// Cookie options
const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	path: "/",
};

/**
 * Store OAuth state and nonce temporarily (for CSRF protection)
 */
export async function storeOAuthState(state: string, nonce: string) {
	const cookieStore = await cookies();

	cookieStore.set(COOKIE_NAMES.OAUTH_STATE, state, {
		...COOKIE_OPTIONS,
		maxAge: 60 * 10, // 10 minutes
	});

	cookieStore.set(COOKIE_NAMES.OAUTH_NONCE, nonce, {
		...COOKIE_OPTIONS,
		maxAge: 60 * 10, // 10 minutes
	});

	console.log("[Session] Stored OAuth state and nonce");
}

/**
 * Verify and retrieve OAuth state (CSRF protection)
 */
export async function verifyOAuthState(
	receivedState: string
): Promise<boolean> {
	const cookieStore = await cookies();
	const storedState = cookieStore.get(COOKIE_NAMES.OAUTH_STATE)?.value;

	if (!storedState) {
		console.error("[Session] OAuth state not found in cookies");
		return false;
	}

	const isValid = storedState === receivedState;
	console.log(
		"[Session] OAuth state verification:",
		isValid ? "SUCCESS" : "FAILED"
	);

	return isValid;
}

/**
 * Clear OAuth state cookies after successful callback
 */
export async function clearOAuthState() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_NAMES.OAUTH_STATE);
	cookieStore.delete(COOKIE_NAMES.OAUTH_NONCE);
	console.log("[Session] Cleared OAuth state cookies");
}

/**
 * Store session tokens after successful authentication
 */
export async function storeSession({
	accessToken,
	refreshToken,
	idToken,
	expiresIn,
}: {
	accessToken: string;
	refreshToken?: string;
	idToken?: string;
	expiresIn: number;
}) {
	const cookieStore = await cookies();

	// Calculate expiration time
	const expiresAt = Date.now() + expiresIn * 1000;

	// Store access token
	cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
		...COOKIE_OPTIONS,
		maxAge: expiresIn,
	});

	// Store refresh token (longer expiration)
	if (refreshToken) {
		cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
			...COOKIE_OPTIONS,
			maxAge: 60 * 60 * 24 * 90, // 90 days
		});
	}

	// Store ID token
	if (idToken) {
		cookieStore.set(COOKIE_NAMES.ID_TOKEN, idToken, {
			...COOKIE_OPTIONS,
			maxAge: expiresIn,
		});
	}

	// Store expiration time
	cookieStore.set(COOKIE_NAMES.TOKEN_EXPIRES_AT, expiresAt.toString(), {
		...COOKIE_OPTIONS,
		maxAge: expiresIn,
	});

	console.log("[Session] Stored session tokens", {
		hasAccessToken: !!accessToken,
		hasRefreshToken: !!refreshToken,
		hasIdToken: !!idToken,
		expiresIn,
	});
}

/**
 * Get current session
 */
export async function getSession(): Promise<{
	accessToken: string | null;
	refreshToken: string | null;
	idToken: string | null;
	expiresAt: number | null;
}> {
	const cookieStore = await cookies();

	const accessToken =
		cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value || null;
	const refreshToken =
		cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value || null;
	const idToken = cookieStore.get(COOKIE_NAMES.ID_TOKEN)?.value || null;
	const expiresAtStr = cookieStore.get(COOKIE_NAMES.TOKEN_EXPIRES_AT)?.value;
	const expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : null;

	return {
		accessToken,
		refreshToken,
		idToken,
		expiresAt,
	};
}

/**
 * Check if session is valid (not expired)
 */
export async function isSessionValid(): Promise<boolean> {
	const session = await getSession();

	if (!session.accessToken) {
		return false;
	}

	// Check if token is expired
	if (session.expiresAt && Date.now() >= session.expiresAt) {
		console.log("[Session] Access token expired");
		return false;
	}

	return true;
}

/**
 * Clear all session cookies (logout)
 */
export async function clearSession() {
	const cookieStore = await cookies();

	cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
	cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
	cookieStore.delete(COOKIE_NAMES.ID_TOKEN);
	cookieStore.delete(COOKIE_NAMES.TOKEN_EXPIRES_AT);

	console.log("[Session] Cleared all session cookies");
}

