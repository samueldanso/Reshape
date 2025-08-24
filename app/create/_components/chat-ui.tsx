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
import type { PrepareMintSVGNFTData } from '@/types/mcp'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Bot, Image, Wallet } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { MintTransactionHandler } from '../../../components/mint-transaction-handler'

export function ChatInterface() {
	const { isConnected } = useAccount()
	const [pendingTransaction, setPendingTransaction] = useState<PrepareMintSVGNFTData | null>(null)
	const [input, setInput] = useState('')
	const [selectedModel, setSelectedModel] = useState('gpt-4o')

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (input.trim()) {
			toast.success('🚀 Sending your creative prompt...', {
				description: 'The AI is processing your request to generate your NFT.',
				duration: 3000,
			})
			sendMessage({ text: input })
			setInput('')
		} else {
			toast.error('Please enter a description for your NFT', {
				description: 'Be specific about style, mood, colors, and composition.',
				duration: 4000,
			})
		}
	}

	const handleTransactionComplete = useCallback((hash: string) => {
		console.log('Transaction completed:', hash)
		toast.success('🎉 NFT Minted Successfully!', {
			description: `Your NFT has been minted on Shape Network. Hash: ${hash.slice(0, 8)}...`,
			duration: 6000,
		})
		setPendingTransaction(null)
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
			<div className="w-full text-center py-20">
				<div className="max-w-md mx-auto">
					<div className="size-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
						<Wallet className="h-12 w-12 text-white" />
					</div>
					<h2 className="text-3xl font-bold text-foreground mb-4">Connect Your Wallet</h2>
					<p className="text-muted-foreground mb-8 text-lg leading-relaxed">
						Connect your wallet to start creating AI-generated NFTs with the Curator
						Agent
					</p>
					<div className="bg-muted/30 rounded-xl p-6 border border-border/50">
						<p className="text-sm text-muted-foreground mb-4">
							💡 <strong>How it works:</strong>
						</p>
						<ul className="text-sm text-muted-foreground space-y-2 text-left">
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
		<div className="w-full space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-semibold text-foreground mb-2">
					Chat with the Curator Agent
				</h2>
				<p className="text-muted-foreground">
					Describe your vision and let AI create your NFT
				</p>
			</div>

			<Conversation className="h-[500px] border rounded-xl bg-background">
				<ConversationContent>
					{messages.length === 0 && (
						<div className="text-muted-foreground py-12 text-center">
							<Bot className="mx-auto mb-4 h-16 w-16 opacity-50" />
							<p className="text-xl font-medium mb-3">Ready to create your NFT?</p>
							<p className="text-sm max-w-md mx-auto">
								Describe your vision below and the Curator Agent will help you
								create a unique NFT. Be specific about style, mood, colors, and what
								you want to see.
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
							<MessageAvatar src="" name={message.role === 'user' ? 'You' : 'AI'} />
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
															const hasNFTData = message.parts?.some(
																(part) =>
																	part.type.startsWith('tool-') &&
																	(part as any).toolName ===
																		'prepareMintSVGNFT'
															)

															if (hasNFTData) {
																return (
																	<div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border-2 border-green-200 dark:border-green-800 p-6 text-center">
																		<div className="size-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
																			<Image className="size-8 text-green-600 dark:text-green-400" />
																		</div>
																		<p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
																			NFT Generated
																			Successfully! 🎉
																		</p>
																		<p className="text-xs text-green-600 dark:text-green-400 mb-4">
																			Your AI-generated NFT is
																			ready to mint
																		</p>
																		<div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-left mb-4">
																			<p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
																				Ready to mint on
																				Shape Network
																			</p>
																			<p className="text-xs text-gray-500 dark:text-gray-400">
																				Click below to mint
																				your NFT
																			</p>
																		</div>
																		<button
																			onClick={() => {
																				// Find the NFT data and set it for minting
																				const nftData =
																					message.parts?.find(
																						(part) =>
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
																								'NFT ready to mint! Check the minting interface below.'
																							)
																						}
																					} catch (e) {
																						console.error(
																							'Failed to parse NFT data:',
																							e
																						)
																						toast.error(
																							'Failed to prepare NFT for minting. Please try again.'
																						)
																					}
																				}
																			}}
																			className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
																		>
																			🚀 Mint NFT Now
																		</button>
																	</div>
																)
															}

															return (
																<div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
																	<Image className="size-12 text-muted-foreground mx-auto mb-3" />
																	<p className="text-xs text-muted-foreground mb-2">
																		Generated Image
																	</p>
																	<p className="text-xs text-muted-foreground">
																		Your AI-generated NFT will
																		appear here
																	</p>
																</div>
															)
														})()}
													</div>
												)
											}
											if (part.type.startsWith('tool-')) {
												const toolPart = part as any

												// Special handling for NFT generation tool
												if (
													toolPart.toolName === 'prepareMintSVGNFT' &&
													toolPart.state === 'result' &&
													toolPart.output
												) {
													try {
														const nftData = JSON.parse(toolPart.output)
														if (nftData.success) {
															return (
																<div
																	key={index}
																	className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 border border-green-200 dark:border-green-800"
																>
																	<div className="flex items-center gap-2 mb-3">
																		<div className="size-3 bg-green-500 rounded-full"></div>
																		<span className="text-sm font-medium text-green-800 dark:text-green-200">
																			NFT Generation Complete
																		</span>
																	</div>
																	<div className="space-y-2 text-xs">
																		<div className="flex justify-between">
																			<span className="text-green-700 dark:text-green-300">
																				Name:
																			</span>
																			<span className="font-medium text-green-800 dark:text-green-200">
																				{nftData.metadata
																					?.nftMetadata
																					?.name ||
																					'AI Generated NFT'}
																			</span>
																		</div>
																		<div className="flex justify-between">
																			<span className="text-green-700 dark:text-green-300">
																				Network:
																			</span>
																			<span className="font-medium text-green-800 dark:text-green-200">
																				Shape Network
																			</span>
																		</div>
																		<div className="flex justify-between">
																			<span className="text-green-700 dark:text-green-200">
																				Status:
																			</span>
																			<span className="font-medium text-green-800 dark:text-green-200">
																				Ready to Mint
																			</span>
																		</div>
																	</div>
																</div>
															)
														}
													} catch (e) {
														console.error(
															'Failed to parse NFT data:',
															e
														)
													}
												}

												// Default tool display
												return (
													<div
														key={index}
														className="rounded-lg bg-muted/50 p-3 text-xs border"
													>
														<div className="font-medium text-muted-foreground mb-2">
															Tool: {toolPart.toolName}
														</div>
														{toolPart.state === 'result' &&
															toolPart.output && (
																<pre className="mt-1 overflow-x-auto text-xs bg-background p-2 rounded">
																	{JSON.stringify(
																		toolPart.output,
																		null,
																		2
																	)}
																</pre>
															)}
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

					{pendingTransaction && (
						<div className="mt-4">
							<MintTransactionHandler
								transaction={pendingTransaction}
								onComplete={handleTransactionComplete}
								onError={handleTransactionError}
							/>
						</div>
					)}

					{/* Continue conversation section - similar to Onlora */}
					{messages.length > 0 && (
						<div className="mt-6 pt-6 border-t border-muted">
							<h4 className="text-sm font-medium text-muted-foreground mb-3">
								Continue the conversation...
							</h4>
							<p className="text-xs text-muted-foreground">
								Refine your prompt or ask for variations
							</p>
						</div>
					)}
				</ConversationContent>
				<ConversationScrollButton />
			</Conversation>

			{error && (
				<Alert variant="destructive">
					<AlertDescription>
						{error.message.includes('429') || error.message.includes('rate limit')
							? 'Rate limit exceeded. Please wait a moment before trying again.'
							: error.message}
					</AlertDescription>
				</Alert>
			)}

			<div className="mt-8">
				<div className="text-center mb-8">
					<h3 className="text-xl font-semibold text-foreground mb-3">✨ Get Inspired</h3>
					<p className="text-sm text-muted-foreground mb-6">
						Choose a template or describe your vision
					</p>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
						<div
							className="aspect-square bg-muted/50 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-all duration-200 hover:scale-105 group"
							onClick={handleTemplateClick}
						>
							<div className="text-center">
								<Image className="size-8 text-muted-foreground mx-auto mb-2 group-hover:text-foreground transition-colors" />
								<span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
									Templates
								</span>
							</div>
						</div>
						<div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-border/50 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-md">
							<span className="text-xs font-medium text-center px-3 text-blue-700 dark:text-blue-300">
								Abstract
								<br />
								Vibes
							</span>
						</div>
						<div className="aspect-square bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border border-border/50 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-md">
							<span className="text-xs font-medium text-center px-3 text-green-700 dark:text-green-300">
								Nature
								<br />
								Scapes
							</span>
						</div>
						<div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-orange-900/20 rounded-xl border border-border/50 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-md">
							<span className="text-xs font-medium text-center px-3 text-orange-700 dark:text-orange-300">
								Digital
								<br />
								Art
							</span>
						</div>
					</div>

					<p className="text-sm text-muted-foreground">
						Or start typing below to describe your vision...
					</p>
				</div>

				<PromptInput
					onSubmit={handleSubmit}
					className="shadow-lg border border-border/50 rounded-xl overflow-hidden"
				>
					<PromptInputTextarea
						value={input}
						onChange={handleInputChange}
						placeholder="Describe the image you want to create..."
						className="text-lg font-medium placeholder:font-bold placeholder:text-foreground/80 min-h-[120px] resize-none"
					/>
					<PromptInputToolbar className="bg-muted/30 border-t border-border/50">
						<PromptInputTools>
							{/* Show generated image thumbnail when available */}
							{messages.some((m) => m.role === 'assistant') && (
								<div className="flex items-center space-x-2 mr-2">
									<div className="size-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 border border-border/50 flex items-center justify-center">
										<Image className="size-4 text-muted-foreground" />
									</div>
									<span className="text-xs text-muted-foreground font-medium">
										History
									</span>
								</div>
							)}

							<PromptInputButton
								variant="ghost"
								size="sm"
								onClick={handleTemplateClick}
								className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg px-3 py-2"
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
								onClick={() => setInput('')}
								className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg px-3 py-2"
							>
								Clear
							</PromptInputButton>
						</PromptInputTools>

						<PromptInputSubmit className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-sm px-6 py-2 rounded-lg font-medium">
							Send
						</PromptInputSubmit>
					</PromptInputToolbar>
				</PromptInput>
			</div>
		</div>
	)
}
