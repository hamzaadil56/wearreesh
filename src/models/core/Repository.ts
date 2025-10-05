import { Entity, Repository, Result } from "./types";

/**
 * Abstract base repository class
 */
export abstract class BaseRepository<T extends Entity>
	implements Repository<T>
{
	protected cache = new Map<string, T>();
	protected cacheExpiry = new Map<string, number>();
	protected cacheTTL = 5 * 60 * 1000; // 5 minutes

	abstract findById(id: string): Promise<T | null>;
	abstract findAll(): Promise<T[]>;
	abstract create(
		entity: Omit<T, "id" | "createdAt" | "updatedAt">
	): Promise<T>;
	abstract update(id: string, updates: Partial<T>): Promise<T>;
	abstract delete(id: string): Promise<void>;

	/**
	 * Get item from cache if valid
	 */
	protected getCached(id: string): T | null {
		const item = this.cache.get(id);
		const expiry = this.cacheExpiry.get(id);

		if (item && expiry && Date.now() < expiry) {
			return item;
		}

		// Clean up expired cache entry
		this.cache.delete(id);
		this.cacheExpiry.delete(id);
		return null;
	}

	/**
	 * Set item in cache
	 */
	protected setCached(id: string, item: T): void {
		this.cache.set(id, item);
		this.cacheExpiry.set(id, Date.now() + this.cacheTTL);
	}

	/**
	 * Clear cache
	 */
	protected clearCache(): void {
		this.cache.clear();
		this.cacheExpiry.clear();
	}

	/**
	 * Safe operation wrapper
	 */
	protected async safeOperation<TResult>(
		operation: () => Promise<TResult>,
		errorMessage: string
	): Promise<Result<TResult>> {
		try {
			const data = await operation();
			return { success: true, data };
		} catch (error) {
			console.error(errorMessage, error);
			return {
				success: false,
				error: error instanceof Error ? error : new Error(errorMessage),
			};
		}
	}
}
