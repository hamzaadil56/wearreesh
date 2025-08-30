"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchInputProps {
	placeholder?: string;
	className?: string;
	onSearch?: (query: string) => void;
}

export function SearchInput({
	placeholder = "Search...",
	className,
	onSearch,
}: SearchInputProps) {
	const [query, setQuery] = useState("");

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
				className={cn("pl-10", query && "pr-10")}
				value={query}
				onChange={(e) => handleSearch(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			{query && (
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
