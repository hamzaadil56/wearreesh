"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { ResponsiveProductsLayout } from "./ResponsiveProductsLayout";

interface ProductsLayoutClientProps {
	children: ReactNode;
	optionsData: Array<{
		name: string;
		values: Array<{ value: string; count: number }>;
	}>;
}

export function ProductsLayoutClient({
	children,
	optionsData,
}: ProductsLayoutClientProps) {
	const [itemCount, setItemCount] = useState(0);

	// Function to extract item count from ProductsView component
	useEffect(() => {
		// Look for products grid in the DOM to get item count
		const updateItemCount = () => {
			const productsGrid = document.querySelector("[data-products-grid]");
			if (productsGrid) {
				const count = productsGrid.getAttribute("data-item-count");
				if (count) {
					setItemCount(parseInt(count, 10));
				}
			}
		};

		// Initial count
		updateItemCount();

		// Set up observer to watch for changes
		const observer = new MutationObserver(updateItemCount);
		const targetNode = document.body;
		observer.observe(targetNode, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["data-item-count"],
		});

		return () => observer.disconnect();
	}, []);

	return (
		<ResponsiveProductsLayout
			optionsData={optionsData}
			itemCount={itemCount}
		>
			{children}
		</ResponsiveProductsLayout>
	);
}
