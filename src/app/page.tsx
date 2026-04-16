import Link from "next/link";
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
	ArrowRight,
	Mail,
	Phone,
	MapPin,
	Handshake,
	CheckCircle,
	Package,
	Recycle,
	Sun,
} from "lucide-react";

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			{/* ═══════════════════════════════════════
			    HERO
			    bg-background = light in light mode, dark in dark mode
			    ═══════════════════════════════════════ */}
			<section
				className="relative min-h-[94dvh] bg-background flex flex-col items-center justify-center overflow-hidden"
				aria-label="WearReesh hero"
			>
				<div className="relative z-10 container mx-auto px-4 text-center text-foreground py-24 lg:py-32 max-w-5xl">

					{/* Eyebrow */}
					<div className="flex justify-center mb-8 motion-safe:animate-fade-in">
						<span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-foreground/20 bg-foreground/8 text-foreground/65 text-xs font-medium tracking-widest uppercase">
							<Sparkles className="w-3 h-3" aria-hidden="true" />
							Established 1996 &middot; Wholesale Partnership
						</span>
					</div>

					{/* Display headline */}
					<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.06] mb-5 motion-safe:animate-fade-in-delay-1">
						Modern Fashion
						<br />
						<span className="font-light italic opacity-55">
							Rooted in Purpose
						</span>
					</h1>

					{/* Sub-copy */}
					<p className="text-base md:text-lg text-foreground/60 max-w-xl mx-auto leading-relaxed mb-10 motion-safe:animate-fade-in-delay-2">
						WearReesh uses the highest quality of fabrics and ensures
						every customer remains satisfied &mdash; premium materials,
						timeless design, and craftsmanship refined over three decades.
					</p>

					{/* Value pills */}
					<div className="flex flex-wrap justify-center gap-3 mb-12 motion-safe:animate-fade-in-delay-2">
						{[
							{ icon: Leaf, label: "Highest Quality Materials" },
							{ icon: Shield, label: "Quality Assured" },
						].map(({ icon: Icon, label }) => (
							<span
								key={label}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/15 bg-foreground/8 text-foreground/75 text-sm font-medium"
							>
								<Icon className="w-4 h-4 opacity-60" aria-hidden="true" />
								{label}
							</span>
						))}
					</div>

					{/* CTAs */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center motion-safe:animate-fade-in-delay-3">
						<Link
							href="/contact"
							className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[52px] bg-foreground text-background rounded-xl font-semibold transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
						>
							<Handshake className="w-5 h-5" aria-hidden="true" />
							Partner With Us
						</Link>
						<Link
							href="/about"
							className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[52px] border border-foreground/25 text-foreground rounded-xl font-semibold transition-all duration-200 ease-out hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
						>
							Our Story
							<ArrowRight className="w-4 h-4" aria-hidden="true" />
						</Link>
					</div>
				</div>

				{/* Scroll cue */}
				<div
					className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-foreground/30 motion-safe:animate-bounce"
					aria-hidden="true"
				>
					<div className="w-px h-8 bg-foreground/20" />
					<span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    STATS — bg-background (warm off-white)
			    ═══════════════════════════════════════ */}
			<section className="py-16 bg-background border-b border-border" aria-label="Key figures">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-border max-w-2xl mx-auto">
						{[
							{ value: "30+", label: "Years of Excellence", icon: Award },
							{ value: "50K+", label: "Happy Customers", icon: Users },
							{ value: "1000+", label: "Quality Products", icon: Package },
						].map(({ value, label, icon: Icon }) => (
							<div key={label} className="text-center px-8 flex flex-col items-center gap-2">
								<Icon className="w-5 h-5 text-muted-foreground mb-1" aria-hidden="true" />
								<div className="text-4xl md:text-5xl font-bold text-foreground tabular-nums">
									{value}
								</div>
								<div className="text-xs text-muted-foreground uppercase tracking-widest">
									{label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    WHY PARTNER — bg-muted (warm light gray)
			    ═══════════════════════════════════════ */}
			<section className="py-20 bg-muted" aria-labelledby="why-heading">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-14">
							<p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
								For Wholesale Buyers
							</p>
							<h2 id="why-heading" className="text-3xl md:text-4xl font-bold text-foreground">
								Why Partner With WearReesh?
							</h2>
						</div>

						<div className="grid md:grid-cols-3 gap-5">
							{[
								{
									icon: CheckCircle,
									title: "Established Since 1996",
									body: "Over three decades of consistent quality and craftsmanship — a brand your customers already trust.",
								},
								{
									icon: Recycle,
									title: "Sustainably Sourced",
									body: "Responsible material sourcing, eco-conscious production, and ethical supply chains at every step.",
								},
								{
									icon: Shield,
									title: "Premium Quality Assured",
									body: "Every garment passes rigorous quality control before leaving our facility. We never compromise.",
								},
							].map(({ icon: Icon, title, body }) => (
								<article
									key={title}
									className="bg-background rounded-2xl border border-border p-8 transition-all duration-200 ease-out hover:border-foreground/20 hover:shadow-sm"
								>
									<div className="w-12 h-12 rounded-full bg-foreground/6 flex items-center justify-center mb-5">
										<Icon className="w-6 h-6 text-foreground/70" aria-hidden="true" />
									</div>
									<h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
									<p className="text-base text-muted-foreground leading-relaxed">{body}</p>
								</article>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    OUR STORY — bg-background, editorial
			    ═══════════════════════════════════════ */}
			<section className="py-24 lg:py-32 bg-background" aria-labelledby="story-heading">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto">
						<div className="flex justify-center mb-10">
							<span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border text-muted-foreground text-sm font-medium">
								<Sparkles className="w-4 h-4" aria-hidden="true" />
								Established 1996
							</span>
						</div>

						<h2
							id="story-heading"
							className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center leading-[1.1] mb-10"
						>
							Our{" "}
							<span className="font-light italic text-muted-foreground">
								Story
							</span>
						</h2>

						<p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed mb-12">
							For over three decades, WearReesh has been crafting quality
							garments inspired by divine guidance and rooted in timeless
							values.
						</p>

						{/* Pull-quote */}
						<div className="border-l-4 border-foreground/20 pl-8 py-2">
							<p className="text-base md:text-lg text-muted-foreground leading-loose">
								What began as a humble vision in 1996 has grown into a
								brand trusted by tens of thousands across Pakistan and
								beyond. We craft garments that honor both the essential
								nature of clothing and its power as adornment &mdash; a
								principle rooted in the wisdom of our faith.
							</p>
						</div>

						{/* Sustainability signal row */}
						<div className="grid grid-cols-3 gap-4 mt-14 pt-10 border-t border-border">
							{[
								{ icon: Sun, label: "Low-impact Production" },
								{ icon: Leaf, label: "Eco Materials" },
								{ icon: Recycle, label: "Responsible Sourcing" },
							].map(({ icon: Icon, label }) => (
								<div key={label} className="flex flex-col items-center gap-2 text-center">
									<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
										<Icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
									</div>
									<span className="text-xs text-muted-foreground leading-tight">{label}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    SPIRITUAL FOUNDATION — bg-muted, contemplative
			    ═══════════════════════════════════════ */}
			<section className="py-24 bg-muted" aria-labelledby="inspiration-heading">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-background text-muted-foreground text-sm font-medium mb-5">
								<BookOpen className="w-4 h-4" aria-hidden="true" />
								Our Inspiration
							</span>
							<h2 id="inspiration-heading" className="text-3xl md:text-4xl font-bold mb-5">
								Rooted in Divine Guidance
							</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
								Our brand philosophy is deeply inspired by Surah Al&apos;Araf,
								Ayah 26 &mdash; which beautifully explains the dual purpose
								of clothing.
							</p>
						</div>

						<div className="grid lg:grid-cols-2 gap-10 items-start">
							{/* Quranic reference */}
							<div className="bg-background rounded-2xl border border-border p-10 relative">
								<div
									className="text-[8rem] leading-none font-serif text-foreground/8 absolute top-2 left-6 select-none pointer-events-none"
									aria-hidden="true"
								>
									&ldquo;
								</div>

								<div className="text-center mb-8 pt-6">
									<div className="inline-flex items-center justify-center w-14 h-14 bg-muted rounded-full mb-4">
										<BookOpen className="w-7 h-7 text-muted-foreground" aria-hidden="true" />
									</div>
									<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
										Surah Al&apos;Araf, Ayah 26
									</h3>
								</div>

								<blockquote className="text-center italic text-foreground/75 text-lg leading-[1.85]">
									&ldquo;O children of Adam! We have provided for you clothing
									to cover your nakedness and as an adornment. However, the
									best clothing is righteousness. This is one of Allah&apos;s
									bounties, so perhaps you will be mindful.&rdquo;
								</blockquote>

								<p className="text-center text-sm text-muted-foreground mt-8 leading-relaxed">
									This divine wisdom guides our approach to creating garments
									that serve both essential needs and aesthetic desires.
								</p>
							</div>

							{/* Libas / Rish */}
							<div className="space-y-5">
								<div className="bg-background rounded-2xl border border-border p-7 transition-all duration-200 hover:border-foreground/25 hover:shadow-sm">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
											<Shield className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
										</div>
										<div>
											<h3 className="text-lg font-semibold leading-tight">
												Essential Protection
											</h3>
											<span className="text-sm text-muted-foreground italic">Libas</span>
										</div>
									</div>
									<p className="text-base text-muted-foreground leading-relaxed">
										We prioritize quality fabrics and thoughtful design that
										provide comfort, durability, and modesty &mdash; honoring
										the essential nature of Libas.
									</p>
								</div>

								<div className="bg-background rounded-2xl border border-border p-7 transition-all duration-200 hover:border-foreground/25 hover:shadow-sm">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
											<Sparkles className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
										</div>
										<div>
											<h3 className="text-lg font-semibold leading-tight">
												Beautiful Adornment
											</h3>
											<span className="text-sm text-muted-foreground italic">Rish</span>
										</div>
									</div>
									<p className="text-base text-muted-foreground leading-relaxed">
										Our designs celebrate the beauty of Rish through elegant
										cuts, refined details, and contemporary aesthetics that
										enhance your natural grace.
									</p>
								</div>

								{/* Brand voice — primary */}
								<div className="bg-primary rounded-2xl p-7 text-primary-foreground">
									<p className="text-base leading-relaxed opacity-75 italic">
										&ldquo;We believe clothing is more than fabric &mdash; it
										is an expression of identity, faith, and dignity. Every
										stitch carries this conviction.&rdquo;
									</p>
									<p className="text-xs font-semibold mt-4 opacity-45 uppercase tracking-widest">
										— WearReesh Philosophy
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    TIMELINE — bg-background
			    ═══════════════════════════════════════ */}
			<section className="py-24 bg-background" aria-labelledby="timeline-heading">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto">
						<div className="text-center mb-16">
							<span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border text-muted-foreground text-sm font-medium mb-5">
								<Calendar className="w-4 h-4" aria-hidden="true" />
								Our Journey
							</span>
							<h2 id="timeline-heading" className="text-3xl md:text-4xl font-bold mb-5">
								Three Decades of Excellence
							</h2>
							<p className="text-lg text-muted-foreground max-w-md mx-auto">
								From humble beginnings to a trusted name in quality clothing.
							</p>
						</div>

						{/* Connecting vertical line */}
						<div className="relative">
							<div
								className="absolute left-8 top-8 bottom-8 w-px bg-border"
								aria-hidden="true"
							/>
							<div className="space-y-0">
								{[
									{
										era: "1996",
										title: "The Foundation",
										body: "WearReesh was founded with a vision to create clothing that honors both practical needs and aesthetic beauty, inspired by Islamic principles of modesty and elegance.",
										tag: "Established our core values",
										tagIcon: Star,
										accent: true,
									},
									{
										era: "2000s",
										title: "Growth & Recognition",
										body: "Expanded our product line and gained recognition for quality craftsmanship. Introduced innovative designs while maintaining our commitment to modest fashion.",
										tag: "Quality recognition achieved",
										tagIcon: Award,
										accent: false,
									},
									{
										era: "2010s",
										title: "Digital Transformation",
										body: "Embraced digital platforms while preserving traditional values. Reached customers worldwide, sharing our philosophy of purposeful fashion.",
										tag: "Global reach established",
										tagIcon: Globe,
										accent: false,
									},
									{
										era: "Now",
										title: "Sustainable Future",
										body: "Today, we commit to sustainability alongside quality. Eco-conscious materials, ethical manufacturing, and timeless design guide our path forward.",
										tag: "Wholesale era begins",
										tagIcon: Leaf,
										accent: true,
									},
								].map(({ era, title, body, tag, tagIcon: TagIcon, accent }, i, arr) => (
									<div
										key={era}
										className={`flex items-start gap-8 group ${i < arr.length - 1 ? "pb-10" : ""}`}
									>
										<div className="flex-shrink-0 relative z-10">
											<div
												className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm transition-transform duration-200 ease-out group-hover:scale-110 ${
													accent
														? "bg-primary text-primary-foreground shadow-sm"
														: "bg-background border-2 border-border text-foreground"
												}`}
											>
												{era}
											</div>
										</div>
										<div className="flex-1 pt-2">
											<div className="bg-card rounded-2xl p-6 border border-border transition-all duration-200 ease-out hover:border-foreground/20 hover:shadow-sm">
												<h3 className="text-lg font-semibold mb-2">{title}</h3>
												<p className="text-base text-muted-foreground leading-relaxed mb-4">
													{body}
												</p>
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<TagIcon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
													<span>{tag}</span>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    VALUES — bg-muted (warm light gray)
			    ═══════════════════════════════════════ */}
			<section className="py-24 bg-muted" aria-labelledby="values-heading">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-background text-muted-foreground text-sm font-medium mb-5">
								<Heart className="w-4 h-4" aria-hidden="true" />
								Our Values
							</span>
							<h2 id="values-heading" className="text-3xl md:text-4xl font-bold mb-5">
								What Drives Us
							</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
								Our values guide us in creating clothing that serves both
								body and soul — and honors the world we share.
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
							{[
								{
									icon: Shield,
									title: "Quality First",
									body: "We never compromise on quality. Every garment is crafted with attention to detail, using premium materials that stand the test of time.",
								},
								{
									icon: Heart,
									title: "Ethical Practice",
									body: "Fair trade, ethical manufacturing, and respect for all stakeholders guide our operations and reflect our deepest values.",
								},
								{
									icon: Sparkles,
									title: "Timeless Design",
									body: "We create designs that transcend trends, focusing on timeless elegance that honors both tradition and contemporary style.",
								},
								{
									icon: Users,
									title: "Partner Care",
									body: "Every partner is valued. We build lasting relationships through exceptional service and genuine care for your business success.",
								},
								{
									icon: Leaf,
									title: "Sustainability",
									body: "We're committed to protecting the environment through sustainable practices, eco-friendly materials, and responsible production.",
								},
								{
									icon: BookOpen,
									title: "Continuous Learning",
									body: "We constantly evolve and improve, learning from our partners, industry trends, and our rich heritage to serve you better.",
								},
							].map(({ icon: Icon, title, body }) => (
								<article
									key={title}
									className="group bg-background rounded-2xl p-8 border border-border transition-all duration-200 ease-out hover:border-foreground/20 hover:shadow-sm flex flex-col"
								>
									<div
										className="w-8 h-0.5 bg-foreground/20 mb-6 transition-all duration-200 group-hover:w-14 group-hover:bg-foreground/50"
										aria-hidden="true"
									/>
									<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110">
										<Icon className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
									</div>
									<h3 className="text-lg font-semibold mb-3">{title}</h3>
									<p className="text-base text-muted-foreground leading-relaxed flex-1">{body}</p>
								</article>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    WHOLESALE CTA — bg-primary (bookends hero)
			    ═══════════════════════════════════════ */}
			<section
				className="py-24 bg-primary text-primary-foreground relative overflow-hidden"
				aria-labelledby="cta-heading"
			>
				<div
					className="absolute inset-0 opacity-[0.04] pointer-events-none"
					aria-hidden="true"
					style={{
						backgroundImage:
							"radial-gradient(ellipse 60% 50% at 65% 50%, white 0%, transparent 70%)",
					}}
				/>

				<div className="relative z-10 container mx-auto px-4">
					<div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
						{/* Left */}
						<div>
							<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/8 text-primary-foreground/55 text-xs font-medium tracking-widest uppercase mb-6">
								<Handshake className="w-3.5 h-3.5" aria-hidden="true" />
								Wholesale Enquiries
							</span>

							<h2
								id="cta-heading"
								className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5"
							>
								Partner in
								<br />
								<span className="font-light italic opacity-55">
									Purposeful Fashion
								</span>
							</h2>

							<p className="text-base text-primary-foreground/60 leading-relaxed mb-10 max-w-md">
								Partner with WearReesh to offer your customers clothing that
								serves their essential needs while celebrating their unique
								style — sustainable, ethical, and beautifully made.
							</p>

							<Link
								href="/contact"
								className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[52px] bg-primary-foreground text-primary rounded-xl font-semibold transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.02] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary cursor-pointer"
							>
								Get in Touch
								<ArrowRight className="w-4 h-4" aria-hidden="true" />
							</Link>
						</div>

						{/* Right — contact cards */}
						<div className="grid gap-4">
							{[
								{
									icon: Mail,
									label: "Email Us",
									value: "contactwearreesh@wearreesh.com",
									href: "mailto:contactwearreesh@wearreesh.com",
								},
								{
									icon: Phone,
									label: "WhatsApp Us",
									value: "+92 324 088 2606",
									href: "https://wa.me/923240882606",
								},
								{
									icon: MapPin,
									label: "Visit Us",
									value: "Karim Center, 1st Floor, Gulzar Fashion",
									href: null,
								},
							].map(({ icon: Icon, label, value, href }) => (
								<div
									key={label}
									className="flex items-center gap-5 rounded-2xl border border-primary-foreground/12 bg-primary-foreground/6 px-6 py-5 transition-colors duration-200 hover:bg-primary-foreground/10"
								>
									<div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
										<Icon className="w-5 h-5 text-primary-foreground/60" aria-hidden="true" />
									</div>
									<div>
										<div className="text-xs uppercase tracking-widest text-primary-foreground/40 mb-0.5">
											{label}
										</div>
										{href ? (
											<a
												href={href}
												className="text-base font-medium text-primary-foreground/85 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:underline"
											>
												{value}
											</a>
										) : (
											<p className="text-base font-medium text-primary-foreground/85">
												{value}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
