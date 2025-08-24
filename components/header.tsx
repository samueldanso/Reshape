"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnect } from "@/components/wallet-connect";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";

export function Header() {
	const { isConnected } = useAccount();
	const { openConnectModal } = useConnectModal();
	const router = useRouter();

	const handleCreateClick = () => {
		if (!isConnected) {
			openConnectModal?.();
		} else {
			router.push("/create");
		}
	};

	return (
		<header>
			<div className="container mx-auto flex h-16 items-center justify-end px-4">
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={handleCreateClick}>
						+ Create
					</Button>
					<ThemeToggle />
					<WalletConnect />
				</div>
			</div>
		</header>
	);
}
