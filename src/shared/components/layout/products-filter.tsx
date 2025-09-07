"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { ProductOption } from "@/shared/lib/shopify/types";

// Types for dynamic filtering

export interface FilterState {
	[optionName: string]: string[];
}

export interface ProductsFilterProps {
	products: Array<{
		id: string;
		options: ProductOption[];
		availableForSale: boolean;
		priceRange: {
			minVariantPrice: { amount: string };
			maxVariantPrice: { amount: string };
		};
	}>;
	onFilterChange: (filters: FilterState) => void;
	className?: string;
}

interface FilterSectionProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}

function FilterSection({
	title,
	children,
	defaultOpen = false,
}: FilterSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className="border-b border-gray-200 last:border-b-0">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full items-center justify-between py-4 text-left text-base font-normal text-black hover:text-gray-700 transition-colors"
			>
				{title}
				{isOpen ? (
					<ChevronUp className="h-4 w-4" />
				) : (
					<ChevronDown className="h-4 w-4" />
				)}
			</button>
			{isOpen && <div className="pb-4">{children}</div>}
		</div>
	);
}

interface OptionValueProps {
	value: string;
	count: number;
	selected: boolean;
	onClick: () => void;
}

function OptionValue({ value, count, selected, onClick }: OptionValueProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors mr-2 mb-2",
				selected
					? "bg-black text-white"
					: "bg-gray-100 text-black hover:bg-gray-200"
			)}
		>
			{value} ({count})
		</button>
	);
}

interface AvailabilityFilterProps {
	availableOnly: boolean;
	onChange: (availableOnly: boolean) => void;
}

function AvailabilityFilter({
	availableOnly,
	onChange,
}: AvailabilityFilterProps) {
	return (
		<div className="space-y-2">
			<label className="flex items-center space-x-2 cursor-pointer">
				<input
					type="checkbox"
					checked={availableOnly}
					onChange={(e) => onChange(e.target.checked)}
					className="rounded border-gray-300 text-black focus:ring-black"
				/>
				<span className="text-sm text-gray-700">Available only</span>
			</label>
		</div>
	);
}

export function ProductsFilter({
	products,
	onFilterChange,
	className,
}: ProductsFilterProps) {
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
	console.log(optionsData, "optionsData");

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

	// Notify parent of filter changes
	useEffect(() => {
		const filtersWithAvailability = {
			...filters,
			...(availableOnly && { available: ["true"] }),
		};
		onFilterChange(filtersWithAvailability);
	}, [filters, availableOnly, onFilterChange]);

	// Get active filter count
	const activeFilterCount = Object.values(filters).reduce(
		(count, values) => count + values.length,
		availableOnly ? 1 : 0
	);

	return (
		<div
			className={cn(
				"w-full max-w-sm bg-white border border-gray-200 rounded-lg p-4",
				className
			)}
		>
			{/* Filter Header */}
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-black">Filters</h3>
				{activeFilterCount > 0 && (
					<Button
						variant="outline"
						size="sm"
						onClick={clearAllFilters}
						className="text-xs"
					>
						Clear All ({activeFilterCount})
					</Button>
				)}
			</div>

			{/* Availability Filter */}
			<FilterSection title="Availability" defaultOpen={true}>
				<AvailabilityFilter
					availableOnly={availableOnly}
					onChange={handleAvailabilityChange}
				/>
			</FilterSection>

			{/* Dynamic Option Filters */}
			{optionsData.map((option) => (
				<FilterSection
					key={option.name}
					title={option.name}
					defaultOpen={option.name.toLowerCase() === "size"}
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
									handleOptionToggle(option.name, value)
								}
							/>
						))}
					</div>
				</FilterSection>
			))}

			{/* Active Filters Display */}
			{activeFilterCount > 0 && (
				<div className="mt-4 pt-4 border-t border-gray-200">
					<h4 className="text-sm font-medium text-gray-900 mb-2">
						Active Filters
					</h4>
					<div className="flex flex-wrap gap-2">
						{availableOnly && (
							<Badge
								variant="secondary"
								className="flex items-center gap-1"
							>
								Available only
								<X
									className="h-3 w-3 cursor-pointer"
									onClick={() => setAvailableOnly(false)}
								/>
							</Badge>
						)}
						{Object.entries(filters).map(([optionName, values]) =>
							values.map((value) => (
								<Badge
									key={`${optionName}-${value}`}
									variant="secondary"
									className="flex items-center gap-1"
								>
									{optionName}: {value}
									<X
										className="h-3 w-3 cursor-pointer"
										onClick={() =>
											handleOptionToggle(
												optionName,
												value
											)
										}
									/>
								</Badge>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default ProductsFilter;
