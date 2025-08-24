'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'
import { NFTGrid } from './nft-grid'

export function DiscoverTabs() {
	const [activeTab, setActiveTab] = useState('latest')

	return (
		<div className="w-full space-y-6">
			{/* Clean Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1 rounded-lg">
					<TabsTrigger
						value="latest"
						className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						<Clock className="h-4 w-4" />
						Latest
					</TabsTrigger>
					<TabsTrigger
						value="trending"
						className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						<TrendingUp className="h-4 w-4" />
						Trending
					</TabsTrigger>
					<TabsTrigger
						value="following"
						className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						<Users className="h-4 w-4" />
						Following
					</TabsTrigger>
				</TabsList>

				<TabsContent value="latest" className="space-y-6">
					<NFTGrid tab="latest" />
				</TabsContent>

				<TabsContent value="trending" className="space-y-6">
					<NFTGrid tab="trending" />
				</TabsContent>

				<TabsContent value="following" className="space-y-6">
					<NFTGrid tab="following" />
				</TabsContent>
			</Tabs>
		</div>
	)
}
