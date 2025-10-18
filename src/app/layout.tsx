import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { CartProvider } from "@/shared/components/cart";
import { CartRepository } from "@/models/cart";
import { Cart } from "@/shared/lib/shopify/types";
import { cookies } from "next/headers";
import { Navbar, Footer } from "@/shared/components/layout";
import "./globals.css";

const merriweather = Merriweather({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "WearReesh",
	description: "WearReesh",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Fetch initial cart from cookies
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;
	let initialCart: Cart | null = null;

	if (cartId) {
		try {
			const repository = new CartRepository();
			const cart = await repository.findById(cartId);
			initialCart = cart?.toJSON() as Cart;
		} catch (error) {
			console.error("Failed to fetch cart:", error);
		}
	}

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${merriweather.className}  antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<CartProvider initialCart={initialCart}>
						<Navbar />
						<main className="flex-1">{children}</main>
						<Footer />
					</CartProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
