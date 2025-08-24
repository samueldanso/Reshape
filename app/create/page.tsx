import { ChatInterface } from '@/app/create/_components/chat-ui'

export default function CreatePage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-foreground mb-6">Create with AI</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Transform your vibes into unique NFTs with the Curator Agent
						</p>
					</div>
					<ChatInterface />
				</div>
			</div>
		</div>
	)
}
