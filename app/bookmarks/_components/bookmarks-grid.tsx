"use client";

import { useQuery } from "@tanstack/react-query";
import { Bookmark, ExternalLink, Image, Plus, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { BookmarkButton } from "@/components/bookmark-button";
import { LikeButton } from "@/components/like-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookmarkedNFT {
	id: string;
	name: string;
	description: string;
	image: string;
	collection: string;
	tokenId: string;
	likes: number;
	author: {
		name: string;
		address: string;
	};
}

export function BookmarksGrid() {
	const { address, isConnected } = useAccount();

	// Fetch user's bookmarked NFTs
	const {
		data: bookmarks,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user-bookmarks", address],
		queryFn: async (): Promise<BookmarkedNFT[]> => {
			if (!address) return [];

			try {
				// For MVP: Return mock data
				// In production: Use MCP tools to fetch bookmarked NFTs
				return [
					{
						id: "1",
						name: "Cosmic Dreams",
						description: "A surreal journey through the cosmos",
						image:
							"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzQ1QjdEMSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5Db3NtaWMgRHJlYW1zPC90ZXh0Pjwvc3ZnPg==",
						collection: "AI Generated",
						tokenId: "1",
						likes: 24,
						author: {
							name: "VibeMaster",
							address: "0x1234...5678",
						},
					},
				];
			} catch (error) {
				console.error("Failed to fetch bookmarks:", error);
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
						Please connect your wallet to view your bookmarks
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
				<p className="text-muted-foreground">Loading your bookmarks...</p>
			</div>
		);
	}

	if (error) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Error Loading Bookmarks</CardTitle>
				</CardHeader>
				<CardContent className="text-center py-8">
					<p className="text-destructive mb-4">Failed to load bookmarks</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</CardContent>
			</Card>
		);
	}

	const hasBookmarks = bookmarks && bookmarks.length > 0;

	return (
		<div className="space-y-6">
			{/* Bookmarks Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold">
						{hasBookmarks
							? `Saved NFTs (${bookmarks.length})`
							: "Your Bookmarks"}
					</h2>
					<p className="text-muted-foreground">
						{hasBookmarks
							? "NFTs you've saved for later"
							: "Start bookmarking NFTs to build your collection"}
					</p>
				</div>
				<Button asChild>
					<a href="/discover">
						<Plus className="h-4 w-4 mr-2" />
						Discover More
					</a>
				</Button>
			</div>

			{/* Bookmarks Grid */}
			{hasBookmarks ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{bookmarks.map((nft) => (
						<BookmarkCard key={nft.id} nft={nft} />
					))}
				</div>
			) : (
				<Card className="w-full">
					<CardContent className="text-center py-12">
						<Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">No Bookmarks Yet</h3>
						<p className="text-muted-foreground mb-4">
							Start discovering and bookmarking amazing NFTs
						</p>
						<Button asChild>
							<a href="/discover">
								<Plus className="h-4 w-4 mr-2" />
								Explore Discover
							</a>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

function BookmarkCard({ nft }: { nft: BookmarkedNFT }) {
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

					{/* Author Info */}
					<div className="flex items-center gap-2 mb-3">
						<div className="flex-1 min-w-0">
							<p className="text-xs text-muted-foreground">
								by {nft.author.name}
							</p>
						</div>
					</div>

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
