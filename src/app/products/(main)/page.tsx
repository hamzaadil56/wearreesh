import { Suspense } from "react";
import { ProductRepository } from "@/models/product/ProductRepository";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { mapToViewModel } from "@/shared/lib/utils";
import ProductsView from "@/views/products/ProductsView";

export default async function ProductsPage(props: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const searchParams = await props.searchParams;
	const { q: searchValue } = searchParams as { [key: string]: string };

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
			<Suspense fallback={<ProductsLoadingView />}>
				<ProductsView products={initialProducts} />
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
