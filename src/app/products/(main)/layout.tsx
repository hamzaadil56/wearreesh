import { ReactNode, Suspense } from "react";
import { ProductRepository } from "@/models/product/ProductRepository";
import ProductLayoutWrapper from "./ProductLayoutWrapper";
import { ProductsFilter } from "@/shared/components/layout";

interface ProductsLayoutProps {
	children: ReactNode;
}

export default async function ProductsLayout({
	children,
}: ProductsLayoutProps) {
	// Fetch options data on the server for the filter
	let optionsData: Array<{
		name: string;
		values: Array<{ value: string; count: number }>;
	}> = [];

	try {
		const repository = new ProductRepository();
		const options = await repository.getProductsOptions();
		optionsData = options.options || [];
	} catch (error) {
		return <div>Error fetching options data</div>;
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-6">
			<div className="flex gap-6">
				{/* Left Sidebar - Filter Section */}
				<div className="w-64 flex-shrink-0">
					<Suspense
						fallback={
							<div className="w-64 h-96 bg-gray-100 animate-pulse rounded-lg" />
						}
					>
						<ProductsFilter optionsData={optionsData} />
					</Suspense>
				</div>

				{/* Main Content Area */}
				<div className="flex-1">
					<Suspense
						fallback={
							<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
						}
					>
						<ProductLayoutWrapper>{children}</ProductLayoutWrapper>
					</Suspense>
				</div>
			</div>
		</div>
	);
}
