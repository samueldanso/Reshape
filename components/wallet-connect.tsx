"use client";

import { ExitIcon } from "@radix-ui/react-icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { mainnet } from "viem/chains";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import { Button } from "@/components/ui/button";
import { abbreviateHash } from "@/lib/utils";

export const WalletConnect = () => {
	const { address } = useAccount();
	const { data: ensName } = useEnsName({ address, chainId: mainnet.id });
	const { disconnect } = useDisconnect();

	function handleDisconnect() {
		disconnect();
	}

	return (
		<ConnectButton.Custom>
			{({ openConnectModal, account }) =>
				account && address ? (
					<span className="flex items-center gap-x-2 font-medium">
						<span className="hidden md:block">
							{ensName ?? abbreviateHash(address)}
						</span>

						<button
							onClick={handleDisconnect}
							type="button"
							className="cursor-pointer"
						>
							<ExitIcon className="size-4" />
						</button>
					</span>
				) : (
					<Button onClick={openConnectModal}>Sign in</Button>
				)
			}
		</ConnectButton.Custom>
	);
};
