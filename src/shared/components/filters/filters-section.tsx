import React from "react";
import { Accordion } from "@/shared/components/ui/accordion";
import { FilterItem } from "./filter-item";
import { AvailabilityFilter } from "./availability-filter";
import { OptionValue } from "./option-value";
import type { FilterState } from "@/shared/types/filters";

interface FilterSectionProps {
	optionsData: Array<{
		name: string;
		values: Array<{ value: string; count: number }>;
	}>;
	filters: FilterState;
	availableOnly: boolean;
	onOptionToggle: (optionName: string, value: string) => void;
	onAvailabilityChange: (available: boolean) => void;
}

export function FilterSection({
	optionsData,
	filters,
	availableOnly,
	onOptionToggle,
	onAvailabilityChange,
}: FilterSectionProps) {
	return (
		<Accordion type="multiple" className="w-full">
			{/* Availability Filter */}
			<FilterItem value="availability" title="Availability">
				<AvailabilityFilter
					availableOnly={availableOnly}
					onChange={onAvailabilityChange}
				/>
			</FilterItem>

			{/* Dynamic Option Filters */}
			{optionsData.map((option) => (
				<FilterItem
					key={option.name}
					value={option.name.toLowerCase()}
					title={option.name}
				>
					<div className="flex flex-wrap">
						{option.values.map(({ value, count }) => (
							<OptionValue
								key={value}
								value={value}
								count={count}
								selected={
									filters[option.name]?.includes(value) ||
									false
								}
								onClick={() =>
									onOptionToggle(option.name, value)
								}
							/>
						))}
					</div>
				</FilterItem>
			))}
		</Accordion>
	);
}
