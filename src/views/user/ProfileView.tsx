"use client";

import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import type { Customer } from "@/models/customer/types";
import {
	LogOut,
	User as UserIcon,
	Mail,
	Phone,
	MapPin,
	Package,
} from "lucide-react";

interface ProfileViewProps {
	customer: Customer;
}

export function ProfileView({ customer }: ProfileViewProps) {
	const handleLogout = () => {
		// Redirect to server-side OAuth logout route
		window.location.href = "/api/auth/logout";
	};

	return (
		<div className="space-y-6">
			{/* Profile Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">My Account</h2>
					<p className="text-muted-foreground mt-1">
						Manage your account information and orders
					</p>
				</div>
				<Button
					variant="outline"
					onClick={handleLogout}
					className="gap-2"
				>
					<LogOut className="h-4 w-4" />
					Sign Out
				</Button>
			</div>

			<Separator />

			{/* Account Information */}
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-semibold mb-4">
						Account Information
					</h3>
					<div className="bg-card border rounded-lg p-6 space-y-4">
						<div className="flex items-center gap-3">
							<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
								<UserIcon className="h-6 w-6 text-primary" />
							</div>
							<div>
								<p className="font-medium">
									{customer.firstName && customer.lastName
										? `${customer.firstName} ${customer.lastName}`
										: customer.email}
								</p>
								<p className="text-sm text-muted-foreground">
									{customer.email}
								</p>
							</div>
						</div>

						<Separator />

						<div className="grid md:grid-cols-2 gap-4">
							<div className="flex items-start gap-3">
								<Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="flex-1">
									<p className="text-sm font-medium">
										Email Address
									</p>
									<p className="text-sm text-muted-foreground break-all">
										{customer.email}
									</p>
								</div>
							</div>

							{customer.phone && (
								<div className="flex items-start gap-3">
									<Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm font-medium">
											Phone Number
										</p>
										<p className="text-sm text-muted-foreground">
											{customer.phone}
										</p>
									</div>
								</div>
							)}

							<div className="flex items-start gap-3">
								<Package className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="flex-1">
									<p className="text-sm font-medium">
										Total Orders
									</p>
									<p className="text-sm text-muted-foreground">
										{customer.numberOfOrders} order
										{customer.numberOfOrders !== 1
											? "s"
											: ""}
									</p>
								</div>
							</div>

							{customer.firstName && customer.lastName && (
								<div className="flex items-start gap-3">
									<UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm font-medium">
											Full Name
										</p>
										<p className="text-sm text-muted-foreground">
											{customer.firstName}{" "}
											{customer.lastName}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Addresses */}
				{customer.addresses && customer.addresses.length > 0 && (
					<div>
						<h3 className="text-lg font-semibold mb-4">
							Saved Addresses
						</h3>
						<div className="space-y-4">
							{customer.addresses.map((address) => (
								<div
									key={address.id}
									className="bg-card border rounded-lg p-6"
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<MapPin className="h-5 w-5 text-muted-foreground" />
												<p className="font-medium">
													{address.firstName}{" "}
													{address.lastName}
												</p>
												{address.id ===
													customer.defaultAddress
														?.id && (
													<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
														Default
													</span>
												)}
											</div>
											<div className="text-sm text-muted-foreground space-y-1 ml-7">
												{address.company && (
													<p>{address.company}</p>
												)}
												<p>{address.address1}</p>
												{address.address2 && (
													<p>{address.address2}</p>
												)}
												<p>
													{address.city},{" "}
													{address.province}{" "}
													{address.zip}
												</p>
												<p>{address.country}</p>
												{address.phone && (
													<p>{address.phone}</p>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
