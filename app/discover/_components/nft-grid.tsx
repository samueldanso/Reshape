'use client'

import { BookmarkButton } from '@/components/bookmark-button'
import { LikeButton } from '@/components/like-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { MessageCircle, RefreshCw, Share, Sparkles } from 'lucide-react'

interface DiscoverNFT {
	id: string
	name: string
	description: string
	image: string
	author: {
		name: string
		avatar: string
		address: string
	}
	likes: number
	comments: number
	createdAt: string
	price?: string
}

export function NFTGrid({ tab }: { tab: string }) {
	// Fetch NFTs based on tab using MCP tools
	const {
		data: nfts,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['discover-nfts', tab],
		queryFn: async (): Promise<DiscoverNFT[]> => {
			try {
				let response

				switch (tab) {
					case 'latest':
						// Get latest NFTs from the community
						response = await fetch('/api/call-mcp-tool', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								toolName: 'getShapeNft',
								parameters: {
									address: '0x0000000000000000000000000000000000000000',
								}, // Community address
							}),
						})
						break

					case 'trending':
						// Get trending collections and market stats
						response = await fetch('/api/call-mcp-tool', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								toolName: 'getCollectionMarketStats',
								parameters: {
									collection: '0x0000000000000000000000000000000000000000',
								}, // Example collection
							}),
						})
						break

					case 'following':
						// Get top creators and their work
						response = await fetch('/api/call-mcp-tool', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								toolName: 'getTopShapeCreators',
								parameters: { random_string: 'discover' },
							}),
						})
						break

					default:
						throw new Error(`Unknown tab: ${tab}`)
				}

				if (!response.ok) {
					throw new Error('Failed to fetch data from MCP')
				}

				const result = await response.json()

				// Transform MCP data to our DiscoverNFT format
				if (tab === 'latest' && result.success && result.result?.nfts) {
					return result.result.nfts.slice(0, 10).map((nft: any, index: number) => ({
						id: nft.tokenId || `latest-${index}`,
						name: nft.name || `AI Generated NFT #${nft.tokenId}`,
						description: 'AI-generated artwork on Shape Network',
						image:
							nft.imageUrl ||
							`data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzQ1QjdEMSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5BSSBHZW5lcmF0ZWQgTkZUIzwvdGV4dD48L3N2Zz4=`,
						author: {
							name: `Creator ${nft.ownerAddress?.slice(0, 6)}...`,
							avatar: '',
							address: nft.ownerAddress || '0x0000...0000',
						},
						likes: Math.floor(Math.random() * 50) + 10,
						comments: Math.floor(Math.random() * 10) + 1,
						createdAt: `${Math.floor(Math.random() * 24)} hours ago`,
						price: `${(Math.random() * 0.1).toFixed(3)} ETH`,
					}))
				}

				if (tab === 'trending' && result.success && result.result) {
					// Transform collection market stats to NFT format
					const collection = result.result
					return Array.from({ length: 6 }, (_, index) => ({
						id: `trending-${index}`,
						name: collection.name || `Trending Collection ${index + 1}`,
						description: `Floor: ${collection.floorPrice?.openSea?.floorPrice || 'N/A'} ETH`,
						image: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0ZGNkI2QiIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5UcmVuZGluZyBDb2xsZWN0aW9uPC90ZXh0Pjwvc3ZnPg==`,
						author: {
							name: 'Shape Community',
							avatar: '',
							address: '0x0000...0000',
						},
						likes: Math.floor(Math.random() * 100) + 50,
						comments: Math.floor(Math.random() * 20) + 5,
						createdAt: 'Trending now',
						price: `${collection.floorPrice?.openSea?.floorPrice || 'N/A'} ETH`,
					}))
				}

				if (tab === 'following' && result.success && result.result?.topCreators) {
					// Transform top creators to NFT format
					return result.result.topCreators
						.slice(0, 8)
						.map((creator: any, index: number) => ({
							id: `creator-${index}`,
							name: creator.ensName || `Creator ${creator.address.slice(0, 6)}...`,
							description: `Gasback: ${creator.totalGasbackEarnedETH.toFixed(4)} ETH`,
							image: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzk2Q0VCNCIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5Ub3AgQ3JlYXRvcjwvdGV4dD48L3N2Zz4=`,
							author: {
								name:
									creator.ensName || `Creator ${creator.address.slice(0, 6)}...`,
								avatar: '',
								address: creator.address,
							},
							likes: Math.floor(Math.random() * 200) + 100,
							comments: Math.floor(Math.random() * 30) + 10,
							createdAt: 'Top creator',
							price: `${creator.totalGasbackEarnedETH.toFixed(4)} ETH earned`,
						}))
				}

				// Fallback to empty array
				return []
			} catch (error) {
				console.error('Failed to fetch NFTs:', error)
				return []
			}
		},
	})

	if (isLoading) {
		return (
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold capitalize">
							{tab === 'latest'
								? 'Latest NFTs'
								: tab === 'trending'
									? 'Trending Collections'
									: tab === 'following'
										? 'Top Creators'
										: 'Discover'}
						</h3>
						<p className="text-sm text-muted-foreground">
							{tab === 'latest'
								? 'Fresh AI-generated NFTs from the community'
								: tab === 'trending'
									? 'Popular collections with market insights'
									: tab === 'following'
										? 'Shape Network top performers'
										: 'Explore amazing vibes'}
						</p>
					</div>
					<Button variant="outline" size="sm" onClick={() => refetch()}>
						<RefreshCw className="h-4 w-4 mr-2" />
						Refresh
					</Button>
				</div>

				{/* Loading Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{Array.from({ length: 8 }).map((_, index) => (
						<div key={index} className="animate-pulse">
							<div className="bg-muted/50 aspect-square rounded-lg mb-4"></div>
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<div className="size-6 bg-muted/50 rounded-full"></div>
									<div className="flex-1 space-y-2">
										<div className="h-3 bg-muted/50 rounded w-3/4"></div>
										<div className="h-2 bg-muted/50 rounded w-1/2"></div>
									</div>
								</div>
								<div className="space-y-2">
									<div className="h-4 bg-muted/50 rounded w-full"></div>
									<div className="h-3 bg-muted/50 rounded w-2/3"></div>
								</div>
								<div className="h-8 bg-muted/50 rounded"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold capitalize">
							{tab === 'latest'
								? 'Latest NFTs'
								: tab === 'trending'
									? 'Trending Collections'
									: tab === 'following'
										? 'Top Creators'
										: 'Discover'}
						</h3>
						<p className="text-sm text-muted-foreground">
							{tab === 'latest'
								? 'Fresh AI-generated NFTs from the community'
								: tab === 'trending'
									? 'Popular collections with market insights'
									: tab === 'following'
										? 'Shape Network top performers'
										: 'Explore amazing vibes'}
						</p>
					</div>
					<Button variant="outline" size="sm" onClick={() => refetch()}>
						<RefreshCw className="h-4 w-4 mr-2" />
						Refresh
					</Button>
				</div>

				{/* Error State */}
				<div className="text-center py-12">
					<div className="mx-auto size-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
						<span className="text-2xl">⚠️</span>
					</div>
					<h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
					<p className="text-muted-foreground mb-4">
						Failed to load{' '}
						{tab === 'latest'
							? 'NFTs'
							: tab === 'trending'
								? 'collections'
								: 'creators'}
					</p>
					<Button onClick={() => refetch()} className="gap-2">
						<RefreshCw className="h-4 w-4" />
						Try Again
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Discover Header */}
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold capitalize">
						{tab === 'latest'
							? 'Latest NFTs'
							: tab === 'trending'
								? 'Trending Collections'
								: tab === 'following'
									? 'Top Creators'
									: 'Discover'}
					</h3>
					<p className="text-sm text-muted-foreground">
						{tab === 'latest'
							? 'Fresh AI-generated NFTs from the community'
							: tab === 'trending'
								? 'Popular collections with market insights'
								: tab === 'following'
									? 'Shape Network top performers'
									: 'Explore amazing vibes'}
					</p>
				</div>
				<Button variant="outline" size="sm" onClick={() => refetch()}>
					<RefreshCw className="h-4 w-4 mr-2" />
					Refresh
				</Button>
			</div>

			{/* Beautiful NFT Grid - Onlora Style */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{nfts?.map((nft) => (
					<NFTCard key={nft.id} nft={nft} />
				))}
			</div>
		</div>
	)
}

