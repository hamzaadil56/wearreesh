import Link from "next/link";
import { getCollections } from "@/lib/shopify";
import { Collection } from "@/lib/shopify/types";

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
						className="block rounded-lg p-3 transition-colors hover:bg-muted/50"
					>
						<div className="flex items-center space-x-3">
							{collection.image && (
								<div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
									<img
										src={collection.image.url}
										alt={
											collection.image.altText ||
											collection.title
										}
										className="h-full w-full object-cover"
									/>
								</div>
							)}
							<div className="flex-1 min-w-0">
								<h3 className="font-medium text-sm truncate">
									{collection.title}
								</h3>
								{collection.description && (
									<p className="text-xs text-muted-foreground truncate">
										{collection.description}
									</p>
								)}
							</div>
						</div>
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
				<div key={i} className="block rounded-lg p-3">
					<div className="flex items-center space-x-3">
						<div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
						<div className="flex-1 space-y-2">
							<div className="h-4 bg-muted rounded animate-pulse w-3/4" />
							<div className="h-3 bg-muted rounded animate-pulse w-1/2" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
