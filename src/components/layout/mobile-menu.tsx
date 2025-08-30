"use client";

import Link from "next/link";
import { Menu, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

const navigationLinks = [
	{ name: "Shop", href: "/shop" },
	{ name: "About Us", href: "/about" },
];

export function MobileMenu() {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Open menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-80">
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col space-y-6 mt-6">
					{/* Mobile Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search..."
							className="pl-10"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					{/* Mobile Navigation Links */}
					<div className="flex flex-col space-y-4">
						{navigationLinks.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
							>
								{link.name}
							</Link>
						))}
					</div>

					{/* Mobile User Account */}
					<Link
						href="/account"
						className="flex items-center space-x-3 text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
					>
						<User className="h-5 w-5" />
						<span>Account</span>
					</Link>

					{/* Mobile Theme Toggle */}
					<div className="flex items-center space-x-3">
						<span className="text-lg font-medium text-foreground/80">
							Theme
						</span>
						<ModeToggle />
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
