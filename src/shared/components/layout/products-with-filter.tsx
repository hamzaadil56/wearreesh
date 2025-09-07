"use client";

import React, { useState, useMemo } from "react";
import { ProductsFilter } from "./products-filter";
import { ProductCard } from "@/shared/components/cards";
import type { ProductViewModel } from "@/viewmodels/products/ProductsViewModel";
import type { FilterState } from "@/shared/types/filters";

interface ProductsWithFilterProps {
	products: ProductViewModel[];
	totalCount: number;
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

export function ProductsWithFilter({
	products,
	totalCount,
}: ProductsWithFilterProps) {
	const [activeFilters, setActiveFilters] = useState<FilterState>({});

	// Convert ProductViewModel to format expected by ProductsFilter
	const productsForFilter = useMemo(() => {
		return products.map((product) => ({
			id: product.id,
			// Use the actual options from the ProductViewModel
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
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<p className="text-sm text-muted-foreground">
						Showing {filteredProducts.length} of {totalCount}{" "}
						products
					</p>

					{/* Sort functionality can be added here if needed */}
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
