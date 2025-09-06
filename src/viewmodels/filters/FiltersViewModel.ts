import { BaseViewModel } from "../core/BaseViewModel";
import type { Product } from "@/models/product/Product.model";
import type { ProductFilters, FilterOption } from "@/shared/types/filters";
import { DEFAULT_FILTERS } from "@/shared/types/filters";

interface FiltersViewState {
	appliedFilters: ProductFilters;
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
	filteredProductsCount: number;
}

export class FiltersViewModel extends BaseViewModel {
	private _viewState: FiltersViewState = {
		appliedFilters: { ...DEFAULT_FILTERS },
		availableOptions: {
			categories: [],
			sizes: [],
			colors: [],
			tags: [],
			priceRange: { min: 0, max: 1000 },
		},
		filteredProductsCount: 0,
	};

	/**
	 * Get current applied filters
	 */
	get appliedFilters(): ProductFilters {
		return this._viewState.appliedFilters;
	}

	/**
	 * Get available filter options
	 */
	get availableOptions() {
		return this._viewState.availableOptions;
	}

	/**
	 * Get filtered products count
	 */
	get filteredProductsCount(): number {
		return this._viewState.filteredProductsCount;
	}

	/**
	 * Check if any filters are applied
	 */
	get hasActiveFilters(): boolean {
		const filters = this._viewState.appliedFilters;
		return (
			filters.categories.length > 0 ||
			filters.sizes.length > 0 ||
			filters.colors.length > 0 ||
			filters.tags.length > 0 ||
			filters.priceRange !== null ||
			filters.availability !== "all"
		);
	}

	/**
	 * Get active filters count
	 */
	get activeFiltersCount(): number {
		const filters = this._viewState.appliedFilters;
		return (
			filters.categories.length +
			filters.sizes.length +
			filters.colors.length +
			filters.tags.length +
			(filters.priceRange ? 1 : 0) +
			(filters.availability !== "all" ? 1 : 0)
		);
	}

	/**
	 * Initialize filter options from products
	 */
	initializeFromProducts(products: Product[]): void {
		const categories = new Map<string, number>();
		const sizes = new Map<string, number>();
		const colors = new Map<string, number>();
		const tags = new Map<string, number>();
		let minPrice = Infinity;
		let maxPrice = 0;

		products.forEach((product) => {
			// Extract categories from tags (assuming category tags start with 'category:')
			product.tags.forEach((tag) => {
				if (tag.startsWith("category:")) {
					const category = tag.replace("category:", "");
					categories.set(
						category,
						(categories.get(category) || 0) + 1
					);
				} else {
					tags.set(tag, (tags.get(tag) || 0) + 1);
				}
			});

			// Extract sizes and colors from variants
			product.variants.forEach((variant) => {
				variant.selectedOptions.forEach((option) => {
					const optionName = option.name.toLowerCase();
					if (optionName.includes("size")) {
						sizes.set(
							option.value,
							(sizes.get(option.value) || 0) + 1
						);
					} else if (
						optionName.includes("color") ||
						optionName.includes("colour")
					) {
						colors.set(
							option.value,
							(colors.get(option.value) || 0) + 1
						);
					}
				});

				// Track price range
				const price = parseFloat(variant.price.amount);
				minPrice = Math.min(minPrice, price);
				maxPrice = Math.max(maxPrice, price);
			});
		});

		// Convert maps to filter options
		const categoryOptions: FilterOption[] = Array.from(
			categories.entries()
		).map(([value, count]) => ({
			id: `category-${value}`,
			label: value.charAt(0).toUpperCase() + value.slice(1),
			value,
			count,
		}));

		const sizeOptions: FilterOption[] = Array.from(sizes.entries()).map(
			([value, count]) => ({
				id: `size-${value}`,
				label: value,
				value,
				count,
			})
		);

		const colorOptions: FilterOption[] = Array.from(colors.entries()).map(
			([value, count]) => ({
				id: `color-${value}`,
				label: value,
				value,
				count,
			})
		);

		const tagOptions: FilterOption[] = Array.from(tags.entries()).map(
			([value, count]) => ({
				id: `tag-${value}`,
				label: value,
				value,
				count,
			})
		);

		this.updateViewState({
			availableOptions: {
				categories: categoryOptions.sort((a, b) =>
					a.label.localeCompare(b.label)
				),
				sizes: sizeOptions.sort((a, b) =>
					a.label.localeCompare(b.label)
				),
				colors: colorOptions.sort((a, b) =>
					a.label.localeCompare(b.label)
				),
				tags: tagOptions.sort((a, b) => a.label.localeCompare(b.label)),
				priceRange: {
					min: Math.floor(minPrice) || 0,
					max: Math.ceil(maxPrice) || 1000,
				},
			},
		});
	}

