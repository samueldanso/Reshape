import { DiscoverTabs } from "./_components/discover-tabs";

export default function DiscoverPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						Discover Amazing Vibes
					</h1>
					<p className="text-xl text-muted-foreground">
						Explore AI-generated NFTs from the Reshape community
					</p>
				</div>
				<DiscoverTabs />
			</div>
		</div>
	);
}
