import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ProductsLoadingView() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="bg-card rounded-lg shadow-sm border overflow-hidden"
				>
					<Skeleton className="aspect-square w-full" />
					<div className="p-4 space-y-3">
						<Skeleton className="h-6 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-6 w-24" />
					</div>
				</div>
			))}
		</div>
	);
}
