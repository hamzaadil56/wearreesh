"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function SortDropdown({
	setSortBy,
}: {
	setSortBy: (sortBy: string) => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
				Sort By
				<ChevronDown className="w-4 h-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setSortBy("Relevance")}>
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
				<DropdownMenuItem onClick={() => setSortBy("Newest")}>
					Newest
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setSortBy("Best Selling")}>
					Best Selling
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
