"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
	DEFAULT_PRODUCT_SORT_OPTION,
	PRODUCT_SORT_OPTIONS,
	ProductSortOption,
	getProductSortOption,
} from "@/shared/constants/productSort";

export function SortDropdown() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const selectedOption = useMemo(() => {
		return getProductSortOption(searchParams.get("sort") || undefined);
	}, [searchParams]);

	const handleSelect = useCallback(
		(option: ProductSortOption) => {
			if (option.value === selectedOption.value) {
				return;
			}

			const params = new URLSearchParams(searchParams.toString());

			if (option.value === DEFAULT_PRODUCT_SORT_OPTION.value) {
				params.delete("sort");
			} else {
				params.set("sort", option.value);
			}

			const queryString = params.toString();
			router.replace(
				queryString ? `${pathname}?${queryString}` : pathname,
				{
					scroll: false,
				}
			);
		},
		[pathname, router, searchParams, selectedOption.value]
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
				{selectedOption.label}
				<ChevronDown className="w-4 h-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{PRODUCT_SORT_OPTIONS.map((option) => (
					<DropdownMenuItem
						key={option.value}
						onClick={() => handleSelect(option)}
						className={
							selectedOption.value === option.value
								? "font-medium text-foreground"
								: ""
						}
					>
						{option.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
