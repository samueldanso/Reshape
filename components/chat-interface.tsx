'use client'

import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Message, MessageAvatar, MessageContent } from '@/components/ai-elements/message'
import {
	PromptInput,
	PromptInputButton,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputToolbar,
	PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PrepareMintSVGNFTData } from '@/types/mcp'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Bot, Wallet } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { MintTransactionHandler } from './mint-transaction-handler'

export function ChatInterface() {
	const { isConnected } = useAccount()
	const [pendingTransaction, setPendingTransaction] = useState<PrepareMintSVGNFTData | null>(null)
	const [input, setInput] = useState('')

	const { messages, sendMessage, status, error } = useChat({
		transport: new DefaultChatTransport({
			api: '/api/chat',
		}),
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (input.trim()) {
			sendMessage({ text: input })
			setInput('')
		}
	}

	// Detect transaction responses in messages
	useEffect(() => {
		if (pendingTransaction) return

		for (const message of messages) {
			if (message.role === 'assistant') {
				let transaction: PrepareMintSVGNFTData | null = null
				let messageText = ''

				// Extract text from message parts
				if (message.parts) {
					for (const part of message.parts) {
						if (part.type === 'text') {
							messageText += part.text || ''
						}
					}
				}

				transaction = detectTransactionResponse(messageText)

				// If not found in text, check tool results
				if (!transaction && message.parts) {
					for (const part of message.parts) {
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
										transaction = parsed as PrepareMintSVGNFTData
										break
									}
								} catch {
									// Ignore parsing errors
								}
							}
						}
					}
				}

				if (transaction) {
					setPendingTransaction(transaction)
					break
				}
			}
		}
	}, [messages, pendingTransaction])

	const detectTransactionResponse = (content: string): PrepareMintSVGNFTData | null => {
		try {
			const parsed = JSON.parse(content)
			if (
				parsed.success &&
				parsed.transaction &&
				parsed.metadata?.functionName === 'mintNFT'
			) {
				return parsed as PrepareMintSVGNFTData
			}
		} catch {
			const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/
			const match = content.match(jsonBlockRegex)
			if (match) {
				const parsed = JSON.parse(match[1])
				if (
					parsed.success &&
					parsed.transaction &&
					parsed.metadata?.functionName === 'mintNFT'
				) {
					return parsed as PrepareMintSVGNFTData
				}
			}
			const jsonRegex =
				/\{[\s\S]*"success"\s*:\s*true[\s\S]*"transaction"\s*[\s\S]*"mintNFT"[\s\S]*\}/
			const jsonMatch = content.match(jsonRegex)
			if (jsonMatch) {
				const parsed = JSON.parse(jsonMatch[0])
				if (
					parsed.success &&
					parsed.transaction &&
					parsed.metadata?.functionName === 'mintNFT'
				) {
					return parsed as PrepareMintSVGNFTData
				}
			}
		}
		return null
	}

	const handleTransactionComplete = useCallback((hash: string) => {
		console.log('Transaction completed:', hash)
		setPendingTransaction(null)
	}, [])

	const handleTransactionError = useCallback((error: string) => {
		console.error('Transaction failed:', error)
		setPendingTransaction(null)
	}, [])

	if (!isConnected) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Wallet className="h-5 w-5" />
						Connect Your Wallet
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
						<Wallet className="h-16 w-16 text-muted-foreground" />
						<div className="space-y-2">
							<h3 className="text-lg font-semibold">Connect Your Wallet</h3>
							<p className="text-muted-foreground max-w-md">
								Please connect your wallet to use the Shape AI assistant.
							</p>
						</div>
						<Alert className="max-w-md">
							<AlertDescription>
								Click the "Connect Wallet" button in the top right corner to get
								started.
							</AlertDescription>
						</Alert>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Bot className="h-5 w-5" />
					Shape AI Assistant
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<Conversation className="h-[600px]">
					<ConversationContent>
						{messages.length === 0 && (
							<div className="text-muted-foreground py-8 text-center">
								<Bot className="mx-auto mb-2 h-12 w-12 opacity-50" />
								<p className="text-lg font-medium">
									Start a conversation with the Shape assistant!
								</p>
								<p className="mt-2 text-sm">
									Try asking about Shape Network data, how much gasback you can
									earn, or analytics for a given collection.
								</p>
							</div>
						)}

						{messages.map((message) => (
							<Message key={message.id} from={message.role}>
								<MessageAvatar
									src=""
									name={message.role === 'user' ? 'You' : 'AI'}
								/>
								<MessageContent>
									{message.role === 'assistant' && message.parts ? (
										<div className="space-y-2">
											{message.parts.map((part, index) => {
												if (part.type === 'text') {
													return (
														<div
															key={index}
															className="prose prose-sm max-w-none"
														>
															{part.text}
														</div>
													)
												}
												if (part.type.startsWith('tool-')) {
													const toolPart = part as any
													return (
														<div
															key={index}
															className="rounded bg-muted/50 p-2 text-xs"
														>
															<div className="font-medium text-muted-foreground">
																Tool: {toolPart.toolName}
															</div>
															{toolPart.state === 'result' &&
																toolPart.output && (
																	<pre className="mt-1 overflow-x-auto text-xs">
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
										<div className="prose prose-sm max-w-none">
											{message.parts?.[0]?.type === 'text'
												? message.parts[0].text
												: 'No content available'}
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

				<PromptInput onSubmit={handleSubmit}>
					<PromptInputTextarea
						value={input}
						onChange={handleInputChange}
						placeholder="Ask about Shape Network, NFT collections, or gasback calculations..."
					/>
					<PromptInputToolbar>
						<PromptInputTools>
							<PromptInputButton
								variant="ghost"
								size="sm"
								onClick={() => setInput('')}
							>
								Clear
							</PromptInputButton>
						</PromptInputTools>
						<PromptInputSubmit status={status} />
					</PromptInputToolbar>
				</PromptInput>
			</CardContent>
		</Card>
	)
}
