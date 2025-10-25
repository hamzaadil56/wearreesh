import { Suspense } from "react";
import { ProductRepository } from "@/models/product/ProductRepository";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { mapToViewModel } from "@/shared/lib/utils";
import ProductsView from "@/views/products/ProductsView";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductsPage(props: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const searchParams = await props.searchParams;
	const { q: searchValue } = searchParams as { [key: string]: string };
	console.log("searchValue", searchValue);

	try {
		// Fetch initial data and options data on the server
		const repository = new ProductRepository();

		// Fetch products
		const initialData = await repository.search({
			pagination: {
				page: 1,
				limit: 100, // Fetch more products for client-side filtering
				sortBy: "TITLE",
				sortOrder: "asc",
			},
			query: searchValue,
		});

		// Fetch options data for filtering
		const optionsResult = await repository.getProductsOptions();
		const optionsData = optionsResult.options || [];

		// Map to view models for initial hydration
		const initialProducts = initialData.items.map(mapToViewModel);

		return (
			<Suspense fallback={<ProductsLoadingView />}>
				<ProductsView
					products={initialProducts}
					optionsData={optionsData}
				/>
			</Suspense>
		);
	} catch (error) {
		console.error("Error in ProductsPage:", error);

		return <ProductsLoadingView />;
	}
}

function ProductsLoadingView() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
			{Array.from({ length: 8 }).map((_, i) => (
				<div
					key={i}
					className="bg-card rounded-lg shadow-sm border overflow-hidden"
				>
					<Skeleton className="aspect-square w-full" />
					<div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
						<Skeleton className="h-4 sm:h-6 w-full" />
						<Skeleton className="h-3 sm:h-4 w-3/4" />
						<Skeleton className="h-4 sm:h-6 w-16 sm:w-24" />
					</div>
				</div>
			))}
		</div>
	);
}
