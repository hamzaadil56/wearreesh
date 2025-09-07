import React from "react";
import { Accordion } from "@/shared/components/ui/accordion";
import { FilterSection } from "./filter-section";
import { AvailabilityFilter } from "./availability-filter";
import { OptionValue } from "./option-value";
import type { FilterState } from "@/shared/types/filters";

interface FilterAccordionProps {
	optionsData: Array<{
		name: string;
		values: Array<{ value: string; count: number }>;
	}>;
	filters: FilterState;
	availableOnly: boolean;
	onOptionToggle: (optionName: string, value: string) => void;
	onAvailabilityChange: (available: boolean) => void;
}

export function FilterAccordion({
	optionsData,
	filters,
	availableOnly,
	onOptionToggle,
	onAvailabilityChange,
}: FilterAccordionProps) {
	// Create default values for accordion (sections that should be open by default)
	const getDefaultAccordionValues = () => {
		const defaultValues = ["availability"]; // Always open availability
		// Also open size filter by default if it exists
		const sizeOption = optionsData.find(
			(option) => option.name.toLowerCase() === "size"
		);
		if (sizeOption) {
			defaultValues.push("size");
		}
		return defaultValues;
	};

	return (
		<Accordion
			type="multiple"
			defaultValue={getDefaultAccordionValues()}
			className="w-full"
		>
			{/* Availability Filter */}
			<FilterSection value="availability" title="Availability">
				<AvailabilityFilter
					availableOnly={availableOnly}
					onChange={onAvailabilityChange}
				/>
			</FilterSection>

			{/* Dynamic Option Filters */}
			{optionsData.map((option) => (
				<FilterSection
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
				</FilterSection>
			))}
		</Accordion>
	);
}
