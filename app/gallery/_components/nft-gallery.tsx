"use client";

import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Image, Plus, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { BookmarkButton } from "@/components/bookmark-button";
import { LikeButton } from "@/components/like-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NFT {
	id: string;
	name: string;
	description: string;
	image: string;
	collection: string;
	tokenId: string;
	likes: number;
}

export function NFTGallery() {
	const { address, isConnected } = useAccount();

	// Fetch user's NFTs using the existing MCP tools
	const {
		data: nfts,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user-nfts", address],
		queryFn: async (): Promise<NFT[]> => {
			if (!address) return [];

			try {
				// For MVP: Return mock data
				// In production: Use getShapeNft MCP tool
				return [
					{
						id: "1",
						name: "Mountain Sunset",
						description: "AI-generated mountain landscape",
						image:
							"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0ZGNkI2QiIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5Nb3VudGFpbiBTdW5zZXQ8L3N2Zz4=",
						collection: "AI Generated",
						tokenId: "1",
						likes: 12,
					},
				];
			} catch (error) {
				console.error("Failed to fetch NFTs:", error);
				return [];
			}
		},
		enabled: !!address && isConnected,
	});

	if (!isConnected) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Wallet className="h-5 w-5" />
						Connect Your Wallet
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center py-8">
					<Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground mb-4">
						Please connect your wallet to view your NFT gallery
					</p>
					<p className="text-sm text-muted-foreground">
						Connect your wallet in the top right corner to get started
					</p>
				</CardContent>
			</Card>
		);
	}

	if (isLoading) {
		return (
			<div className="text-center py-8">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
				<p className="text-muted-foreground">Loading your gallery...</p>
			</div>
		);
	}

	if (error) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Error Loading Gallery</CardTitle>
				</CardHeader>
				<CardContent className="text-center py-8">
					<p className="text-destructive mb-4">
						Failed to load your NFT gallery
					</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</CardContent>
			</Card>
		);
	}

	const hasNFTs = nfts && nfts.length > 0;

	return (
		<div className="space-y-6">
			{/* Gallery Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold">
						{hasNFTs ? `Your Collection (${nfts.length})` : "Your Gallery"}
					</h2>
					<p className="text-muted-foreground">
						{hasNFTs
							? "Your AI-generated NFT collection"
							: "Start creating to build your collection"}
					</p>
				</div>
				<Button asChild>
					<a href="/create">
						<Plus className="h-4 w-4 mr-2" />
						Create New NFT
					</a>
				</Button>
			</div>

			{/* NFT Grid */}
			{hasNFTs ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{nfts.map((nft) => (
						<NFTCard key={nft.id} nft={nft} />
					))}
				</div>
			) : (
				<Card className="w-full">
					<CardContent className="text-center py-12">
						<Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">No NFTs Yet</h3>
						<p className="text-muted-foreground mb-4">
							Start creating your first AI-generated NFT
						</p>
						<Button asChild>
							<a href="/create">
								<Plus className="h-4 w-4 mr-2" />
								Create Your First NFT
							</a>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

function NFTCard({ nft }: { nft: NFT }) {
	return (
		<Card className="group hover:shadow-lg transition-shadow">
			<CardContent className="p-0">
				<div className="aspect-square overflow-hidden rounded-t-lg">
					<img
						src={nft.image}
						alt={nft.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				</div>
				<div className="p-4">
					<h3 className="font-semibold text-lg mb-1 truncate">{nft.name}</h3>
					<p className="text-muted-foreground text-sm mb-2 line-clamp-2">
						{nft.description}
					</p>
					<div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
						<span>{nft.collection}</span>
						<span>#{nft.tokenId}</span>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-between mb-3">
						<LikeButton nftId={nft.id} showCount initialLikeCount={nft.likes} />
						<BookmarkButton nftId={nft.id} />
					</div>

					<div className="flex gap-2">
						<Button variant="outline" size="sm" className="flex-1">
							<ExternalLink className="h-3 w-3 mr-1" />
							View
						</Button>
						<Button variant="outline" size="sm" className="flex-1">
							Share
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
