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
		<div className="flex gap-8">
			<Suspense>
				<ProductsFilter optionsData={optionsData} />
				<ProductLayoutWrapper>{children}</ProductLayoutWrapper>
			</Suspense>
		</div>
	);
}
