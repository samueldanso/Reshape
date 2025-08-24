"use client";

import { cn } from "@/lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
	Bot,
	Bookmark,
	Home,
	Image as ImageIcon,
	PanelLeftOpen,
	User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

export function AppSidebar() {
	const [collapsed, setCollapsed] = useState(false);
	const pathname = usePathname();
	const { address, isConnected } = useAccount();
	const { disconnect } = useDisconnect();
	const { openConnectModal } = useConnectModal();

	// Navigation links configuration
	const mainNavLinks = [
		{
			href: "/",
			label: "Discover",
			icon: Home,
			isActive: () => pathname === "/",
		},
		{
			href: "/agent",
			label: "Agent",
			icon: Bot,
			isActive: () => pathname.startsWith("/agent"),
		},
		{
			href: "/artists",
			label: "Artists",
			icon: User,
			isActive: () => pathname.startsWith("/artists"),
		},
		{
			href: "/gallery",
			label: "My Gallery",
			icon: ImageIcon,
			isActive: () => pathname.startsWith("/gallery"),
		},
		{
			href: "/bookmarks",
			label: "Bookmark",
			icon: Bookmark,
			isActive: () => pathname.startsWith("/bookmarks"),
		},
	];

	const profileLink = {
		href: "/profile",
		label: "Profile",
		icon: User,
		isActive: () => pathname.startsWith("/profile"),
	};

	// Handle protected route access
	const handleProtectedRoute = (e: React.MouseEvent, href: string) => {
		if (!isConnected) {
			e.preventDefault();
			openConnectModal?.();
		}
	};

	// Collapsed sidebar view
	if (collapsed) {
		return (
			<div
				className={cn(
					"flex h-full flex-col transition-all duration-200",
					"w-16 pl-2",
					"bg-card rounded-2xl shadow-lg",
					"mt-1 ml-1 mb-1",
				)}
			>
				{/* Top: Icon only */}
				<div className="flex h-16 items-center justify-center">
					<Image src="/logo.svg" alt="Logo" width={32} height={32} priority />
				</div>

				{/* Divider */}
				<div className="mx-2 h-px bg-border mb-2" />

				{/* Center: Main Nav */}
				<nav className="flex flex-col items-center gap-2 mt-6 w-full flex-1">
					{/* Toggle button as first nav item */}
					<button
						type="button"
						aria-label="Expand sidebar"
						onClick={() => setCollapsed(false)}
						className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring mb-2 transition-colors"
					>
						<PanelLeftOpen className="h-5 w-5" />
					</button>

					{/* Main nav icons */}
					{mainNavLinks.map((link) => {
						const isActive = link.isActive();
						const isProtected =
							link.label === "My Gallery" || link.label === "Bookmark";
						return (
							<Link
								key={link.href}
								href={link.href}
								className="flex items-center justify-center w-full"
								onClick={
									isProtected
										? (e) => handleProtectedRoute(e, link.href)
										: undefined
								}
							>
								<span
									className={cn(
										"flex items-center justify-center w-10 h-10 rounded-full transition-colors",
										isActive
											? "text-foreground bg-accent"
											: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
									)}
								>
									<link.icon className="h-5 w-5 mx-auto" />
								</span>
							</Link>
						);
					})}
				</nav>

				{/* Profile icon at bottom */}
				<div className="flex flex-col items-center mb-4 mt-auto">
					<Link
						href={profileLink.href}
						className="flex items-center justify-center w-full"
						onClick={(e) => handleProtectedRoute(e, profileLink.href)}
					>
						<span className="flex items-center justify-center w-10 h-10 rounded-full transition-colors text-muted-foreground hover:bg-accent/50 hover:text-foreground">
							<profileLink.icon className="h-5 w-5" />
						</span>
					</Link>
				</div>
			</div>
		);
	}

	// Expanded sidebar view
	return (
		<div
			className={cn(
				"flex h-full flex-col transition-all duration-200",
				"w-64 pl-2",
				"bg-card rounded-2xl shadow-lg mt-1 ml-1 mb-1",
			)}
		>
			{/* Top: Logo and toggle */}
			<div className="flex h-16 items-center px-2 gap-2">
				<Image src="/logo.svg" alt="Logo" width={32} height={32} priority />
				<span className="text-lg font-semibold">Reshape</span>
				<button
					type="button"
					aria-label="Collapse sidebar"
					onClick={() => setCollapsed(true)}
					className="ml-auto rounded-md p-2 hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring"
				>
					<PanelLeftOpen className="h-5 w-5 transform rotate-180" />
				</button>
			</div>

			{/* Divider */}
			<div className="mx-2 h-px bg-border mb-2" />

			<nav className="flex-1 flex flex-col gap-2 mt-6">
				{/* Main Navigation */}
				{mainNavLinks.map((link) => {
					const isActive = link.isActive();
					const isProtected =
						link.label === "My Gallery" || link.label === "Bookmark";
					return (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-4 py-2 font-medium transition-colors",
								isActive
									? "text-foreground font-semibold bg-accent"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
							onClick={
								isProtected
									? (e) => handleProtectedRoute(e, link.href)
									: undefined
							}
						>
							<link.icon className="h-5 w-5" />
							<span>{link.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Profile at the bottom */}
			<div className="mt-auto mb-4 px-4">
				<Link
					href={profileLink.href}
					className="flex items-center gap-3 rounded-lg px-2 py-2 font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
					onClick={(e) => handleProtectedRoute(e, profileLink.href)}
				>
					<profileLink.icon className="h-5 w-5" />
					<span>Profile</span>
				</Link>
			</div>
		</div>
	);
}
