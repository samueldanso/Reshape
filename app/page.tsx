import { ChatInterface } from '@/components/chat-interface'

export default function Home() {
	return (
		<div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center space-y-8">
			<div className="space-y-4 text-center">
				<h1 className="text-4xl text-primary font-bold tracking-tight sm:text-6xl">
					Reshape
				</h1>
				<p className="text-muted-foreground max-w-2xl text-xl">
					AI-powered NFT platform for vibe artists on Shape Network
				</p>
				<p className="text-muted-foreground max-w-xl text-base">
					Create, mint, and manage your NFTs with AI assistance. Connect your wallet to
					get started.
				</p>
			</div>

			{/* AI Chat Interface */}
			<div className="w-full max-w-6xl">
				<ChatInterface />
			</div>
		</div>
	)
}
