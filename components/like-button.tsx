"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
	nftId: string;
	className?: string;
	showCount?: boolean;
	initialLikeCount?: number;
	onLikeChange?: (isLiked: boolean, newCount: number) => void;
}

export function LikeButton({
	nftId,
	className,
	showCount = false,
	initialLikeCount = 0,
	onLikeChange,
}: LikeButtonProps) {
	const { address } = useAccount();
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(initialLikeCount);
	const [isLoading, setIsLoading] = useState(false);

	const handleLike = async () => {
		if (!address) {
			// Could show a toast here asking user to connect wallet
			return;
		}

		setIsLoading(true);

		try {
			// For MVP: Just toggle local state
			// In production: This would call an API to like/unlike
			const newIsLiked = !isLiked;
			const newCount = newIsLiked ? likeCount + 1 : likeCount - 1;

			setIsLiked(newIsLiked);
			setLikeCount(newCount);

			onLikeChange?.(newIsLiked, newCount);
		} catch (error) {
			console.error("Failed to toggle like:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleLike}
			disabled={isLoading || !address}
			variant="ghost"
			size="sm"
			className={cn(
				"gap-2 hover:bg-accent/50 transition-colors",
				isLiked && "text-red-500 hover:text-red-600",
				className,
			)}
		>
			<Heart
				className={cn("size-4 transition-colors", isLiked && "fill-current")}
			/>
			{showCount && <span className="text-sm font-medium">{likeCount}</span>}
		</Button>
	);
}
