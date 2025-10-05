import { ViewModelState, Result } from "@/models/core/types";

/**
 * Base ViewModel class that all ViewModels should extend
 */
export abstract class BaseViewModel {
	protected _state: ViewModelState = {
		loading: false,
		error: null,
		lastUpdated: undefined,
	};

	/**
	 * Get current state
	 */
	get state(): ViewModelState {
		return { ...this._state };
	}

	/**
	 * Get loading status
	 */
	get isLoading(): boolean {
		return this._state.loading;
	}

	/**
	 * Get error status
	 */
	get hasError(): boolean {
		return this._state.error !== null;
	}

	/**
	 * Get error message
	 */
	get error(): string | null {
		return this._state.error;
	}

	/**
	 * Set loading state
	 */
	protected setLoading(loading: boolean): void {
		this._state = {
			...this._state,
			loading,
			error: loading ? null : this._state.error, // Clear error when starting new operation
		};
	}

	/**
	 * Set error state
	 */
	protected setError(error: string | Error | null): void {
		this._state = {
			...this._state,
			loading: false,
			error: error instanceof Error ? error.message : error,
		};
	}

	/**
	 * Clear error state
	 */
	protected clearError(): void {
		this._state = {
			...this._state,
			error: null,
		};
	}

	/**
	 * Update last updated timestamp
	 */
	protected updateTimestamp(): void {
		this._state = {
			...this._state,
			lastUpdated: new Date(),
		};
	}

	/**
	 * Execute operation with loading and error handling
	 */
	protected async executeOperation<T>(
		operation: () => Promise<T>,
		errorMessage?: string
	): Promise<Result<T>> {
		this.setLoading(true);

		try {
			const result = await operation();
			this.setLoading(false);
			this.updateTimestamp();
			return { success: true, data: result };
		} catch (error) {
			const errorMsg = errorMessage || "An error occurred";
			this.setError(error instanceof Error ? error.message : errorMsg);
			return {
				success: false,
				error: error instanceof Error ? error : new Error(errorMsg),
			};
		}
	}

	/**
	 * Reset ViewModel state
	 */
	protected resetState(): void {
		this._state = {
			loading: false,
			error: null,
			lastUpdated: undefined,
		};
	}
}
