/**
 * Diagnostic Route - Check Environment Variables
 * Visit: /api/debug/env to verify your configuration
 *
 * ⚠️ IMPORTANT: Remove this route in production!
 */

import { NextResponse } from "next/server";

export async function GET() {
	const envCheck = {
		// Critical variables
		SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN
			? `✅ Set (${process.env.SHOPIFY_STORE_DOMAIN})`
			: "❌ NOT SET",
		SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL
			? `✅ Set (${process.env.SHOPIFY_APP_URL})`
			: "❌ NOT SET",
		SHOPIFY_CUSTOMER_API_CLIENT_ID: process.env
			.SHOPIFY_CUSTOMER_API_CLIENT_ID
			? `✅ Set (${process.env.SHOPIFY_CUSTOMER_API_CLIENT_ID.substring(
					0,
					15
			  )}...)`
			: "❌ NOT SET",
		SHOPIFY_CUSTOMER_API_CLIENT_SECRET: process.env
			.SHOPIFY_CUSTOMER_API_CLIENT_SECRET
			? "✅ Set (hidden for security)"
			: "❌ NOT SET",

		// Storefront API variables
		SHOPIFY_API_ENDPOINT: process.env.SHOPIFY_API_ENDPOINT
			? `✅ Set (${process.env.SHOPIFY_API_ENDPOINT})`
			: "❌ NOT SET",
		SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env
			.SHOPIFY_STOREFRONT_ACCESS_TOKEN
			? "✅ Set (hidden for security)"
			: "❌ NOT SET",
	};

	const allSet = Object.values(envCheck).every((value) =>
		value.startsWith("✅")
	);

	return NextResponse.json(
		{
			status: allSet
				? "✅ All variables set"
				: "⚠️ Some variables missing",
			environment: process.env.NODE_ENV,
			variables: envCheck,
			timestamp: new Date().toISOString(),
		},
		{
			headers: {
				"Cache-Control": "no-store, no-cache, must-revalidate",
			},
		}
	);
}

