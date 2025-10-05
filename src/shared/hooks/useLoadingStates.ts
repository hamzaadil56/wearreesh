"use client";

import { useState, useCallback } from "react";

interface LoadingStates {
	[operationName: string]: boolean;
}

interface UseLoadingStatesReturn {
	loadingStates: LoadingStates;
	isLoading: (operationName: string, itemId?: string) => boolean;
	setLoading: (
		operationName: string,
		isLoading: boolean,
		itemId?: string
	) => void;
	executeWithLoading: <T>(
		operationName: string,
		operation: () => Promise<T>,
		itemId?: string
	) => Promise<{ success: boolean; data?: T; error?: Error }>;
	clearLoading: (operationName: string, itemId?: string) => void;
	clearAllLoading: () => void;
}

export function useLoadingStates(): UseLoadingStatesReturn {
	const [loadingStates, setLoadingStates] = useState<LoadingStates>({});

	const isLoading = useCallback(
		(operationName: string, itemId?: string): boolean => {
			const key = itemId ? `${operationName}:${itemId}` : operationName;
			return loadingStates[key] || false;
		},
		[loadingStates]
	);

	const setLoading = useCallback(
		(operationName: string, isLoading: boolean, itemId?: string) => {
			const key = itemId ? `${operationName}:${itemId}` : operationName;
			setLoadingStates((prev) => ({
				...prev,
				[key]: isLoading,
			}));
		},
		[]
	);

	const executeWithLoading = useCallback(
		async <T>(
			operationName: string,
			operation: () => Promise<T>,
			itemId?: string
		): Promise<{ success: boolean; data?: T; error?: Error }> => {
			setLoading(operationName, true, itemId);

			try {
				const result = await operation();
				setLoading(operationName, false, itemId);
				return { success: true, data: result };
			} catch (error) {
				setLoading(operationName, false, itemId);
				return {
					success: false,
					error:
						error instanceof Error
							? error
							: new Error(String(error)),
				};
			}
		},
		[setLoading]
	);

	const clearLoading = useCallback(
		(operationName: string, itemId?: string) => {
			const key = itemId ? `${operationName}:${itemId}` : operationName;
			setLoadingStates((prev) => {
				const newStates = { ...prev };
				delete newStates[key];
				return newStates;
			});
		},
		[]
	);

	const clearAllLoading = useCallback(() => {
		setLoadingStates({});
	}, []);

	return {
		loadingStates,
		isLoading,
		setLoading,
		executeWithLoading,
		clearLoading,
		clearAllLoading,
	};
}
