import { Filter, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

interface FilteredEmptyStateProps {
	onClearFilters?: () => void;
}

export function FilteredEmptyState({
	onClearFilters,
}: FilteredEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 sm:py-24">
			<div className="bg-muted rounded-full p-6 mb-6">
				<Filter className="h-12 w-12 text-muted-foreground" />
			</div>
			<h2 className="text-xl sm:text-2xl font-semibold mb-3">
				No Products Found
			</h2>
			<p className="text-sm sm:text-base text-muted-foreground max-w-md text-center mb-2">
				We couldn't find any products matching your selected filters.
			</p>
			<p className="text-xs sm:text-sm text-muted-foreground mb-6">
				Try adjusting your filters or browse our full collection
			</p>
			<div className="flex gap-3">
				{onClearFilters && (
					<Button variant="outline" onClick={onClearFilters}>
						<X className="h-4 w-4 mr-2" />
						Clear Filters
					</Button>
				)}
				<Button asChild>
					<Link href="/products">Browse All Products</Link>
				</Button>
			</div>
		</div>
	);
}
