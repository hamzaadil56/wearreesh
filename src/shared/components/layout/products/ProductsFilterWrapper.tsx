import { ProductRepository } from "@/models/product/ProductRepository";
import { ProductsFilter } from "@/shared/components/layout";

interface ProductsFilterWrapperProps {
	className?: string;
}

export default async function ProductsFilterWrapper({
	className,
}: ProductsFilterWrapperProps) {
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
		console.error("Error fetching options data:", error);
		// Return empty filter or error state
		return (
			<div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-4">
				<p className="text-sm text-gray-500">Unable to load filters</p>
			</div>
		);
	}

	return <ProductsFilter optionsData={optionsData} className={className} />;
}
