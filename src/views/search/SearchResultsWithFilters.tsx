import { ProductRepository } from "@/models/product/ProductRepository";
import { mapToViewModel } from "@/shared/lib/utils";
import { ResponsiveProductsLayout } from "@/shared/components/layout/products/ResponsiveProductsLayout";
import { ProductCard } from "@/shared/components/cards";
import { SearchEmptyState } from "./SearchEmptyState";

interface SearchResultsWithFiltersProps {
	query?: string;
}

export async function SearchResultsWithFilters({
	query,
}: SearchResultsWithFiltersProps) {
	const repository = new ProductRepository();

	// Fetch filter options first
	const optionsResult = await repository.getProductsOptions();
	const optionsData = optionsResult.options || [];

	// If no query, show empty state with filters
	if (!query || query.trim() === "") {
		return (
			<ResponsiveProductsLayout optionsData={optionsData} itemCount={0}>
				<SearchEmptyState type="no-query" />
			</ResponsiveProductsLayout>
		);
	}

	// Fetch products with search query
	const result = await repository.search({
		query: query,
	});

	const products = result.items;

	// If no results found, show empty state with filters
	if (products.length === 0) {
		return (
			<ResponsiveProductsLayout optionsData={optionsData} itemCount={0}>
				<SearchEmptyState type="no-results" query={query} />
			</ResponsiveProductsLayout>
		);
	}

	// Render products with correct item count
	return (
		<ResponsiveProductsLayout
			optionsData={optionsData}
			itemCount={products.length}
		>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={mapToViewModel(product)}
					/>
				))}
			</div>
		</ResponsiveProductsLayout>
	);
}
