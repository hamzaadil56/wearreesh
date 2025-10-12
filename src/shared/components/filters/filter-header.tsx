import React from "react";
import { Button } from "@/shared/components/ui/button";
import type { FilterHeaderProps } from "@/shared/types/filters";

export function FilterHeader({
	activeFilterCount,
	onClearAll,
}: FilterHeaderProps) {
	return (
		<div className="flex items-center justify-between mb-4">
			<h3 className="text-lg font-semibold text-foreground">Filters</h3>
			{activeFilterCount > 0 && (
				<Button
					variant="outline"
					size="sm"
					onClick={onClearAll}
					className="text-xs"
				>
					Clear All ({activeFilterCount})
				</Button>
			)}
		</div>
	);
}
