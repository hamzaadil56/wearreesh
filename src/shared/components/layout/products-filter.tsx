"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { FilterHeader } from "@/shared/components/filters/filter-header";
import { FilterAccordion } from "@/shared/components/filters/filter-accordion";
import { ActiveFilters } from "@/shared/components/filters/active-filters";
import { useFilterLogic } from "@/shared/hooks/useFilterLogic";
import type { ProductsFilterProps } from "@/shared/types/filters";

export function ProductsFilter({
	products,
	onFilterChange,
	className,
}: ProductsFilterProps) {
	const {
		filters,
		availableOnly,
		optionsData,
		activeFilterCount,
		handleOptionToggle,
		handleAvailabilityChange,
		clearAllFilters,
		removeFilter,
		removeAvailability,
	} = useFilterLogic({ products, onFilterChange });

	return (
		<div
			className={cn(
				"w-full max-w-sm bg-white border border-gray-200 rounded-lg p-4",
				className
			)}
		>
			<FilterHeader
				activeFilterCount={activeFilterCount}
				onClearAll={clearAllFilters}
			/>

			<FilterAccordion
				optionsData={optionsData}
				filters={filters}
				availableOnly={availableOnly}
				onOptionToggle={handleOptionToggle}
				onAvailabilityChange={handleAvailabilityChange}
			/>

			<ActiveFilters
				filters={filters}
				availableOnly={availableOnly}
				onRemoveFilter={removeFilter}
				onRemoveAvailability={removeAvailability}
			/>
		</div>
	);
}

export default ProductsFilter;
