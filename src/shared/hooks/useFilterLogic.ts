import { useState, useEffect } from "react";
import type { FilterState } from "@/shared/types/filters";

interface UseFilterLogicProps {
	products: Array<{
		options: Array<{ name: string; values: string[] }>;
		availableForSale: boolean;
	}>;
	onFilterChange: (filters: FilterState) => void;
}

export function useFilterLogic({
	products,
	onFilterChange,
}: UseFilterLogicProps) {
	const [filters, setFilters] = useState<FilterState>({});
	const [availableOnly, setAvailableOnly] = useState(false);

	// Extract all unique options and their values from products
	const extractOptionsData = () => {
		const optionsMap = new Map<string, Map<string, number>>();

		products.forEach((product) => {
			// Only count products that match availability filter
			if (availableOnly && !product.availableForSale) return;

			product.options.forEach((option) => {
				if (!optionsMap.has(option.name)) {
					optionsMap.set(option.name, new Map());
				}

				const valuesMap = optionsMap.get(option.name)!;
				option.values.forEach((value) => {
					valuesMap.set(value, (valuesMap.get(value) || 0) + 1);
				});
			});
		});

		return Array.from(optionsMap.entries()).map(([name, valuesMap]) => ({
			name,
			values: Array.from(valuesMap.entries()).map(([value, count]) => ({
				value,
				count,
			})),
		}));
	};

	const optionsData = extractOptionsData();

	// Handle option value toggle
	const handleOptionToggle = (optionName: string, value: string) => {
		const currentValues = filters[optionName] || [];
		const newValues = currentValues.includes(value)
			? currentValues.filter((v) => v !== value)
			: [...currentValues, value];

		const newFilters = {
			...filters,
			[optionName]: newValues,
		};

		// Remove empty arrays
		if (newValues.length === 0) {
			delete newFilters[optionName];
		}

		setFilters(newFilters);
	};

	// Handle availability filter
	const handleAvailabilityChange = (available: boolean) => {
		setAvailableOnly(available);
	};

	// Clear all filters
	const clearAllFilters = () => {
		setFilters({});
		setAvailableOnly(false);
	};

	// Remove individual filter
	const removeFilter = (optionName: string, value: string) => {
		handleOptionToggle(optionName, value);
	};

	// Remove availability filter
	const removeAvailability = () => {
		setAvailableOnly(false);
	};

	// Get active filter count
	const activeFilterCount = Object.values(filters).reduce(
		(count, values) => count + values.length,
		availableOnly ? 1 : 0
	);

	// Notify parent of filter changes
	useEffect(() => {
		const filtersWithAvailability = {
			...filters,
			...(availableOnly && { available: ["true"] }),
		};
		onFilterChange(filtersWithAvailability);
	}, [filters, availableOnly, onFilterChange]);

	return {
		filters,
		availableOnly,
		optionsData,
		activeFilterCount,
		handleOptionToggle,
		handleAvailabilityChange,
		clearAllFilters,
		removeFilter,
		removeAvailability,
	};
}
