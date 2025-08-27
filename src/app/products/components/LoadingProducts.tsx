export default function LoadingProducts() {
	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header Skeleton */}
				<div className="text-center mb-12">
					<div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
					<div className="h-6 bg-gray-200 rounded w-96 mx-auto mb-2 animate-pulse"></div>
					<div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
				</div>

				{/* Products Grid Skeleton */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{Array.from({ length: 8 }).map((_, index) => (
						<div
							key={index}
							className="bg-white rounded-lg shadow-sm overflow-hidden"
						>
							<div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 animate-pulse"></div>
							<div className="p-4">
								<div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
								<div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
								<div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
								<div className="flex items-center justify-between">
									<div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
									<div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
