# Customer Architecture Documentation

This document explains the MVVM architecture implementation for Customer management in the WearReesh application.

## Overview

The Customer feature follows our MVVM (Model-View-ViewModel) architecture pattern with proper separation of concerns:

- **Model Layer**: Domain models and business logic
- **Repository Layer**: Data access and API interactions
- **ViewModel Layer**: State management and presentation logic
- **View Layer**: UI components
- **Global State**: Context provider for application-wide customer state

## File Structure

```
src/
├── models/customer/
│   ├── Customer.model.ts         # Domain model with business logic
│   ├── CustomerRepository.ts     # Data access layer
│   ├── Customer.actions.ts       # Server actions for API calls
│   ├── types.ts                  # TypeScript interfaces
│   └── index.ts                  # Exports
│
├── viewmodels/customer/
│   ├── useCustomerViewModel.ts   # React hook for state management
│   └── index.ts                  # Exports
│
├── views/user/
│   ├── ProfileView.tsx           # Customer profile UI component
│   └── index.ts                  # Exports
│
└── shared/components/customer/
    ├── CustomerContext.tsx       # Global state provider
    └── index.ts                  # Exports
```

## Architecture Components

### 1. Customer Model (`Customer.model.ts`)

The Customer model extends `BaseModel` and provides domain logic:

```typescript
import { Customer, Address } from "@/models/customer";

// Customer class provides:
- fullName: string
- displayName: string
- initials: string
- hasOrders: boolean
- hasAddresses: boolean
- isProfileComplete: boolean
- findAddress(addressId: string): Address | null
- shippingAddresses: Address[]
```

**Address Model** is also included for managing customer addresses.

### 2. Customer Repository (`CustomerRepository.ts`)

Handles data operations with the Shopify Customer Account API:

```typescript
import { CustomerRepository } from "@/models/customer";

const repository = new CustomerRepository();

// Available methods:
await repository.findById()           // Get current customer
await repository.isAuthenticated()    // Check auth status
await repository.refresh()            // Force refresh customer data
```

### 3. Customer ViewModel (`useCustomerViewModel.ts`)

React hook for managing customer state and actions:

```typescript
import { useCustomerViewModel } from "@/viewmodels/customer";

const {
  // State
  customer,              // Customer | null
  isAuthenticated,       // boolean
  error,                // string | null
  
  // Loading states
  isLoadingCustomer,    // boolean
  
  // Actions
  loadCustomer,         // () => Promise<void>
  logout,               // () => void
  clearError,           // () => void
  refreshCustomer,      // () => Promise<void>
  
  // Computed properties
  displayName,          // string
  initials,             // string
  hasOrders,            // boolean
  isProfileComplete,    // boolean
} = useCustomerViewModel();
```

## Global State Management

### CustomerProvider

The `CustomerProvider` wraps your application and provides customer state globally:

```typescript
// In layout.tsx (already configured)
import { CustomerProvider } from "@/shared/components/customer";

<CustomerProvider>
  {/* Your app components */}
</CustomerProvider>
```

### Using Customer State in Components

Access customer state anywhere in your app using the `useCustomer` hook:

```typescript
"use client";

import { useCustomer } from "@/shared/components/customer";

export function MyComponent() {
  const { 
    customer, 
    isAuthenticated, 
    displayName,
    logout 
  } = useCustomer();

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {displayName}!</h1>
      <p>Email: {customer?.email}</p>
      <p>Orders: {customer?.numberOfOrders}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

## Example Usage Patterns

### 1. Check Authentication Status

```typescript
"use client";

import { useCustomer } from "@/shared/components/customer";

export function ProtectedComponent() {
  const { isAuthenticated, isLoadingCustomer } = useCustomer();

  if (isLoadingCustomer) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please sign in to access this page</div>;
  }

  return <div>Protected content</div>;
}
```

### 2. Display Customer Information

```typescript
"use client";

import { useCustomer } from "@/shared/components/customer";

export function UserBadge() {
  const { customer, initials, displayName } = useCustomer();

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        <span className="text-white">{initials}</span>
      </div>
      <div>
        <p className="font-medium">{displayName}</p>
        <p className="text-sm text-muted-foreground">{customer?.email}</p>
      </div>
    </div>
  );
}
```

### 3. Access Customer Addresses

```typescript
"use client";

import { useCustomer } from "@/shared/components/customer";

