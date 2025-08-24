'use client'

import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { Activity, Clock, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'
import { NFTGrid } from './nft-grid'

export function DiscoverTabs() {
	const [activeTab, setActiveTab] = useState('latest')

	// Fetch chain status
	const { data: chainStatus } = useQuery({
		queryKey: ['chain-status'],
		queryFn: async () => {
			try {
				const response = await fetch('/api/call-mcp-tool', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						toolName: 'getChainStatus',
						parameters: { random_string: 'discover' },
					}),
				})

				if (response.ok) {
					const result = await response.json()
					return result.success ? result.result : null
				}
				return null
			} catch (error) {
				console.error('Failed to fetch chain status:', error)
				return null
			}
		},
		refetchInterval: 30000, // Refresh every 30 seconds
	})

	return (
		<div className="w-full space-y-6">
			{/* Chain Status Indicator */}
			{chainStatus && (
				<div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm">
					<div className="flex items-center gap-2">
						<Activity className="h-4 w-4 text-green-500" />
						<span className="text-sm font-medium">Shape Network Status</span>
					</div>
					<Badge variant="outline" className="text-xs bg-background/50">
						Block #{chainStatus.latestBlock?.number || 'N/A'}
					</Badge>
					<Badge variant="outline" className="text-xs bg-background/50">
						Gas: {chainStatus.gasPrices?.standard || 'N/A'} Gwei
					</Badge>
					<Badge variant="outline" className="text-xs bg-background/50">
						{chainStatus.networkMetrics?.totalTransactions || 'N/A'} Txs
					</Badge>
				</div>
			)}

			{/* Feature Cards - Cleaner Design */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-border/50 backdrop-blur-sm">
					<h3 className="text-lg font-semibold mb-2">🎯 Gasback Calculator</h3>
					<p className="text-sm text-muted-foreground mb-4">
						Calculate potential gasback earnings for your NFT collection
					</p>
					<GasbackCalculator />
				</div>

				<div className="p-6 bg-gradient-to-br from-green-50/50 to-teal-50/50 dark:from-green-950/20 dark:to-teal-950/20 rounded-xl border border-border/50 backdrop-blur-sm">
					<h3 className="text-lg font-semibold mb-2">📊 Creator Analytics</h3>
					<p className="text-sm text-muted-foreground mb-4">
						View top creators and their performance on Shape Network
					</p>
					<TopCreatorsPreview />
				</div>
			</div>

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

// Gasback Calculator Component
function GasbackCalculator() {
	const [transactions, setTransactions] = useState(100)
	const [avgGas, setAvgGas] = useState(150000)

	const { data: gasbackData, isLoading } = useQuery({
		queryKey: ['gasback-simulation', transactions, avgGas],
		queryFn: async () => {
			try {
				const response = await fetch('/api/call-mcp-tool', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						toolName: 'simulateGasbackEarnings',
						parameters: {
							hypotheticalTxs: transactions,
							avgGasPerTx: avgGas,
						},
					}),
				})

				if (response.ok) {
					const result = await response.json()
					return result.success ? result.result : null
				}
				return null
			} catch (error) {
				console.error('Failed to simulate gasback:', error)
				return null
			}
		},
		enabled: transactions > 0 && avgGas > 0,
	})

	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<div className="flex items-center gap-3">
					<label className="text-xs font-medium text-muted-foreground min-w-[80px]">
						Transactions:
					</label>
					<input
						type="range"
						min="10"
						max="1000"
						value={transactions}
						onChange={(e) => setTransactions(Number(e.target.value))}
						className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
					/>
					<span className="text-sm font-medium min-w-[60px] text-right">
						{transactions} txs
					</span>
				</div>

				<div className="flex items-center gap-3">
					<label className="text-xs font-medium text-muted-foreground min-w-[80px]">
						Avg Gas:
					</label>
					<input
						type="range"
						min="50000"
						max="500000"
						step="10000"
						value={avgGas}
						onChange={(e) => setAvgGas(Number(e.target.value))}
						className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
					/>
					<span className="text-sm font-medium min-w-[80px] text-right">
						{avgGas.toLocaleString()} gas
					</span>
				</div>
			</div>

			{gasbackData && (
				<div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/50">
					<p className="text-xs text-muted-foreground mb-1">Estimated Gasback</p>
					<p className="text-xl font-bold text-green-600">
						{gasbackData.estimatedGasbackEarnings?.toFixed(4) || '0.0000'} ETH
					</p>
				</div>
			)}
		</div>
	)
}

// Top Creators Preview Component
function TopCreatorsPreview() {
	const { data: creatorsData } = useQuery({
		queryKey: ['top-creators-preview'],
		queryFn: async () => {
			try {
				const response = await fetch('/api/call-mcp-tool', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						toolName: 'getTopShapeCreators',
						parameters: { random_string: 'preview' },
					}),
				})

				if (response.ok) {
					const result = await response.json()
					return result.success ? result.result : null
				}
				return null
			} catch (error) {
				console.error('Failed to fetch top creators:', error)
				return null
			}
		},
	})

	if (!creatorsData?.topCreators) {
		return (
			<div className="text-center py-4">
				<p className="text-sm text-muted-foreground">Loading creators...</p>
			</div>
		)
	}

	return (
		<div className="space-y-2">
			{creatorsData.topCreators.slice(0, 3).map((creator: any, index: number) => (
				<div key={creator.address} className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-2">
						<span className="text-xs font-medium text-muted-foreground">
							#{index + 1}
						</span>
						<span className="truncate">
							{creator.ensName || creator.address.slice(0, 6) + '...'}
						</span>
					</div>
					<span className="text-xs font-medium text-green-600">
						{creator.totalGasbackEarnedETH.toFixed(3)} ETH
					</span>
				</div>
			))}
		</div>
	)
}
