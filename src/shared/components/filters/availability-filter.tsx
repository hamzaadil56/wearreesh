import React from "react";
import type { AvailabilityFilterProps } from "@/shared/types/filters";

export function AvailabilityFilter({
	availableOnly,
	onChange,
}: AvailabilityFilterProps) {
	return (
		<div className="space-y-2">
			<label className="flex items-center space-x-2 cursor-pointer">
				<input
					type="checkbox"
					checked={availableOnly}
					onChange={(e) => onChange(e.target.checked)}
					className="rounded border-border text-foreground focus:ring-ring"
				/>
				<span className="text-sm text-muted-foreground">
					Available only
				</span>
			</label>
		</div>
	);
}
