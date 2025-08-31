"use client";

import * as React from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { CollectionsList, CollectionsListSkeleton } from "./collections-list";

const navigationLinks = [
	{ name: "Shop", href: "/shop" },
	{ name: "About Us", href: "/about" },
];

export function MobileMenu() {
	const [showCollections, setShowCollections] = React.useState(false);

	return (
		<Drawer shouldScaleBackground={false}>
			<DrawerTrigger asChild>
				<Button variant="ghost" size="icon">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DrawerTrigger>
			<DrawerContent className="fixed inset-0 z-50 flex flex-col bg-background p-0 max-w-none w-screen h-screen rounded-none border-0 m-0">
				{/* Header with Close Button */}
				<DrawerHeader className="flex items-center justify-between p-4 border-b">
					<DrawerTitle>Menu</DrawerTitle>
					<DrawerClose asChild>
						<Button variant="ghost" size="icon">
							<X className="h-5 w-5" />
							<span className="sr-only">Close menu</span>
						</Button>
					</DrawerClose>
				</DrawerHeader>

				{/* Navigation Content */}
				<div className="flex-1 overflow-y-auto p-4">
					{!showCollections ? (
						// Main Menu
						<div className="space-y-2">
							{navigationLinks.map((link) => {
								if (link.name === "Shop") {
									return (
										<button
											key={link.name}
											onClick={() =>
												setShowCollections(true)
											}
											className="flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors hover:bg-muted"
										>
											<span className="text-lg font-medium">
												{link.name}
											</span>
											<ChevronRight className="h-5 w-5" />
										</button>
									);
								}
								return (
									<DrawerClose key={link.name} asChild>
										<Link
											href={link.href}
											className="flex w-full items-center rounded-lg p-4 text-lg font-medium transition-colors hover:bg-muted"
										>
											{link.name}
										</Link>
									</DrawerClose>
								);
							})}
						</div>
					) : (
						// Collections Menu
						<div>
							<div className="mb-4">
								<button
									onClick={() => setShowCollections(false)}
									className="flex items-center text-sm text-muted-foreground hover:text-foreground"
								>
									← Back to Menu
								</button>
								<h2 className="mt-2 text-lg font-semibold">
									Shop Collections
								</h2>
								<p className="text-sm text-muted-foreground">
									Browse our curated collections
								</p>
							</div>
							<Suspense fallback={<CollectionsListSkeleton />}>
								<CollectionsList />
							</Suspense>
						</div>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
