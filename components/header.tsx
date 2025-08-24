"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/wallet-connect";

export function Header() {
	const { isConnected } = useAccount();
	const { openConnectModal } = useConnectModal();
	const router = useRouter();

	function handleCreateClick() {
		if (!isConnected) {
			openConnectModal?.();
			return;
		}
		router.push("/create");
	}

	return (
		<header>
			<div className="container mx-auto flex h-16 items-center justify-end px-4">
				<div className="flex items-center gap-2">
					<SearchBar />
					<ThemeToggle />
					<Button
						variant="outline"
						onClick={handleCreateClick}
						className="text-sm font-medium flex items-center gap-1"
					>
						<Plus className="h-5 w-5" />
						Create
					</Button>
					<WalletConnect />
				</div>
			</div>
		</header>
	);
}
