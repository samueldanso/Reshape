import { DiscoverTabs } from './_components/discover-tabs'

export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-8">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
							Discover Amazing Vibes
						</h2>
						<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
							Explore AI-generated NFTs from the Reshape community on Shape Network
						</p>
					</div>
					<DiscoverTabs />
				</div>
			</main>
		</div>
	)
}
