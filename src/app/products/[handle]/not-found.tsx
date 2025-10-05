import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="text-center space-y-4">
				<div className="text-6xl">🔍</div>
				<h1 className="text-3xl font-bold text-foreground">
					Product Not Found
				</h1>
				<p className="text-muted-foreground max-w-md">
					The product you're looking for doesn't exist or has been
					removed.
				</p>
				<div className="flex gap-4 justify-center">
					<Button asChild>
						<Link href="/products">Browse Products</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/">Go Home</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
