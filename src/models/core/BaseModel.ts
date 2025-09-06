import { Entity } from "./types";

/**
 * Base model class that all domain models should extend
 */
export abstract class BaseModel implements Entity {
	public readonly id: string;
	public readonly createdAt?: Date;
	public readonly updatedAt?: Date;

	constructor(data: { id: string; createdAt?: Date; updatedAt?: Date }) {
		this.id = data.id;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
	}

	/**
	 * Convert model to plain object
	 */
	toJSON(): Record<string, any> {
		return {
			id: this.id,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			...this.getSerializableData(),
		};
	}

	/**
	 * Get data that should be serialized
	 * Override in subclasses to include model-specific data
	 */
	protected abstract getSerializableData(): Record<string, any>;

	/**
	 * Check if model is equal to another model
	 */
	equals(other: BaseModel): boolean {
		return this.id === other.id;
	}

	/**
	 * Clone the model with optional updates
	 */
	abstract clone(updates?: Partial<any>): this;

	/**
	 * Validate the model
	 */
	abstract validate(): { isValid: boolean; errors: string[] };
}
