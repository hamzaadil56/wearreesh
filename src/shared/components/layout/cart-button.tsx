import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { CartRepository } from "@/models/cart";
import { cookies } from "next/headers";

interface CartButtonProps {
	className?: string;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	size?: "default" | "sm" | "lg" | "icon";
}

export async function CartButton({
	className = "relative",
	variant = "ghost",
	size = "icon",
}: CartButtonProps) {
	const repository = new CartRepository();
	const cartId = (await cookies()).get("cartId")?.value;
	console.log("cartId", cartId);
	const cart = await repository.findById(cartId || "");
	const totalQuantity = cart?.totalQuantity;

	return (
		<Button variant={variant} size={size} className={className}>
			<ShoppingCart className="h-5 w-5" />
			{totalQuantity! > 0 && (
				<Badge
					variant="destructive"
					className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
				>
					{totalQuantity}
				</Badge>
			)}
			<span className="sr-only">Shopping cart</span>
		</Button>
	);
}
