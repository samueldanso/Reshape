"use client";

import { Clock, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NFTGrid } from "./nft-grid";

export function DiscoverTabs() {
	const [activeTab, setActiveTab] = useState("latest");

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
			<TabsList className="grid w-full grid-cols-3 mb-8">
				<TabsTrigger value="latest" className="flex items-center gap-2">
					<Clock className="h-4 w-4" />
					Latest
				</TabsTrigger>
				<TabsTrigger value="trending" className="flex items-center gap-2">
					<TrendingUp className="h-4 w-4" />
					Trending
				</TabsTrigger>
				<TabsTrigger value="following" className="flex items-center gap-2">
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
	);
}
