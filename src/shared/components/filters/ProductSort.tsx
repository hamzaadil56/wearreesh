"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import type { ProductFilters } from "@/shared/types/filters";

interface ProductSortProps {
	sortBy: ProductFilters["sortBy"];
	onSortChange: (sortBy: ProductFilters["sortBy"]) => void;
	className?: string;
}

const sortOptions = [
	{ value: "title", label: "Name (A-Z)" },
	{ value: "price_low_to_high", label: "Price (Low to High)" },
	{ value: "price_high_to_low", label: "Price (High to Low)" },
	{ value: "newest", label: "Newest" },
	{ value: "oldest", label: "Oldest" },
] as const;

export function ProductSort({
	sortBy,
	onSortChange,
	className,
}: ProductSortProps) {
	const currentSortLabel =
		sortOptions.find((option) => option.value === sortBy)?.label ||
		"Name (A-Z)";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className={className}>
					Sort by: {currentSortLabel}
					<ChevronDown className="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				{sortOptions.map((option) => (
					<DropdownMenuItem
						key={option.value}
						onClick={() => onSortChange(option.value)}
						className={sortBy === option.value ? "bg-accent" : ""}
					>
						{option.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default ProductSort;
