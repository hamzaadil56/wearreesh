import React from "react";
import { cn } from "@/shared/lib/utils";
import type { OptionValueProps } from "@/shared/types/filters";

export function OptionValue({
	value,
	count,
	selected,
	onClick,
}: OptionValueProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors mr-2 mb-2",
				selected
					? "bg-primary text-primary-foreground"
					: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
			)}
		>
			{value} ({count})
		</button>
	);
}
