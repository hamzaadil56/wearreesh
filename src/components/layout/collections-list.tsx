import Link from "next/link";
import { getCollections } from "@/lib/shopify";

export async function CollectionsList() {
	try {
		const collections = await getCollections();

		if (!collections || collections.length === 0) {
			return (
				<div className="flex items-center justify-center py-8">
					<p className="text-muted-foreground">
						No collections found
					</p>
				</div>
			);
		}

		return (
			<div className="space-y-1">
				{collections.map((collection) => (
					<Link
						key={collection.handle || collection?.id || ""}
						href={
							collection.handle
								? `/search/${collection.handle}`
								: "/search"
						}
						className="block py-3 px-2 text-lg font-medium transition-colors hover:text-foreground hover:underline underline-offset-4 text-foreground/80"
					>
						{collection.title}
					</Link>
				))}
			</div>
		);
	} catch (error) {
		console.error("Error fetching collections:", error);
		return (
			<div className="flex items-center justify-center py-8">
				<p className="text-destructive text-sm">
					Failed to load collections. Please try again.
				</p>
			</div>
		);
	}
}

// Loading component for Suspense
export function CollectionsListSkeleton() {
	return (
		<div className="space-y-1">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="py-3 px-2">
					<div className="h-6 bg-muted rounded animate-pulse w-3/4" />
				</div>
			))}
		</div>
	);
}
