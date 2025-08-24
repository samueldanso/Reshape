'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, Image, User, Users } from 'lucide-react'

interface Artist {
	id: string
	address: string
	name: string
	avatar: string
	collectionCount: number
	nftCount: number
	followers: number
	topNFTs: Array<{
		id: string
		name: string
		image: string
	}>
}

export function ArtistsGrid() {
	// Fetch top artists using MCP tools
	const {
		data: artists,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['top-artists'],
		queryFn: async (): Promise<Artist[]> => {
			try {
				// For MVP: Return mock data
				// In production: Use getTopShapeCreators MCP tool
				return [
					{
						id: '1',
						address: '0x1234...5678',
						name: 'VibeMaster',
						avatar: '',
						collectionCount: 3,
						nftCount: 25,
						followers: 156,
						topNFTs: [
							{
								id: '1',
								name: 'Cosmic Dreams',
								image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzQ1QjdEMSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48L3N2Zz4=',
							},
						],
					},
					{
						id: '2',
						address: '0x8765...4321',
						name: 'DigitalDreamer',
						avatar: '',
						collectionCount: 2,
						nftCount: 18,
						followers: 89,
						topNFTs: [
							{
								id: '2',
								name: 'Neon Nights',
								image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGNkI2QiIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48L3N2Zz4=',
							},
						],
					},
				]
			} catch (error) {
				console.error('Failed to fetch artists:', error)
				return []
			}
		},
	})

	if (isLoading) {
		return (
			<div className="text-center py-8">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
				<p className="text-muted-foreground">Discovering amazing artists...</p>
			</div>
		)
	}

	if (error) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Error Loading Artists</CardTitle>
				</CardHeader>
				<CardContent className="text-center py-8">
					<p className="text-destructive mb-4">Failed to load artists</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-6">
			{/* Artists Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{artists?.map((artist) => (
					<ArtistCard key={artist.id} artist={artist} />
				))}
			</div>

			{/* Empty State */}
			{(!artists || artists.length === 0) && (
				<Card className="w-full">
					<CardContent className="text-center py-12">
						<Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">No Artists Found</h3>
						<p className="text-muted-foreground">
							Be the first to create amazing AI-generated NFTs!
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

function ArtistCard({ artist }: { artist: Artist }) {
	return (
		<Card className="group hover:shadow-lg transition-shadow">
			<CardHeader className="pb-4">
				<div className="flex items-center gap-3">
					<Avatar className="h-12 w-12">
						<AvatarImage src={artist.avatar} alt={artist.name} />
						<AvatarFallback>
							<User className="h-6 w-6" />
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg truncate">{artist.name}</CardTitle>
						<p className="text-sm text-muted-foreground font-mono">{artist.address}</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Stats */}
				<div className="grid grid-cols-3 gap-4 text-center">
					<div>
						<div className="text-lg font-semibold">{artist.collectionCount}</div>
						<div className="text-xs text-muted-foreground">Collections</div>
					</div>
					<div>
						<div className="text-lg font-semibold">{artist.nftCount}</div>
						<div className="text-xs text-muted-foreground">NFTs</div>
					</div>
					<div>
						<div className="text-lg font-semibold">{artist.followers}</div>
						<div className="text-xs text-muted-foreground">Followers</div>
					</div>
				</div>

				{/* Top NFT Preview */}
				{artist.topNFTs.length > 0 && (
					<div>
						<h4 className="text-sm font-medium mb-2">Featured Work</h4>
						<div className="grid grid-cols-2 gap-2">
							{artist.topNFTs.slice(0, 2).map((nft) => (
								<div key={nft.id} className="relative group">
									<img
										src={nft.image}
										alt={nft.name}
										className="w-full h-20 object-cover rounded-md"
									/>
									<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
										<Button variant="ghost" size="sm" className="text-white">
											<ExternalLink className="h-3 w-3" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="flex gap-2">
					<Button variant="outline" size="sm" className="flex-1">
						<Image className="h-3 w-3 mr-1" />
						View Collection
					</Button>
					<Button variant="outline" size="sm" className="flex-1">
						<Users className="h-3 w-3 mr-1" />
						Follow
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
