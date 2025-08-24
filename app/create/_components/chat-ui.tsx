'use client'

import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Loader } from '@/components/ai-elements/loader'
import { Message, MessageAvatar, MessageContent } from '@/components/ai-elements/message'
import {
	PromptInput,
	PromptInputButton,
	PromptInputModelSelect,
	PromptInputModelSelectContent,
	PromptInputModelSelectItem,
	PromptInputModelSelectTrigger,
	PromptInputModelSelectValue,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputToolbar,
	PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useImageGeneration } from '@/hooks/use-image-generation'
import type { PrepareMintSVGNFTData } from '@/types/mcp'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Bot, Download, ExternalLink, Image, Sparkles, Wallet } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { MintTransactionHandler } from '../../../components/mint-transaction-handler'

export function ChatInterface() {
	const { isConnected } = useAccount()
	const [pendingTransaction, setPendingTransaction] = useState<PrepareMintSVGNFTData | null>(null)
	const [input, setInput] = useState('')
	const [selectedModel, setSelectedModel] = useState('gpt-4o')
	const [currentPrompt, setCurrentPrompt] = useState('')

	// Image generation hook
	const { generateImage, isGenerating, generatedImage, clearGeneratedImage } =
		useImageGeneration()

	const { messages, sendMessage, status, error } = useChat({
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

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value)
	}

	const handleTemplateClick = () => {
		toast.info('🎨 Templates coming soon!', {
			description: "We're working on inspiration templates to help you create amazing NFTs.",
			duration: 4000,
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (input.trim()) {
			setCurrentPrompt(input)

			// First, generate the image
			toast.info('🎨 Starting your creative journey...', {
				description: "First, let's generate your artwork, then create the NFT",
				duration: 3000,
			})

			const imageResult = await generateImage(input)

			if (imageResult.success && imageResult.image) {
				// Image generated successfully, now send to AI for NFT creation
				toast.success('🚀 Now creating your NFT...', {
					description: 'The AI is preparing your NFT metadata',
					duration: 3000,
				})

				// Send the enhanced prompt to AI for NFT creation
				const enhancedPrompt = `I want to create an NFT with this artwork: ${input}. The image has been generated and stored on IPFS with hash: ${imageResult.image.ipfsHash}. Please create the NFT metadata and prepare it for minting on Shape Network.`

				sendMessage({ text: enhancedPrompt })
				setInput('')
			} else {
				toast.error('Failed to generate image. Please try again.')
			}
		} else {
			toast.error('Please enter a description for your NFT', {
				description: 'Be specific about style, mood, colors, and composition.',
				duration: 4000,
			})
		}
	}

	const handleTransactionComplete = useCallback((hash: string) => {
		console.log('Transaction completed:', hash)

		// Show success with explorer links
		toast.success('🎉 NFT Minted Successfully!', {
			description: `Your NFT has been minted on Shape Network!`,
			duration: 8000,
			action: {
				label: 'View on Explorer',
				onClick: () => {
					window.open(`https://explorer.shape.org/tx/${hash}`, '_blank')
				},
			},
		})

		setPendingTransaction(null)

		// Show instruction to refresh gallery
		setTimeout(() => {
			toast.info('🔄 Refresh Your Gallery', {
				description: 'Visit your gallery to see your newly minted NFT!',
				duration: 5000,
				action: {
					label: 'Go to Gallery',
					onClick: () => {
						window.location.href = '/gallery'
					},
				},
			})
		}, 2000)
	}, [])

	const handleTransactionError = useCallback((error: string) => {
		console.error('Transaction failed:', error)
		toast.error('❌ Minting Failed', {
			description: 'There was an error minting your NFT. Please try again.',
			duration: 5000,
		})
		setPendingTransaction(null)
	}, [])

	if (!isConnected) {
		return (
			<div className="w-full text-center py-8">
				<div className="max-w-md mx-auto">
					<div className="size-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
						<Wallet className="h-10 w-10 text-white" />
					</div>
					<h2 className="text-2xl font-bold text-foreground mb-3">Connect Your Wallet</h2>
					<p className="text-muted-foreground mb-6 text-base leading-relaxed">
						Connect your wallet to start creating AI-generated NFTs with the Curator
						Agent
					</p>
					<div className="bg-muted/30 rounded-xl p-4 border border-border/50">
						<p className="text-sm text-muted-foreground mb-3">
							💡 <strong>How it works:</strong>
						</p>
						<ul className="text-sm text-muted-foreground space-y-1 text-left">
							<li>• Connect your wallet in the top right corner</li>
							<li>• Describe your vision to the AI</li>
							<li>• Generate and mint unique NFTs</li>
							<li>• Earn gasback rewards on Shape Network</li>
						</ul>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full h-screen flex flex-col">
			{/* Header */}
			<div className="text-center py-4 border-b border-border/50">
				<h2 className="text-xl font-semibold text-foreground mb-2">
					Chat with the Curator Agent
				</h2>
				<p className="text-sm text-muted-foreground">
					Describe your vision and let AI create your NFT
				</p>
			</div>

			{/* Chat Conversation - Scrollable */}
			<div className="flex-1 overflow-y-auto">
				<Conversation className="h-full border-0 bg-transparent">
					<ConversationContent>
						{messages.length === 0 && (
							<div className="text-muted-foreground py-8 text-center">
								<Bot className="mx-auto mb-3 h-12 w-12 opacity-50" />
								<p className="text-lg font-medium mb-2">
									Ready to create your NFT?
								</p>
								<p className="text-sm max-w-md mx-auto">
									Describe your vision below and the Curator Agent will help you
									create a unique NFT. Be specific about style, mood, colors, and
									what you want to see.
								</p>
							</div>
						)}

						{/* Show thinking state when AI is processing */}
						{status === 'streaming' && (
							<Message from="assistant">
								<MessageAvatar src="" name="AI" />
								<MessageContent>
									<div className="flex items-center space-x-2 text-muted-foreground">
										<Loader className="size-4" />
										<span className="text-sm">Creating your NFT...</span>
									</div>
								</MessageContent>
							</Message>
						)}

						{messages.map((message) => (
							<Message key={message.id} from={message.role}>
								<MessageAvatar
									src=""
									name={message.role === 'user' ? 'You' : 'AI'}
								/>
								<MessageContent>
									{message.role === 'assistant' && message.parts ? (
										<div className="space-y-4">
											{message.parts.map((part, index) => {
												if (part.type === 'text') {
													return (
														<div key={index} className="space-y-4">
															<div className="bg-muted/30 rounded-lg p-4 border-l-4 border-l-primary">
																<p className="text-sm leading-relaxed text-foreground">
																	{part.text}
																</p>
															</div>

															{/* Show generated NFT data when available */}
															{(() => {
																// Check if this message contains NFT generation data
																const hasNFTData =
																	message.parts?.some(
																		(part) =>
																			part.type.startsWith(
																				'tool-'
																			) &&
																			(part as any)
																				.toolName ===
																				'prepareMintSVGNFT'
																	)

																if (hasNFTData) {
																	console.log(
																		'🎉 NFT Data Found!',
																		message.parts
																	)
																	return (
																		<div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border-2 border-green-200 dark:border-green-800 p-6 text-center">
																			<div className="size-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
																				<Image className="size-8 text-green-600 dark:text-green-400" />
																			</div>
																			<p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
																				🎉 NFT Generated
																				Successfully!
																			</p>
																			<p className="text-xs text-green-600 dark:text-green-400 mb-4">
																				Your AI-generated
																				NFT is ready to mint
																				on Shape Network!
																			</p>

																			{/* Clear Minting Instructions */}
																			<div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-left mb-4">
																				<p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
																					🚀 Ready to mint
																					on Shape Network
																				</p>
																				<p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
																					Click the button
																					below to start
																					the minting
																					process
																				</p>
																				<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
																					<p className="text-xs text-blue-700 dark:text-blue-300">
																						💡{' '}
																						<strong>
																							What
																							happens
																							next:
																						</strong>
																						<br />
																						1. Click
																						"Mint NFT
																						Now" below
																						<br />
																						2. Your
																						wallet will
																						pop up
																						asking for
																						approval
																						<br />
																						3. Sign the
																						transaction
																						to mint your
																						NFT
																						<br />
																						4. Earn
																						gasback
																						rewards on
																						Shape
																						Network!
																					</p>
																				</div>
																			</div>

																			{/* Prominent Mint Button */}
																			<button
																				onClick={() => {
																					// Find the NFT data and set it for minting
																					const nftData =
																						message.parts?.find(
																							(
																								part
																							) =>
																								part.type.startsWith(
																									'tool-'
																								) &&
																								(
																									part as any
																								)
																									.toolName ===
																									'prepareMintSVGNFT'
																						)
																					if (nftData) {
																						try {
																							const parsed =
																								JSON.parse(
																									(
																										nftData as any
																									)
																										.output
																								)
																							if (
																								parsed.success &&
																								parsed.transaction
																							) {
																								setPendingTransaction(
																									parsed as PrepareMintSVGNFTData
																								)
																								toast.success(
																									'🎉 NFT ready to mint! Check the minting interface below.'
																								)
																							}
																						} catch (e) {
																							console.error(
																								'Failed to parse NFT data:',
																								e
																							)
																							toast.error(
																								'Failed to prepare NFT for minting'
																							)
																						}
																					}
																				}}
																				className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
																			>
																				🚀 Mint NFT Now
																			</button>
																		</div>
																	)
																}
																return null
															})()}
														</div>
													)
												}
												return null
											})}
										</div>
									) : (
										<div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
											<p className="text-sm text-foreground">
												{message.parts?.[0]?.type === 'text'
													? message.parts[0].text
													: 'No content available'}
											</p>
										</div>
									)}
								</MessageContent>
							</Message>
						))}

						{/* Show generated image in conversation flow */}
						{generatedImage && (
							<Message from="assistant">
								<MessageAvatar src="" name="AI" />
								<MessageContent>
									<div className="space-y-4">
										<div className="bg-muted/30 rounded-lg p-4 border-l-4 border-l-primary">
											<p className="text-sm leading-relaxed text-foreground mb-4">
												🎨 Here's your generated artwork! It has been stored
												on IPFS and is ready for NFT creation.
											</p>

											{/* Image Display */}
											<div className="text-center">
												<img
													src={`data:image/png;base64,${generatedImage.base64}`}
													alt="AI Generated Artwork"
													className="w-full max-w-md mx-auto rounded-lg border border-border/50 shadow-lg"
												/>
											</div>

											{/* IPFS Details */}
											<div className="mt-4 space-y-2 text-xs">
												<div>
													<span className="font-medium text-foreground">
														IPFS Hash:
													</span>
													<code className="ml-2 bg-muted/50 px-2 py-1 rounded font-mono text-muted-foreground break-all">
														{generatedImage.ipfsHash}
													</code>
												</div>
												<div>
													<span className="font-medium text-foreground">
														Gateway:
													</span>
													<a
														href={generatedImage.gatewayUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="ml-2 text-blue-600 hover:text-blue-700 underline break-all"
													>
														{generatedImage.gatewayUrl}
													</a>
												</div>
											</div>
										</div>
									</div>
								</MessageContent>
							</Message>
						)}

						{pendingTransaction && (
							<Message from="assistant">
								<MessageAvatar src="" name="AI" />
								<MessageContent>
									<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-6">
										<div className="text-center mb-4">
											<div className="flex items-center justify-center gap-2 mb-2">
												<Sparkles className="size-6 text-blue-600" />
												<h3 className="text-lg font-bold text-foreground">
													🚀 Mint Your NFT on Shape Network
												</h3>
											</div>
											<p className="text-sm text-muted-foreground mb-3">
												Your AI-generated NFT is ready to be minted on Shape
												Network
											</p>
											<div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-center">
												<p className="text-xs text-blue-700 dark:text-blue-300">
													💡 <strong>Note:</strong> You'll need to sign a
													transaction with your wallet to mint. This
													creates a permanent record on Shape Network and
													you'll earn gasback rewards!
												</p>
											</div>
										</div>
										<MintTransactionHandler
											transaction={pendingTransaction}
											onComplete={handleTransactionComplete}
											onError={handleTransactionError}
										/>
									</div>
								</MessageContent>
							</Message>
						)}
					</ConversationContent>
				</Conversation>
			</div>

			{/* Sticky Chat Input - Always at Bottom */}
			<div className="border-t border-border/50 bg-background p-4">
				<PromptInput
					onSubmit={handleSubmit}
					className="shadow-lg border border-border/50 rounded-xl overflow-hidden"
				>
					<PromptInputTextarea
						value={input}
						onChange={handleInputChange}
						placeholder="Describe the image you want to create..."
						className="text-lg font-medium placeholder:font-bold placeholder:text-foreground/80 min-h-[120px] resize-none"
						disabled={isGenerating}
					/>
					<PromptInputToolbar className="bg-muted/30 border-t border-border/50">
						<PromptInputTools>
							{/* Show generated image thumbnail when available */}
							{generatedImage && (
								<div className="flex items-center space-x-2 mr-2">
									<div className="size-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 border border-border/50 flex items-center justify-center">
										<img
											src={`data:image/png;base64,${generatedImage.base64}`}
											alt="Generated"
											className="size-6 rounded object-cover"
										/>
									</div>
									<span className="text-xs text-muted-foreground font-medium">
										Artwork Ready
									</span>
								</div>
							)}

							<PromptInputButton
								variant="ghost"
								size="sm"
								onClick={handleTemplateClick}
								className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg px-3 py-2"
								disabled={isGenerating}
							>
								<Image className="size-4 mr-2" />
								<span className="hidden sm:inline">Template</span>
							</PromptInputButton>

							<PromptInputModelSelect
								value={selectedModel}
								onValueChange={setSelectedModel}
							>
								<PromptInputModelSelectTrigger className="text-sm bg-background border border-border/50 hover:bg-muted/50">
									<PromptInputModelSelectValue />
								</PromptInputModelSelectTrigger>
								<PromptInputModelSelectContent>
									<PromptInputModelSelectItem value="gpt-4o">
										GPT-4o
									</PromptInputModelSelectItem>
								</PromptInputModelSelectContent>
							</PromptInputModelSelect>

							<PromptInputButton
								variant="ghost"
								size="sm"
								onClick={() => {
									setInput('')
									clearGeneratedImage()
								}}
								className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg px-3 py-2"
								disabled={isGenerating}
							>
								Clear
							</PromptInputButton>
						</PromptInputTools>

						<PromptInputSubmit
							className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-sm px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isGenerating || !input.trim()}
						>
							{isGenerating ? (
								<>
									<Loader className="size-4 mr-2 animate-spin" />
									Generating...
								</>
							) : (
								'Create Artwork'
							)}
						</PromptInputSubmit>
					</PromptInputToolbar>
				</PromptInput>
			</div>
		</div>
	)
}
