/**
 * Cache Service
 * Provides caching functionality for the application
 */
export interface CacheOptions {
	ttl?: number; // Time to live in milliseconds
	maxSize?: number; // Maximum number of items in cache
}

export interface CacheItem<T> {
	data: T;
	expiresAt: number;
	createdAt: number;
}

export class CacheService {
	private static instance: CacheService;
	private cache = new Map<string, CacheItem<any>>();
	private defaultTTL = 5 * 60 * 1000; // 5 minutes
	private maxSize = 1000;

	private constructor() {}

	/**
	 * Get singleton instance
	 */
	static getInstance(): CacheService {
		if (!CacheService.instance) {
			CacheService.instance = new CacheService();
		}
		return CacheService.instance;
	}

	/**
	 * Set item in cache
	 */
	set<T>(key: string, data: T, options?: CacheOptions): void {
		const ttl = options?.ttl || this.defaultTTL;
		const now = Date.now();

		// Clean up expired items if cache is getting full
		if (this.cache.size >= (options?.maxSize || this.maxSize)) {
			this.cleanup();
		}

		this.cache.set(key, {
			data,
			expiresAt: now + ttl,
			createdAt: now,
		});
	}

	/**
	 * Get item from cache
	 */
	get<T>(key: string): T | null {
		const item = this.cache.get(key);

		if (!item) {
			return null;
		}

		// Check if item has expired
		if (Date.now() > item.expiresAt) {
			this.cache.delete(key);
			return null;
		}

		return item.data as T;
	}

	/**
	 * Check if item exists in cache and is valid
	 */
	has(key: string): boolean {
		return this.get(key) !== null;
	}

	/**
	 * Delete item from cache
	 */
	delete(key: string): boolean {
		return this.cache.delete(key);
	}

	/**
	 * Clear all cache
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Get cache size
	 */
	size(): number {
		return this.cache.size;
	}

	/**
	 * Get cache statistics
	 */
	getStats(): {
		size: number;
		maxSize: number;
		hitRate: number;
		items: Array<{
			key: string;
			createdAt: number;
			expiresAt: number;
			isExpired: boolean;
		}>;
	} {
		const now = Date.now();
		const items = Array.from(this.cache.entries()).map(([key, item]) => ({
			key,
			createdAt: item.createdAt,
			expiresAt: item.expiresAt,
			isExpired: now > item.expiresAt,
		}));

		return {
			size: this.cache.size,
			maxSize: this.maxSize,
			hitRate: 0, // Would need to track hits/misses for this
			items,
		};
	}

	/**
	 * Clean up expired items
	 */
	private cleanup(): void {
		const now = Date.now();
		const expiredKeys: string[] = [];

		for (const [key, item] of this.cache.entries()) {
			if (now > item.expiresAt) {
				expiredKeys.push(key);
			}
		}

		expiredKeys.forEach((key) => this.cache.delete(key));
	}

	/**
	 * Get or set pattern - if item doesn't exist, fetch it and cache it
	 */
	async getOrSet<T>(
		key: string,
		fetchFn: () => Promise<T>,
		options?: CacheOptions
	): Promise<T> {
		const cached = this.get<T>(key);

		if (cached !== null) {
			return cached;
		}

		const data = await fetchFn();
		this.set(key, data, options);
		return data;
	}

	/**
	 * Invalidate items by pattern
	 */
	invalidatePattern(pattern: string | RegExp): number {
		let deletedCount = 0;
		const regex =
			typeof pattern === "string" ? new RegExp(pattern) : pattern;

		for (const key of this.cache.keys()) {
			if (regex.test(key)) {
				this.cache.delete(key);
				deletedCount++;
			}
		}

		return deletedCount;
	}
}

// Export singleton instance
export const cacheService = CacheService.getInstance();
