/**
 * Core types for MVVM architecture
 */

// Base entity interface
export interface Entity {
	readonly id: string;
	readonly createdAt?: Date;
	readonly updatedAt?: Date;
}

// Repository interface
export interface Repository<T extends Entity> {
	findById(id: string): Promise<T | null>;
	findAll(): Promise<T[]>;
	create(entity: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
	update(id: string, updates: Partial<T>): Promise<T>;
	delete(id: string): Promise<void>;
}

// Service interface
export interface Service<T extends Entity> {
	repository: Repository<T>;
}

// ViewModel state
export interface ViewModelState {
	loading: boolean;
	error: string | null;
	lastUpdated?: Date;
}

// Result wrapper for operations
export type Result<T, E = Error> =
	| { success: true; data: T; error?: never }
	| { success: false; error: E; data?: never };

// Pagination
export interface PaginationParams {
	page: number;
	limit: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
	items: T[];
	totalCount: number;
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

// Search parameters
export interface SearchParams {
	query?: string;
	filters?: Record<string, any>;
	pagination?: PaginationParams;
}
