import Link from "next/link";
import { User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchInput } from "./search-input";
import { MobileMenu } from "./mobile-menu";

const navigationLinks = [
	{ name: "Shop", href: "/shop" },
	{ name: "About Us", href: "/about" },
];

export function Navbar() {
	// This will be dynamic later - could come from server state or context
	const cartItemCount = 0;

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Left Section - Navigation Links (Desktop) */}
					<div className="hidden md:flex items-center space-x-8">
						{navigationLinks.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
							>
								{link.name}
							</Link>
						))}
					</div>

					{/* Center Section - Logo */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-2">
							<div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-lg">
									W
								</span>
							</div>
							<span className="font-bold text-xl">Wearreesh</span>
						</Link>
					</div>

					{/* Right Section - Search, User, Cart (Desktop) */}
					<div className="hidden md:flex items-center space-x-4">
						{/* Search - Client Component */}
						<SearchInput placeholder="Search..." className="w-64" />

						{/* User Account - Server Component */}
						<Button variant="ghost" size="icon" asChild>
							<Link href="/account">
								<User className="h-5 w-5" />
								<span className="sr-only">User account</span>
							</Link>
						</Button>

						{/* Cart - Server Component */}
						<Button
							variant="ghost"
							size="icon"
							asChild
							className="relative"
						>
							<Link href="/cart">
								<ShoppingCart className="h-5 w-5" />
								{cartItemCount > 0 && (
									<Badge
										variant="destructive"
										className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
									>
										{cartItemCount}
									</Badge>
								)}
								<span className="sr-only">Shopping cart</span>
							</Link>
						</Button>

						{/* Theme Toggle - Client Component */}
						<ModeToggle />
					</div>

					{/* Mobile Section */}
					<div className="md:hidden flex items-center space-x-2">
						{/* Mobile Cart - Server Component */}
						<Button
							variant="ghost"
							size="icon"
							asChild
							className="relative"
						>
							<Link href="/cart">
								<ShoppingCart className="h-5 w-5" />
								{cartItemCount > 0 && (
									<Badge
										variant="destructive"
										className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
									>
										{cartItemCount}
									</Badge>
								)}
								<span className="sr-only">Shopping cart</span>
							</Link>
						</Button>

						{/* Mobile Menu - Client Component */}
						<MobileMenu />
					</div>
				</div>
			</div>
		</nav>
	);
}
