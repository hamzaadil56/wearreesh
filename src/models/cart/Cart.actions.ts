"use server";

import {
	addToCartMutation,
	createCartMutation,
	removeFromCartMutation,
} from "@/shared/lib/shopify/mutations/cart";
import { shopifyFetch, reshapeCart } from "@/shared/lib/shopify";
import {
	Cart,
	CartInput,
	CartLineInput,
	ShopifyAddToCartOperation,
	ShopifyCreateCartOperation,
	ShopifyRemoveFromCartOperation,
} from "@/shared/lib/shopify/types";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { TAGS } from "@/shared/lib/shopify/constants";

export async function addItem(lines: CartLineInput[]): Promise<Cart> {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;
	const res = await shopifyFetch<ShopifyAddToCartOperation>({
		query: addToCartMutation,
		variables: {
			cartId: cartId || "",
			lines,
		},
		cache: "no-store",
	});
	revalidateTag(TAGS.cart);
	return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function createCart(input: CartInput): Promise<Cart> {
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
	const cookieStore = await cookies();
	cookieStore.set("cartId", res.body.data.cartCreate.cart.id);
	return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(cartInput: CartInput): Promise<Cart> {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (cartId) {
		// Cart exists, add items to existing cart
		// Extract lines from CartInput to pass to addItem
		return await addItem(cartInput.lines);
	} else {
		// No cart exists, create new cart with the full CartInput
		return await createCart(cartInput);
	}
}

export async function removeFromCart(
	cartId: string,
	lineIds: string[]
): Promise<Cart> {
	const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
		query: removeFromCartMutation,
		variables: {
			cartId,
			lineIds,
		},
	});
	return reshapeCart(res.body.data.cartLinesRemove.cart);
}
