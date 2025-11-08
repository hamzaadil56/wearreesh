import { BaseModel } from "../core/BaseModel";

/**
 * Address data interface
 */
export interface AddressData {
	id: string;
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
}

/**
 * Customer data interface
 */
export interface CustomerData {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	numberOfOrders: number;
	addresses: AddressData[];
	defaultAddress?: AddressData;
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * Address Model
 */
export class Address {
	public readonly id: string;
	public readonly firstName: string;
	public readonly lastName: string;
	public readonly company?: string;
	public readonly address1: string;
	public readonly address2?: string;
	public readonly city: string;
	public readonly province: string;
	public readonly country: string;
	public readonly zip: string;
	public readonly phone?: string;

	constructor(data: AddressData) {
		this.id = data.id;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.company = data.company;
		this.address1 = data.address1;
		this.address2 = data.address2;
		this.city = data.city;
		this.province = data.province;
		this.country = data.country;
		this.zip = data.zip;
		this.phone = data.phone;
	}

	/**
	 * Get full name
	 */
	get fullName(): string {
		return `${this.firstName} ${this.lastName}`.trim();
	}

	/**
	 * Get formatted single line address
	 */
	get formattedSingleLine(): string {
		const parts = [
			this.address1,
			this.address2,
			this.city,
			this.province,
			this.zip,
			this.country,
		].filter(Boolean);
		return parts.join(", ");
	}

	/**
	 * Get formatted multi-line address
	 */
	get formattedMultiLine(): string[] {
		const lines: string[] = [this.fullName];

		if (this.company) {
			lines.push(this.company);
		}

		lines.push(this.address1);

		if (this.address2) {
			lines.push(this.address2);
		}

		lines.push(`${this.city}, ${this.province} ${this.zip}`);
		lines.push(this.country);

		if (this.phone) {
			lines.push(this.phone);
		}

		return lines;
	}

	/**
	 * Check if address is complete
	 */
	get isComplete(): boolean {
		return !!(
			this.firstName &&
			this.lastName &&
			this.address1 &&
			this.city &&
			this.province &&
			this.country &&
			this.zip
		);
	}
}

/**
 * Customer Model
 */
export class Customer extends BaseModel {
	public readonly email: string;
	public readonly firstName?: string;
	public readonly lastName?: string;
	public readonly phone?: string;
	public readonly numberOfOrders: number;
	public readonly addresses: Address[];
	public readonly defaultAddress?: Address;

	constructor(data: CustomerData) {
		super({
			id: data.id,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});

		this.email = data.email;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.phone = data.phone;
		this.numberOfOrders = data.numberOfOrders;
		this.addresses = data.addresses.map((addr) => new Address(addr));
		this.defaultAddress = data.defaultAddress
			? new Address(data.defaultAddress)
			: undefined;
	}

	/**
	 * Get customer's full name
	 */
	get fullName(): string {
		if (this.firstName && this.lastName) {
			return `${this.firstName} ${this.lastName}`.trim();
		}
		return this.email;
	}

	/**
	 * Get customer's display name
	 */
	get displayName(): string {
		return this.firstName || this.email;
	}

	/**
	 * Get customer's initials
	 */
	get initials(): string {
		if (this.firstName && this.lastName) {
			return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
		}
		if (this.firstName) {
			return this.firstName.substring(0, 2).toUpperCase();
		}
		return this.email.substring(0, 2).toUpperCase();
	}

	/**
	 * Check if customer has any orders
	 */
	get hasOrders(): boolean {
		return this.numberOfOrders > 0;
	}

	/**
	 * Check if customer has addresses
	 */
	get hasAddresses(): boolean {
		return this.addresses.length > 0;
	}

	/**
	 * Check if customer has a default address
	 */
	get hasDefaultAddress(): boolean {
		return !!this.defaultAddress;
	}

	/**
	 * Check if customer profile is complete
	 */
	get isProfileComplete(): boolean {
		return !!(
			this.email &&
			this.firstName &&
			this.lastName &&
			this.hasDefaultAddress
		);
	}

	/**
	 * Find address by ID
	 */
	findAddress(addressId: string): Address | null {
		return (
			this.addresses.find((address) => address.id === addressId) || null
		);
	}

	/**
	 * Get shipping addresses (complete addresses only)
	 */
	get shippingAddresses(): Address[] {
		return this.addresses.filter((address) => address.isComplete);
	}

	protected getSerializableData(): Record<string, any> {
		return {
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName,
			phone: this.phone,
			numberOfOrders: this.numberOfOrders,
			addresses: this.addresses.map((addr) => ({
				id: addr.id,
				firstName: addr.firstName,
				lastName: addr.lastName,
				company: addr.company,
				address1: addr.address1,
				address2: addr.address2,
				city: addr.city,
				province: addr.province,
				country: addr.country,
				zip: addr.zip,
				phone: addr.phone,
			})),
			defaultAddress: this.defaultAddress
				? {
						id: this.defaultAddress.id,
						firstName: this.defaultAddress.firstName,
						lastName: this.defaultAddress.lastName,
						company: this.defaultAddress.company,
						address1: this.defaultAddress.address1,
						address2: this.defaultAddress.address2,
						city: this.defaultAddress.city,
						province: this.defaultAddress.province,
						country: this.defaultAddress.country,
						zip: this.defaultAddress.zip,
						phone: this.defaultAddress.phone,
				  }
				: undefined,
		};
	}

	clone(updates?: Partial<CustomerData>): this {
		return new Customer({
			...this.getSerializableData(),
			id: this.id,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			...updates,
		} as CustomerData) as this;
	}

	validate(): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];

		// Validate email
		if (!this.email || !this.email.trim()) {
			errors.push("Email is required");
		} else if (!this.isValidEmail(this.email)) {
			errors.push("Email is invalid");
		}

		// Validate phone if provided
		if (this.phone && !this.isValidPhone(this.phone)) {
			errors.push("Phone number is invalid");
		}

		// Validate addresses
		this.addresses.forEach((address, index) => {
			if (!address.isComplete) {
				errors.push(`Address ${index + 1} is incomplete`);
			}
		});

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Validate email format
	 */
	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	/**
	 * Validate phone format (basic validation)
	 */
	private isValidPhone(phone: string): boolean {
		// Remove all non-digit characters
		const digits = phone.replace(/\D/g, "");
		// Phone should have at least 10 digits
		return digits.length >= 10;
	}
}
