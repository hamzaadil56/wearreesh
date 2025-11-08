/**
 * Account Page - Server Component
 * Checks authentication and displays appropriate content
 */

import { Suspense } from "react";
import { getCustomer } from "@/models/customer/Customer.actions";
import { ProfileView } from "@/views/user/ProfileView";
import { AccountClient } from "./AccountClient";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/shared/lib/auth/session";

// Force dynamic rendering to check session on every request
export const dynamic = "force-dynamic";

export default async function AccountPage({
	searchParams,
}: {
	searchParams: { error?: string };
}) {
	const cookieStore = await cookies();
	const idToken = cookieStore.get(COOKIE_NAMES.ID_TOKEN)?.value;
	let customer = null;
	if (idToken) {
		customer = await getCustomer();
	}

	// If customer is authenticated, show profile
	if (customer) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<ProfileView customer={customer} />
				</div>
			</div>
		);
	}

	// If not authenticated, show login options
	// Pass any error from OAuth flow to the client component
	return (
		<div className="container mx-auto px-4 py-8">
			<Suspense fallback={<div>Loading...</div>}>
				<AccountClient />
			</Suspense>
		</div>
	);
}
