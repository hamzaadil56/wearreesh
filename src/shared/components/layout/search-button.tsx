"use client";

import { useFormStatus } from "react-dom";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function SearchButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" size="sm" className="h-9 px-3" disabled={pending}>
			{pending ? (
				<>
					<Loader2 className="h-4 w-4 mr-2 animate-spin" />
					<span className="hidden sm:inline">Searching...</span>
				</>
			) : (
				<>
					<Search className="h-4 w-4 sm:mr-2" />
					<span className="hidden sm:inline">Search</span>
				</>
			)}
		</Button>
	);
}
