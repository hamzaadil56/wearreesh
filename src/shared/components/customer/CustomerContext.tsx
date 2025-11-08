"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
	useCustomerViewModel,
	UseCustomerViewModelReturn,
} from "@/viewmodels/customer/useCustomerViewModel";

const CustomerContext = createContext<UseCustomerViewModelReturn | undefined>(
	undefined
);

/**
 * Hook to access customer state and actions
 * Must be used within a CustomerProvider
 */
export const useCustomer = () => {
	const context = useContext(CustomerContext);
	if (context === undefined) {
		throw new Error("useCustomer must be used within a CustomerProvider");
	}
	return context;
};

interface CustomerProviderProps {
	children: ReactNode;
}

/**
 * CustomerProvider - Provides global customer state throughout the application
 * Following MVVM architecture, uses useCustomerViewModel directly
 */
export function CustomerProvider({ children }: CustomerProviderProps) {
	// Use the customer view model hook directly [[memory:9378671]]
	const customerViewModel = useCustomerViewModel();

	return (
		<CustomerContext.Provider value={customerViewModel}>
			{children}
		</CustomerContext.Provider>
	);
}
