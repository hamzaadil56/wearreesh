"use client";

import * as React from "react";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/shared/components/ui/drawer";

const bottomNavigationLinks = [
	{ name: "About Us", href: "/about" },
	{ name: "Contact Us", href: "/contact" },
];

export function MobileMenu({
	CollectionLists,
}: {
	CollectionLists: React.ReactNode;
}) {
	return (
		<Drawer shouldScaleBackground={false}>
			<DrawerTrigger asChild>
				<Button variant="ghost" size="icon">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DrawerTrigger>
			<DrawerContent
				className="fixed inset-0 z-50 flex flex-col bg-background p-0 max-w-none w-screen h-screen rounded-none border-0 m-0 transition-transform duration-200 ease-out"
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					width: "100vw",
					height: "100vh",
					maxWidth: "none",
					maxHeight: "none",
					borderRadius: 0,
					margin: 0,
					padding: 0,
					transitionDuration: "200ms",
					transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
				}}
			>
				<DrawerHeader>
					<DrawerTitle></DrawerTitle>
				</DrawerHeader>
				{/* Close Button - Fixed Top Right */}
				<div className="absolute top-4 right-4 z-10">
					<DrawerClose asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm"
						>
							<X className="h-5 w-5" />
							<span className="sr-only">Close menu</span>
						</Button>
					</DrawerClose>
				</div>

				{/* Navigation Content */}
				<div className="flex-1 overflow-y-auto pt-8 px-6 pb-6">
					{/* Collections Section */}
					<div className="mb-8">{CollectionLists}</div>

					{/* Horizontal Divider */}
					<div className="border-t border-border mb-8" />

					{/* Bottom Section - Profile & Navigation */}
					<div className="space-y-4">
						{/* Profile Button */}
						<DrawerClose asChild>
							<Link
								href="/account"
								className="flex items-center space-x-3 py-3 px-2 text-lg font-medium transition-colors hover:text-foreground hover:underline underline-offset-4 text-foreground/80"
							>
								<User className="h-5 w-5" />
								<span>Profile</span>
							</Link>
						</DrawerClose>

						{/* Navigation Links */}
						{bottomNavigationLinks.map((link) => (
							<DrawerClose key={link.name} asChild>
								<Link
									href={link.href}
									className="block py-3 px-2 text-lg font-medium transition-colors hover:text-foreground hover:underline underline-offset-4 text-foreground/80"
								>
									{link.name}
								</Link>
							</DrawerClose>
						))}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
