import Link from "next/link";
import Image from "next/image";
import {
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
	Mail,
	Phone,
	MapPin,
	Heart,
	ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function Footer() {
	const currentYear = new Date().getFullYear();

	const socialLinks = [
		{
			name: "Facebook",
			href: "https://facebook.com/wearreesh",
			icon: Facebook,
		},
		{
			name: "Instagram",
			href: "https://instagram.com/wearreesh",
			icon: Instagram,
		},
	];

	const quickLinks = [
		{ name: "Home", href: "/" },
		{ name: "Products", href: "/products" },
		{ name: "About", href: "/about" },
		{ name: "Contact", href: "/contact" },
	];

	const customerService = [
		{ name: "Returns", href: "/returns" },
		{ name: "Size Guide", href: "/size-guide" },
	];

	const company = [{ name: "About Us", href: "/about" }];

	return (
		<footer className="bg-gradient-to-br from-muted/50 via-background to-muted/30 border-t border-border/50">
			{/* Main Footer Content */}
			<div className="container mx-auto px-4 py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{/* Brand Section */}
					<div className="lg:col-span-1 space-y-6">
						<div className="space-y-4">
							{/* Logo */}
							<Link
								href="/"
								className="flex items-center space-x-3"
							>
								{/* Light mode logo */}
								<Image
									src="/black_symbol.svg"
									alt="Wearreesh Logo"
									width={120}
									height={32}
									className="h-20 w-auto dark:hidden"
									priority
								/>
								{/* Dark mode logo */}
								<Image
									src="/white_symbol.svg"
									alt="Wearreesh Logo"
									width={120}
									height={32}
									className="h-20 w-auto hidden dark:block "
									priority
								/>
								<span className="text-2xl font-bold text-foreground">
									WearReesh
								</span>
							</Link>

							<p className="text-muted-foreground leading-relaxed max-w-sm">
								Discover premium outdoor gear and apparel
								designed for your adventures. Quality that
								endures, style that inspires.
							</p>
						</div>

						{/* Social Links */}
						<div className="space-y-4">
							<h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
								Follow Us
							</h3>
							<div className="flex space-x-4">
								{socialLinks.map((social) => {
									const Icon = social.icon;
									return (
										<Link
											key={social.name}
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className="group p-3 bg-card/50 hover:bg-primary/10 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
										>
											<Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
											<span className="sr-only">
												{social.name}
											</span>
										</Link>
									);
								})}
							</div>
						</div>

						{/* Contact Info */}
						<div className="space-y-4">
							<h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
								Contact Info
							</h3>
							<div className="space-y-3">
								<div className="flex items-center space-x-3 text-muted-foreground">
									<Mail className="h-4 w-4 text-primary" />
									<span className="text-sm">
										hello@wearreesh.com
									</span>
								</div>
								<div className="flex items-center space-x-3 text-muted-foreground">
									<Phone className="h-4 w-4 text-primary" />
									<span className="text-sm">
										+1 (555) 123-4567
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Quick Links */}
					<div className="space-y-6">
						<h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
							Quick Links
						</h3>
						<ul className="space-y-3">
							{quickLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm group flex items-center"
									>
										<span>{link.name}</span>
										<ArrowRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Customer Service */}
					<div className="space-y-6">
						<h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
							Customer Service
						</h3>
						<ul className="space-y-3">
							{customerService.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm group flex items-center"
									>
										<span>{link.name}</span>
										<ArrowRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company */}
					<div className="space-y-6">
						<h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
							Company
						</h3>
						<ul className="space-y-3">
							{company.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm group flex items-center"
									>
										<span>{link.name}</span>
										<ArrowRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Newsletter Section */}
				<div className="mt-16 pt-8 border-t border-border/50">
					<div className="max-w-2xl mx-auto text-center space-y-6">
						<div className="space-y-2">
							<h3 className="text-2xl font-bold text-foreground">
								Stay in the Loop
							</h3>
							<p className="text-muted-foreground">
								Get the latest updates on new products,
								exclusive offers, and outdoor tips.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-sm"
							/>
							<Button
								size="lg"
								className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105"
							>
								Subscribe
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-border/50 bg-muted/30">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
						{/* Copyright */}
						<div className="flex items-center space-x-2 text-muted-foreground text-sm">
							<span>
								&copy; {currentYear} Wearreesh. All rights
								reserved.
							</span>
							<Heart className="h-4 w-4 text-red-500" />
						</div>

						{/* Legal Links */}
						<div className="flex items-center space-x-6 text-sm">
							<Link
								href="/privacy"
								className="text-muted-foreground hover:text-primary transition-colors duration-300"
							>
								Privacy Policy
							</Link>
							<Link
								href="/terms"
								className="text-muted-foreground hover:text-primary transition-colors duration-300"
							>
								Terms of Service
							</Link>
							<Link
								href="/cookies"
								className="text-muted-foreground hover:text-primary transition-colors duration-300"
							>
								Cookie Policy
							</Link>
						</div>

						{/* Technology Credits */}
						<div className="text-muted-foreground text-sm">
							Built with{" "}
							<span className="text-primary font-medium">
								Next.js
							</span>{" "}
							&{" "}
							<span className="text-primary font-medium">
								TypeScript
							</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
