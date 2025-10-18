import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import {
	Heart,
	Star,
	Users,
	Award,
	Globe,
	Sparkles,
	Calendar,
	BookOpen,
	Shield,
	Leaf,
} from "lucide-react";

export default function AboutPage() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
				<div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
				<div className="container mx-auto px-4 relative">
					<div className="max-w-4xl mx-auto text-center space-y-8">
						<Badge
							variant="outline"
							className="px-6 py-2 text-sm font-medium animate-fade-in"
						>
							<Sparkles className="w-4 h-4 mr-2" />
							Established 1992
						</Badge>

						<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-delay-1">
							Our{" "}
							<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								Story
							</span>
						</h1>

						<p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-2">
							For over three decades, WearReesh has been crafting
							quality garments inspired by divine guidance and
							rooted in timeless values.
						</p>

						<div className="flex flex-wrap justify-center gap-8 pt-8 animate-fade-in-delay-3">
							<div className="text-center">
								<div className="text-3xl font-bold text-primary">
									30+
								</div>
								<div className="text-sm text-muted-foreground">
									Years of Excellence
								</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-primary">
									50K+
								</div>
								<div className="text-sm text-muted-foreground">
									Happy Customers
								</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-primary">
									1000+
								</div>
								<div className="text-sm text-muted-foreground">
									Quality Products
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Spiritual Foundation Section */}
			<section className="py-20 bg-gradient-to-r from-muted/20 to-background">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<Badge variant="outline" className="mb-4">
								<BookOpen className="w-4 h-4 mr-2" />
								Our Inspiration
							</Badge>
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								Rooted in Divine Guidance
							</h2>
							<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
								Our brand philosophy is deeply inspired by Surah
								Al-A'raf, Ayah 26, which beautifully explains
								the dual purpose of clothing.
							</p>
						</div>

						<div className="grid lg:grid-cols-2 gap-12 items-center">
							<div className="space-y-8">
								<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
									<div className="text-center mb-6">
										<div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
											<BookOpen className="w-8 h-8 text-primary" />
										</div>
										<h3 className="text-xl font-semibold mb-2">
											Surah Al-A'raf, Ayah 26
										</h3>
									</div>

									<blockquote className="text-center italic text-muted-foreground mb-6 text-lg leading-relaxed">
										"O children of Adam! We have provided
										for you clothing to cover your nakedness
										and as an adornment. However, the best
										clothing is righteousness. This is one
										of Allah’s bounties, so perhaps you will
										be mindful."
									</blockquote>
								</div>

								<div className="text-center">
									<p className="text-muted-foreground">
										This divine wisdom guides our approach
										to creating garments that serve both
										essential needs and aesthetic desires.
									</p>
								</div>
							</div>

							<div className="space-y-6">
								<div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
									<Shield className="w-12 h-12 text-primary mb-4" />
									<h3 className="text-xl font-semibold mb-3">
										Essential Protection
									</h3>
									<p className="text-muted-foreground">
										We prioritize quality fabrics and
										thoughtful design that provide comfort,
										durability, and modesty - honoring the
										essential nature of Libas.
									</p>
								</div>

								<div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl p-8 border border-secondary/20">
									<Sparkles className="w-12 h-12 text-secondary-foreground mb-4" />
									<h3 className="text-xl font-semibold mb-3">
										Beautiful Adornment
									</h3>
									<p className="text-muted-foreground">
										Our designs celebrate the beauty of Rish
										through elegant cuts, refined details,
										and contemporary aesthetics that enhance
										your natural grace.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Heritage Timeline Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-16">
							<Badge variant="outline" className="mb-4">
								<Calendar className="w-4 h-4 mr-2" />
								Our Journey
							</Badge>
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								Three Decades of Excellence
							</h2>
							<p className="text-xl text-muted-foreground">
								From humble beginnings to becoming a trusted
								name in quality clothing.
							</p>
						</div>

						<div className="space-y-12">
							{/* Timeline Item 1992 */}
							<div className="flex items-start space-x-8 group">
								<div className="flex-shrink-0">
									<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg group-hover:scale-110 transition-transform duration-300">
										92
									</div>
								</div>
								<div className="flex-1 pb-8">
									<div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-colors duration-300">
										<h3 className="text-xl font-semibold mb-2">
											The Foundation (1992)
										</h3>
										<p className="text-muted-foreground mb-4">
											WearReesh was founded with a vision
											to create clothing that honors both
											practical needs and aesthetic
											beauty, inspired by Islamic
											principles of modesty and elegance.
										</p>
										<div className="flex items-center space-x-2 text-sm text-primary">
											<Star className="w-4 h-4" />
											<span>
												Established our core values
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Timeline Item 2000s */}
							<div className="flex items-start space-x-8 group">
								<div className="flex-shrink-0">
									<div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-lg group-hover:scale-110 transition-transform duration-300">
										00s
									</div>
								</div>
								<div className="flex-1 pb-8">
									<div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-secondary/30 transition-colors duration-300">
										<h3 className="text-xl font-semibold mb-2">
											Growth & Recognition
										</h3>
										<p className="text-muted-foreground mb-4">
											Expanded our product line and gained
											recognition for quality
											craftsmanship. Introduced innovative
											designs while maintaining our
											commitment to modest fashion.
										</p>
										<div className="flex items-center space-x-2 text-sm text-secondary-foreground">
											<Award className="w-4 h-4" />
											<span>
												Quality recognition achieved
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Timeline Item 2010s */}
							<div className="flex items-start space-x-8 group">
								<div className="flex-shrink-0">
									<div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-lg group-hover:scale-110 transition-transform duration-300">
										10s
									</div>
								</div>
								<div className="flex-1 pb-8">
									<div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-accent/30 transition-colors duration-300">
										<h3 className="text-xl font-semibold mb-2">
											Digital Transformation
										</h3>
										<p className="text-muted-foreground mb-4">
											Embraced digital platforms while
											preserving traditional values.
											Reached customers worldwide, sharing
											our philosophy of purposeful
											fashion.
										</p>
										<div className="flex items-center space-x-2 text-sm text-accent-foreground">
											<Globe className="w-4 h-4" />
											<span>
												Global reach established
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Timeline Item Present */}
							<div className="flex items-start space-x-8 group">
								<div className="flex-shrink-0">
									<div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg group-hover:scale-110 transition-transform duration-300">
										Now
									</div>
								</div>
								<div className="flex-1">
									<div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/20">
										<h3 className="text-xl font-semibold mb-2">
											Continuing the Legacy
										</h3>
										<p className="text-muted-foreground mb-4">
											Today, we continue to honor our
											founding principles while innovating
											for the future. Sustainable
											practices, ethical manufacturing,
											and timeless design guide our path
											forward.
										</p>
										<div className="flex items-center space-x-2 text-sm text-primary">
											<Leaf className="w-4 h-4" />
											<span>
												Sustainable future focused
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-20 bg-gradient-to-br from-muted/20 to-background">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<Badge variant="outline" className="mb-4">
								<Heart className="w-4 h-4 mr-2" />
								Our Values
							</Badge>
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								What Drives Us
							</h2>
							<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
								Our values are the foundation of everything we
								do, guiding us in creating clothing that serves
								both body and soul.
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							<div className="group">
								<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
									<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
										<Shield className="w-8 h-8 text-primary" />
									</div>
									<h3 className="text-xl font-semibold mb-4">
										Quality First
									</h3>
									<p className="text-muted-foreground">
										We never compromise on quality. Every
										garment is crafted with attention to
										detail, using premium materials that
										stand the test of time.
									</p>
								</div>
							</div>

							<div className="group">
								<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
									<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
										<Heart className="w-8 h-8 text-primary" />
									</div>
									<h3 className="text-xl font-semibold mb-4">
										Ethical Practice
									</h3>
									<p className="text-muted-foreground">
										Our business practices reflect our
										values. Fair trade, ethical
										manufacturing, and respect for all
										stakeholders guide our operations.
									</p>
								</div>
							</div>

							<div className="group">
								<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
									<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
										<Sparkles className="w-8 h-8 text-primary" />
									</div>
									<h3 className="text-xl font-semibold mb-4">
										Timeless Design
									</h3>
									<p className="text-muted-foreground">
										We create designs that transcend trends,
										focusing on timeless elegance that
										honors both tradition and contemporary
										style.
									</p>
								</div>
							</div>

							<div className="group">
								<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
									<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
										<Users className="w-8 h-8 text-primary" />
									</div>
									<h3 className="text-xl font-semibold mb-4">
										Customer Care
									</h3>
									<p className="text-muted-foreground">
										Every customer is valued. We build
										lasting relationships through
										exceptional service and genuine care for
										your satisfaction.
									</p>
								</div>
							</div>

							<div className="group">
								<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
									<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
										<Leaf className="w-8 h-8 text-primary" />
									</div>
									<h3 className="text-xl font-semibold mb-4">
										Sustainability
									</h3>
									<p className="text-muted-foreground">
										We're committed to protecting the
										environment through sustainable
										practices, eco-friendly materials, and
										responsible production.
									</p>
								</div>
							</div>

							<div className="group">
								<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
									<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
										<BookOpen className="w-8 h-8 text-primary" />
									</div>
									<h3 className="text-xl font-semibold mb-4">
										Continuous Learning
									</h3>
									<p className="text-muted-foreground">
										We constantly evolve and improve,
										learning from our customers, industry
										trends, and our rich heritage to serve
										you better.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action Section */}
			<section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center space-y-8">
						<h2 className="text-3xl md:text-4xl font-bold">
							Join Our Journey
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Experience the perfect balance of Libas and Rish.
							Discover clothing that serves your essential needs
							while celebrating your unique style.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
							<a
								href="/products"
								className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
							>
								Explore Our Collection
							</a>
							<a
								href="/contact"
								className="inline-flex items-center justify-center px-8 py-4 border border-border rounded-xl font-semibold hover:bg-muted/50 transition-all duration-300"
							>
								Get in Touch
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
