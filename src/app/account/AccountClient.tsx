import { Button } from "@/shared/components/ui/button";
import { AlertCircle, LogIn } from "lucide-react";
import Link from "next/link";

export function AccountClient() {
	// const searchParams = useSearchParams();
	// const [error, setError] = useState<string | null>(null);

	// useEffect(() => {
	// 	const errorParam = searchParams.get("error");
	// 	if (errorParam) {
	// 		setError(decodeURIComponent(errorParam));
	// 	}
	// }, [searchParams]);

	return (
		<div className="max-w-md mx-auto">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold mb-2">Account</h1>
				<p className="text-muted-foreground">
					Sign in to access your account and view your orders
				</p>
			</div>

			{/* {error && (
				<div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 mb-6">
					<div className="flex items-start gap-2">
						<AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
						<div className="flex-1">
							<h3 className="text-sm font-medium text-destructive mb-1">
								Authentication Error
							</h3>
							<p className="text-sm text-destructive/80">
								{error}
							</p>
						</div>
					</div>
				</div>
			)} */}

			<div className="bg-card border rounded-lg p-8">
				<div className="text-center space-y-6">
					<div className="space-y-2">
						<h2 className="text-2xl font-semibold">
							Sign in with Shopify
						</h2>
						<p className="text-sm text-muted-foreground">
							You'll be securely redirected to Shopify to sign in
							to your account
						</p>
					</div>

					<Button asChild className="w-full h-12 gap-2" size="lg">
						<Link href="/api/auth/login">
							<LogIn className="h-5 w-5" />
							Sign in with Shopify
						</Link>
					</Button>

					<div className="pt-4 border-t">
						<p className="text-xs text-muted-foreground">
							Secure authentication powered by Shopify Customer
							Account API
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
