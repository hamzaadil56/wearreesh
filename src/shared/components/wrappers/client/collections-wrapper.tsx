"use client";

import { useState } from "react";
import { Suspense } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

interface ShopDrawerProps {
	buttonText: string;
	className?: string;
	children?: React.ReactNode;
}

export function CollectionsWrapper({
	buttonText,
	className,
	children,
}: ShopDrawerProps) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button className={className} onClick={() => setOpen(true)}>
					{buttonText}
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="w-80 sm:w-96">
				<SheetHeader>
					<SheetTitle>Shop Collections</SheetTitle>
					<SheetDescription>
						Browse our curated collections and find what you're
						looking for.
					</SheetDescription>
				</SheetHeader>
				{children}
			</SheetContent>
		</Sheet>
	);
}
