import { ProductCard } from "@/shared/components/cards/ProductCard";
import { ProductViewModel } from "@/shared/types/viewModels";
import React from "react";

const ProductsView = ({ products }: { products: ProductViewModel[] }) => {
	return (
		<div
			className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6"
			data-products-grid
			data-item-count={products.length}
		>
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
};

export default ProductsView;
