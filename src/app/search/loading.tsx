import { Skeleton } from "@/shared/components/ui/skeleton";

export default function SearchLoading() {
	return (
		<div className="py-4 sm:py-6">
			{/* Header Skeleton */}
			<div className="container mx-auto px-4 mb-6">
				<Skeleton className="h-8 sm:h-9 w-48 sm:w-64 mb-2" />
				<Skeleton className="h-4 sm:h-5 w-64 sm:w-96" />
			</div>

			{/* Products Layout Skeleton */}
			<div className="max-w-7xl mx-auto px-3 sm:px-4">
				<div className="hidden lg:flex gap-6">
					{/* Filter Sidebar Skeleton */}
					<div className="w-64 flex-shrink-0">
						<Skeleton className="h-96 w-full rounded-lg" />
					</div>

					{/* Products Grid Skeleton */}
					<div className="flex-1">
						<div className="mb-4 flex justify-between">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-10 w-32" />
						</div>
						<div className="grid grid-cols-3 gap-6">
							{Array.from({ length: 9 }).map((_, i) => (
								<div key={i} className="space-y-3">
									<Skeleton className="aspect-square w-full rounded-lg" />
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-6 w-20" />
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Mobile/Tablet Skeleton */}
				<div className="lg:hidden">
					<div className="mb-4 flex justify-between gap-2">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 flex-1" />
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="space-y-3">
								<Skeleton className="aspect-square w-full rounded-lg" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-6 w-20" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
