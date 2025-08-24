'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePrepareMintSVGNFT } from '@/hooks/use-mcp'
import { Bot, Image, Sparkles, Wallet } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

export function ArtGenerator() {
	const { isConnected } = useAccount()
	const [prompt, setPrompt] = useState('')
	const [generatedImage, setGeneratedImage] = useState<string | null>(null)
	const [isGenerating, setIsGenerating] = useState(false)
	const [nftName, setNftName] = useState('')
	const [nftDescription, setNftDescription] = useState('')

	// Generate simple SVG based on prompt (placeholder for AI generation)
	const generateArt = async () => {
		if (!prompt.trim()) {
			toast.error('Please enter a prompt')
			return
		}

		setIsGenerating(true)

		try {
			// For MVP: Generate a simple SVG based on prompt
			// In production: This would call OpenAI DALL-E or similar
			const svg = generateSimpleSVG(prompt)
			setGeneratedImage(svg)

			// Auto-fill NFT details
			setNftName(`${prompt} NFT`)
			setNftDescription(`AI-generated artwork based on: ${prompt}`)

			toast.success('Art generated successfully!')
		} catch (error) {
			toast.error('Failed to generate art')
			console.error(error)
		} finally {
			setIsGenerating(false)
		}
	}

	const generateSimpleSVG = (prompt: string): string => {
		// Simple SVG generation for MVP - replace with AI generation
		const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
		const color = colors[Math.floor(Math.random() * colors.length)]

		return `
			<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
				<rect width="400" height="400" fill="${color}"/>
				<circle cx="200" cy="200" r="80" fill="white" opacity="0.8"/>
				<text x="200" y="220" text-anchor="middle" fill="#333" font-family="Arial" font-size="16">
					${prompt.substring(0, 20)}
				</text>
			</svg>
		`
	}

	if (!isConnected) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Wallet className="h-5 w-5" />
						Connect Your Wallet
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center py-8">
					<Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground mb-4">
						Please connect your wallet to start creating NFTs
					</p>
					<p className="text-sm text-muted-foreground">
						Connect your wallet in the top right corner to get started
					</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-6">
			{/* Prompt Input */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bot className="h-5 w-5" />
						Describe Your Vision
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="prompt">What would you like to create?</Label>
						<Textarea
							id="prompt"
							placeholder="A serene mountain landscape at sunset with vibrant colors..."
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							className="min-h-[100px]"
						/>
					</div>
					<Button
						onClick={generateArt}
						disabled={isGenerating || !prompt.trim()}
						className="w-full"
					>
						{isGenerating ? (
							<>
								<Sparkles className="h-4 w-4 mr-2 animate-spin" />
								Generating...
							</>
						) : (
							<>
								<Sparkles className="h-4 w-4 mr-2" />
								Generate Art
							</>
						)}
					</Button>
				</CardContent>
			</Card>

			{/* Generated Art Preview */}
			{generatedImage && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Image className="h-5 w-5" />
							Generated Artwork
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex justify-center">
							<div
								className="border rounded-lg p-4 bg-white"
								dangerouslySetInnerHTML={{ __html: generatedImage }}
							/>
						</div>

						{/* NFT Details Form */}
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="nftName">NFT Name</Label>
								<Input
									id="nftName"
									value={nftName}
									onChange={(e) => setNftName(e.target.value)}
									placeholder="My Amazing NFT"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="nftDescription">Description</Label>
								<Textarea
									id="nftDescription"
									value={nftDescription}
									onChange={(e) => setNftDescription(e.target.value)}
									placeholder="Describe your NFT..."
									className="min-h-[80px]"
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
