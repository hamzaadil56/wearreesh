"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { FilterHeader } from "@/shared/components/filters/filter-header";
import { FilterSection } from "@/shared/components/filters/filters-section";
import { ActiveFilters } from "@/shared/components/filters/active-filters";
import { useUrlFilterLogic } from "@/shared/hooks/useUrlFilterLogic";
import type { ProductsFilterProps } from "@/shared/types/filters";

export function ProductsFilter({
	optionsData,
	className,
}: ProductsFilterProps) {
	const {
		filters,
		availableOnly,
		activeFilterCount,
		handleOptionToggle,
		handleAvailabilityChange,
		clearAllFilters,
		removeFilter,
		removeAvailability,
	} = useUrlFilterLogic({ optionsData });

	return (
		<div
			className={cn(
				"w-full max-w-sm bg-card border border-border rounded-lg p-4",
				className
			)}
		>
			<FilterHeader
				activeFilterCount={activeFilterCount}
				onClearAll={clearAllFilters}
			/>

			<FilterSection
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
