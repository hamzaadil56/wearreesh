import { Skeleton } from "@/shared/components/ui/skeleton";

export function SearchResultsSkeleton() {
	return (
		<div>
			{/* Results Count Skeleton */}
			<div className="mb-6">
				<Skeleton className="h-5 w-32" />
			</div>

			{/* Products Grid Skeleton */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className="space-y-3">
						<Skeleton className="aspect-square w-full rounded-lg" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-6 w-20" />
					</div>
				))}
			</div>
		</div>
	);
}
