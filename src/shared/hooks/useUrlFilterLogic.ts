"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { FilterState } from "@/shared/types/filters";

interface UseUrlFilterLogicProps {
	optionsData: Array<{
		name: string;
		values: Array<{ value: string; count: number }>;
	}>;
}

export function useUrlFilterLogic({ optionsData }: UseUrlFilterLogicProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [filters, setFilters] = useState<FilterState>({});
	const [availableOnly, setAvailableOnly] = useState(false);

	// Parse URL query parameters on mount and when URL changes
	useEffect(() => {
		const qParam = searchParams.get("q");
		if (!qParam) {
			setFilters({});
			setAvailableOnly(false);
			return;
		}

		const newFilters: FilterState = {};
		let newAvailableOnly = false;

		// Split by '+' to get individual filter parts
		const filterParts = qParam.split("+");

		filterParts.forEach((part) => {
			if (part === "available:true") {
				newAvailableOnly = true;
			} else if (part.startsWith("variant_option:")) {
				// Parse variant_option:OptionName:Value format
				const match = part.match(/^variant_option:([^:]+):(.+)$/);
				if (match) {
					const [, optionName, value] = match;
					// Remove quotes if present
					const cleanValue = value.replace(/^"(.*)"$/, "$1");

					if (!newFilters[optionName]) {
						newFilters[optionName] = [];
					}
					if (!newFilters[optionName].includes(cleanValue)) {
						newFilters[optionName].push(cleanValue);
					}
				}
			}
		});

		setFilters(newFilters);
		setAvailableOnly(newAvailableOnly);
	}, [searchParams]);

	// Helper function to build query string from current filters
	const buildQueryString = useCallback(
		(newFilters: FilterState, newAvailableOnly: boolean) => {
			const queryParts: string[] = [];

			// Add availability filter
			if (newAvailableOnly) {
				queryParts.push("available:true");
			}

			// Add variant option filters
			Object.entries(newFilters).forEach(([optionName, values]) => {
				values.forEach((value) => {
					// Add quotes around values that contain spaces
					const formattedValue = value.includes(" ")
						? `"${value}"`
						: value;
					queryParts.push(
						`variant_option:${optionName}:${formattedValue}`
					);
				});
			});

			return queryParts.length > 0 ? queryParts.join("+") : "";
		},
		[]
	);

	// Update URL when filters change
	const updateUrl = useCallback(
		(newFilters: FilterState, newAvailableOnly: boolean) => {
			const queryString = buildQueryString(newFilters, newAvailableOnly);
			const url = queryString
				? `${pathname}?q=${encodeURIComponent(queryString)}`
				: pathname;
			router.push(url); // Use replace instead of push
		},
		[router, pathname, buildQueryString]
	);

	// Options data is now passed as a prop

	// Handle option value toggle
	const handleOptionToggle = useCallback(
		(optionName: string, value: string) => {
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

			// Update URL immediately with the new filters
			updateUrl(newFilters, availableOnly);
			// Then update local state
			setFilters(newFilters);
		},
		[filters, availableOnly, updateUrl]
	);

	// Handle availability filter
	const handleAvailabilityChange = useCallback(
		(available: boolean) => {
			setAvailableOnly(available);
			updateUrl(filters, available);
		},
		[filters, updateUrl]
	);

	// Clear all filters
	const clearAllFilters = useCallback(() => {
		const newFilters = {};
		const newAvailableOnly = false;
		setFilters(newFilters);
		setAvailableOnly(newAvailableOnly);
		updateUrl(newFilters, newAvailableOnly);
	}, [updateUrl]);

	// Remove individual filter
	const removeFilter = useCallback(
		(optionName: string, value: string) => {
			handleOptionToggle(optionName, value);
		},
		[handleOptionToggle]
	);

	// Remove availability filter
	const removeAvailability = useCallback(() => {
		handleAvailabilityChange(false);
	}, [handleAvailabilityChange]);

	// Get active filter count
	const activeFilterCount = Object.values(filters).reduce(
		(count, values) => count + values.length,
		availableOnly ? 1 : 0
	);

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
