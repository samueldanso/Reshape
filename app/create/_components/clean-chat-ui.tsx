'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { useImageGeneration } from '@/hooks/use-image-generation'
import { toast } from 'sonner'
import { Loader, Image, Sparkles } from 'lucide-react'
import { MintTransactionHandler } from './mint-transaction-handler'
import type { PrepareMintSVGNFTData } from '@/types/mcp'

export function CleanChatUI() {
	const [input, setInput] = useState('')
	const [selectedModel, setSelectedModel] = useState('gpt-4o')
	const [pendingTransaction, setPendingTransaction] = useState<PrepareMintSVGNFTData | null>(null)
	
	const { isGenerating, generatedImage, clearGeneratedImage } = useImageGeneration()

	const { messages, input: chatInput, handleInputChange, handleSubmit: chatSubmit, isLoading } = useChat({
		api: '/api/create',
		onFinish: (message) => {
			// Check if this message contains NFT generation data
			const hasNFTData = message.message.parts?.some(
				(part) =>
					part.type.startsWith('tool-') &&
					(part as any).toolName === 'prepareMintSVGNFT'
			)

			if (hasNFTData) {
				console.log('🎉 NFT Data Found!', message.message.parts)
				toast.success('🎉 NFT ready to mint!')
			}
		},
		onError: (error) => {
			toast.error(`Error: ${error.message}`)
		},
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim()) {
			toast.error('Please enter a prompt')
			return
		}

		// First generate the image
		await generateImage(input.trim())
		
		// Then send to chat
		chatSubmit(e)
	}

	const generateImage = async (prompt: string) => {
		try {
			toast.info('🎨 Generating your artwork...')
			// This will be handled by the useImageGeneration hook
		} catch (error) {
			toast.error('Failed to generate image')
		}
	}

	const handleTemplateClick = () => {
		toast.info('Templates coming soon! 🚀')
	}

	const handleTransactionComplete = (transactionHash: string) => {
		toast.success('🎉 NFT minted successfully!', {
			action: {
				label: 'View on Explorer',
				onClick: () => window.open(`https://explorer.shape.org/tx/${transactionHash}`, '_blank')
			}
		})
		setPendingTransaction(null)
	}

	const handleTransactionError = (error: string) => {
		toast.error(`Minting failed: ${error}`)
		setPendingTransaction(null)
	}

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Clean Header - Just Headline */}
			<div className="flex-1 flex items-center justify-center px-4">
				<div className="text-center max-w-2xl mx-auto">
					<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
						What can I help you create?
					</h1>
					<p className="text-lg text-muted-foreground mb-8">
						Describe your vision and let AI create your NFT
					</p>
				</div>
			</div>

			{/* Sticky Input - Always at Bottom */}
			<div className="border-t border-border/50 bg-background p-6">
				<div className="max-w-4xl mx-auto">
					<form onSubmit={handleSubmit} className="relative">
						{/* Main Input */}
						<div className="relative">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Describe the image you want to create..."
								className="w-full px-6 py-4 text-lg bg-muted/30 border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
								disabled={isGenerating}
							/>
							
							{/* Right Side Controls */}
							<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
								{/* Model Select */}
								<select
									value={selectedModel}
									onChange={(e) => setSelectedModel(e.target.value)}
									className="bg-background border border-border/50 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
								>
									<option value="gpt-4o">GPT-4o</option>
								</select>

								{/* Template Button */}
								<button
									type="button"
									onClick={handleTemplateClick}
									className="bg-muted/50 hover:bg-muted/70 border border-border/50 rounded-lg px-3 py-1.5 text-sm transition-colors"
									disabled={isGenerating}
								>
									Template
								</button>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={isGenerating || !input.trim()}
									className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
								>
									{isGenerating ? (
										<>
											<Loader className="size-4 animate-spin" />
											Generating...
										</>
									) : (
										<>
											<Image className="size-4" />
											Create
										</>
									)}
								</button>
							</div>
						</div>

						{/* Generated Image Thumbnail */}
						{generatedImage && (
							<div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
								<div className="size-8 rounded-lg overflow-hidden border border-border/50">
									<img
										src={`data:image/png;base64,${generatedImage.base64}`}
										alt="Generated"
										className="w-full h-full object-cover"
									/>
								</div>
								<span>Artwork ready</span>
							</div>
						)}
					</form>
				</div>
			</div>

			{/* Hidden Chat Messages - For Functionality */}
			<div className="hidden">
				{messages.map((message) => (
					<div key={message.id}>
						{message.role === 'assistant' && message.parts?.some(
							(part) =>
								part.type.startsWith('tool-') &&
								(part as any).toolName === 'prepareMintSVGNFT'
						) && (
							<div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
								<p className="text-sm font-medium text-green-800 dark:text-green-200">
									🎉 NFT Generated Successfully!
								</p>
								<button
									onClick={() => {
										const nftData = message.parts?.find(
											(part) =>
												part.type.startsWith('tool-') &&
												(part as any).toolName === 'prepareMintSVGNFT'
										)
										if (nftData) {
											try {
												const parsed = JSON.parse((nftData as any).output)
												if (parsed.success && parsed.transaction) {
													setPendingTransaction(parsed as PrepareMintSVGNFTData)
													toast.success('🎉 NFT ready to mint!')
												}
											} catch (e) {
												console.error('Failed to parse NFT data:', e)
												toast.error('Failed to prepare NFT for minting')
											}
										}
									}}
									className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
								>
									Mint NFT Now
								</button>
							</div>
						)}
					</div>
				))}

				{pendingTransaction && (
					<MintTransactionHandler
						transaction={pendingTransaction}
						onComplete={handleTransactionComplete}
						onError={handleTransactionError}
					/>
				)}
			</div>
		</div>
	)
}
