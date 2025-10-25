"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductViewModel } from "@/shared/types/viewModels";
import { ProductCard } from "@/shared/components/cards/ProductCard";
import { FilteredEmptyState } from "./FilteredEmptyState";
import { useUrlFilterLogic } from "@/shared/hooks/useUrlFilterLogic";

interface FilteredProductsViewProps {
	products: ProductViewModel[];
	optionsData: Array<{
		name: string;
		values: Array<{ value: string; count: number }>;
	}>;
}

interface FilterState {
	[optionName: string]: string[];
}

export function FilteredProductsView({
	products,
	optionsData,
}: FilteredProductsViewProps) {
	const searchParams = useSearchParams();
	const qParam = searchParams.get("q");

	// Use the same filter logic as the filter component
	const { clearAllFilters } = useUrlFilterLogic({ optionsData });

	// Parse filters from URL
	const { filters, availableOnly } = useMemo(() => {
		if (!qParam) {
			return { filters: {}, availableOnly: false };
		}

		const parsedFilters: FilterState = {};
		let isAvailableOnly = false;

		// Split by ' AND ' to get individual filter groups
		const filterGroups = qParam.split(" AND ");

		filterGroups.forEach((group) => {
			const trimmedGroup = group.trim();

			if (trimmedGroup === "available:true") {
				isAvailableOnly = true;
			} else if (
				trimmedGroup.startsWith("variant_option:") &&
				trimmedGroup.includes(" OR ")
			) {
				// Handle OR filters with single prefix: variant_option:Color:Pink OR Brown
				const match = trimmedGroup.match(
					/^variant_option:([^:]+):(.+)$/
				);
				if (match) {
					const [, optionName, valuesString] = match;
					// Split the values part by OR
					const values = valuesString
						.split(" OR ")
						.map((v) => v.trim());

					if (!parsedFilters[optionName]) {
						parsedFilters[optionName] = [];
					}

					values.forEach((value) => {
						if (!parsedFilters[optionName].includes(value)) {
							parsedFilters[optionName].push(value);
						}
					});
				}
			} else if (
				trimmedGroup.startsWith("(") &&
				trimmedGroup.endsWith(")")
			) {
				// Handle legacy grouped OR filters
				const innerContent = trimmedGroup.slice(1, -1);
				const orParts = innerContent.split(" OR ");

				orParts.forEach((part) => {
					const match = part
						.trim()
						.match(/^variant_option:([^:]+):(.+)$/);
					if (match) {
						const [, optionName, value] = match;
						const cleanValue = value.trim();

						if (!parsedFilters[optionName]) {
							parsedFilters[optionName] = [];
						}
						if (!parsedFilters[optionName].includes(cleanValue)) {
							parsedFilters[optionName].push(cleanValue);
						}
					}
				});
			} else if (trimmedGroup.startsWith("variant_option:")) {
				// Handle single variant_option filter
				const match = trimmedGroup.match(
					/^variant_option:([^:]+):(.+)$/
				);
				if (match) {
					const [, optionName, value] = match;
					const cleanValue = value.trim();

					if (!parsedFilters[optionName]) {
						parsedFilters[optionName] = [];
					}
					if (!parsedFilters[optionName].includes(cleanValue)) {
						parsedFilters[optionName].push(cleanValue);
					}
				}
			}
		});

		return { filters: parsedFilters, availableOnly: isAvailableOnly };
	}, [qParam]);

	// Filter products based on parsed filters
	const filteredProducts = useMemo(() => {
		let filtered = [...products];

		// Apply availability filter
		if (availableOnly) {
			filtered = filtered.filter((product) => product.availableForSale);
		}

		// Apply variant option filters
		Object.entries(filters).forEach(([optionName, values]) => {
			if (values.length === 0) return;

			// Filter products that have variants matching ANY of the selected values (OR logic)
			filtered = filtered.filter((product) => {
				// Check if the product has any variant with this option matching one of the selected values
				return product.variants.some((variant) => {
					return variant.selectedOptions.some(
						(option) =>
							option.name === optionName &&
							values.includes(option.value)
					);
				});
			});
		});

		return filtered;
	}, [products, filters, availableOnly]);

	// Check if any filters are applied
	const hasActiveFilters = Object.keys(filters).length > 0 || availableOnly;

	// If no products match filters and filters are applied, show empty state
	if (filteredProducts.length === 0 && hasActiveFilters) {
		return <FilteredEmptyState onClearFilters={clearAllFilters} />;
	}

	// If no products and no filters, show regular empty state
	if (filteredProducts.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-muted-foreground text-6xl mb-4">📦</div>
				<h3 className="text-lg font-medium text-foreground mb-2">
					No products found
				</h3>
				<p className="text-muted-foreground">
					We couldn't find any products at the moment.
				</p>
			</div>
		);
	}

	return (
		<div
			className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6"
			data-products-grid
			data-item-count={filteredProducts.length}
		>
			{filteredProducts.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
