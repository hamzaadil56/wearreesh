import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import type { ActiveFiltersProps } from "@/shared/types/filters";

export function ActiveFilters({
	filters,
	availableOnly,
	onRemoveFilter,
	onRemoveAvailability,
}: ActiveFiltersProps) {
	const activeFilterCount = Object.values(filters).reduce(
		(count, values) => count + values.length,
		availableOnly ? 1 : 0
	);

	if (activeFilterCount === 0) return null;

	return (
		<div className="mt-4 pt-4 border-t border-border">
			<h4 className="text-sm font-medium text-foreground mb-2">
				Active Filters
			</h4>
			<div className="flex flex-wrap gap-2">
				{availableOnly && (
					<Badge
						variant="secondary"
						className="flex items-center gap-1"
					>
						Available only
						<X
							className="h-3 w-3 cursor-pointer"
							onClick={onRemoveAvailability}
						/>
					</Badge>
				)}
				{Object.entries(filters).map(([optionName, values]) =>
					values.map((value) => (
						<Badge
							key={`${optionName}-${value}`}
							variant="secondary"
							className="flex items-center gap-1"
						>
							{optionName}: {value}
							<X
								className="h-3 w-3 cursor-pointer"
								onClick={() =>
									onRemoveFilter(optionName, value)
								}
							/>
						</Badge>
					))
				)}
			</div>
		</div>
	);
}
