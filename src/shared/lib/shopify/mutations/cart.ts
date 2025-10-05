import { cartFragment } from "../fragments/cart";
import { imageFragment } from "../fragments/image";
import { seoFragment } from "../fragments/seo";
import { variantFragment } from "../fragments/variant";

export const addToCartMutation = /* GraphQL */ `
	mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
		cartLinesAdd(cartId: $cartId, lines: $lines) {
			cart {
				...cart
			}
		}
	}
	${cartFragment}
	${imageFragment}
	${seoFragment}
	${variantFragment}
`;

export const createCartMutation = /* GraphQL */ `
	mutation createCart($input: CartInput) {
		cartCreate(input: $input) {
			cart {
				...cart
			}
			userErrors {
				field
				message
			}
		}
	}
	${cartFragment}
	${imageFragment}
	${seoFragment}
	${variantFragment}
`;

export const editCartItemsMutation = /* GraphQL */ `
	mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
		cartLinesUpdate(cartId: $cartId, lines: $lines) {
			cart {
				...cart
			}
		}
	}
	${cartFragment}
	${imageFragment}
	${seoFragment}
	${variantFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
	mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
		cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
			cart {
				...cart
			}
			userErrors {
				field
				message
			}
		}
	}
	${cartFragment}
	${imageFragment}
	${seoFragment}
	${variantFragment}
`;
