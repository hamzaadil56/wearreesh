# E-Commerce Application Architecture

_Based on Vercel Commerce Patterns_

## 🏗️ Architecture Overview

This application follows the architectural patterns established by [Vercel Commerce](https://github.com/vercel/commerce), a high-performance, server-rendered e-commerce platform built with Next.js 15. The architecture leverages modern React features including React Server Components, Server Actions, Suspense, and useOptimistic to deliver exceptional performance and user experience.

## 🎯 Core Architectural Principles

### 1. **Server-First Architecture**

-   **React Server Components (RSC)**: Components render on the server by default, reducing client-side JavaScript bundle
-   **Server Actions**: Handle data mutations and server-side operations securely
-   **Edge Runtime**: Optimized for global performance with low-latency responses
-   **Streaming**: Progressive rendering with Suspense boundaries

### 2. **Component-Driven Design**

-   **Composable Components**: Modular, reusable UI components
-   **Separation of Concerns**: Clear distinction between server and client components
-   **Progressive Enhancement**: Works without JavaScript, enhanced with it

### 3. **Performance-Optimized**

-   **Zero JavaScript by default**: Server components don't ship JavaScript to client
-   **Optimistic Updates**: Immediate UI feedback during interactions
-   **Image Optimization**: Next.js Image component with automatic optimization
-   **Code Splitting**: Automatic route-based code splitting

## 📁 Project Structure

Based on Vercel Commerce architecture patterns:

```
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Route groups
│   │   ├── cart/                 # Cart functionality
│   │   ├── product/              # Product pages
│   │   ├── search/               # Search functionality
│   │   └── collections/          # Product collections
│   ├── api/                      # API routes
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Reusable UI components
│   ├── layout/                   # Layout components
│   │   ├── navbar/               # Navigation components
│   │   ├── footer/               # Footer components
│   │   └── mobile-menu/          # Mobile navigation
│   ├── product/                  # Product-related components
│   │   ├── gallery/              # Product image gallery
│   │   ├── variant-selector/     # Product options selector
│   │   └── product-description/  # Product details
│   ├── cart/                     # Shopping cart components
│   │   ├── cart-modal/           # Cart slide-in panel
│   │   ├── edit-item-quantity/   # Quantity controls
│   │   └── delete-item/          # Remove item controls
│   ├── grid/                     # Display grid components
│   │   ├── three-item-grid/      # Featured products grid
│   │   ├── product-grid-items/   # Product listing grid
│   │   └── grid-tile-image/      # Consistent image display
│   └── ui/                       # Base UI components
│       ├── button/               # Button variations
│       ├── input/                # Form inputs
│       └── modal/                # Modal dialogs
├── lib/                          # Utilities and configurations
│   ├── shopify/                  # Shopify integration
│   │   ├── index.ts              # Main Shopify client
│   │   ├── queries/              # GraphQL queries
│   │   ├── mutations/            # GraphQL mutations
│   │   └── types.ts              # Shopify type definitions
│   ├── utils/                    # Utility functions
│   └── constants.ts              # Application constants
├── public/                       # Static assets
└── styles/                       # Additional styles
```

## 🏛️ Core Component Architecture

### **Layout Components**

#### **Navbar (Server Component)**

The main navbar is a server component that imports client components only where interactivity is needed:

```typescript
// components/layout/navbar.tsx
import Link from "next/link";
import { User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchInput } from "./search-input";
import { MobileMenu } from "./mobile-menu";

export function Navbar() {
	const cartItemCount = 0; // Dynamic from server state

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Static navigation links - Server Component */}
					<div className="hidden md:flex items-center space-x-8">
						{navigationLinks.map((link) => (
							<Link key={link.name} href={link.href}>
								{link.name}
							</Link>
						))}
					</div>

					{/* Logo - Server Component */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-2">
							<div className="h-8 w-8 rounded bg-primary">
								<span className="text-primary-foreground font-bold">
									W
								</span>
							</div>
							<span className="font-bold text-xl">Wearreesh</span>
						</Link>
					</div>

					{/* Desktop actions */}
					<div className="hidden md:flex items-center space-x-4">
						{/* Interactive search - Client Component */}
						<SearchInput placeholder="Search..." className="w-64" />

						{/* Static links - Server Components */}
						<Button variant="ghost" size="icon" asChild>
							<Link href="/account">
								<User className="h-5 w-5" />
							</Link>
						</Button>

						<Button variant="ghost" size="icon" asChild>
							<Link href="/cart">
								<ShoppingCart className="h-5 w-5" />
								{cartItemCount > 0 && (
									<Badge variant="destructive">
										{cartItemCount}
									</Badge>
								)}
							</Link>
						</Button>

						{/* Interactive theme toggle - Client Component */}
						<ModeToggle />
					</div>

					{/* Mobile menu - Client Component */}
					<div className="md:hidden">
						<MobileMenu />
					</div>
				</div>
			</div>
		</nav>
	);
}
```

#### **Search Input (Client Component)**

Interactive search component with state management:

```typescript
"use client";

// components/layout/search-input.tsx
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchInput({ placeholder, className, onSearch }) {
	const [query, setQuery] = useState("");

	const handleSearch = (searchQuery: string) => {
		setQuery(searchQuery);
		onSearch?.(searchQuery);
	};

	return (
		<div className={cn("relative", className)}>
			<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
			<Input
				type="search"
				placeholder={placeholder}
				className="pl-10"
				value={query}
				onChange={(e) => handleSearch(e.target.value)}
			/>
			{query && (
				<Button onClick={() => handleSearch("")}>
					<X className="h-3 w-3" />
				</Button>
			)}
		</div>
	);
}
```

#### **Mobile Menu (Client Component)**

Full-screen mobile menu that slides up from the bottom with enhanced UX:

```typescript
"use client";

// components/layout/mobile-menu.tsx
import { Menu, X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function MobileMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Prevent body scroll when menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	// Close menu on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsOpen(false);
		};
		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		}
		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen]);

	return (
		<>
			{/* Menu Trigger */}
			<Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
				<Menu className="h-5 w-5" />
			</Button>

			{/* Full Screen Overlay */}
			{isOpen && (
				<div className="fixed inset-0 z-50 md:hidden">
					{/* Background Overlay */}
					<div
						className="fixed inset-0 bg-black/50 backdrop-blur-sm"
						onClick={() => setIsOpen(false)}
					/>

					{/* Menu Panel - Slides up from bottom */}
					<div className="fixed bottom-0 left-0 right-0 h-full bg-background animate-in slide-in-from-bottom-full">
						{/* Menu Header with Logo and Close Button */}
						<div className="flex items-center justify-between p-4 border-b">
							<div className="flex items-center space-x-2">
								<div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
									<span className="text-primary-foreground font-bold">
										W
									</span>
								</div>
								<span className="font-bold text-xl">
									Wearreesh
								</span>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsOpen(false)}
							>
								<X className="h-6 w-6" />
							</Button>
						</div>

						{/* Scrollable Menu Content */}
						<div className="flex flex-col h-full overflow-y-auto">
							<div className="flex-1 px-4 py-6 space-y-8">
								{/* Organized sections with headers */}
								<div className="space-y-2">
									<h3 className="text-sm font-medium text-muted-foreground uppercase">
										Search
									</h3>
									<div className="relative">
										<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
										<Input
											type="search"
											placeholder="Search products..."
											className="pl-10 h-12 text-lg"
											value={searchQuery}
											onChange={(e) =>
												setSearchQuery(e.target.value)
											}
										/>
									</div>
								</div>

								{/* Navigation, Account, Theme sections... */}
							</div>

							{/* Footer */}
							<div className="border-t p-4 bg-muted/20">
								<p className="text-center text-sm text-muted-foreground">
									&copy; 2024 Wearreesh. All rights reserved.
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
```

## 🌙 Dark Mode Implementation

The application includes comprehensive dark mode support following [shadcn/ui patterns](https://ui.shadcn.com/docs/dark-mode/next), providing users with light, dark, and system preference options.

### **Theme Provider Setup**

The theme system is built using `next-themes` and integrated at the root layout level:

```typescript
// src/components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### **Root Layout Integration**

```typescript
// src/app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
```

### **Mode Toggle Component**

```typescript
// src/components/mode-toggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
```

### **Dark Mode CSS Classes**

Tailwind CSS automatically handles dark mode through the `dark:` prefix:

```typescript
// Example usage in components
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
	<p className="text-gray-600 dark:text-gray-300">Content</p>
	<Image className="dark:invert" src="/logo.svg" alt="Logo" />
</div>
```

### **Theme Configuration**

The theme system supports:

-   **Light Mode**: Default light theme
-   **Dark Mode**: Dark theme with proper contrast ratios
-   **System Mode**: Automatically follows OS preference
-   **Smooth Transitions**: Disabled to prevent flash during SSR
-   **Hydration Safe**: Uses `suppressHydrationWarning` to prevent mismatches

## 🛠️ Development Guidelines

### **Component Creation Rules**

#### **Server Components (Default)**

-   No `'use client'` directive required
-   Can directly access databases/APIs
-   Cannot use hooks or browser APIs
-   Should handle data fetching and initial rendering
-   Automatically tree-shaken from client bundle

#### **Client Components**

-   Must include `'use client'` directive at the top
-   Can use hooks and browser APIs
-   Should handle user interactions and dynamic state
-   Cannot directly access server resources
-   Should be used sparingly for optimal performance

### **File Organization Patterns**

```typescript
// components/feature/component-name/
├── index.tsx              # Main component
├── actions.ts            # Server actions (if needed)
├── types.ts              # TypeScript definitions
└── README.md             # Component documentation
```

### **Naming Conventions**

```
PascalCase.tsx            # React components
kebab-case/               # Directories
camelCase.ts              # Utilities and helpers
UPPER_SNAKE_CASE.ts       # Constants
```

## 🚀 Performance Optimization Strategies

### **1. Server Components Benefits**

-   **Zero JavaScript Impact**: Server components don't add to client bundle
-   **Direct Data Access**: Can directly query databases without API layers
-   **SEO Optimized**: Fully rendered HTML sent to client
-   **Faster Initial Load**: No JavaScript execution needed for initial render

### **2. Image Optimization**

```typescript
import Image from "next/image";

// Optimized product images
<Image
	src={product.featuredImage.url}
	alt={product.featuredImage.altText}
	fill
	sizes="(min-width: 1024px) 50vw, 100vw"
	className="object-cover"
	priority={isAboveFold}
/>;
```

## 🔧 Technology Stack

### **Core Framework**

-   **Next.js 15**: React framework with App Router and RSC
-   **React 19**: Latest React with Server Components and Actions
-   **TypeScript**: Type safety and enhanced developer experience

### **Styling & UI**

-   **Tailwind CSS**: Utility-first CSS framework
-   **shadcn/ui**: High-quality, accessible UI components built on Radix UI
-   **next-themes**: Theme switching with system preference support
-   **Lucide React**: Beautiful, customizable icons
-   **clsx**: Conditional className utility

### **Data Management**

-   **Shopify Storefront API**: Primary e-commerce data source
-   **GraphQL**: Query language for efficient data fetching
-   **Server Actions**: Handle mutations and server-side operations

### **Development & Build Tools**

-   **Turbopack**: Next.js bundler for fast development
-   **ESLint**: Code linting and quality enforcement
-   **Prettier**: Code formatting

## 🌍 Environment Configuration

### **Required Environment Variables**

```bash
# Commerce Provider (Shopify)
SHOPIFY_STORE_DOMAIN=your-shop-name.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token

# Application
SITE_NAME="Your Store Name"
TWITTER_CREATOR="@yourhandle"
TWITTER_SITE="@yourhandle"

# Optional
COMPANY_NAME="Your Company"
SHOPIFY_REVALIDATION_SECRET=your_webhook_secret
```

### **Development Setup**

```bash
# Clone and install
git clone <repository-url>
cd <project-directory>
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
pnpm dev
```

## 📋 Implementation Checklist

When building features, ensure you follow these patterns:

### **✅ Component Development**

-   [ ] Determine if component needs client-side interactivity
-   [ ] Use Server Component by default, Client Component only when necessary
-   [ ] Implement proper TypeScript types
-   [ ] Add loading states with Suspense boundaries
-   [ ] Handle error states gracefully
-   [ ] Optimize images with Next.js Image component
-   [ ] Ensure accessibility (ARIA labels, keyboard navigation)
-   [ ] Add dark mode support with `dark:` classes
-   [ ] Test component in both light and dark themes

### **✅ Data Management**

-   [ ] Use Server Actions for mutations
-   [ ] Implement proper error handling
-   [ ] Add revalidation tags for cache management
-   [ ] Use TypeScript for API response types
-   [ ] Handle loading and error states in UI

### **✅ Performance**

-   [ ] Minimize client-side JavaScript
-   [ ] Use dynamic imports for large components
-   [ ] Implement proper image optimization
-   [ ] Add appropriate caching headers
-   [ ] Use Suspense for progressive loading

## 📚 References

-   [Vercel Commerce Repository](https://github.com/vercel/commerce)
-   [Next.js App Router Documentation](https://nextjs.org/docs/app)
-   [React Server Components](https://react.dev/reference/react/use-server)
-   [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
-   [Tailwind CSS](https://tailwindcss.com/docs)

---

**This README serves as the architectural foundation for all development tasks. Always refer to these patterns and principles when implementing new features or modifying existing code.**
