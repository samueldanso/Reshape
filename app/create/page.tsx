import { ChatInterface } from '@/app/create/_components/chat-ui'

export default function CreatePage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<ChatInterface />
				</div>
			</div>
		</div>
	)
}
