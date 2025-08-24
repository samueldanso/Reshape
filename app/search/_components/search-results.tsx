"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SearchResult {
	id: string;
	name: string;
	description: string;
	image: string;
	type: "nft" | "artist" | "collection";
}

export function SearchResults({ query }: { query: string }) {
	// Mock search results - in production this would use MCP tools
	const { data: results, isLoading } = useQuery({
		queryKey: ["search", query],
		queryFn: async (): Promise<SearchResult[]> => {
			if (!query.trim()) return [];

			// Simulate search delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Mock results
			return [
				{
					id: "1",
					name: "Cosmic Dreams",
					description: "A surreal journey through the cosmos",
					image:
						"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzQ1QjdEMSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5Db3NtaWMgRHJlYW1zPC90ZXh0Pjwvc3ZnPg==",
					type: "nft",
				},
			];
		},
		enabled: !!query.trim(),
	});

	if (!query.trim()) {
		return (
			<Card className="w-full">
				<CardContent className="text-center py-12">
					<Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-semibold mb-2">Start Searching</h3>
					<p className="text-muted-foreground mb-4">
						Use the search bar to find NFTs, artists, and collections
					</p>
				</CardContent>
			</Card>
		);
	}

	if (isLoading) {
		return (
			<div className="text-center py-8">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
				<p className="text-muted-foreground">Searching for "{query}"...</p>
			</div>
		);
	}

	if (!results || results.length === 0) {
		return (
			<Card className="w-full">
				<CardContent className="text-center py-12">
					<Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-semibold mb-2">No Results Found</h3>
					<p className="text-muted-foreground mb-4">
						No results found for "{query}"
					</p>
					<Button asChild>
						<a href="/create">
							<Plus className="h-4 w-4 mr-2" />
							Create Something New
						</a>
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<div className="text-left">
				<h2 className="text-2xl font-semibold mb-4">
					Found {results.length} result{results.length !== 1 ? "s" : ""}
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{results.map((result) => (
					<Card
						key={result.id}
						className="group hover:shadow-lg transition-shadow"
					>
						<CardContent className="p-0">
							<div className="aspect-square overflow-hidden rounded-t-lg">
								<img
									src={result.image}
									alt={result.name}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								/>
							</div>
							<div className="p-4">
								<div className="flex items-center gap-2 mb-2">
									<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full uppercase font-medium">
										{result.type}
									</span>
								</div>
								<h3 className="font-semibold text-lg mb-1">{result.name}</h3>
								<p className="text-muted-foreground text-sm line-clamp-2">
									{result.description}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
