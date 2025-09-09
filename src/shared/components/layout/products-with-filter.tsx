"use client";

import React, { useState, useMemo } from "react";
import { ProductsFilter } from "./products-filter";
import { ProductCard } from "@/shared/components/cards";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { ProductViewModel } from "@/shared/types/viewModels";
import type { FilterState } from "@/shared/types/filters";

interface ProductsWithFilterProps {
	products: ProductViewModel[];
	totalCount: number;
	isLoading?: boolean;
}

interface EmptyProductsViewProps {
	hasFilters?: boolean;
}

function EmptyProductsView({ hasFilters }: EmptyProductsViewProps) {
	return (
		<div className="text-center py-12">
			<div className="text-muted-foreground text-6xl mb-4">
				{hasFilters ? "🔍" : "📦"}
			</div>
			<h3 className="text-lg font-medium text-foreground mb-2">
				{hasFilters
					? "No products match your filters"
					: "No products found"}
			</h3>
			<p className="text-muted-foreground">
				{hasFilters
					? "Try adjusting your filters to see more products."
					: "We couldn't find any products at the moment."}
			</p>
		</div>
	);
}

export function ProductsWithFilter({ products }: ProductsWithFilterProps) {
	const [activeFilters, setActiveFilters] = useState<FilterState>({});
	const [sortBy, setSortBy] = useState("Relevance");

	// Convert ProductViewModel to format expected by ProductsFilter
	const productsForFilter = useMemo(() => {
		return products.map((product) => ({
			id: product.id,
			options: product.options || [],
			availableForSale: product.availableForSale,
			priceRange: {
				minVariantPrice: { amount: product.price },
				maxVariantPrice: { amount: product.price },
			},
		}));
	}, [products]);

	// Apply filters to products
	const filteredProducts = useMemo(() => {
		if (Object.keys(activeFilters).length === 0) {
			return products;
		}

		return products.filter((product) => {
			// Apply availability filter
			if (
				activeFilters.available &&
				activeFilters.available.includes("true")
			) {
				if (!product.availableForSale) return false;
			}

			// Apply option filters
			for (const [optionName, selectedValues] of Object.entries(
				activeFilters
			)) {
				if (optionName === "available" || selectedValues.length === 0)
					continue;

				// Check if the product has this option with any of the selected values
				const hasMatchingOption = product.options?.some(
					(option) =>
						option.name === optionName &&
						option.values.some((value) =>
							selectedValues.includes(value)
						)
				);

				if (!hasMatchingOption) return false;
			}

			return true;
		});
	}, [products, activeFilters]);

	const hasActiveFilters = Object.keys(activeFilters).length > 0;

	return (
		<div className="flex gap-8">
			{/* Sidebar Filters */}
			<div className="w-80 flex-shrink-0">
				<ProductsFilter
					products={productsForFilter}
					onFilterChange={setActiveFilters}
				/>
			</div>

			{/* Main Content */}
			<div className="flex-1 space-y-6">
				{/* Results Header */}
				<div className="flex items-center justify-between">
					<p className="text-sm text-gray-600">
						{filteredProducts.length} Items
					</p>

					{/* Sort Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
							Sort By
							<ChevronDown className="w-4 h-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => setSortBy("Relevance")}
							>
								Relevance
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSortBy("Price: Low to High")}
							>
								Price: Low to High
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSortBy("Price: High to Low")}
							>
								Price: High to Low
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSortBy("Newest")}
							>
								Newest
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSortBy("Best Selling")}
							>
								Best Selling
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Products Grid */}
				{filteredProducts.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				) : (
					<EmptyProductsView hasFilters={hasActiveFilters} />
				)}
			</div>
		</div>
	);
}

export default ProductsWithFilter;
