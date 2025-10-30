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

		// Split by ' AND ' to get individual filter groups
		const filterGroups = qParam.split(" AND ");

		filterGroups.forEach((group) => {
			const trimmedGroup = group.trim();

			if (trimmedGroup === "available:true") {
				newAvailableOnly = true;
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

					if (!newFilters[optionName]) {
						newFilters[optionName] = [];
					}

					values.forEach((value) => {
						if (!newFilters[optionName].includes(value)) {
							newFilters[optionName].push(value);
						}
					});
				}
			} else if (
				trimmedGroup.startsWith("(") &&
				trimmedGroup.endsWith(")")
			) {
				// Handle legacy grouped OR filters: (variant_option:Color:Pink OR variant_option:Color:Red)
				const innerContent = trimmedGroup.slice(1, -1);
				const orParts = innerContent.split(" OR ");

				orParts.forEach((part) => {
					const match = part
						.trim()
						.match(/^variant_option:([^:]+):(.+)$/);
					if (match) {
						const [, optionName, value] = match;
						// Use value as-is (no quote removal needed)
						const cleanValue = value.trim();

						if (!newFilters[optionName]) {
							newFilters[optionName] = [];
						}
						if (!newFilters[optionName].includes(cleanValue)) {
							newFilters[optionName].push(cleanValue);
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
					// Use value as-is (no quote removal needed)
					const cleanValue = value.trim();

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
			// For multiple values within the same option, use OR without parentheses
			// For different options, use AND to join them
			Object.entries(newFilters).forEach(([optionName, values]) => {
				if (values.length === 1) {
					// Single value for this option - no quotes needed for simple values
					queryParts.push(
						`variant_option:${optionName}:${values[0]}`
					);
				} else if (values.length > 1) {
					// Multiple values for same option - use OR with single variant_option prefix
					const orValues = values.join(" OR ");
					queryParts.push(`variant_option:${optionName}:${orValues}`);
				}
			});

			// Join different filter groups with AND
			return queryParts.length > 0 ? queryParts.join(" AND ") : "";
		},
		[]
	);

	// Update URL when filters change
	const updateUrl = useCallback(
		(newFilters: FilterState, newAvailableOnly: boolean) => {
			const queryString = buildQueryString(newFilters, newAvailableOnly);
			const params = new URLSearchParams(searchParams.toString());

			if (queryString) {
				params.set("q", queryString);
			} else {
				params.delete("q");
			}

			const query = params.toString();
			const url = query ? `${pathname}?${query}` : pathname;
			router.replace(url, { scroll: false });
		},
		[buildQueryString, pathname, router, searchParams]
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
		const newFilters: FilterState = {};
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
