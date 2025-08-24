'use client'

import { SearchBar } from '@/components/search-bar'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { WalletConnect } from '@/components/wallet-connect'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

export function Header() {
	const { isConnected } = useAccount()
	const { openConnectModal } = useConnectModal()
	const router = useRouter()

	function handleCreateClick() {
		if (!isConnected) {
			openConnectModal?.()
			return
		}
		router.push('/create')
	}

	return (
		<header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Left: Search Bar */}
				<div className="flex-1 max-w-md">
					<SearchBar />
				</div>

				{/* Right: Actions */}
				<div className="flex items-center gap-3">
					<ThemeToggle />
					<Button
						variant="outline"
						onClick={handleCreateClick}
						className="text-sm font-medium flex items-center gap-2"
					>
						<Plus className="h-4 w-4" />
						Create
					</Button>
					<WalletConnect />
				</div>
			</div>
		</header>
	)
}
