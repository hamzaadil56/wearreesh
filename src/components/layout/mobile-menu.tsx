"use client";

import * as React from "react";
import { Menu, Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

export function MobileMenu() {
	const [goal, setGoal] = React.useState(350);

	function onClick(adjustment: number) {
		setGoal(Math.max(200, Math.min(400, goal + adjustment)));
	}

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
				{/* Close Button at Top */}
				<div className="absolute top-4 right-4 z-10">
					<DrawerClose asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border"
						>
							<X className="h-5 w-5" />
							<span className="sr-only">Close menu</span>
						</Button>
					</DrawerClose>
				</div>

				{/* Full Screen Content */}
				<div className="flex-1 flex flex-col justify-center items-center w-full h-full min-h-screen">
					<div className="w-full max-w-sm mx-auto px-4">
						<DrawerHeader className="text-center">
							<DrawerTitle>Move Goal</DrawerTitle>
							<DrawerDescription>
								Set your daily activity goal.
							</DrawerDescription>
						</DrawerHeader>
						<div className="p-4 pb-0">
							<div className="flex items-center justify-center space-x-2">
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 shrink-0 rounded-full"
									onClick={() => onClick(-10)}
									disabled={goal <= 200}
								>
									<Minus />
									<span className="sr-only">Decrease</span>
								</Button>
								<div className="flex-1 text-center">
									<div className="text-7xl font-bold tracking-tighter">
										{goal}
									</div>
									<div className="text-muted-foreground text-[0.70rem] uppercase">
										Calories/day
									</div>
								</div>
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 shrink-0 rounded-full"
									onClick={() => onClick(10)}
									disabled={goal >= 400}
								>
									<Plus />
									<span className="sr-only">Increase</span>
								</Button>
							</div>
						</div>
						<DrawerFooter className="pt-6">
							<Button>Submit</Button>
							<DrawerClose asChild>
								<Button variant="outline">Cancel</Button>
							</DrawerClose>
						</DrawerFooter>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
