import { ReactNode, Suspense } from "react";
import { ProductRepository } from "@/models/product/ProductRepository";
import ProductLayoutWrapper from "./ProductLayoutWrapper";
import { ProductsLayoutClient } from "@/shared/components/layout/products/ProductsLayoutClient";

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
		<Suspense
			fallback={
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
				</div>
			}
		>
			<ProductsLayoutClient optionsData={optionsData}>
				<ProductLayoutWrapper>{children}</ProductLayoutWrapper>
			</ProductsLayoutClient>
		</Suspense>
	);
}
