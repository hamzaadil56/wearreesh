import { BaseViewModel } from "./BaseViewModel";

/**
 * Central store for managing ViewModels
 * Implements singleton pattern for global state management
 */
export class ViewModelStore {
	private static instance: ViewModelStore;
	private viewModels = new Map<string, BaseViewModel>();

	private constructor() {}

	/**
	 * Get singleton instance
	 */
	static getInstance(): ViewModelStore {
		if (!ViewModelStore.instance) {
			ViewModelStore.instance = new ViewModelStore();
		}
		return ViewModelStore.instance;
	}

	/**
	 * Register a ViewModel
	 */
	register<T extends BaseViewModel>(key: string, viewModel: T): T {
		this.viewModels.set(key, viewModel);
		return viewModel;
	}

	/**
	 * Get a ViewModel by key
	 */
	get<T extends BaseViewModel>(key: string): T | null {
		return (this.viewModels.get(key) as T) || null;
	}

	/**
	 * Remove a ViewModel
	 */
	remove(key: string): void {
		this.viewModels.delete(key);
	}

	/**
	 * Clear all ViewModels
	 */
	clear(): void {
		this.viewModels.clear();
	}

	/**
	 * Get all registered ViewModels
	 */
	getAll(): Map<string, BaseViewModel> {
		return new Map(this.viewModels);
	}
}

// Export singleton instance
export const viewModelStore = ViewModelStore.getInstance();
