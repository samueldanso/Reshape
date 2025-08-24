"use client";

import { useQuery } from "@tanstack/react-query";
import {
	Bookmark,
	Heart,
	Image,
	Plus,
	Settings,
	Sparkles,
	User,
	Wallet,
} from "lucide-react";
import { useAccount } from "wagmi";
import { NFTGrid } from "@/app/gallery/_components/nft-gallery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserProfile {
	address: string;
	name: string;
	avatar: string;
	stats: {
		nftsCreated: number;
		nftsCollected: number;
		totalLikes: number;
		followers: number;
		following: number;
	};
}

export function ProfileView() {
	const { address, isConnected } = useAccount();

	// Fetch user profile data
	const {
		data: profile,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user-profile", address],
		queryFn: async (): Promise<UserProfile> => {
			if (!address) throw new Error("No address");

			try {
				// For MVP: Return mock data
				// In production: Use MCP tools to fetch user profile
				return {
					address,
					name: "Vibe Creator",
					avatar: "",
					stats: {
						nftsCreated: 5,
						nftsCollected: 12,
						totalLikes: 89,
						followers: 24,
						following: 18,
					},
				};
			} catch (error) {
				console.error("Failed to fetch profile:", error);
				throw error;
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
						Please connect your wallet to view your profile
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
				<p className="text-muted-foreground">Loading your profile...</p>
			</div>
		);
	}

	if (error || !profile) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Error Loading Profile</CardTitle>
				</CardHeader>
				<CardContent className="text-center py-8">
					<p className="text-destructive mb-4">Failed to load profile</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{/* Profile Header */}
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center gap-6">
						<Avatar className="h-24 w-24">
							<AvatarImage src={profile.avatar} alt={profile.name} />
							<AvatarFallback className="text-2xl">
								{profile.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
							<p className="text-muted-foreground font-mono mb-4">
								{profile.address}
							</p>
							<div className="flex gap-4">
								<Button asChild>
									<a href="/create">
										<Plus className="h-4 w-4 mr-2" />
										Create NFT
									</a>
								</Button>
								<Button variant="outline">
									<Settings className="h-4 w-4 mr-2" />
									Edit Profile
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
				<Card>
					<CardContent className="p-4 text-center">
						<Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
						<div className="text-2xl font-bold">
							{profile.stats.nftsCreated}
						</div>
						<div className="text-sm text-muted-foreground">Created</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<Image className="h-6 w-6 text-primary mx-auto mb-2" />
						<div className="text-2xl font-bold">
							{profile.stats.nftsCollected}
						</div>
						<div className="text-sm text-muted-foreground">Collected</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<Heart className="h-6 w-6 text-primary mx-auto mb-2" />
						<div className="text-2xl font-bold">{profile.stats.totalLikes}</div>
						<div className="text-sm text-muted-foreground">Likes</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<User className="h-6 w-6 text-primary mx-auto mb-2" />
						<div className="text-2xl font-bold">{profile.stats.followers}</div>
						<div className="text-sm text-muted-foreground">Followers</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<User className="h-6 w-6 text-primary mx-auto mb-2" />
						<div className="text-2xl font-bold">{profile.stats.following}</div>
						<div className="text-sm text-muted-foreground">Following</div>
					</CardContent>
				</Card>
			</div>

			{/* Profile Tabs */}
			<Tabs defaultValue="created" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="created" className="flex items-center gap-2">
						<Sparkles className="h-4 w-4" />
						Created
					</TabsTrigger>
					<TabsTrigger value="collected" className="flex items-center gap-2">
						<Image className="h-4 w-4" />
						Collected
					</TabsTrigger>
					<TabsTrigger value="bookmarks" className="flex items-center gap-2">
						<Bookmark className="h-4 w-4" />
						Bookmarks
					</TabsTrigger>
				</TabsList>

				<TabsContent value="created" className="space-y-6">
					<div className="text-center py-8">
						<h3 className="text-lg font-semibold mb-2">Your Created NFTs</h3>
						<p className="text-muted-foreground">NFTs you've created with AI</p>
					</div>
					{/* This would show created NFTs */}
				</TabsContent>

				<TabsContent value="collected" className="space-y-6">
					<div className="text-center py-8">
						<h3 className="text-lg font-semibold mb-2">Your Collection</h3>
						<p className="text-muted-foreground">
							NFTs you've collected from others
						</p>
					</div>
					{/* This would show collected NFTs */}
				</TabsContent>

				<TabsContent value="bookmarks" className="space-y-6">
					<div className="text-center py-8">
						<h3 className="text-lg font-semibold mb-2">Your Bookmarks</h3>
						<p className="text-muted-foreground">NFTs you've saved for later</p>
					</div>
					{/* This would show bookmarked NFTs */}
				</TabsContent>
			</Tabs>
		</div>
	);
}
