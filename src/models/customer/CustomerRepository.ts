import { BaseRepository } from "../core/Repository";
import { Customer, CustomerData } from "./Customer.model";
import { getCustomer, isAuthenticated } from "./Customer.actions";
import type {
	Customer as CustomerType,
	CustomerAccountApiCustomer,
} from "./types";

/**
 * Customer Repository
 * Handles customer data operations with Shopify Customer Account API
 */
export class CustomerRepository extends BaseRepository<Customer> {
	/**
	 * Get current authenticated customer
	 */
	async findById(id?: string): Promise<Customer | null> {
		// Check cache first (optional for customers as they change less frequently)
		if (id) {
			const cached = this.getCached(id);
			if (cached) return cached;
		}

		const result = await this.safeOperation(async () => {
			const customerData = await getCustomer();
			if (!customerData) return null;

			const customer = this.mapToCustomerModel(customerData);

			// Cache the customer
			this.setCached(customer.id, customer);

			return customer;
		}, "Failed to fetch customer");

		return result.success ? result.data : null;
	}

	/**
	 * Check if customer is authenticated
	 */
	async isAuthenticated(): Promise<boolean> {
		const result = await this.safeOperation(async () => {
			return await isAuthenticated();
		}, "Failed to check authentication status");

		return result.success ? result.data : false;
	}

	/**
	 * Refresh customer data (clear cache and fetch fresh)
	 */
	async refresh(): Promise<Customer | null> {
		this.clearCache();
		return await this.findById();
	}

	/**
	 * Not applicable - customers are fetched individually via session
	 */
	async findAll(): Promise<Customer[]> {
		throw new Error(
			"Customer repository does not support findAll operation"
		);
	}

	/**
	 * Not applicable - customer creation is handled through OAuth flow
	 */
	async create(): Promise<Customer> {
		throw new Error(
			"Customer creation is handled through OAuth authentication flow"
		);
	}

	/**
	 * Not applicable - customer updates are handled through Shopify Admin API
	 */
	async update(): Promise<Customer> {
		throw new Error(
			"Customer updates not supported through Customer Account API"
		);
	}

	/**
	 * Not applicable - customer deletion is handled through Shopify Admin
	 */
	async delete(): Promise<void> {
		throw new Error(
			"Customer deletion not supported through Customer Account API"
		);
	}

	/**
	 * Map API customer data to domain model
	 */
	private mapToCustomerModel(customerData: CustomerType): Customer {
		return new Customer({
			id: customerData.id,
			email: customerData.email,
			firstName: customerData.firstName,
			lastName: customerData.lastName,
			phone: customerData.phone,
			numberOfOrders: customerData.numberOfOrders,
			addresses: customerData.addresses,
			defaultAddress: customerData.defaultAddress,
		});
	}
}

