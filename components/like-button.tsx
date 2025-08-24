'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

interface LikeButtonProps {
	nftId: string
	className?: string
	showCount?: boolean
	initialLikeCount?: number
	onLikeChange?: (isLiked: boolean, newCount: number) => void
}

export function LikeButton({
	nftId,
	className,
	showCount = false,
	initialLikeCount = 0,
	onLikeChange,
}: LikeButtonProps) {
	const { address } = useAccount()
	const [isLiked, setIsLiked] = useState(false)
	const [likeCount, setLikeCount] = useState(initialLikeCount)
	const [isLoading, setIsLoading] = useState(false)

	const handleLike = async () => {
		if (!address) {
			toast.error('Please connect your wallet to like NFTs')
			return
		}

		setIsLoading(true)

		try {
			// For MVP: Show coming soon toast
			// In production: This would call Supabase API to like/unlike
			toast.info('Like feature coming soon! Database integration in progress.')

			// For now: Just toggle local state for demo
			const newIsLiked = !isLiked
			const newCount = newIsLiked ? likeCount + 1 : likeCount - 1

			setIsLiked(newIsLiked)
			setLikeCount(newCount)

			onLikeChange?.(newIsLiked, newCount)
		} catch (error) {
			console.error('Failed to toggle like:', error)
			toast.error('Failed to like NFT')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			onClick={handleLike}
			disabled={isLoading || !address}
			variant="ghost"
			size="sm"
			className={cn(
				'gap-2 hover:bg-accent/50 transition-colors',
				isLiked && 'text-red-500 hover:text-red-600',
				className
			)}
		>
			<Heart className={cn('size-4 transition-colors', isLiked && 'fill-current')} />
			{showCount && <span className="text-sm font-medium">{likeCount}</span>}
		</Button>
	)
}
