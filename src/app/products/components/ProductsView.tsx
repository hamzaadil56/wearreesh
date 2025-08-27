import { ProductViewModel, ProductsViewModel } from "./ProductsViewModel";
import Link from "next/link";
import Image from "next/image";

interface ProductsViewProps {
	viewModel: ProductsViewModel;
}

export default function ProductsView({ viewModel }: ProductsViewProps) {
	const products = viewModel.getProducts();
	const totalCount = viewModel.getTotalCount();
	const displayedCount = viewModel.getProductsCount();

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				{/* <div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Our Products
					</h1>
					<p className="text-lg text-gray-600">
						Discover our amazing collection of{" "}
						{totalCount || "many"} products
					</p>
					{totalCount > 0 && (
						<p className="text-sm text-gray-500 mt-2">
							Showing {displayedCount} of {totalCount} products
						</p>
					)}
				</div> */}

				{/* Products Grid */}
				{products.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								viewModel={viewModel}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<div className="text-gray-400 text-6xl mb-4">📦</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No products found
						</h3>
						<p className="text-gray-500">
							We couldn't find any products at the moment.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

interface ProductCardProps {
	product: ProductViewModel;
	viewModel: ProductsViewModel;
}

function ProductCard({ product, viewModel }: ProductCardProps) {
	const formattedPrice = viewModel.formatPrice(
		product.price,
		product.currencyCode
	);

	return (
		<Link
			href={`/products/${product.handle}`}
			className="group bg-black rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
		>
			<Image
				width={500}
				height={500}
				src={product.imageUrl}
				alt={product.imageAlt}
				className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
			/>

			<div className="p-4">
				<h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
					{product.title}
				</h3>

				<p className="text-sm text-gray-600 mb-3 line-clamp-2">
					{product.shortDescription}
				</p>

				<div className="flex items-center justify-between">
					<span className="text-xl font-bold text-blue-600">
						{formattedPrice}
					</span>

					<div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
						View Details
					</div>
				</div>
			</div>
		</Link>
	);
}
