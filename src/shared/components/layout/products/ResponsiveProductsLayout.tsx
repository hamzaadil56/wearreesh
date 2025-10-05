"use client";

import React, { ReactNode, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui/sheet";
import { ProductsFilter } from "@/shared/components/layout/products/products-filter";
import { SortDropdown } from "@/shared/components/layout/products/sort-dropdown";
import { cn } from "@/shared/lib/utils";

interface ResponsiveProductsLayoutProps {
	children: ReactNode;
	optionsData: Array<{
		name: string;
		values: Array<{ value: string; count: number }>;
	}>;
	itemCount: number;
}

export function ResponsiveProductsLayout({
	children,
	optionsData,
	itemCount,
}: ResponsiveProductsLayoutProps) {
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	return (
		<div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
			{/* Desktop Layout */}
			<div className="hidden lg:flex gap-6">
				{/* Left Sidebar - Filter Section (Desktop Only) */}
				<div className="w-64 flex-shrink-0">
					<ProductsFilter optionsData={optionsData} />
				</div>

				{/* Main Content Area */}
				<div className="flex-1">
					<div className="space-y-6">
						{/* Header with Item Count and Sort */}
						<div className="flex items-center justify-between">
							<p className="text-sm text-gray-600">
								{itemCount} Items
							</p>
							<SortDropdown />
						</div>
						{children}
					</div>
				</div>
			</div>

			{/* Mobile/Tablet Layout */}
			<div className="lg:hidden">
				<div className="space-y-4 sm:space-y-6">
					{/* Header with Item Count and Sort (Mobile) */}
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-600 font-medium">
							{itemCount} Items
						</p>
						<div className="flex items-center gap-2">
							{/* Mobile Sort - Simplified for tablets only */}
							<div className="hidden sm:block md:hidden">
								<SortDropdown />
							</div>
						</div>
					</div>

					{/* Products Content */}
					<div className="relative pb-20">{children}</div>
				</div>

				{/* Fixed Filter Button (Mobile/Tablet) */}
				<div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-40">
					<Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
						<SheetTrigger asChild>
							<Button
								size="lg"
								className={cn(
									"bg-black text-white hover:bg-gray-800 shadow-xl",
									"px-4 sm:px-6 py-3 rounded-full flex items-center gap-2",
									"transition-all duration-200 hover:scale-105",
									"text-sm sm:text-base font-medium"
								)}
							>
								<Filter className="w-4 h-4" />
								<span className="hidden sm:inline">
									Filter & Sort
								</span>
								<span className="sm:hidden">Filter</span>
							</Button>
						</SheetTrigger>
						<SheetContent
							side="bottom"
							className="h-[85vh] overflow-hidden flex flex-col rounded-t-2xl"
						>
							<SheetHeader className="border-b pb-4 px-4 pt-6">
								<SheetTitle className="text-lg font-semibold text-left">
									Filter & Sort
								</SheetTitle>
							</SheetHeader>

							<div className="flex-1 overflow-y-auto py-4 px-4">
								<div className="space-y-6">
									{/* Sort Section (Mobile) */}
									<div className="space-y-3">
										<h3 className="font-medium text-base">
											Sort By
										</h3>
										<div className="bg-gray-50 rounded-xl p-4">
											<SortDropdown />
										</div>
									</div>

									{/* Filter Section */}
									<div className="space-y-3">
										<h3 className="font-medium text-base">
											Filters
										</h3>
										<div className="bg-gray-50 rounded-xl p-4">
											<ProductsFilter
												optionsData={optionsData}
												className="bg-transparent border-none p-0 max-w-none"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Footer with Apply Button */}
							<div className="border-t pt-4 pb-6 px-4 bg-white">
								<Button
									onClick={() => setIsFilterOpen(false)}
									className="w-full bg-black text-white hover:bg-gray-800 rounded-xl"
									size="lg"
								>
									Apply Filters
								</Button>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</div>
	);
}
