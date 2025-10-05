import { BaseViewModel } from "../core/BaseViewModel";
import { Collection } from "@/models/collection/Collection.model";
import { CollectionRepository } from "@/models/collection/CollectionRepository";

export interface CollectionViewModel {
	id: string;
	handle: string;
	title: string;
	description: string;
	shortDescription: string;
	path: string;
	imageUrl?: string;
	imageAlt?: string;
	isAllCollection: boolean;
}

export interface NavigationViewState {
	collections: CollectionViewModel[];
	isMenuOpen: boolean;
	isSearchOpen: boolean;
	searchQuery: string;
	cartItemCount: number;
}

export class NavigationViewModel extends BaseViewModel {
	private repository: CollectionRepository;
	private _viewState: NavigationViewState = {
		collections: [],
		isMenuOpen: false,
		isSearchOpen: false,
		searchQuery: "",
		cartItemCount: 0,
	};

	constructor(repository?: CollectionRepository) {
		super();
		this.repository = repository || new CollectionRepository();
	}

	/**
	 * Get current view state
	 */
	get viewState(): NavigationViewState {
		return { ...this._viewState };
	}

	/**
	 * Get collections
	 */
	get collections(): CollectionViewModel[] {
		return this._viewState.collections;
	}

	/**
	 * Get menu open state
	 */
	get isMenuOpen(): boolean {
		return this._viewState.isMenuOpen;
	}

	/**
	 * Get search open state
	 */
	get isSearchOpen(): boolean {
		return this._viewState.isSearchOpen;
	}

	/**
	 * Get search query
	 */
	get searchQuery(): string {
		return this._viewState.searchQuery;
	}

	/**
	 * Get cart item count
	 */
	get cartItemCount(): number {
		return this._viewState.cartItemCount;
	}

	/**
	 * Load collections for navigation
	 */
	async loadCollections(): Promise<void> {
		const result = await this.executeOperation(
			() => this.repository.findAll(),
			"Failed to load collections"
		);

		if (result.success) {
			this.updateViewState({
				collections: result.data.map((c) => this.mapToViewModel(c)),
			});
		}
	}

	/**
	 * Toggle mobile menu
	 */
	toggleMenu(): void {
		this.updateViewState({
			isMenuOpen: !this._viewState.isMenuOpen,
		});
	}

	/**
	 * Close mobile menu
	 */
	closeMenu(): void {
		this.updateViewState({
			isMenuOpen: false,
		});
	}

	/**
	 * Open mobile menu
	 */
	openMenu(): void {
		this.updateViewState({
			isMenuOpen: true,
		});
	}

	/**
	 * Toggle search drawer
	 */
	toggleSearch(): void {
		this.updateViewState({
			isSearchOpen: !this._viewState.isSearchOpen,
		});
	}

	/**
	 * Close search drawer
	 */
	closeSearch(): void {
		this.updateViewState({
			isSearchOpen: false,
			searchQuery: "",
		});
	}

	/**
	 * Open search drawer
	 */
	openSearch(): void {
		this.updateViewState({
			isSearchOpen: true,
		});
	}

	/**
	 * Update search query
	 */
	updateSearchQuery(query: string): void {
		this.updateViewState({
			searchQuery: query,
		});
	}

	/**
	 * Clear search query
	 */
	clearSearchQuery(): void {
		this.updateViewState({
			searchQuery: "",
		});
	}

	/**
	 * Update cart item count
	 */
	updateCartItemCount(count: number): void {
		this.updateViewState({
			cartItemCount: count,
		});
	}

	/**
	 * Get collection by handle
	 */
	getCollectionByHandle(handle: string): CollectionViewModel | null {
		return (
			this._viewState.collections.find((c) => c.handle === handle) || null
		);
	}

	/**
	 * Check if collection exists
	 */
	hasCollection(handle: string): boolean {
		return this._viewState.collections.some((c) => c.handle === handle);
	}

	/**
	 * Map domain model to view model
	 */
	private mapToViewModel(collection: Collection): CollectionViewModel {
		return {
			id: collection.id,
			handle: collection.handle,
			title: collection.title,
			description: collection.description,
			shortDescription: collection.getShortDescription(50),
			path: collection.path,
			imageUrl: collection.image?.url,
			imageAlt: collection.image?.altText || collection.title,
			isAllCollection: collection.isAllCollection,
		};
	}

	/**
	 * Update view state
	 */
	private updateViewState(updates: Partial<NavigationViewState>): void {
		this._viewState = {
			...this._viewState,
			...updates,
		};
	}
}
