import { ProductRepository } from "@/models/product/ProductRepository";
import { mapToViewModel } from "@/shared/lib/utils";
import { ProductCard } from "@/shared/components/cards";
import { SearchEmptyState } from "./SearchEmptyState";

interface SearchResultsViewProps {
	query?: string;
}

export async function SearchResultsView({ query }: SearchResultsViewProps) {
	// If no query, show empty state
	if (!query || query.trim() === "") {
		return <SearchEmptyState type="no-query" />;
	}

	// Fetch products server-side using ProductRepository
	const repository = new ProductRepository();
	const result = await repository.search({
		query: query,
	});

	const products = result.items;

	// If no results found
	if (products.length === 0) {
		return <SearchEmptyState type="no-results" query={query} />;
	}

	return (
		<div>
			{/* Results Count */}
			<div className="mb-6">
				<p className="text-sm text-muted-foreground">
					Found{" "}
					<span className="font-semibold text-foreground">
						{products.length}
					</span>{" "}
					{products.length === 1 ? "product" : "products"}
				</p>
			</div>

			{/* Products Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={mapToViewModel(product)}
					/>
				))}
			</div>
		</div>
	);
}
