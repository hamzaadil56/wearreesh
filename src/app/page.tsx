import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Truck, RefreshCw } from "lucide-react";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
							Welcome to{" "}
							<span className="text-primary">Wearreesh</span>
						</h1>
						<p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
							Discover premium outdoor gear and apparel designed
							for your adventures. Quality that endures, style
							that inspires.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								size="lg"
								asChild
								className="text-lg px-8 py-6"
							>
								<Link href="/shop">
									Shop Now
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
							<Button
								variant="outline"
								size="lg"
								asChild
								className="text-lg px-8 py-6"
							>
								<Link href="/about">Learn More</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-muted/50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Why Choose Wearreesh?
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							We're committed to providing the best outdoor gear
							with exceptional service.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="text-center group">
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
								<Star className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Premium Quality
							</h3>
							<p className="text-muted-foreground">
								Carefully selected materials and craftsmanship
								for lasting durability.
							</p>
						</div>

						<div className="text-center group">
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
								<Truck className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Fast Shipping
							</h3>
							<p className="text-muted-foreground">
								Free shipping on orders over $100. Express
								options available.
							</p>
						</div>

						<div className="text-center group">
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
								<Shield className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Secure Shopping
							</h3>
							<p className="text-muted-foreground">
								Your data is protected with enterprise-grade
								security.
							</p>
						</div>

						<div className="text-center group">
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
								<RefreshCw className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Easy Returns
							</h3>
							<p className="text-muted-foreground">
								30-day return policy. No questions asked
								guarantee.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl md:text-4xl font-bold mb-6">
							Ready for Your Next Adventure?
						</h2>
						<p className="text-xl text-muted-foreground mb-8">
							Explore our collection of premium outdoor gear and
							find everything you need for your next journey.
						</p>
						<Button size="lg" asChild className="text-lg px-8 py-6">
							<Link href="/products">
								Browse Products
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-muted py-12 mt-auto">
				<div className="container mx-auto px-4">
					<div className="text-center text-muted-foreground">
						<p>&copy; 2024 Wearreesh. All rights reserved.</p>
						<p className="mt-2">
							Built with Next.js, TypeScript, and Tailwind CSS
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
