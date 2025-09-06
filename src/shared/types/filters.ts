export interface FilterOption {
	id: string;
	label: string;
	value: string;
	count?: number;
}

export interface PriceRange {
	min: number;
	max: number;
}

export interface ProductFilters {
	categories: string[];
	priceRange: PriceRange | null;
	sizes: string[];
	colors: string[];
	tags: string[];
	availability: "all" | "in_stock" | "out_of_stock";
	sortBy:
		| "title"
		| "price_low_to_high"
		| "price_high_to_low"
		| "newest"
		| "oldest";
}

export interface FilterState {
	isOpen: boolean;
	appliedFilters: ProductFilters;
	tempFilters: ProductFilters;
	availableOptions: {
		categories: FilterOption[];
		sizes: FilterOption[];
		colors: FilterOption[];
		tags: FilterOption[];
		priceRange: {
			min: number;
			max: number;
		};
	};
}

export const DEFAULT_FILTERS: ProductFilters = {
	categories: [],
	priceRange: null,
	sizes: [],
	colors: [],
	tags: [],
	availability: "all",
	sortBy: "title",
};
