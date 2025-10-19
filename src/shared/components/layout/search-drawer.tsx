"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Form from "next/form";
import { Button } from "@/shared/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/shared/components/ui/drawer";
import { Input } from "@/shared/components/ui/input";
import { SearchButton } from "./search-button";
import { cn } from "@/shared/lib/utils";

export function SearchDrawer() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus input when drawer opens
	useEffect(() => {
		if (open && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [open]);

	// Clear search when drawer closes
	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			setQuery("");
		}
	};

	return (
		<Drawer
			open={open}
			onOpenChange={handleOpenChange}
			shouldScaleBackground={false}
		>
			<DrawerTrigger asChild>
				<Button variant="ghost" size="icon">
					<Search className="h-5 w-5" />
					<span className="sr-only">Search</span>
				</Button>
			</DrawerTrigger>
			<DrawerContent
				className={cn(
					"fixed inset-0 z-50 flex flex-col bg-background",
					"w-screen h-screen max-w-none max-h-none",
					"rounded-none border-0 m-0 p-0",
					"transition-transform duration-300 ease-out"
				)}
			>
				<DrawerTitle className="sr-only">Search Products</DrawerTitle>

				{/* Header Section */}
				<div className="flex-shrink-0 border-b">
					<div className="container mx-auto px-4 sm:px-6 py-6">
						<div className="flex items-center justify-between gap-4 mb-6">
							<h2 className="text-xl sm:text-2xl font-bold">
								Search Products
							</h2>
							<DrawerClose asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-9 w-9 rounded-full"
								>
									<X className="h-5 w-5" />
									<span className="sr-only">
										Close search
									</span>
								</Button>
							</DrawerClose>
						</div>

						{/* Search Form using Next.js Form component */}
						<Form
							action="/search"
							className="relative"
							onSubmit={() => {
								// Close drawer when form submits
								setOpen(false);
							}}
						>
							<Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
							<Input
								ref={inputRef}
								type="search"
								name="query"
								placeholder="Search for products..."
								className={cn(
									"pl-10 sm:pl-12 pr-24 h-12 sm:h-14 text-base",
									query && "pr-24"
								)}
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								autoComplete="off"
							/>
							<div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
								{query && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-9 w-9"
										onClick={() => setQuery("")}
									>
										<X className="h-4 w-4" />
										<span className="sr-only">
											Clear search
										</span>
									</Button>
								)}
								<SearchButton />
							</div>
						</Form>

						{/* Search Tips */}
						<div className="mt-4 space-y-2">
							<p className="text-xs sm:text-sm text-muted-foreground">
								Try searching for product names, categories, or
								keywords
							</p>
							{query && (
								<p className="text-xs text-muted-foreground">
									Press Enter or click Search to see results
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Content Section - Search Tips & Popular Searches */}
				<div className="flex-1 overflow-y-auto">
					<div className="container mx-auto px-4 sm:px-6 py-8">
						<div className="max-w-2xl">
							{/* Quick Search Tips */}
							<div className="mb-8">
								<h3 className="text-sm font-semibold mb-3">
									Search Tips
								</h3>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li className="flex items-start gap-2">
										<span className="text-primary mt-0.5">
											•
										</span>
										<span>
											Use specific keywords for better
											results
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-0.5">
											•
										</span>
										<span>
											Search by product name, category, or
											type
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-0.5">
											•
										</span>
										<span>
											Try different variations if you
											don't find what you're looking for
										</span>
									</li>
								</ul>
							</div>

							{/* Popular Categories */}
							<div>
								<h3 className="text-sm font-semibold mb-3">
									Popular Categories
								</h3>
								<div className="flex flex-wrap gap-2">
									{[
										"New Arrivals",
										"Best Sellers",
										"Sale",
										"Featured",
									].map((category) => (
										<button
											key={category}
											type="button"
											onClick={() => setQuery(category)}
											className="px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-muted/80 transition-colors"
										>
											{category}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
