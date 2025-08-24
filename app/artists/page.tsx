import { ArtistsGrid } from "./_components/artists-grid";

export default function ArtistsPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						Discover Artists
					</h1>
					<p className="text-xl text-muted-foreground">
						Explore amazing creators and their AI-generated NFT collections
					</p>
				</div>
				<ArtistsGrid />
			</div>
		</div>
	);
}
