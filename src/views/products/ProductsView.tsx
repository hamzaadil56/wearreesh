import { ProductViewModel } from "@/shared/types/viewModels";
import { FilteredProductsView } from "./FilteredProductsView";
import React from "react";

interface ProductsViewProps {
	products: ProductViewModel[];
	optionsData?: Array<{
		name: string;
		values: Array<{ value: string; count: number }>;
	}>;
}

const ProductsView = ({ products, optionsData = [] }: ProductsViewProps) => {
	return (
		<FilteredProductsView products={products} optionsData={optionsData} />
	);
};

export default ProductsView;
