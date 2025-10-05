# MVVM Architecture Documentation

## 🏗️ Architecture Overview

This application now follows a complete **MVVM (Model-View-ViewModel)** architecture pattern, providing clear separation of concerns, improved testability, and better maintainability.

## 📁 Project Structure

```
src/
├── models/                     # Domain Models & Business Logic (M)
│   ├── core/                   # Core MVVM infrastructure
│   │   ├── BaseModel.ts        # Base class for all models
│   │   ├── Repository.ts       # Repository pattern implementation
│   │   └── types.ts            # Core type definitions
│   ├── product/                # Product domain
│   │   ├── Product.model.ts    # Product domain model
│   │   └── ProductRepository.ts # Product data access
│   ├── collection/             # Collection domain
│   ├── cart/                   # Cart domain
│   ├── user/                   # User domain
│   └── index.ts                # Barrel exports
│
├── viewmodels/                 # Presentation Logic & State (VM)
│   ├── core/                   # Core ViewModel infrastructure
│   │   ├── BaseViewModel.ts    # Base class for all ViewModels
│   │   └── ViewModelStore.ts   # Global ViewModel state management
│   ├── products/               # Product presentation logic
│   │   └── ProductsViewModel.ts # Products list state & operations
│   ├── navigation/             # Navigation state management
│   ├── cart/                   # Cart state management
│   └── index.ts                # Barrel exports
│
├── views/                      # UI Components (V)
│   ├── products/               # Product-related views
│   │   └── ProductsView.tsx    # Products list UI component
│   ├── navigation/             # Navigation views
│   ├── cart/                   # Cart views
│   └── index.ts                # Barrel exports
│
├── infrastructure/             # External Services & APIs
│   ├── api/                    # API clients
│   │   └── shopify-client.ts   # Shopify API wrapper
│   └── services/               # Business services
│       ├── cache.service.ts    # Caching service
│       ├── products.service.ts # Product business service
│       └── collections.service.ts # Collection business service
│
└── shared/                     # Shared Resources (moved from root)
    ├── components/             # Moved from src/components/
    ├── lib/                    # Moved from src/lib/
    ├── utils/                  # Moved from src/utils/
    └── hooks/                  # MVVM-specific React hooks
        └── useViewModel.ts     # ViewModel integration hook
```

## 🎯 MVVM Layers Explained

### **Model Layer (M)**

-   **Purpose**: Domain models, business logic, and data access
-   **Responsibilities**:
    -   Define domain entities (Product, Cart, User, etc.)
    -   Implement business rules and validation
    -   Handle data persistence and retrieval
    -   Repository pattern for data access abstraction

**Example: Product Model**

```typescript
export class Product extends BaseModel {
	// Domain properties
	public readonly title: string;
	public readonly price: Money;

	// Business logic methods
	get formattedPrice(): string {
		return this.formatPrice(this.price.amount, this.price.currencyCode);
	}

	hasTag(tag: string): boolean {
		return this.tags.includes(tag);
	}
}
```

### **ViewModel Layer (VM)**

-   **Purpose**: Presentation logic and state management
-   **Responsibilities**:
    -   Manage UI state and loading states
    -   Transform domain models for UI consumption
    -   Handle user interactions and business operations
    -   Coordinate between Models and Views

**Example: Products ViewModel**

```typescript
export class ProductsViewModel extends BaseViewModel {
	private repository: ProductRepository;

	async loadProducts(): Promise<void> {
		const result = await this.executeOperation(
			() => this.repository.search(params),
			"Failed to load products"
		);

		if (result.success) {
			this.updateViewState({
				products: result.data.map((p) => this.mapToViewModel(p)),
			});
		}
	}
}
```

### **View Layer (V)**

-   **Purpose**: Pure UI components and rendering
-   **Responsibilities**:
    -   Render UI based on ViewModel state
    -   Handle user input and delegate to ViewModel
    -   No business logic or direct data access
    -   React components with clear props interfaces

**Example: Products View**

```typescript
export default function ProductsView({ viewModel }: ProductsViewProps) {
	const { products, isLoading } = viewModel.viewState;

	if (isLoading) return <LoadingView />;

	return (
		<div>
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
```

## 🔄 Data Flow

```
User Interaction
      ↓
View Component
      ↓
ViewModel (handles interaction)
      ↓
Repository (data access)
      ↓
External API (Shopify)
      ↓
Domain Model (business logic)
      ↓
ViewModel (transforms for UI)
      ↓
View Component (renders UI)
```

## 🚀 Key Benefits

### **1. Separation of Concerns**

