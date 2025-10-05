"use client";

import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
	"Relevance",
	"Price: Low to High",
	"Price: High to Low",
	"Newest",
	"Best Selling",
];

export function SortDropdown() {
	const [sortBy, setSortBy] = useState<string>("");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
				{sortBy ? sortBy : "Sort By"}
				<ChevronDown className="w-4 h-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{SORT_OPTIONS.map((option) => (
					<DropdownMenuItem
						key={option}
						onClick={() => setSortBy(option)}
					>
						{option}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
