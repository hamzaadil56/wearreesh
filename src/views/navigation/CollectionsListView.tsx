import Link from "next/link";
import {
	NavigationViewModel,
	CollectionViewModel,
} from "@/viewmodels/navigation/NavigationViewModel";

interface CollectionsListViewProps {
	viewModel: NavigationViewModel;
}

export async function CollectionsListView({
	viewModel,
}: CollectionsListViewProps) {
	const { collections } = viewModel.viewState;
	const { loading, error } = viewModel.state;

	if (loading) {
		return <CollectionsListSkeleton />;
	}

	if (error) {
		return (
			<div className="flex items-center justify-center py-8">
				<p className="text-destructive text-sm">
					{error || "Failed to load collections. Please try again."}
				</p>
			</div>
		);
	}

	if (!collections || collections.length === 0) {
		return (
			<div className="flex items-center justify-center py-8">
				<p className="text-muted-foreground">No collections found</p>
			</div>
		);
	}

	return (
		<div className="space-y-1">
			{collections.map((collection) => (
				<CollectionLink key={collection.id} collection={collection} />
			))}
		</div>
	);
}

interface CollectionLinkProps {
	collection: CollectionViewModel;
}

function CollectionLink({ collection }: CollectionLinkProps) {
	return (
		<Link
			href={collection.path}
			className="block py-3 px-2 text-lg font-medium transition-colors hover:text-foreground hover:underline underline-offset-4 text-foreground/80"
		>
			{collection.title}
		</Link>
	);
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
