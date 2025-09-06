"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface SearchProps {
	placeholder?: string;
	className?: string;
	onSearch?: (query: string) => void;
	showClearButton?: boolean;
}

export function SearchComponent({
	placeholder = "Search...",
	className,
	onSearch,
	showClearButton = true,
}: SearchProps) {
	const [query, setQuery] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	const handleSearch = (searchQuery: string) => {
		setQuery(searchQuery);
		onSearch?.(searchQuery);
	};

	const clearSearch = () => {
		setQuery("");
		onSearch?.("");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			onSearch?.(query);
		}
	};

	return (
		<div className={cn("relative", className)}>
			<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="search"
				placeholder={placeholder}
				className={cn(
					"pl-10",
					showClearButton && query && "pr-10",
					isFocused && "ring-2 ring-ring ring-offset-2"
				)}
				value={query}
				onChange={(e) => handleSearch(e.target.value)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				onKeyDown={handleKeyDown}
			/>
			{showClearButton && query && (
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
					onClick={clearSearch}
				>
					<X className="h-3 w-3" />
					<span className="sr-only">Clear search</span>
				</Button>
			)}
		</div>
	);
}

// Simple search hook for managing search state
export function useSearch(initialQuery = "") {
	const [query, setQuery] = useState(initialQuery);
	const [isSearching, setIsSearching] = useState(false);

	const handleSearch = async (searchQuery: string) => {
		setQuery(searchQuery);
		if (searchQuery.trim()) {
			setIsSearching(true);
			// Here you would typically make an API call
			// For now, we'll just simulate a delay
			setTimeout(() => setIsSearching(false), 500);
		} else {
			setIsSearching(false);
		}
	};

	return {
		query,
		isSearching,
		handleSearch,
		clearSearch: () => handleSearch(""),
	};
}
