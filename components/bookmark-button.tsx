'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Bookmark } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

interface BookmarkButtonProps {
	nftId: string
	className?: string
	onBookmarkChange?: (isBookmarked: boolean) => void
}

export function BookmarkButton({ nftId, className, onBookmarkChange }: BookmarkButtonProps) {
	const { address } = useAccount()
	const [isBookmarked, setIsBookmarked] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const handleBookmark = async () => {
		if (!address) {
			toast.error('Please connect your wallet to bookmark NFTs')
			return
		}

		setIsLoading(true)

		try {
			// For MVP: Show coming soon toast
			// In production: This would call Supabase API to bookmark/unbookmark
			toast.info('Bookmark feature coming soon! Database integration in progress.')

			// For now: Just toggle local state for demo
			const newIsBookmarked = !isBookmarked

			setIsBookmarked(newIsBookmarked)
			onBookmarkChange?.(newIsBookmarked)
		} catch (error) {
			console.error('Failed to toggle bookmark:', error)
			toast.error('Failed to bookmark NFT')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			onClick={handleBookmark}
			disabled={isLoading || !address}
			variant="ghost"
			size="sm"
			className={cn(
				'hover:bg-accent/50 transition-colors',
				isBookmarked && 'text-primary hover:text-primary/80',
				className
			)}
		>
			<Bookmark className={cn('size-4 transition-colors', isBookmarked && 'fill-current')} />
		</Button>
	)
}
