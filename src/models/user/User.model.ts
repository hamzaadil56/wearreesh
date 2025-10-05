import { BaseModel } from "../core/BaseModel";

export interface UserAddress {
	id?: string;
	firstName: string;
	lastName: string;
	company?: string;
	address1: string;
	address2?: string;
	city: string;
	province: string;
	country: string;
	zip: string;
	phone?: string;
	isDefault?: boolean;
}

export interface UserData {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	addresses?: UserAddress[];
	acceptsMarketing?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export class User extends BaseModel {
	public readonly email: string;
	public readonly firstName?: string;
	public readonly lastName?: string;
	public readonly phone?: string;
	public readonly addresses: UserAddress[];
	public readonly acceptsMarketing: boolean;

	constructor(data: UserData) {
		super({
			id: data.id,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});

		this.email = data.email;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.phone = data.phone;
		this.addresses = data.addresses || [];
		this.acceptsMarketing = data.acceptsMarketing || false;
	}

	/**
	 * Get full name
	 */
	get fullName(): string {
		const parts = [this.firstName, this.lastName].filter(Boolean);
		return parts.length > 0 ? parts.join(" ") : this.email;
	}

	/**
	 * Get display name (first name or email)
	 */
	get displayName(): string {
		return this.firstName || this.email;
	}

	/**
	 * Get initials
	 */
	get initials(): string {
		if (this.firstName && this.lastName) {
			return `${this.firstName.charAt(0)}${this.lastName.charAt(
				0
			)}`.toUpperCase();
		}
		if (this.firstName) {
			return this.firstName.charAt(0).toUpperCase();
		}
		return this.email.charAt(0).toUpperCase();
	}

	/**
	 * Get default address
	 */
	get defaultAddress(): UserAddress | null {
		return (
			this.addresses.find((addr) => addr.isDefault) ||
			this.addresses[0] ||
			null
		);
	}

	/**
	 * Check if user has complete profile
	 */
	get hasCompleteProfile(): boolean {
		return !!(this.firstName && this.lastName);
	}

	/**
	 * Check if user has addresses
	 */
	get hasAddresses(): boolean {
		return this.addresses.length > 0;
	}

	/**
	 * Add address
	 */
	addAddress(address: UserAddress): User {
		const newAddresses = [...this.addresses];

		// If this is the first address or marked as default, make it default
		if (newAddresses.length === 0 || address.isDefault) {
			// Remove default from other addresses
			newAddresses.forEach((addr) => (addr.isDefault = false));
			address.isDefault = true;
		}

		newAddresses.push(address);

		return this.clone({ addresses: newAddresses });
	}

	/**
	 * Update address
	 */
	updateAddress(addressId: string, updates: Partial<UserAddress>): User {
		const newAddresses = this.addresses.map((addr) =>
			addr.id === addressId ? { ...addr, ...updates } : addr
		);

		return this.clone({ addresses: newAddresses });
	}

	/**
	 * Remove address
	 */
	removeAddress(addressId: string): User {
		const newAddresses = this.addresses.filter(
			(addr) => addr.id !== addressId
		);

		// If we removed the default address, make the first remaining address default
		if (
			newAddresses.length > 0 &&
			!newAddresses.some((addr) => addr.isDefault)
		) {
			newAddresses[0].isDefault = true;
		}

		return this.clone({ addresses: newAddresses });
	}

	/**
	 * Set default address
	 */
	setDefaultAddress(addressId: string): User {
		const newAddresses = this.addresses.map((addr) => ({
			...addr,
			isDefault: addr.id === addressId,
		}));

		return this.clone({ addresses: newAddresses });
	}

	protected getSerializableData(): Record<string, any> {
		return {
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName,
			phone: this.phone,
			addresses: this.addresses,
			acceptsMarketing: this.acceptsMarketing,
		};
	}

	clone(updates?: Partial<UserData>): this {
		return new User({
			...this.getSerializableData(),
			id: this.id,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			...updates,
		} as UserData) as this;
	}

	validate(): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];

		// Email validation
		if (!this.email.trim()) {
			errors.push("Email is required");
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
			errors.push("Email format is invalid");
		}

		// Address validation
		this.addresses.forEach((address, index) => {
			if (!address.firstName.trim()) {
				errors.push(`Address ${index + 1}: First name is required`);
			}
			if (!address.lastName.trim()) {
				errors.push(`Address ${index + 1}: Last name is required`);
			}
			if (!address.address1.trim()) {
				errors.push(`Address ${index + 1}: Address line 1 is required`);
			}
			if (!address.city.trim()) {
				errors.push(`Address ${index + 1}: City is required`);
			}
			if (!address.province.trim()) {
				errors.push(`Address ${index + 1}: Province/State is required`);
			}
			if (!address.country.trim()) {
				errors.push(`Address ${index + 1}: Country is required`);
			}
			if (!address.zip.trim()) {
				errors.push(
					`Address ${index + 1}: ZIP/Postal code is required`
				);
			}
		});

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}
