import { ArtGenerator } from './_components/art-generator'

export default function CreatePage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						Create with AI
					</h1>
					<p className="text-xl text-muted-foreground">
						Transform your vibes into unique NFTs with the Curator Agent
					</p>
				</div>
				<ArtGenerator />
			</div>
		</div>
	)
}
