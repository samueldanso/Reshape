'use client'

import { BookmarkButton } from '@/components/bookmark-button'
import { LikeButton } from '@/components/like-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, Image, Plus, RefreshCw, Share2, Wallet } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

interface NFT {
	id: string
	name: string
	description: string
	image: string
	collection: string
	tokenId: string
	likes: number
}

export function NFTGallery() {
	const { address, isConnected } = useAccount()

	// Fetch user's NFTs using the existing MCP tools
	const {
		data: nfts,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['user-nfts', address],
		queryFn: async (): Promise<NFT[]> => {
			if (!address) return []

			try {
				// Use the getShapeNft MCP tool to fetch real data
				const response = await fetch('/api/call-mcp-tool', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						toolName: 'getShapeNft',
						parameters: { address },
					}),
				})

				if (!response.ok) {
					throw new Error('Failed to fetch NFTs from MCP')
				}

				const result = await response.json()

				if (result.success && result.result?.nfts) {
					// Transform MCP data to our NFT format
					return result.result.nfts.map((nft: any) => ({
						id: nft.tokenId,
						name: nft.name || `NFT #${nft.tokenId}`,
						description: `AI-generated NFT on Shape Network`,
						image:
							nft.imageUrl ||
							`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&crop=center`,
						collection: nft.contractAddress || 'AI Generated',
						tokenId: nft.tokenId,
						likes: Math.floor(Math.random() * 50) + 5, // Random likes for now
					}))
				}

				// Fallback to empty array if no NFTs found
				return []
			} catch (error) {
				console.error('Failed to fetch NFTs:', error)
				return []
			}
		},
		enabled: !!address && isConnected,
	})

	const handleRefresh = async () => {
		toast.info('🔄 Refreshing your gallery...', {
			description: 'Fetching the latest NFTs from Shape Network',
			duration: 2000,
		})
		await refetch()
		toast.success('✅ Gallery refreshed!', {
			description: 'Your NFT collection is up to date',
			duration: 3000,
		})
	}

	if (!isConnected) {
		return (
			<div className="w-full text-center py-20">
				<div className="max-w-md mx-auto">
					<div className="size-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
						<Wallet className="h-12 w-12 text-white" />
					</div>
					<h2 className="text-3xl font-bold text-foreground mb-4">Connect Your Wallet</h2>
					<p className="text-muted-foreground mb-8 text-lg leading-relaxed">
						Connect your wallet to view your AI-generated NFT collection
					</p>
					<div className="bg-muted/30 rounded-xl p-6 border border-border/50">
						<p className="text-sm text-muted-foreground mb-4">
							💡 <strong>What you'll see:</strong>
						</p>
						<ul className="text-sm text-muted-foreground space-y-2 text-left">
							<li>• All your minted NFTs in one place</li>
							<li>• Beautiful gallery layout</li>
							<li>• Like and bookmark your favorites</li>
							<li>• Share your collection with others</li>
						</ul>
					</div>
				</div>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className="text-center py-8">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
				<p className="text-muted-foreground">Loading your gallery...</p>
			</div>
		)
	}

	if (error) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Error Loading Gallery</CardTitle>
				</CardHeader>
				<CardContent className="text-center py-8">
					<p className="text-destructive mb-4">Failed to load your NFT gallery</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</CardContent>
			</Card>
		)
	}

	const hasNFTs = nfts && nfts.length > 0

	return (
		<div className="space-y-6">
			{/* Gallery Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold">
						{hasNFTs ? `Your Collection (${nfts.length})` : 'Your Gallery'}
					</h2>
					<p className="text-muted-foreground">
						{hasNFTs
							? 'Your AI-generated NFT collection on Shape Network'
							: 'Start creating to build your collection'}
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" onClick={handleRefresh}>
						<RefreshCw className="h-4 w-4 mr-2" />
						Refresh
					</Button>
					<Button asChild>
						<a href="/create">
							<Plus className="h-4 w-4 mr-2" />
							Create New NFT
						</a>
					</Button>
				</div>
			</div>

			{/* NFT Grid */}
			{hasNFTs ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{nfts.map((nft) => (
						<NFTCard key={nft.id} nft={nft} />
					))}
				</div>
			) : (
				<div className="text-center py-16">
					<div className="max-w-md mx-auto">
						<div className="size-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
							<Image className="h-10 w-10 text-muted-foreground" />
						</div>
						<h3 className="text-2xl font-semibold mb-3">No NFTs Yet</h3>
						<p className="text-muted-foreground mb-6 text-lg">
							Start creating your first AI-generated NFT
						</p>
						<Button
							asChild
							size="lg"
							className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
						>
							<a href="/create">
								<Plus className="h-5 w-5 mr-2" />
								Create Your First NFT
							</a>
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}

function NFTCard({ nft }: { nft: NFT }) {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleShare = async () => {
		try {
			if (navigator.share) {
				await navigator.share({
					title: nft.name,
					text: `Check out my AI-generated NFT: ${nft.name}`,
					url: window.location.href,
				})
			} else {
				await navigator.clipboard.writeText(window.location.href)
				toast.success('🔗 Link copied!', {
					description: 'NFT link copied to clipboard',
					duration: 3000,
				})
			}
		} catch (error) {
			toast.error('Failed to share', {
				description: 'Please try again',
				duration: 3000,
			})
		}
	}

	return (
		<Card className="group overflow-hidden bg-background border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
			<CardContent className="p-0">
				<div className="aspect-square overflow-hidden">
					<img
						src={nft.image}
						alt={nft.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				</div>
				<div className="p-4 space-y-3">
					<h3 className="font-semibold text-lg mb-1 truncate text-foreground">
						{nft.name}
					</h3>
					<p className="text-muted-foreground text-sm mb-2 line-clamp-2 leading-relaxed">
						{nft.description}
					</p>
					<div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
						<span className="bg-muted/50 px-2 py-1 rounded-md">{nft.collection}</span>
						<span className="font-mono">#{nft.tokenId}</span>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-between mb-3">
						<LikeButton nftId={nft.id} showCount initialLikeCount={nft.likes} />
						<BookmarkButton nftId={nft.id} />
					</div>

					<div className="flex gap-2">
						<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="flex-1 hover:bg-muted/50"
								>
									<ExternalLink className="h-3 w-3 mr-1" />
									View
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>{nft.name}</DialogTitle>
								</DialogHeader>
								<div className="aspect-square overflow-hidden">
									<img
										src={nft.image}
										alt={nft.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<p className="text-muted-foreground text-sm mt-4">
									{nft.description}
								</p>
								<div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
									<span className="bg-muted/50 px-2 py-1 rounded-md">
										{nft.collection}
									</span>
									<span className="font-mono">#{nft.tokenId}</span>
								</div>
								<div className="flex items-center justify-between mt-4">
									<LikeButton
										nftId={nft.id}
										showCount
										initialLikeCount={nft.likes}
									/>
									<BookmarkButton nftId={nft.id} />
								</div>
							</DialogContent>
						</Dialog>
						<Button
							variant="outline"
							size="sm"
							className="flex-1 hover:bg-muted/50"
							onClick={handleShare}
						>
							<Share2 className="h-3 w-3 mr-1" />
							Share
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
