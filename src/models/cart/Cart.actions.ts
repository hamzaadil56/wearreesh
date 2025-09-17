"use server";

import {
	addToCartMutation,
	createCartMutation,
} from "@/shared/lib/shopify/mutations/cart";
import { shopifyFetch, reshapeCart } from "@/shared/lib/shopify";
import {
	Cart,
	CartInput,
	CartLineInput,
	ShopifyAddToCartOperation,
	ShopifyCreateCartOperation,
} from "@/shared/lib/shopify/types";

export async function addToCart(
	cartId: string,
	lines: CartLineInput[]
): Promise<Cart> {
	const res = await shopifyFetch<ShopifyAddToCartOperation>({
		query: addToCartMutation,
		variables: {
			cartId,
			lines,
		},
		cache: "no-store",
	});
	return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function createCart(input: CartInput): Promise<Cart> {
	console.log("input", input);
	const res = await shopifyFetch<ShopifyCreateCartOperation>({
		query: createCartMutation,
		variables: {
			input,
		},
	});

	// Check for user errors from Shopify
	if (
		res.body.data.cartCreate.userErrors &&
		res.body.data.cartCreate.userErrors.length > 0
	) {
		const errorMessages = res.body.data.cartCreate.userErrors
			.map((error) => error.message)
			.join(", ");
		throw new Error(`Cart creation failed: ${errorMessages}`);
	}

	return reshapeCart(res.body.data.cartCreate.cart);
}
