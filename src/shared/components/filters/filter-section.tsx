import React from "react";
import {
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/shared/components/ui/accordion";

interface FilterSectionProps {
	value: string;
	title: string;
	children: React.ReactNode;
}

export function FilterSection({ value, title, children }: FilterSectionProps) {
	return (
		<AccordionItem value={value}>
			<AccordionTrigger className="text-base font-normal text-black hover:text-gray-700 cursor-pointer">
				{title}
			</AccordionTrigger>
			<AccordionContent>{children}</AccordionContent>
		</AccordionItem>
	);
}
