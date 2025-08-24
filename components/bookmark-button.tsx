"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
	nftId: string;
	className?: string;
	onBookmarkChange?: (isBookmarked: boolean) => void;
}

export function BookmarkButton({
	nftId,
	className,
	onBookmarkChange,
}: BookmarkButtonProps) {
	const { address } = useAccount();
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleBookmark = async () => {
		if (!address) {
			// Could show a toast here asking user to connect wallet
			return;
		}

		setIsLoading(true);

		try {
			// For MVP: Just toggle local state
			// In production: This would call an API to bookmark/unbookmark
			const newIsBookmarked = !isBookmarked;

			setIsBookmarked(newIsBookmarked);
			onBookmarkChange?.(newIsBookmarked);
		} catch (error) {
			console.error("Failed to toggle bookmark:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleBookmark}
			disabled={isLoading || !address}
			variant="ghost"
			size="sm"
			className={cn(
				"hover:bg-accent/50 transition-colors",
				isBookmarked && "text-primary hover:text-primary/80",
				className,
			)}
		>
			<Bookmark
				className={cn(
					"size-4 transition-colors",
					isBookmarked && "fill-current",
				)}
			/>
		</Button>
	);
}
