"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { BaseViewModel } from "@/viewmodels/core/BaseViewModel";
import { ViewModelState } from "@/models/core/types";

/**
 * Hook for using ViewModels in React components
 */
export function useViewModel<T extends BaseViewModel>(
	viewModel: T,
	autoLoad?: boolean
): {
	viewModel: T;
	state: ViewModelState;
	isLoading: boolean;
	hasError: boolean;
	error: string | null;
	refresh: () => void;
} {
	const [, forceUpdate] = useState({});

	// Force re-render when ViewModel state changes
	const refresh = useCallback(() => {
		forceUpdate({});
	}, []);

	// Auto-refresh when ViewModel state changes
	useEffect(() => {
		// Set up a simple polling mechanism to check for state changes
		// In a more sophisticated implementation, ViewModels could emit events
		const interval = setInterval(() => {
			refresh();
		}, 100);

		return () => clearInterval(interval);
	}, [refresh]);

	// Auto-load data if specified
	useEffect(() => {
		if (autoLoad && typeof (viewModel as any).loadData === "function") {
			(viewModel as any).loadData();
		}
	}, [viewModel, autoLoad]);

	const state = useMemo(() => viewModel.state, [viewModel, forceUpdate]);

	return {
		viewModel,
		state,
		isLoading: viewModel.isLoading,
		hasError: viewModel.hasError,
		error: viewModel.error,
		refresh,
	};
}

/**
 * Hook for managing ViewModel lifecycle
 */
export function useViewModelLifecycle<T extends BaseViewModel>(
	createViewModel: () => T,
	dependencies: any[] = []
): T {
	const [viewModel] = useState<T>(createViewModel);

	// Recreate ViewModel when dependencies change
	useEffect(() => {
		// In a more sophisticated implementation, we might want to
		// recreate the ViewModel or update its dependencies
	}, dependencies);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			// Cleanup ViewModel if it has a cleanup method
			if (typeof (viewModel as any).cleanup === "function") {
				(viewModel as any).cleanup();
			}
		};
	}, [viewModel]);

	return viewModel;
}
