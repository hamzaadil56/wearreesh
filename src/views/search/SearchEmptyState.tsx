import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

interface SearchEmptyStateProps {
	type: "no-query" | "no-results";
	query?: string;
}

export function SearchEmptyState({ type, query }: SearchEmptyStateProps) {
	if (type === "no-query") {
		return (
			<div className="flex flex-col items-center justify-center py-16 sm:py-24">
				<div className="bg-muted rounded-full p-6 mb-6">
					<Search className="h-12 w-12 text-muted-foreground" />
				</div>
				<h2 className="text-xl sm:text-2xl font-semibold mb-3">
					Start Your Search
				</h2>
				<p className="text-sm sm:text-base text-muted-foreground max-w-md text-center mb-6">
					Enter keywords in the search bar above to find products
					you're looking for.
				</p>
				<Button asChild>
					<Link href="/products">Browse All Products</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center py-16 sm:py-24">
			<div className="bg-muted rounded-full p-6 mb-6">
				<Search className="h-12 w-12 text-muted-foreground" />
			</div>
			<h2 className="text-xl sm:text-2xl font-semibold mb-3">
				No Products Found
			</h2>
			<p className="text-sm sm:text-base text-muted-foreground max-w-md text-center mb-2">
				We couldn't find any products matching{" "}
				<span className="font-medium text-foreground">"{query}"</span>
			</p>
			<p className="text-xs sm:text-sm text-muted-foreground mb-6">
				Try different keywords or browse our collections
			</p>
			<div className="flex gap-3">
				<Button variant="outline" asChild>
					<Link href="/products">Browse All Products</Link>
				</Button>
				<Button asChild>
					<Link href="/">Go Home</Link>
				</Button>
			</div>
		</div>
	);
}
