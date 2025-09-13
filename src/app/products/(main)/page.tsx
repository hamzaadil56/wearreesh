import { Suspense } from "react";
import { ProductRepository } from "@/models/product/ProductRepository";
import ProductsViewClient from "@/views/products/ProductsViewClient";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { mapToViewModel } from "@/shared/lib/utils";
import { ProductCard } from "@/shared/components/cards/ProductCard";
import ProductsView from "@/views/products/ProductsView";
import { SortDropdown } from "@/shared/components/layout/products/sort-dropdown";

export default async function ProductsPage(props: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const searchParams = await props.searchParams;
	const { sort, q: searchValue } = searchParams as { [key: string]: string };

	console.log(searchValue, "searchValue");

	try {
		// Optionally fetch initial data on the server for better SEO and initial load
		const repository = new ProductRepository();
		const initialData = await repository.search({
			pagination: {
				page: 1,
				limit: 20,
				sortBy: "TITLE",
				sortOrder: "asc",
			},
			query: searchValue,
		});

		// Map to view models for initial hydration
		const initialProducts = initialData.items.map(mapToViewModel);

		return (
			<div className="space-y-6">
				{/* Header with Item Count and Sort */}
				<div className="flex items-center justify-between">
					<p className="text-sm text-gray-600">
						{initialProducts.length} Items
					</p>
					<SortDropdown />
				</div>

				{/* Products Grid */}
				<Suspense fallback={<ProductsLoadingView />}>
					<ProductsView products={initialProducts} />
				</Suspense>
			</div>
		);
	} catch (error) {
		console.error("Error in ProductsPage:", error);

		return <ProductsLoadingView />;
	}
}

function ProductsLoadingView() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="bg-card rounded-lg shadow-sm border overflow-hidden"
				>
					<Skeleton className="aspect-square w-full" />
					<div className="p-4 space-y-3">
						<Skeleton className="h-6 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-6 w-24" />
					</div>
				</div>
			))}
		</div>
	);
}
