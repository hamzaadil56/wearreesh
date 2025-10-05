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
					? "bg-black text-white"
					: "bg-gray-100 text-black hover:bg-gray-200"
			)}
		>
			{value} ({count})
		</button>
	);
}
