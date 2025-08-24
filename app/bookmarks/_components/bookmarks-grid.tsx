'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bookmark, Construction, Wallet } from 'lucide-react'
import { useAccount } from 'wagmi'

export function BookmarksGrid() {
	const { isConnected } = useAccount()

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
		)
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Bookmark className="h-5 w-5" />
					My Bookmarks
				</CardTitle>
			</CardHeader>
			<CardContent className="text-center py-12">
				<Construction className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
				<h3 className="text-lg font-semibold mb-2">Bookmarks Coming Soon</h3>
				<p className="text-muted-foreground mb-4">
					Save and organize your favorite NFTs with bookmarks
				</p>
				<Button asChild>
					<a href="/discover">Discover NFTs</a>
				</Button>
			</CardContent>
		</Card>
	)
}
