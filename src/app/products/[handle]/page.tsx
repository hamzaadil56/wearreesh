import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductRepository } from "@/models/product/ProductRepository";
import ProductViewClient from "@/views/products/ProductViewClient";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ProductViewModel } from "@/shared/types/viewModels";
import { mapToViewModel } from "@/shared/lib/utils";

interface ProductPageProps {
	params: {
		handle: string;
	};
}

export async function getProductData({
	params,
}: ProductPageProps): Promise<ProductViewModel | null> {
	const repository = new ProductRepository();
	const product = await repository.findByHandle(params.handle);

	if (!product) {
		return null;
	}

	return mapToViewModel(product);
}

export default async function ProductPage({ params }: ProductPageProps) {
	try {
		const product = await getProductData({ params });
		if (!product) {
			notFound();
		}

		return (
			<Suspense fallback={<ProductLoadingView />}>
				<ProductViewClient product={product} />
			</Suspense>
		);
	} catch (error) {
		console.error("Error in ProductPage:", error);
		notFound();
	}
}

function ProductLoadingView() {
	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Image Gallery Skeleton */}
					<div className="space-y-4">
						<Skeleton className="aspect-square w-full rounded-lg" />
						<div className="grid grid-cols-4 gap-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton
									key={i}
									className="aspect-square rounded-md"
								/>
							))}
						</div>
					</div>

					{/* Product Info Skeleton */}
					<div className="space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-8 w-3/4" />
							<Skeleton className="h-6 w-1/2" />
						</div>
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-2/3" />
						<Skeleton className="h-4 w-1/2" />

						<div className="space-y-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>

						<Skeleton className="h-12 w-full" />
					</div>
				</div>
			</div>
		</div>
	);
}
