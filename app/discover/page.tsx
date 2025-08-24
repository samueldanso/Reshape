import { DiscoverTabs } from './_components/discover-tabs'

export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Clean Header - Logo Only */}
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-center">
						{/* Centered Logo */}
						<div className="flex items-center space-x-3">
							<div className="size-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">R</span>
							</div>
							<h1 className="text-xl font-bold text-foreground">Reshape</h1>
						</div>
					</div>
				</div>
			</header>

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
