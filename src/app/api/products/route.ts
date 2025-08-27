import { shopifyFetch } from "@/utils/shopifyFetch";
export async function GET() {
	const res = await shopifyFetch({
		query: `{
        products(sortKey: TITLE, first: 100) {
          edges{
            node {
              id
              title
              description
            }
          }
        }
      }`,
		variables: {},
	});

	return Response.json({ res });
}
