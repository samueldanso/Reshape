"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Share, Sparkles } from "lucide-react";
import { BookmarkButton } from "@/components/bookmark-button";
import { LikeButton } from "@/components/like-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DiscoverNFT {
	id: string;
	name: string;
	description: string;
	image: string;
	author: {
		name: string;
		avatar: string;
		address: string;
	};
	likes: number;
	comments: number;
	createdAt: string;
	price?: string;
}

export function NFTGrid({ tab }: { tab: string }) {
	// Fetch NFTs based on tab using MCP tools
	const {
		data: nfts,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["discover-nfts", tab],
		queryFn: async (): Promise<DiscoverNFT[]> => {
			try {
				// For MVP: Return mock data
				// In production: Use MCP tools like getCollectionMarketStats, getTopShapeCreators
				return [
					{
						id: "1",
						name: "Cosmic Dreams",
						description: "A surreal journey through the cosmos",
						image:
							"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzQ1QjdEMSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5Db3NtaWMgRHJlYW1zPC90ZXh0Pjwvc3ZnPg==",
						author: {
							name: "VibeMaster",
							avatar: "",
							address: "0x1234...5678",
						},
						likes: 24,
						comments: 5,
						createdAt: "2 hours ago",
						price: "0.05 ETH",
					},
					{
						id: "2",
						name: "Neon Nights",
						description: "Cyberpunk cityscape in neon lights",
						image:
							"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0ZGNkI2QiIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5OZW9uIE5pZ2h0czwvdGV4dD48L3N2Zz4=",
						author: {
							name: "DigitalDreamer",
							avatar: "",
							address: "0x8765...4321",
						},
						likes: 18,
						comments: 3,
						createdAt: "4 hours ago",
						price: "0.03 ETH",
					},
					{
						id: "3",
						name: "Mountain Serenity",
						description: "Peaceful mountain landscape at dawn",
						image:
							"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzk2Q0VCNCIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5Nb3VudGFpbiBTZXJlbml0eTwvdGV4dD48L3N2Zz4=",
						author: {
							name: "NatureLover",
							avatar: "",
							address: "0x9876...5432",
						},
						likes: 31,
						comments: 8,
						createdAt: "6 hours ago",
						price: "0.07 ETH",
					},
				];
			} catch (error) {
				console.error("Failed to fetch NFTs:", error);
				return [];
			}
		},
	});

	if (isLoading) {
		return (
			<div className="text-center py-8">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
				<p className="text-muted-foreground">Discovering amazing vibes...</p>
			</div>
		);
	}

	if (error) {
		return (
			<Card className="w-full">
				<CardContent className="text-center py-8">
					<p className="text-destructive mb-4">Failed to load NFTs</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{nfts?.map((nft) => (
				<NFTCard key={nft.id} nft={nft} />
			))}
		</div>
	);
}

interface NFTCardProps {
	nft: DiscoverNFT;
}

function NFTCard({ nft }: NFTCardProps) {
	return (
		<Card className="group hover:shadow-lg transition-shadow">
			<CardContent className="p-0">
				{/* NFT Image */}
				<div className="aspect-square overflow-hidden rounded-t-lg">
					<img
						src={nft.image}
						alt={nft.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				</div>

				{/* NFT Details */}
				<div className="p-4 space-y-3">
					{/* Author Info */}
					<div className="flex items-center gap-2">
						<Avatar className="h-6 w-6">
							<AvatarImage src={nft.author.avatar} alt={nft.author.name} />
							<AvatarFallback className="text-xs">
								{nft.author.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">{nft.author.name}</p>
							<p className="text-xs text-muted-foreground font-mono">
								{nft.author.address}
							</p>
						</div>
					</div>

					{/* NFT Info */}
					<div>
						<h3 className="font-semibold text-lg mb-1">{nft.name}</h3>
						<p className="text-sm text-muted-foreground line-clamp-2">
							{nft.description}
						</p>
					</div>

					{/* Price and Time */}
					<div className="flex items-center justify-between text-sm">
						{nft.price && (
							<span className="font-medium text-primary">{nft.price}</span>
						)}
						<span className="text-muted-foreground">{nft.createdAt}</span>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<LikeButton
								nftId={nft.id}
								showCount
								initialLikeCount={nft.likes}
							/>
							<Button
								variant="ghost"
								size="sm"
								className="flex items-center gap-1"
							>
								<MessageCircle className="h-4 w-4" />
								<span className="text-sm">{nft.comments}</span>
							</Button>
						</div>
						<div className="flex items-center gap-2">
							<BookmarkButton nftId={nft.id} />
							<Button variant="ghost" size="sm">
								<Share className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Mint Button */}
					<Button className="w-full gap-2">
						<Sparkles className="h-4 w-4" />
						Mint NFT
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
