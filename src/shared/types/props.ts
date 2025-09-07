import type { IIndividualProductViewModel } from "@/viewmodels/products/IndividualProductViewModel";
import type { ProductViewModel } from "@/viewmodels/products/ProductsViewModel";

// ============================================================================
// PRODUCTS WITH FILTERS COMPONENT PROPS
// ============================================================================

export interface ProductsWithFilterProps {
	products: ProductViewModel[];
	totalCount: number;
}

export interface EmptyProductsViewProps {
	hasFilters?: boolean;
}

// ============================================================================
// PRODUCT FILTERS SECTION COMPONENT PROPS
// ============================================================================

export interface FilterSectionProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}

export interface SizeOptionProps {
	size: string;
	count: number;
	selected: boolean;
	onClick: () => void;
}

// ============================================================================
// PRODUCT SORT COMPONENT PROPS
// ============================================================================

// ============================================================================
// PRODUCT FILTERS COMPONENT PROPS (Mobile/Sheet version)
// ============================================================================

// ============================================================================
// PRODUCT CARD COMPONENT PROPS
// ============================================================================

export interface ProductCardProps {
	product: ProductViewModel;
}

// ============================================================================
// REUSABLE FILTER INTERFACES
// ============================================================================

// ============================================================================
// COMMON UI COMPONENT PROPS
// ============================================================================

export interface CollapsibleSectionProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
	className?: string;
}

export interface FilterToggleProps {
	label: string;
	count?: number;
	selected: boolean;
	onClick: () => void;
	variant?: "button" | "checkbox";
	className?: string;
}

export interface ProductOptionsProps {
	viewModel: IIndividualProductViewModel;
}
