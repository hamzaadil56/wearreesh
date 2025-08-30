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

```typescript
// components/layout/navbar/index.tsx
export default async function Navbar() {
	const menu = await getMenu("next-js-frontend-header-menu");

	return (
		<nav className="relative flex items-center justify-between p-4 lg:px-6">
			<div className="flex w-full items-center">
				<div className="flex w-full md:w-1/3">
					<Link
						href="/"
						className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
					>
						<LogoSquare />
					</Link>
					{menu.length ? (
						<ul className="hidden gap-6 text-sm md:flex md:items-center">
							{menu.map((item: Menu) => (
								<NavItem key={item.title} item={item} />
							))}
						</ul>
					) : null}
				</div>
				<div className="hidden justify-center md:flex md:w-1/3">
					<Search />
				</div>
				<div className="flex justify-end md:w-1/3">
					<CartModal />
				</div>
			</div>
		</nav>
	);
}
```

#### **Mobile Menu (Client Component)**

```typescript
"use client";

// components/layout/mobile-menu/index.tsx
export default function MobileMenu({ menu }: { menu: Menu[] }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button onClick={() => setIsOpen(!isOpen)}>
				<Bars3Icon className="h-6" />
			</button>

			{isOpen && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-80">
					<div className="relative h-full w-full bg-white p-6">
						<ul className="flex flex-col">
							{menu.map((item) => (
								<MobileMenuItem key={item.title} item={item} />
							))}
						</ul>
					</div>
				</div>
			)}
		</>
	);
}
```

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
-   **Headless UI**: Unstyled, accessible UI components
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
