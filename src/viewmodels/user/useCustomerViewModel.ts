"use client";

import { useState, useCallback, useEffect } from "react";
import {
	registerCustomer,
	loginCustomer,
	logoutCustomer,
	recoverCustomerPassword,
	getCustomer,
} from "@/models/user/User.actions";
import type {
	Customer,
	CustomerCreateInput,
	CustomerAccessTokenCreateInput,
} from "@/shared/lib/shopify/types";
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
	isRegistering: boolean;
	isLoggingIn: boolean;
	isLoggingOut: boolean;
	isRecoveringPassword: boolean;
	isLoadingCustomer: boolean;

	// Actions
	register: (
		input: CustomerCreateInput
	) => Promise<{ success: boolean; errors: string[] }>;
	login: (
		input: CustomerAccessTokenCreateInput
	) => Promise<{ success: boolean; errors: string[] }>;
	logout: () => Promise<{ success: boolean; errors: string[] }>;
	recoverPassword: (
		email: string
	) => Promise<{ success: boolean; errors: string[] }>;
	loadCustomer: () => Promise<void>;
	clearError: () => void;
}

export function useCustomerViewModel(): UseCustomerViewModelReturn {
	const [viewState, setViewState] = useState<CustomerViewState>({
		customer: null,
		isAuthenticated: false,
		error: null,
	});

	const { isLoading, executeWithLoading } = useLoadingStates();

	const OPERATIONS = {
		REGISTER: "register",
		LOGIN: "login",
		LOGOUT: "logout",
		RECOVER_PASSWORD: "recoverPassword",
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
				return await getCustomer();
			}
		);

		if (result.success && result.data) {
			setViewState((prev) => ({
				...prev,
				customer: result.data,
				isAuthenticated: true,
				error: null,
			}));
		} else {
			// Only set to unauthenticated if we explicitly failed to load
			// Don't override if we're already authenticated
			setViewState((prev) => ({
				...prev,
				customer: null,
				isAuthenticated: prev.isAuthenticated
					? prev.isAuthenticated
					: false,
				error: null,
			}));
		}
	}, [executeWithLoading]);

	// Register customer
	const register = useCallback(
		async (
			input: CustomerCreateInput
		): Promise<{ success: boolean; errors: string[] }> => {
			const result = await executeWithLoading(
				OPERATIONS.REGISTER,
				async () => {
					return await registerCustomer(input);
				}
			);

			if (result.success && result.data) {
				const { customer, errors } = result.data;

				if (errors.length > 0) {
					setViewState((prev) => ({
						...prev,
						error: errors.join(", "),
					}));
					return { success: false, errors };
				}

				// Customer created successfully
				// Note: Customer needs to activate account via email before they can login
				setViewState((prev) => ({
					...prev,
					customer: customer || null,
					isAuthenticated: false, // Not authenticated until they activate and login
					error: null,
				}));

				return { success: true, errors: [] };
			}

			const errorMessage = result.error?.message || "Registration failed";
			setViewState((prev) => ({
				...prev,
				error: errorMessage,
			}));

			return { success: false, errors: [errorMessage] };
		},
		[executeWithLoading]
	);

	// Login customer
	const login = useCallback(
		async (
			input: CustomerAccessTokenCreateInput
		): Promise<{ success: boolean; errors: string[] }> => {
			const result = await executeWithLoading(
				OPERATIONS.LOGIN,
				async () => {
					return await loginCustomer(input);
				}
			);

			if (result.success && result.data) {
				const { accessToken, errors } = result.data;

				if (errors.length > 0) {
					setViewState((prev) => ({
						...prev,
						error: errors.join(", "),
					}));
					return { success: false, errors };
				}

				if (!accessToken) {
					const errorMessage = "Failed to create access token";
					setViewState((prev) => ({
						...prev,
						error: errorMessage,
					}));
					return { success: false, errors: [errorMessage] };
				}

				// Immediately set authenticated state to true
				setViewState((prev) => ({
					...prev,
					isAuthenticated: true,
					error: null,
				}));

				// Load customer data after successful login
				// This will update the customer data in state
				await loadCustomer();

				return { success: true, errors: [] };
			}

			const errorMessage = result.error?.message || "Login failed";
			setViewState((prev) => ({
				...prev,
				error: errorMessage,
			}));

			return { success: false, errors: [errorMessage] };
		},
		[executeWithLoading, loadCustomer]
	);

	// Logout customer
	const logout = useCallback(async (): Promise<{
		success: boolean;
		errors: string[];
	}> => {
		const result = await executeWithLoading(OPERATIONS.LOGOUT, async () => {
			return await logoutCustomer();
		});

		if (result.success && result.data) {
			const { success, errors } = result.data;

			if (errors.length > 0) {
				setViewState((prev) => ({
					...prev,
					error: errors.join(", "),
				}));
				return { success: false, errors };
			}

			// Clear customer state
			setViewState({
				customer: null,
				isAuthenticated: false,
				error: null,
			});

			return { success: true, errors: [] };
		}

		// Even if API call fails, clear local state
		setViewState({
			customer: null,
			isAuthenticated: false,
			error: null,
		});

		const errorMessage = result.error?.message || "Logout failed";
		return { success: false, errors: [errorMessage] };
	}, [executeWithLoading]);

	// Recover password
	const recoverPassword = useCallback(
		async (
			email: string
		): Promise<{ success: boolean; errors: string[] }> => {
			const result = await executeWithLoading(
				OPERATIONS.RECOVER_PASSWORD,
				async () => {
					return await recoverCustomerPassword(email);
				}
			);

			if (result.success && result.data) {
				const { success, errors } = result.data;

				if (errors.length > 0) {
					setViewState((prev) => ({
						...prev,
						error: errors.join(", "),
					}));
					return { success: false, errors };
				}

				return { success: true, errors: [] };
			}

			const errorMessage =
				result.error?.message || "Password recovery failed";
			setViewState((prev) => ({
				...prev,
				error: errorMessage,
			}));

			return { success: false, errors: [errorMessage] };
		},
		[executeWithLoading]
	);

	// Clear error
	const clearError = useCallback(() => {
		setViewState((prev) => ({ ...prev, error: null }));
	}, []);

	return {
		// State
		customer: viewState.customer,
		isAuthenticated: viewState.isAuthenticated,
		error: viewState.error,

		// Loading states
		isRegistering: isLoading(OPERATIONS.REGISTER),
		isLoggingIn: isLoading(OPERATIONS.LOGIN),
		isLoggingOut: isLoading(OPERATIONS.LOGOUT),
		isRecoveringPassword: isLoading(OPERATIONS.RECOVER_PASSWORD),
		isLoadingCustomer: isLoading(OPERATIONS.LOAD_CUSTOMER),

		// Actions
		register,
		login,
		logout,
		recoverPassword,
		loadCustomer,
		clearError,
	};
}
