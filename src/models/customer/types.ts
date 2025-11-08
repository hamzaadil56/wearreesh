/**
 * Customer Account API Types
 */

export interface CustomerAccountApiAddress {
	id: string;
	firstName: string;
	lastName: string;
	company?: string;
	address1: string;
	address2?: string;
	city: string;
	provinceCode: string;
	countryCode: string;
	zip: string;
	phoneNumber?: string;
}

export interface CustomerAccountApiCustomer {
	id: string;
	emailAddress: {
		emailAddress: string;
	};
	firstName?: string;
	lastName?: string;
	phoneNumber?: {
		phoneNumber: string;
	};
	numberOfOrders: number;
	defaultAddress?: CustomerAccountApiAddress;
	addresses: {
		edges: Array<{
			node: CustomerAccountApiAddress;
		}>;
	};
}

export interface Customer {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	numberOfOrders: number;
	addresses: Array<{
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
	}>;
	defaultAddress?: {
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
	};
}

/**
 * Transform Customer Account API customer to our Customer type
 */
export function transformCustomer(
	apiCustomer: CustomerAccountApiCustomer
): Customer {
	const addresses = apiCustomer.addresses.edges.map((edge) => ({
		id: edge.node.id,
		firstName: edge.node.firstName,
		lastName: edge.node.lastName,
		company: edge.node.company,
		address1: edge.node.address1,
		address2: edge.node.address2,
		city: edge.node.city,
		province: edge.node.provinceCode,
		country: edge.node.countryCode,
		zip: edge.node.zip,
		phone: edge.node.phoneNumber,
	}));

	const defaultAddress = apiCustomer.defaultAddress
		? {
				id: apiCustomer.defaultAddress.id,
				firstName: apiCustomer.defaultAddress.firstName,
				lastName: apiCustomer.defaultAddress.lastName,
				company: apiCustomer.defaultAddress.company,
				address1: apiCustomer.defaultAddress.address1,
				address2: apiCustomer.defaultAddress.address2,
				city: apiCustomer.defaultAddress.city,
				province: apiCustomer.defaultAddress.provinceCode,
				country: apiCustomer.defaultAddress.countryCode,
				zip: apiCustomer.defaultAddress.zip,
				phone: apiCustomer.defaultAddress.phoneNumber,
		  }
		: undefined;

	return {
		id: apiCustomer.id,
		email: apiCustomer.emailAddress.emailAddress,
		firstName: apiCustomer.firstName,
		lastName: apiCustomer.lastName,
		phone: apiCustomer.phoneNumber?.phoneNumber,
		numberOfOrders: apiCustomer.numberOfOrders,
		addresses,
		defaultAddress,
	};
}

