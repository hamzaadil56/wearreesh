import { ProductCard } from "@/shared/components/cards/ProductCard";
import { ProductViewModel } from "@/shared/types/viewModels";
import React, { useMemo } from "react";
import ProductsFilter from "@/shared/components/layout/products-filter";
import { ProductRepository } from "@/models/product/ProductRepository";

const ProductsView = async ({ products }: { products: ProductViewModel[] }) => {
	const repository = new ProductRepository();
	const optionsData = await repository.getProductsOptions();

	console.log(optionsData);
	// Convert ProductViewModel to format expected by ProductsFilter

	return (
		<>
			<ProductsFilter optionsData={optionsData.options} />

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</>
	);
};

export default ProductsView;
