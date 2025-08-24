import { SearchResults } from "./_components/search-results";

export default function SearchPage({
	searchParams,
}: {
	searchParams: { q?: string };
}) {
	const query = searchParams.q || "";

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						Search Results
					</h1>
					{query && (
						<p className="text-xl text-muted-foreground">
							Results for "{query}"
						</p>
					)}
				</div>
				<SearchResults query={query} />
			</div>
		</div>
	);
}
