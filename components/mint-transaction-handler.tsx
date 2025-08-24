"use client";

import { CheckCircle, ExternalLink, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrepareMintSVGNFT } from "@/hooks/use-mcp";
import type { PrepareMintSVGNFTData } from "@/types/mcp";

interface MintTransactionHandlerProps {
	transaction: PrepareMintSVGNFTData;
	onComplete: (hash: string) => void;
	onError: (error: string) => void;
}

export function MintTransactionHandler({
	transaction,
	onComplete,
	onError,
}: MintTransactionHandlerProps) {
	const [isMinting, setIsMinting] = useState(false);
	const [mintHash, setMintHash] = useState<string | null>(null);
	const [mintError, setMintError] = useState<string | null>(null);

	// For MVP: We'll use a simple approach since the MCP hook needs to be updated
	const handleMint = async () => {
		setIsMinting(true);
		setMintError(null);

		try {
			// For MVP: Simulate minting success
			// In production: This would use the actual MCP hook and contract interaction
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const mockHash = "0x" + Math.random().toString(16).substr(2, 64);
			setMintHash(mockHash);
			toast.success("NFT minted successfully!");
			onComplete(mockHash);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Minting failed";
			setMintError(errorMessage);
			toast.error(`Minting failed: ${errorMessage}`);
			onError(errorMessage);
		} finally {
			setIsMinting(false);
		}
	};

	if (mintHash) {
		return (
			<Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
						<CheckCircle className="h-5 w-5" />
						NFT Minted Successfully!
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-green-700 dark:text-green-300">
						Your NFT has been minted to the blockchain!
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								window.open(
									`https://sepolia.etherscan.io/tx/${mintHash}`,
									"_blank",
								)
							}
						>
							<ExternalLink className="h-4 w-4 mr-2" />
							View on Etherscan
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => (window.location.href = "/gallery")}
						>
							View in Gallery
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (mintError) {
		return (
			<Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
						<XCircle className="h-5 w-5" />
						Minting Failed
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-red-700 dark:text-red-300">{mintError}</p>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setMintError(null);
							setIsMinting(false);
						}}
					>
						Try Again
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
					NFT Ready to Mint
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<p className="text-blue-700 dark:text-blue-300">
						Your AI-generated NFT is ready to be minted to the blockchain!
					</p>
					<div className="text-sm text-blue-600 dark:text-blue-400">
						<p>
							<strong>Name:</strong>{" "}
							{(transaction.metadata?.nftMetadata as any)?.name ||
								"AI Generated NFT"}
						</p>
						<p>
							<strong>Description:</strong>{" "}
							{(transaction.metadata?.nftMetadata as any)?.description ||
								"Unique AI-generated artwork"}
						</p>
					</div>
				</div>

				<Button onClick={handleMint} disabled={isMinting} className="w-full">
					{isMinting ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Minting...
						</>
					) : (
						"Mint NFT"
					)}
				</Button>

				<p className="text-xs text-blue-600 dark:text-blue-400">
					This will mint your NFT to the Shape Sepolia testnet
				</p>
			</CardContent>
		</Card>
	);
}
