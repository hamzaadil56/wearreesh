import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Merriweather } from "next/font/google";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { CartProvider } from "@/shared/components/cart";
import { Navbar } from "@/shared/components/layout";
import "./globals.css";

const merriweather = Merriweather({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Wearreesh",
	description: "Wearreesh",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${merriweather.className}  antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<CartProvider>
						<Navbar />
						<main className="flex-1">{children}</main>
					</CartProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
