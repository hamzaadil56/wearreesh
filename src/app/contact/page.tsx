"use client";

import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import {
	Mail,
	Phone,
	MapPin,
	Clock,
	Send,
	MessageCircle,
	Heart,
	CheckCircle,
} from "lucide-react";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIsSubmitted(true);
		setIsSubmitting(false);
		setFormData({ name: "", email: "", subject: "", message: "" });

		// Reset success message after 5 seconds
		setTimeout(() => setIsSubmitted(false), 5000);
	};

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
							<MessageCircle className="w-4 h-4 mr-2" />
							Get in Touch
						</Badge>

						<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-delay-1">
							Contact{" "}
							<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								Us
							</span>
						</h1>

						<p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-2">
							We'd love to hear from you. Send us a message and
							we'll respond as soon as possible.
						</p>
					</div>
				</div>
			</section>

			{/* Contact Form and Info Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="grid lg:grid-cols-2 gap-16">
							{/* Contact Form */}
							<div className="space-y-8">
								<div>
									<h2 className="text-3xl font-bold mb-4">
										Send us a Message
									</h2>
									<p className="text-muted-foreground">
										Fill out the form below and we'll get
										back to you within 24 hours.
									</p>
								</div>

								{isSubmitted && (
									<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 flex items-center space-x-3">
										<CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
										<div>
											<h3 className="font-semibold text-green-800 dark:text-green-200">
												Message Sent Successfully!
											</h3>
											<p className="text-green-700 dark:text-green-300 text-sm">
												Thank you for reaching out.
												We'll get back to you soon.
											</p>
										</div>
									</div>
								)}

								<form
									onSubmit={handleSubmit}
									className="space-y-6"
								>
									<div className="grid md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<label
												htmlFor="name"
												className="text-sm font-medium"
											>
												Full Name *
											</label>
											<Input
												id="name"
												name="name"
												type="text"
												value={formData.name}
												onChange={handleInputChange}
												required
												className="h-12"
												placeholder="Your full name"
											/>
										</div>
										<div className="space-y-2">
											<label
												htmlFor="email"
												className="text-sm font-medium"
											>
												Email Address *
											</label>
											<Input
												id="email"
												name="email"
												type="email"
												value={formData.email}
												onChange={handleInputChange}
												required
												className="h-12"
												placeholder="your@email.com"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="subject"
											className="text-sm font-medium"
										>
											Subject *
										</label>
										<Input
											id="subject"
											name="subject"
											type="text"
											value={formData.subject}
											onChange={handleInputChange}
											required
											className="h-12"
											placeholder="What is this about?"
										/>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="message"
											className="text-sm font-medium"
										>
											Message *
										</label>
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleInputChange}
											required
											rows={6}
											className="w-full px-3 py-3 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
											placeholder="Tell us how we can help you..."
										/>
									</div>

									<Button
										type="submit"
										size="lg"
										disabled={isSubmitting}
										className="w-full h-12 text-base"
									>
										{isSubmitting ? (
											<>
												<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
												Sending...
											</>
										) : (
											<>
												<Send className="w-4 h-4 mr-2" />
												Send Message
											</>
										)}
									</Button>
								</form>
							</div>

							{/* Contact Information */}
							<div className="space-y-8">
								<div>
									<h2 className="text-3xl font-bold mb-4">
										Get in Touch
									</h2>
									<p className="text-muted-foreground">
										We're here to help and answer any
										questions you might have. We look
										forward to hearing from you.
									</p>
								</div>

								<div className="space-y-6">
									{/* Email */}
									<div className="flex items-start space-x-4 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 transition-colors duration-300">
										<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
											<Mail className="w-6 h-6 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold mb-1">
												Email Us
											</h3>
											<p className="text-muted-foreground text-sm mb-2">
												Send us an email anytime
											</p>
											<a
												href="mailto:info@wearreesh.com"
												className="text-primary hover:underline font-medium"
											>
												info@wearreesh.com
											</a>
										</div>
									</div>

									{/* Phone */}
									<div className="flex items-start space-x-4 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 transition-colors duration-300">
										<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
											<Phone className="w-6 h-6 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold mb-1">
												Call Us
											</h3>
											<p className="text-muted-foreground text-sm mb-2">
												Mon-Fri from 9am to 6pm
											</p>
											<a
												href="tel:+923001234567"
												className="text-primary hover:underline font-medium"
											>
												+92 300 123 4567
											</a>
										</div>
									</div>

									{/* Address */}
									<div className="flex items-start space-x-4 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 transition-colors duration-300">
										<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
											<MapPin className="w-6 h-6 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold mb-1">
												Visit Us
											</h3>
											<p className="text-muted-foreground text-sm mb-2">
												Come say hello at our office
											</p>
											<address className="text-primary not-italic">
												123 Fashion Street
												<br />
												Karachi, Pakistan
											</address>
										</div>
									</div>

									{/* Business Hours */}
									<div className="flex items-start space-x-4 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 transition-colors duration-300">
										<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
											<Clock className="w-6 h-6 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold mb-1">
												Business Hours
											</h3>
											<div className="text-muted-foreground text-sm space-y-1">
												<p>
													Monday - Friday: 9:00 AM -
													6:00 PM
												</p>
												<p>
													Saturday: 10:00 AM - 4:00 PM
												</p>
												<p>Sunday: Closed</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-20 bg-gradient-to-br from-muted/20 to-background">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-16">
							<Badge variant="outline" className="mb-4">
								<Heart className="w-4 h-4 mr-2" />
								Quick Help
							</Badge>
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								Frequently Asked Questions
							</h2>
							<p className="text-xl text-muted-foreground">
								Find quick answers to common questions
							</p>
						</div>

						<div className="space-y-6">
							<div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
								<h3 className="font-semibold mb-2">
									What are your shipping options?
								</h3>
								<p className="text-muted-foreground">
									We offer free standard shipping on orders
									over PKR 5,000. Express shipping is
									available for PKR 500 additional.
								</p>
							</div>

							<div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
								<h3 className="font-semibold mb-2">
									What is your return policy?
								</h3>
								<p className="text-muted-foreground">
									We accept returns within 30 days of
									purchase. Items must be in original
									condition with tags attached.
								</p>
							</div>

							<div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
								<h3 className="font-semibold mb-2">
									How can I track my order?
								</h3>
								<p className="text-muted-foreground">
									Once your order ships, you'll receive a
									tracking number via email. You can also
									track your order in your account dashboard.
								</p>
							</div>

							<div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
								<h3 className="font-semibold mb-2">
									Do you offer custom sizing?
								</h3>
								<p className="text-muted-foreground">
									Yes, we offer custom sizing for select
									items. Please contact us for more
									information about our tailoring services.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
