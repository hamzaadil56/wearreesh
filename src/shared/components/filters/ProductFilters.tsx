"use client";

import React, { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import type {
	ProductFilters,
	FilterOption,
	PriceRange,
} from "@/shared/types/filters";

interface ProductFiltersProps {
	filters: ProductFilters;
	onFiltersChange: (filters: ProductFilters) => void;
	availableOptions: {
		categories: FilterOption[];
		sizes: FilterOption[];
		colors: FilterOption[];
		tags: FilterOption[];
		priceRange: { min: number; max: number };
	};
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
	defaultOpen = true,
}: FilterSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className="border-b border-border/40 pb-4">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
			>
				{title}
				{isOpen ? (
					<ChevronUp className="h-4 w-4" />
				) : (
					<ChevronDown className="h-4 w-4" />
				)}
			</button>
			{isOpen && <div className="mt-3 space-y-2">{children}</div>}
		</div>
	);
}

interface CheckboxFilterProps {
	options: FilterOption[];
	selectedValues: string[];
	onChange: (values: string[]) => void;
}

function CheckboxFilter({
	options,
	selectedValues,
	onChange,
}: CheckboxFilterProps) {
	const handleToggle = (value: string) => {
		const newValues = selectedValues.includes(value)
			? selectedValues.filter((v) => v !== value)
			: [...selectedValues, value];
		onChange(newValues);
	};

	return (
		<div className="space-y-2">
			{options.map((option) => (
				<label
					key={option.id}
					className="flex items-center space-x-2 cursor-pointer group"
				>
					<input
						type="checkbox"
						checked={selectedValues.includes(option.value)}
						onChange={() => handleToggle(option.value)}
						className="rounded border-border text-primary focus:ring-primary focus:ring-offset-0 focus:ring-1"
					/>
					<span className="text-sm text-foreground group-hover:text-foreground/80 transition-colors flex-1">
						{option.label}
					</span>
					{option.count !== undefined && (
						<span className="text-xs text-muted-foreground">
							({option.count})
						</span>
					)}
				</label>
			))}
		</div>
	);
}

interface PriceRangeFilterProps {
	value: PriceRange | null;
	onChange: (range: PriceRange | null) => void;
	min: number;
	max: number;
}

function PriceRangeFilter({
	value,
	onChange,
	min,
	max,
}: PriceRangeFilterProps) {
	const [localMin, setLocalMin] = useState(
		value?.min.toString() || min.toString()
	);
	const [localMax, setLocalMax] = useState(
		value?.max.toString() || max.toString()
	);

	const handleApply = () => {
		const minNum = Math.max(min, parseInt(localMin) || min);
		const maxNum = Math.min(max, parseInt(localMax) || max);

		if (minNum <= maxNum) {
			onChange({ min: minNum, max: maxNum });
		}
	};

	const handleClear = () => {
		setLocalMin(min.toString());
		setLocalMax(max.toString());
		onChange(null);
	};

	return (
		<div className="space-y-3">
			<div className="flex space-x-2">
				<div className="flex-1">
					<label className="text-xs text-muted-foreground">Min</label>
					<input
						type="number"
						value={localMin}
						onChange={(e) => setLocalMin(e.target.value)}
						min={min}
						max={max}
						className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder={`$${min}`}
					/>
				</div>
				<div className="flex-1">
					<label className="text-xs text-muted-foreground">Max</label>
					<input
						type="number"
						value={localMax}
						onChange={(e) => setLocalMax(e.target.value)}
						min={min}
						max={max}
						className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder={`$${max}`}
					/>
				</div>
			</div>
			<div className="flex space-x-2">
				<Button size="sm" onClick={handleApply} className="flex-1">
					Apply
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={handleClear}
					className="flex-1"
				>
					Clear
				</Button>
			</div>
		</div>
	);
}

