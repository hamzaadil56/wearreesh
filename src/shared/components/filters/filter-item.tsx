import React from "react";
import {
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/shared/components/ui/accordion";

interface FilterItemProps {
	value: string;
	title: string;
	children: React.ReactNode;
}

export function FilterItem({ value, title, children }: FilterItemProps) {
	return (
		<AccordionItem value={value}>
			<AccordionTrigger className="text-base font-normal text-black hover:text-gray-700 cursor-pointer">
				{title}
			</AccordionTrigger>
			<AccordionContent>{children}</AccordionContent>
		</AccordionItem>
	);
}
