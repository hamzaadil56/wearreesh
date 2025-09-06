import { cartFragment } from "../fragments/cart";
import { imageFragment } from "../fragments/image";
import { seoFragment } from "../fragments/seo";

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
`;

export const createCartMutation = /* GraphQL */ `
	mutation createCart($lineItems: [CartLineInput!]) {
		cartCreate(input: { lines: $lineItems }) {
			cart {
				...cart
			}
		}
	}
	${cartFragment}
	${imageFragment}
	${seoFragment}
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
`;

export const removeFromCartMutation = /* GraphQL */ `
	mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
		cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
			cart {
				...cart
			}
		}
	}
	${cartFragment}
	${imageFragment}
	${seoFragment}
`;
