import { Suspense } from "react";
import {
	fetchProducts,
	ProductsViewModel,
	ProductsView,
	LoadingProducts,
} from "./components";

export default async function ProductsPage() {
	try {
		// Fetch data on the server side
		const productsData = await fetchProducts();

		// Create ViewModel instance
		const viewModel = new ProductsViewModel(productsData);

		return (
			// <Suspense fallback={<LoadingProducts />}>
			<ProductsView viewModel={viewModel} />
			// </Suspense>
		);
	} catch (error) {
		console.error("Error in ProductsPage:", error);

		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-6xl mb-4">⚠️</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						Something went wrong
					</h1>
					<p className="text-gray-600 mb-4">
						We're having trouble loading the products right now.
					</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
						Try Again
					</button>
				</div>
			</div>
		);
	}
}
