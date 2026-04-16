import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/shared/components/mode-toggle";
import { MobileMenu } from "./mobile-menu";
import { CollectionsList } from "./collections-list";
import { CollectionsListSkeleton } from "./collections-list";
import { Suspense } from "react";
import { navigationLinks } from "@/shared/constants/routes";

export function Navbar() {
	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="relative flex h-20 items-center">
					{/* Left Section - Navigation Links (Desktop) */}
					<div className="hidden md:flex items-center space-x-8">
						{navigationLinks
							.filter((link) => link.name !== "Shop")
							.map((link) => (
								<Link
									key={link.name}
									href={link.href}
									className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground hover:underline underline-offset-4"
								>
									{link.name}
								</Link>
							))}
					</div>

					{/* Center Section - Logo (Absolutely Centered) */}
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
						<Link href="/" className="flex items-center">
							{/* Light mode logo */}
							<Image
								src="/main_logo.svg"
								alt="Wearreesh Logo"
								width={120}
								height={32}
								className="h-20 w-auto dark:hidden"
								priority
							/>
							{/* Dark mode logo */}
							<Image
								src="/white_logo.svg"
								alt="Wearreesh Logo"
								width={120}
								height={32}
								className="h-20 w-auto hidden dark:block"
								priority
							/>
						</Link>
					</div>

					{/* Right Section - Theme Toggle (Desktop) */}
					<div className="hidden md:flex items-center space-x-4 ml-auto">
						<ModeToggle />
					</div>

					{/* Mobile Left Section */}
					<div className="md:hidden flex items-center space-x-2">
						<MobileMenu
							CollectionLists={
								<Suspense fallback={<CollectionsListSkeleton />}>
									<CollectionsList />
								</Suspense>
							}
						/>
					</div>

					{/* Mobile Right Section */}
					<div className="md:hidden flex items-center space-x-2 ml-auto">
						<ModeToggle />
					</div>
				</div>
			</div>
		</nav>
	);
}
