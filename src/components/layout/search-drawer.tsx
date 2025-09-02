"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { SearchInput } from "./search-input";

export function SearchDrawer() {
	const [open, setOpen] = useState(false);

	return (
		<Drawer
			open={open}
			onOpenChange={setOpen}
			shouldScaleBackground={false}
		>
			<DrawerTrigger asChild>
				<Button variant="ghost" size="icon">
					<Search className="h-5 w-5" />
					<span className="sr-only">Search</span>
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
				<DrawerTitle className="sr-only">Search</DrawerTitle>
				{/* Close Button - Fixed Top Right */}
				<div className="absolute top-4 right-4 z-10">
					<DrawerClose asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm"
						>
							<X className="h-5 w-5" />
							<span className="sr-only">Close search</span>
						</Button>
					</DrawerClose>
				</div>

				{/* Search Content */}
				<div className="flex-1 pt-16 px-6">
					<div className="space-y-6">
						<div>
							<h2 className="text-2xl font-bold mb-2">Search</h2>
							<p className="text-muted-foreground">
								Find products, collections, and more.
							</p>
						</div>
						<SearchInput
							placeholder="Search..."
							className="w-full text-lg h-12"
						/>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
