"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
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
import { navigationLinks } from "@/shared/constants/routes";
import { socialMediaLinks } from "@/shared/constants/routes";

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
				<div className="flex-1 flex flex-col px-6 pb-6">
					{/* Collections Section - temporarily disabled */}
					{/* <div className="mb-8">{CollectionLists}</div> */}

					{/* Main Navigation Links */}
					<div className="flex-1 pt-8">
						{navigationLinks
							.filter((link) => link.name !== "Shop")
							.map((link, index, arr) => (
								<React.Fragment key={link.name}>
									<DrawerClose asChild>
										<Link
											href={link.href}
											className="block py-4 px-2 text-lg font-medium transition-colors hover:text-foreground hover:underline underline-offset-4 text-foreground/80"
										>
											{link.name}
										</Link>
									</DrawerClose>
									{index < arr.length - 1 && (
										<div className="border-t border-border" />
									)}
								</React.Fragment>
							))}
					</div>

					{/* Bottom Section - Social Media */}
					<div className="mt-auto">
						<div className="border-t border-border mb-6" />

						<div className="flex justify-end px-2 pb-2">
							{/* Social Media Icons */}
							<div className="flex space-x-3">
								{socialMediaLinks.map((social) => {
									const IconComponent = social.icon;
									return (
										<DrawerClose key={social.name} asChild>
											<Link
												href={social.href}
												className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
												aria-label={social.name}
											>
												<IconComponent className="h-5 w-5 text-foreground/70" />
											</Link>
										</DrawerClose>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
