"use client";

import { useAccount, useBalance } from "wagmi";
import { config } from "@/lib/config";

export function useWalletBalance() {
	const { address, isConnected } = useAccount();

	const {
		data: balance,
		isLoading,
		error,
	} = useBalance({
		address,
		chainId: config.chainId,
		query: {
			enabled: isConnected && !!address,
			refetchInterval: 30000, // Refetch every 30 seconds
		},
	});

	return {
		balance,
		isLoading,
		error,
		isConnected,
		address,
	};
}
