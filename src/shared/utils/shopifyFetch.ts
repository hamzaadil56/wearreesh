export async function shopifyFetch({
	query,
	variables,
}: {
	query: string | undefined;
	variables: string | Record<string, unknown> | undefined;
}) {
	const endpoint = process.env.SHOPIFY_API_ENDPOINT || "";
	const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

	try {
		const result = await fetch(endpoint as string, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Shopify-Storefront-Access-Token": key,
			},
			body: JSON.stringify({ query, variables }),
		});

		const data = await result.json();

		return {
			status: result.status,
			body: data,
		};
	} catch (error) {
		console.error("Error:", error);
		return {
			status: 500,
			error: "Error receiving data",
		};
	}
}
