export type ProductSortValue =
	| "relevance"
	| "price-asc"
	| "price-desc"
	| "newest"
	| "best-selling";

export interface ProductSortOption {
	label: string;
	value: ProductSortValue;
	sortKey: string;
	reverse?: boolean;
}

export const PRODUCT_SORT_OPTIONS: ProductSortOption[] = [
	{
		label: "Relevance",
		value: "relevance",
		sortKey: "RELEVANCE",
	},
	{
		label: "Price: Low to High",
		value: "price-asc",
		sortKey: "PRICE",
	},
	{
		label: "Price: High to Low",
		value: "price-desc",
		sortKey: "PRICE",
		reverse: true,
	},
	{
		label: "Newest",
		value: "newest",
		sortKey: "CREATED_AT",
		reverse: true,
	},
	{
		label: "Best Selling",
		value: "best-selling",
		sortKey: "BEST_SELLING",
	},
];

export const DEFAULT_PRODUCT_SORT_OPTION = PRODUCT_SORT_OPTIONS[0];

export function getProductSortOption(value?: string): ProductSortOption {
	const normalizedValue = (value || "").toLowerCase();
	return (
		PRODUCT_SORT_OPTIONS.find(
			(option) => option.value === normalizedValue
		) || DEFAULT_PRODUCT_SORT_OPTION
	);
}

export function resolveProductSortParams({
	value,
	hasQuery,
}: {
	value?: string;
	hasQuery?: boolean;
}): {
	option: ProductSortOption;
	sortKey: string;
	sortOrder: "asc" | "desc";
} {
	const option = getProductSortOption(value);
	let sortKey = option.sortKey;

	// Shopify only supports RELEVANCE when a search query is present.
	if (sortKey === "RELEVANCE" && !hasQuery) {
		sortKey = "TITLE";
	}

	return {
		option,
		sortKey,
		sortOrder: option.reverse ? "desc" : "asc",
	};
}