	/**
	 * Apply filters to products
	 */
	applyFilters(products: Product[]): Product[] {
		const filters = this._viewState.appliedFilters;
		let filtered = [...products];

		// Filter by categories
		if (filters.categories.length > 0) {
			filtered = filtered.filter((product) =>
				product.tags.some((tag) =>
					filters.categories.some(
						(category) =>
							tag
								.toLowerCase()
								.includes(category.toLowerCase()) ||
							tag === `category:${category}`
					)
				)
			);
		}

		// Filter by sizes
		if (filters.sizes.length > 0) {
			filtered = filtered.filter((product) =>
				product.variants.some((variant) =>
					variant.selectedOptions.some(
						(option) =>
							option.name.toLowerCase().includes("size") &&
							filters.sizes.includes(option.value)
					)
				)
			);
		}

		// Filter by colors
		if (filters.colors.length > 0) {
			filtered = filtered.filter((product) =>
				product.variants.some((variant) =>
					variant.selectedOptions.some(
						(option) =>
							(option.name.toLowerCase().includes("color") ||
								option.name.toLowerCase().includes("colour")) &&
							filters.colors.includes(option.value)
					)
				)
			);
		}

		// Filter by tags
		if (filters.tags.length > 0) {
			filtered = filtered.filter((product) =>
				product.tags.some((tag) => filters.tags.includes(tag))
			);
		}

		// Filter by price range
		if (filters.priceRange) {
			filtered = filtered.filter((product) => {
				const minPrice = Math.min(
					...product.variants.map((v) => parseFloat(v.price.amount))
				);
				const maxPrice = Math.max(
					...product.variants.map((v) => parseFloat(v.price.amount))
				);
				return (
					minPrice <= filters.priceRange!.max &&
					maxPrice >= filters.priceRange!.min
				);
			});
		}

		// Filter by availability
		if (filters.availability === "in_stock") {
			filtered = filtered.filter((product) => product.availableForSale);
		} else if (filters.availability === "out_of_stock") {
			filtered = filtered.filter((product) => !product.availableForSale);
		}

		// Sort products
		switch (filters.sortBy) {
			case "price_low_to_high":
				filtered.sort((a, b) => {
					const aPrice = Math.min(
						...a.variants.map((v) => parseFloat(v.price.amount))
					);
					const bPrice = Math.min(
						...b.variants.map((v) => parseFloat(v.price.amount))
					);
					return aPrice - bPrice;
				});
				break;
			case "price_high_to_low":
				filtered.sort((a, b) => {
					const aPrice = Math.max(
						...a.variants.map((v) => parseFloat(v.price.amount))
					);
					const bPrice = Math.max(
						...b.variants.map((v) => parseFloat(v.price.amount))
					);
					return bPrice - aPrice;
				});
				break;
			case "newest":
				filtered.sort(
					(a, b) =>
						new Date(b.updatedAt || 0).getTime() -
						new Date(a.updatedAt || 0).getTime()
				);
				break;
			case "oldest":
				filtered.sort(
					(a, b) =>
						new Date(a.updatedAt || 0).getTime() -
						new Date(b.updatedAt || 0).getTime()
				);
				break;
			case "title":
			default:
				filtered.sort((a, b) => a.title.localeCompare(b.title));
				break;
		}

		this.updateViewState({
			filteredProductsCount: filtered.length,
		});

		return filtered;
	}

	/**
	 * Update applied filters
	 */
	updateFilters(filters: Partial<ProductFilters>): void {
		this.updateViewState({
			appliedFilters: {
				...this._viewState.appliedFilters,
				...filters,
			},
		});
	}

	/**
	 * Clear all filters
	 */
	clearAllFilters(): void {
		this.updateViewState({
			appliedFilters: { ...DEFAULT_FILTERS },
		});
	}

	/**
	 * Clear specific filter type
	 */
	clearFilter(filterType: keyof ProductFilters): void {
		const filters = { ...this._viewState.appliedFilters };

		switch (filterType) {
			case "categories":
				filters.categories = [];
				break;
			case "sizes":
				filters.sizes = [];
				break;
			case "colors":
				filters.colors = [];
				break;
			case "tags":
				filters.tags = [];
				break;
			case "priceRange":
				filters.priceRange = null;
				break;
			case "availability":
				filters.availability = "all";
				break;
		}

		this.updateViewState({ appliedFilters: filters });
	}

	/**
	 * Get filter summary for display
	 */
	getFilterSummary(): string[] {
		const filters = this._viewState.appliedFilters;
		const summary: string[] = [];

		if (filters.categories.length > 0) {
			summary.push(`Categories: ${filters.categories.join(", ")}`);
		}

		if (filters.sizes.length > 0) {
			summary.push(`Sizes: ${filters.sizes.join(", ")}`);
		}

		if (filters.colors.length > 0) {
			summary.push(`Colors: ${filters.colors.join(", ")}`);
		}

		if (filters.priceRange) {
			summary.push(
				`Price: $${filters.priceRange.min} - $${filters.priceRange.max}`
			);
		}

		if (filters.availability !== "all") {
			summary.push(
				`Availability: ${filters.availability.replace("_", " ")}`
			);
		}

		if (filters.tags.length > 0) {
			summary.push(`Tags: ${filters.tags.join(", ")}`);
		}

		return summary;
	}

	private updateViewState(updates: Partial<FiltersViewState>): void {
		this._viewState = {
			...this._viewState,
			...updates,
		};
		this.notifyStateChange();
	}
}