function FilterContent({
	filters,
	onFiltersChange,
	availableOptions,
}: Omit<ProductFiltersProps, "className">) {
	const activeFiltersCount =
		filters.categories.length +
		filters.sizes.length +
		filters.colors.length +
		filters.tags.length +
		(filters.priceRange ? 1 : 0) +
		(filters.availability !== "all" ? 1 : 0);

	const clearAllFilters = () => {
		onFiltersChange({
			categories: [],
			priceRange: null,
			sizes: [],
			colors: [],
			tags: [],
			availability: "all",
			sortBy: filters.sortBy,
		});
	};

	return (
		<div className="space-y-6">
			{/* Header with clear all */}
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-foreground">Filters</h3>
				{activeFiltersCount > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearAllFilters}
						className="text-xs text-muted-foreground hover:text-foreground"
					>
						Clear All ({activeFiltersCount})
					</Button>
				)}
			</div>

			{/* Categories */}
			{availableOptions.categories.length > 0 && (
				<FilterSection title="Categories">
					<CheckboxFilter
						options={availableOptions.categories}
						selectedValues={filters.categories}
						onChange={(categories) =>
							onFiltersChange({ ...filters, categories })
						}
					/>
				</FilterSection>
			)}

			{/* Price Range */}
			<FilterSection title="Price Range">
				<PriceRangeFilter
					value={filters.priceRange}
					onChange={(priceRange) =>
						onFiltersChange({ ...filters, priceRange })
					}
					min={availableOptions.priceRange.min}
					max={availableOptions.priceRange.max}
				/>
			</FilterSection>

			{/* Sizes */}
			{availableOptions.sizes.length > 0 && (
				<FilterSection title="Sizes">
					<CheckboxFilter
						options={availableOptions.sizes}
						selectedValues={filters.sizes}
						onChange={(sizes) =>
							onFiltersChange({ ...filters, sizes })
						}
					/>
				</FilterSection>
			)}

			{/* Colors */}
			{availableOptions.colors.length > 0 && (
				<FilterSection title="Colors">
					<CheckboxFilter
						options={availableOptions.colors}
						selectedValues={filters.colors}
						onChange={(colors) =>
							onFiltersChange({ ...filters, colors })
						}
					/>
				</FilterSection>
			)}

			{/* Availability */}
			<FilterSection title="Availability">
				<div className="space-y-2">
					{[
						{ value: "all", label: "All Products" },
						{ value: "in_stock", label: "In Stock" },
						{ value: "out_of_stock", label: "Out of Stock" },
					].map((option) => (
						<label
							key={option.value}
							className="flex items-center space-x-2 cursor-pointer group"
						>
							<input
								type="radio"
								name="availability"
								value={option.value}
								checked={filters.availability === option.value}
								onChange={(e) =>
									onFiltersChange({
										...filters,
										availability: e.target.value as
											| "all"
											| "in_stock"
											| "out_of_stock",
									})
								}
								className="text-primary focus:ring-primary focus:ring-offset-0 focus:ring-1"
							/>
							<span className="text-sm text-foreground group-hover:text-foreground/80 transition-colors">
								{option.label}
							</span>
						</label>
					))}
				</div>
			</FilterSection>

			{/* Tags */}
			{availableOptions.tags.length > 0 && (
				<FilterSection title="Tags" defaultOpen={false}>
					<CheckboxFilter
						options={availableOptions.tags}
						selectedValues={filters.tags}
						onChange={(tags) =>
							onFiltersChange({ ...filters, tags })
						}
					/>
				</FilterSection>
			)}
		</div>
	);
}

export function ProductFilters({
	filters,
	onFiltersChange,
	availableOptions,
	className,
}: ProductFiltersProps) {
	const activeFiltersCount =
		filters.categories.length +
		filters.sizes.length +
		filters.colors.length +
		filters.tags.length +
		(filters.priceRange ? 1 : 0) +
		(filters.availability !== "all" ? 1 : 0);

	return (
		<>
			{/* Desktop Sidebar */}
			<div className={cn("hidden lg:block w-80 pr-8", className)}>
				<div className="sticky top-6 bg-background border border-border rounded-lg p-6 shadow-sm">
					<FilterContent
						filters={filters}
						onFiltersChange={onFiltersChange}
						availableOptions={availableOptions}
					/>
				</div>
			</div>

			{/* Mobile Filter Button & Sheet */}
			<div className="lg:hidden">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" className="relative">
							<Filter className="h-4 w-4 mr-2" />
							Filters
							{activeFiltersCount > 0 && (
								<Badge
									variant="secondary"
									className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
								>
									{activeFiltersCount}
								</Badge>
							)}
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-full sm:w-80">
						<SheetHeader>
							<SheetTitle>Product Filters</SheetTitle>
						</SheetHeader>
						<div className="mt-6 overflow-y-auto">
							<FilterContent
								filters={filters}
								onFiltersChange={onFiltersChange}
								availableOptions={availableOptions}
							/>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
}

export default ProductFilters;
