import { useState } from 'react'
import { toast } from 'sonner'

interface GeneratedImage {
	ipfsHash: string
	ipfsUrl: string
	gatewayUrl: string
	base64: string
}

interface ImageGenerationResult {
	success: boolean
	image?: GeneratedImage
	metadata?: {
		name: string
		description: string
		generatedAt: string
	}
	error?: string
}

export function useImageGeneration() {
	const [isGenerating, setIsGenerating] = useState(false)
	const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)

	const generateImage = async (prompt: string, name?: string, description?: string): Promise<ImageGenerationResult> => {
		if (!prompt.trim()) {
			toast.error('Please provide a description for the image')
			return { success: false, error: 'Prompt is required' }
		}

		setIsGenerating(true)
		toast.info('🎨 Generating your AI artwork...', {
			description: 'This may take a few moments',
			duration: 3000,
		})

		try {
			const response = await fetch('/api/generate-image', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					prompt,
					name,
					description,
				}),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Image generation failed')
			}

			const result: ImageGenerationResult = await response.json()

			if (result.success && result.image) {
				setGeneratedImage(result.image)
				toast.success('🎉 Image generated successfully!', {
					description: 'Your artwork has been created and stored on IPFS',
					duration: 5000,
				})
				return result
			} else {
				throw new Error(result.error || 'Image generation failed')
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Image generation failed'
			console.error('Image generation error:', error)

			toast.error('❌ Image generation failed', {
				description: errorMessage,
				duration: 5000,
			})

			return { success: false, error: errorMessage }
		} finally {
			setIsGenerating(false)
		}
	}

	const clearGeneratedImage = () => {
		setGeneratedImage(null)
	}

	return {
		generateImage,
		isGenerating,
		generatedImage,
		clearGeneratedImage,
	}
}
