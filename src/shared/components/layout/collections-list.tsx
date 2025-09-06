import { NavigationViewModel } from "@/viewmodels/navigation/NavigationViewModel";
import { CollectionRepository } from "@/models/collection/CollectionRepository";
import { CollectionsListView } from "@/views/navigation/CollectionsListView";

export async function CollectionsList() {
	try {
		// Create repository and ViewModel instances
		const repository = new CollectionRepository();
		const viewModel = new NavigationViewModel(repository);

		// Load collections
		await viewModel.loadCollections();

		return <CollectionsListView viewModel={viewModel} />;
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
