import { ProductRepository } from "@/models/product/ProductRepository";
import { mapToViewModel } from "@/shared/lib/utils";
import { ProductCard } from "@/shared/components/cards";
import { SearchEmptyState } from "./SearchEmptyState";

interface SearchResultsContentProps {
	query?: string;
}

export async function SearchResultsContent({
	query,
}: SearchResultsContentProps) {
	// If no query, show empty state
	if (!query || query.trim() === "") {
		return <SearchEmptyState type="no-query" />;
	}

	// Fetch products with the search query
	const repository = new ProductRepository();
	const result = await repository.search({
		query: query,
	});

	const products = result.items;

	// If no results found, show empty state
	if (products.length === 0) {
		return <SearchEmptyState type="no-results" query={query} />;
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={mapToViewModel(product)}
				/>
			))}
		</div>
	);
}
