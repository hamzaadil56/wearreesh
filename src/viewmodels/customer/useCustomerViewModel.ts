"use client";

import { useState, useCallback, useEffect } from "react";
import {
	getCustomer,
	isAuthenticated,
} from "@/models/customer/Customer.actions";
import { Customer } from "@/models/customer/Customer.model";
import { useLoadingStates } from "@/shared/hooks/useLoadingStates";

export interface CustomerViewState {
	customer: Customer | null;
	isAuthenticated: boolean;
	error: string | null;
}

export interface UseCustomerViewModelReturn {
	// State
	customer: Customer | null;
	isAuthenticated: boolean;
	error: string | null;

	// Loading states
	isLoadingCustomer: boolean;

	// Actions
	loadCustomer: () => Promise<void>;
	logout: () => void;
	clearError: () => void;
	refreshCustomer: () => Promise<void>;

	// Computed properties
	displayName: string;
	initials: string;
	hasOrders: boolean;
	isProfileComplete: boolean;
}

export function useCustomerViewModel(): UseCustomerViewModelReturn {
	const [viewState, setViewState] = useState<CustomerViewState>({
		customer: null,
		isAuthenticated: false,
		error: null,
	});

	const { isLoading, executeWithLoading } = useLoadingStates();

	const OPERATIONS = {
		LOAD_CUSTOMER: "loadCustomer",
	} as const;

	// Load customer on mount
	useEffect(() => {
		loadCustomer();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Load customer from server
	const loadCustomer = useCallback(async () => {
		const result = await executeWithLoading(
			OPERATIONS.LOAD_CUSTOMER,
			async () => {
				// First check if authenticated
				const authenticated = await isAuthenticated();

				if (!authenticated) {
					return { customer: null, authenticated: false };
				}

				// Then load customer data
				const customerData = await getCustomer();

				// Convert plain data to Customer model instance
				const customer = customerData
					? new Customer(customerData)
					: null;

				return {
					customer,
					authenticated: true,
				};
			}
		);

		if (result.success && result.data) {
			const { customer, authenticated } = result.data;
			setViewState((prev) => ({
				...prev,
				customer,
				isAuthenticated: authenticated,
				error: null,
			}));
		} else {
			// Set to unauthenticated if we failed to load
			setViewState((prev) => ({
				...prev,
				customer: null,
				isAuthenticated: false,
				error: result.error?.message || null,
			}));
		}
	}, [executeWithLoading]);

	// Refresh customer data (force reload)
	const refreshCustomer = useCallback(async () => {
		await loadCustomer();
	}, [loadCustomer]);

	// Logout customer
	const logout = useCallback((): void => {
		// Redirect to server-side OAuth logout route
		window.location.href = "/api/auth/logout";
	}, []);

	// Clear error
	const clearError = useCallback(() => {
		setViewState((prev) => ({ ...prev, error: null }));
	}, []);

	// Computed properties
	const displayName = viewState.customer?.displayName || "Guest";
	const initials = viewState.customer?.initials || "?";
	const hasOrders = viewState.customer?.hasOrders || false;
	const isProfileComplete = viewState.customer?.isProfileComplete || false;

	return {
		// State
		customer: viewState.customer,
		isAuthenticated: viewState.isAuthenticated,
		error: viewState.error,

		// Loading states
		isLoadingCustomer: isLoading(OPERATIONS.LOAD_CUSTOMER),

		// Actions
		loadCustomer,
		logout,
		clearError,
		refreshCustomer,

		// Computed properties
		displayName,
		initials,
		hasOrders,
		isProfileComplete,
	};
}
