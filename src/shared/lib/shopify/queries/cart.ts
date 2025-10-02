import { cartFragment } from "../fragments/cart";
import { imageFragment } from "../fragments/image";
import { seoFragment } from "../fragments/seo";
import { variantFragment } from "../fragments/variant";

export const getCartQuery = /* GraphQL */ `
	query getCart($cartId: ID!) {
		cart(id: $cartId) {
			...cart
		}
	}
	${cartFragment}
	${imageFragment}
	${seoFragment}
	${variantFragment}
`;
