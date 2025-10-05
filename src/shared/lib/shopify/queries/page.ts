import { seoFragment } from "../fragments/seo";

export const getPageQuery = /* GraphQL */ `
	query getPage($handle: String!) {
		page(handle: $handle) {
			id
			title
			handle
			body
			bodySummary
			seo {
				...seo
			}
			createdAt
			updatedAt
		}
	}
	${seoFragment}
`;

export const getPagesQuery = /* GraphQL */ `
	query getPages {
		pages(first: 100) {
			edges {
				node {
					id
					title
					handle
					bodySummary
					createdAt
					updatedAt
				}
			}
		}
	}
`;