interface NFTCardProps {
	nft: DiscoverNFT
}

function NFTCard({ nft }: NFTCardProps) {
	return (
		<Card className="group overflow-hidden bg-background border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
			<CardContent className="p-0">
				{/* NFT Image */}
				<div className="aspect-square overflow-hidden">
					<img
						src={nft.image}
						alt={nft.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				</div>

				{/* NFT Details */}
				<div className="p-4 space-y-3">
					{/* Author Info */}
					<div className="flex items-center gap-2">
						<Avatar className="h-6 w-6">
							<AvatarImage src={nft.author.avatar} alt={nft.author.name} />
							<AvatarFallback className="text-xs bg-muted">
								{nft.author.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate text-foreground">
								{nft.author.name}
							</p>
							<p className="text-xs text-muted-foreground font-mono">
								{nft.author.address}
							</p>
						</div>
					</div>

					{/* NFT Info */}
					<div>
						<h3 className="font-semibold text-lg mb-1 text-foreground line-clamp-1">
							{nft.name}
						</h3>
						<p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
							{nft.description}
						</p>
					</div>

					{/* Price and Time */}
					<div className="flex items-center justify-between text-sm">
						{nft.price && (
							<span className="font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
								{nft.price}
							</span>
						)}
						<span className="text-muted-foreground">{nft.createdAt}</span>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-between pt-2">
						<div className="flex items-center gap-4">
							<LikeButton nftId={nft.id} showCount initialLikeCount={nft.likes} />
							<Button
								variant="ghost"
								size="sm"
								className="flex items-center gap-1 h-8 px-2"
							>
								<MessageCircle className="h-4 w-4" />
								<span className="text-sm">{nft.comments}</span>
							</Button>
						</div>
						<div className="flex items-center gap-2">
							<BookmarkButton nftId={nft.id} />
							<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
								<Share className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Mint Button */}
					<Button className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-sm">
						<Sparkles className="h-4 w-4" />
						Mint NFT
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