export function ShippingAddresses() {
  const { customer } = useCustomer();

  if (!customer?.hasAddresses) {
    return <div>No addresses saved</div>;
  }

  return (
    <div>
      {customer.addresses.map((address) => (
        <div key={address.id}>
          <p>{address.fullName}</p>
          <p>{address.formattedSingleLine}</p>
        </div>
      ))}
    </div>
  );
}
```

### 4. Handle Logout

```typescript
"use client";

import { useCustomer } from "@/shared/components/customer";
import { Button } from "@/shared/components/ui/button";

export function LogoutButton() {
  const { logout, isAuthenticated } = useCustomer();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button onClick={logout} variant="outline">
      Sign Out
    </Button>
  );
}
```

## Server-Side Usage

For server components, use the Customer actions directly:

```typescript
import { getCustomer, isAuthenticated } from "@/models/customer";

export default async function ServerComponent() {
  // Check authentication
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    return <div>Please sign in</div>;
  }

  // Get customer data
  const customer = await getCustomer();

  return (
    <div>
      <h1>Welcome, {customer?.firstName}!</h1>
      <p>Email: {customer?.email}</p>
    </div>
  );
}
```

## Authentication Flow

### Login Flow

1. User clicks "Sign in with Shopify" button
2. Redirect to `/api/auth/login`
3. OAuth flow completes
4. Redirect back with session tokens
5. CustomerProvider automatically loads customer data
6. Customer state is available throughout the app

### Logout Flow

1. User clicks logout button
2. `logout()` redirects to `/api/auth/logout`
3. Session is cleared
4. Customer state is reset
5. User is redirected to home page

## Best Practices

### 1. Use the Global Context

Instead of calling `useCustomerViewModel()` in multiple components, use the global `useCustomer()` hook:

```typescript
// ✅ Good
import { useCustomer } from "@/shared/components/customer";

// ❌ Bad (creates separate state instances)
import { useCustomerViewModel } from "@/viewmodels/customer";
```

### 2. Handle Loading States

Always check loading states before displaying content:

```typescript
const { customer, isLoadingCustomer } = useCustomer();

if (isLoadingCustomer) {
  return <Skeleton />;
}
```

### 3. Check Authentication First

Before accessing customer properties, verify authentication:

```typescript
const { customer, isAuthenticated } = useCustomer();

if (!isAuthenticated || !customer) {
  return <SignInPrompt />;
}

// Safe to access customer properties
return <div>{customer.email}</div>;
```

### 4. Use Computed Properties

The viewModel provides computed properties for common operations:

```typescript
// ✅ Good
const { displayName, initials, hasOrders } = useCustomer();

// ❌ Bad (doing the same logic in components)
const displayName = customer?.firstName || customer?.email || "Guest";
```

## TypeScript Types

### Customer Type

```typescript
interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  numberOfOrders: number;
  addresses: Address[];
  defaultAddress?: Address;
  
  // Computed properties
  fullName: string;
  displayName: string;
  initials: string;
  hasOrders: boolean;
  hasAddresses: boolean;
  isProfileComplete: boolean;
}
```

### Address Type

```typescript
interface Address {
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
  
  // Computed properties
  fullName: string;
  formattedSingleLine: string;
  formattedMultiLine: string[];
  isComplete: boolean;
}
```

## Integration with Existing Features

### Cart Integration

The customer state can be used alongside cart state:

```typescript
import { useCustomer } from "@/shared/components/customer";
import { useCart } from "@/shared/components/cart";

export function CheckoutButton() {
  const { isAuthenticated } = useCustomer();
  const { checkoutUrl, isEmpty } = useCart();

  if (isEmpty) {
    return null;
  }

  if (!isAuthenticated) {
    return <Link href="/account">Sign in to checkout</Link>;
  }

  return <Link href={checkoutUrl}>Proceed to Checkout</Link>;
}
```

## Troubleshooting

### Customer Not Loading

1. Check if CustomerProvider is wrapping your app in layout.tsx
2. Verify OAuth authentication is working
3. Check browser console for errors
4. Verify session cookies are being set

### Stale Customer Data

Use `refreshCustomer()` to force reload:

```typescript
const { refreshCustomer } = useCustomer();

// After updating customer info
await refreshCustomer();
```

### Type Errors

Make sure to import types from the correct location:

```typescript
import type { CustomerType } from "@/models/customer";
```

## Related Documentation

- [MVVM-ARCHITECTURE.md](./MVVM-ARCHITECTURE.md) - Overall architecture guide
- Customer Account API Authentication (see auth routes in `src/app/api/auth/`)

