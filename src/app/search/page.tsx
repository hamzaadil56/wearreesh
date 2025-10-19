import { SearchResultsWithFilters } from "@/views/search/SearchResultsWithFilters";

interface SearchPageProps {
	searchParams: Promise<{ query?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
	const { query } = await searchParams;
	return {
		title: query ? `Search results for "${query}"` : "Search",
		description: query
			? `Browse our products matching "${query}"`
			: "Search for products",
	};
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const { query } = await searchParams;

	return (
		<div className="py-4 sm:py-6">
			{/* Search Header */}
			<div className="container mx-auto px-4 mb-6">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">
					{query
						? `Search results for "${query}"`
						: "Search Products"}
				</h1>
				{query && (
					<p className="text-sm sm:text-base text-muted-foreground">
						Showing results matching your search
					</p>
				)}
			</div>

			{/* Search Results with Filters - Suspense is inside the component */}
			<SearchResultsWithFilters query={query} />
		</div>
	);
}