-   **Models**: Pure business logic, no UI dependencies
-   **ViewModels**: Presentation logic, no direct UI manipulation
-   **Views**: Pure UI, no business logic

### **2. Testability**

```typescript
// Easy to unit test business logic
describe("Product", () => {
	it("should format price correctly", () => {
		const product = new Product(mockData);
		expect(product.formattedPrice).toBe("$29.99");
	});
});

// Easy to test presentation logic
describe("ProductsViewModel", () => {
	it("should load products", async () => {
		const mockRepository = new MockProductRepository();
		const viewModel = new ProductsViewModel(mockRepository);

		await viewModel.loadProducts();

		expect(viewModel.products).toHaveLength(5);
	});
});
```

### **3. Reusability**

-   ViewModels can be reused across different Views
-   Models contain pure business logic, reusable anywhere
-   Clear interfaces make components easily replaceable

### **4. Maintainability**

-   Clear folder structure and naming conventions
-   Each layer has single responsibility
-   Easy to locate and modify specific functionality

## 🛠️ Usage Examples

### **Creating a New Feature**

1. **Define the Domain Model**

```typescript
// src/models/order/Order.model.ts
export class Order extends BaseModel {
	constructor(data: OrderData) {
		super(data);
		// Initialize order properties
	}

	get totalAmount(): string {
		return this.formatPrice(this.total);
	}
}
```

2. **Create Repository**

```typescript
// src/models/order/OrderRepository.ts
export class OrderRepository extends BaseRepository<Order> {
	async findByUserId(userId: string): Promise<Order[]> {
		// Implementation
	}
}
```

3. **Build ViewModel**

```typescript
// src/viewmodels/orders/OrdersViewModel.ts
export class OrdersViewModel extends BaseViewModel {
	async loadUserOrders(userId: string): Promise<void> {
		// Load and transform orders
	}
}
```

4. **Create View Component**

```typescript
// src/views/orders/OrdersView.tsx
export function OrdersView({ viewModel }: OrdersViewProps) {
	// Render orders UI
}
```

### **Using ViewModels in React Components**

```typescript
// Server Component (Next.js)
export default async function OrdersPage() {
	const repository = new OrderRepository();
	const viewModel = new OrdersViewModel(repository);

	await viewModel.loadUserOrders(userId);

	return <OrdersView viewModel={viewModel} />;
}

// Client Component with hooks
("use client");
export function InteractiveOrdersView() {
	const viewModel = useViewModelLifecycle(() => new OrdersViewModel());
	const { isLoading, error } = useViewModel(viewModel);

	return (
		<div>
			{isLoading && <LoadingSpinner />}
			{error && <ErrorMessage error={error} />}
			<OrdersList viewModel={viewModel} />
		</div>
	);
}
```

## 📋 Migration Checklist

-   ✅ **Folder Structure**: Created MVVM directory structure
-   ✅ **Core Infrastructure**: BaseModel, BaseViewModel, Repository pattern
-   ✅ **Domain Models**: Product, Collection, Cart, User models
-   ✅ **Repositories**: Data access layer with caching
-   ✅ **ViewModels**: Presentation logic for all features
-   ✅ **Views**: Pure UI components
-   ✅ **Services**: Business services and API clients
-   ✅ **Hooks**: React integration hooks
-   ✅ **Migration**: Updated existing components to use MVVM
-   ✅ **Aliases**: Updated import aliases in components.json

## 🔧 Development Guidelines

### **Adding New Models**

1. Extend `BaseModel`
2. Implement required abstract methods
3. Add business logic methods
4. Create corresponding Repository
5. Add to barrel exports

### **Creating ViewModels**

1. Extend `BaseViewModel`
2. Define view state interface
3. Implement data loading methods
4. Add user interaction handlers
5. Transform domain models to view models

### **Building Views**

1. Define clear props interface
2. Use ViewModel for all data and state
3. Handle loading and error states
4. Keep components pure (no side effects)
5. Delegate user actions to ViewModel

### **Testing Strategy**

-   **Models**: Unit test business logic
-   **Repositories**: Mock external dependencies
-   **ViewModels**: Test state management and transformations
-   **Views**: Component testing with mock ViewModels

## 🎉 Success!

Your application now follows a complete MVVM architecture with:

-   ✨ **Clean separation** of concerns
-   🧪 **Highly testable** codebase
-   🔄 **Reusable components** and logic
-   📈 **Scalable architecture** for future growth
-   🛠️ **Maintainable code** structure

The existing Next.js 15 + React Server Components architecture is preserved while adding proper MVVM patterns for better organization and maintainability.
