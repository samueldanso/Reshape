'use client'

import { MintTransactionHandler } from '@/components/mint-transaction-handler'
import { useImageGeneration } from '@/hooks/use-image-generation'
import type { PrepareMintSVGNFTData } from '@/types/mcp'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Loader2, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function ChatInterface() {
	const [input, setInput] = useState('')
	const [pendingTransaction, setPendingTransaction] = useState<PrepareMintSVGNFTData | null>(null)

	const { isGenerating, generatedImage } = useImageGeneration()

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: '/api/create',
		}),
		onFinish: (message) => {
			// Check if the AI generated an NFT and we should show minting
			if (message.message.role === 'assistant' && message.message.parts) {
				for (const part of message.message.parts) {
					if (part.type.startsWith('tool-')) {
						const toolPart = part as any
						if (
							toolPart.toolName === 'prepareMintSVGNFT' &&
							toolPart.state === 'result' &&
							toolPart.output
						) {
							try {
								const parsed = JSON.parse(toolPart.output)
								if (
									parsed.success &&
									parsed.transaction &&
									parsed.metadata?.functionName === 'mintNFT'
								) {
									setPendingTransaction(parsed as PrepareMintSVGNFTData)
									toast.success('🎉 NFT ready to mint!')
									break
								}
							} catch {
								// Ignore parsing errors
							}
						}
					}
				}
			}
		},
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim()) return

		await generateImage(input.trim())
		sendMessage({ text: input.trim() })
		setInput('')
	}

	const generateImage = async (prompt: string) => {
		try {
			toast.info('🎨 Generating your artwork...')
		} catch (error) {
			toast.error('Failed to generate image')
		}
	}

	const handleTransactionComplete = (transactionHash: string) => {
		toast.success('🎉 NFT minted successfully!', {
			action: {
				label: 'View on Explorer',
				onClick: () =>
					window.open(
						`https://explorer-sepolia.shape.network/tx/${transactionHash}`,
						'_blank'
					),
			},
		})
		setPendingTransaction(null)
	}

	const handleTransactionError = (error: string) => {
		toast.error(`Minting failed: ${error}`)
		setPendingTransaction(null)
	}

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Minimal Header - Just Headline */}
			<div className="flex-1 flex items-center justify-center px-4">
				<div className="text-center max-w-2xl mx-auto">
					<h1 className="text-4xl md:text-5xl font-bold text-foreground">
						What can I help you create?
					</h1>
				</div>
			</div>

			{/* Sticky Input - Always at Bottom */}
			<div className="bg-background p-6">
				<div className="max-w-3xl mx-auto">
					<form onSubmit={handleSubmit} className="relative">
						<div className="flex items-center gap-3">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Describe the image you want to create..."
								className="flex-1 h-12 px-4 text-base bg-muted/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
								disabled={
									isGenerating || status === 'submitted' || status === 'streaming'
								}
							/>

							<button
								type="submit"
								disabled={
									isGenerating ||
									!input.trim() ||
									status === 'submitted' ||
									status === 'streaming'
								}
								className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								{isGenerating ||
								status === 'submitted' ||
								status === 'streaming' ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										Generating
									</>
								) : (
									<>
										<Send className="size-4" />
										Create
									</>
								)}
							</button>
						</div>

						{/* Generated Image Thumbnail */}
						{generatedImage && (
							<div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
								<div className="size-8 rounded-lg overflow-hidden">
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
						{message.role === 'assistant' &&
							message.parts?.some(
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
													const parsed = JSON.parse(
														(nftData as any).output
													)
													if (parsed.success && parsed.transaction) {
														setPendingTransaction(
															parsed as PrepareMintSVGNFTData
														)
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
