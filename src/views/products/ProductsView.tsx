import { ProductCard } from "@/shared/components/cards/ProductCard";
import { ProductViewModel } from "@/shared/types/viewModels";
import React from "react";

const ProductsView = ({ products }: { products: ProductViewModel[] }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
};

export default ProductsView;
