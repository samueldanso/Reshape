import { env } from '@/env'
import { uploadFileToIPFS } from '@/lib/pinata'
import { openai } from '@ai-sdk/openai'

export const maxDuration = 60

export async function POST(req: Request) {
	try {
		const { prompt, name, description } = await req.json()

		if (!prompt) {
			return Response.json({ error: 'Prompt is required' }, { status: 400 })
		}

		// Step 1: Generate image using OpenAI DALL-E 3
		console.log('🎨 Generating image for prompt:', prompt)

		const imageResponse = await openai.image('dall-e-3').generate({
			prompt: `${prompt}. High quality digital art, vibrant colors, detailed composition, professional artwork.`,
			size: '1024x1024',
			quality: 'standard',
			responseFormat: 'b64_json',
		})

		if (!imageResponse.images || imageResponse.images.length === 0) {
			throw new Error('Failed to generate image')
		}

		const base64Image = imageResponse.images[0].b64_json
		if (!base64Image) {
			throw new Error('No image data received')
		}

		// Step 2: Convert base64 to File object for IPFS upload
		const imageBuffer = Buffer.from(base64Image, 'base64')
		const imageFile = new File([imageBuffer], `${name || 'ai-generated'}.png`, {
			type: 'image/png',
		})

		// Step 3: Upload to IPFS via Pinata
		console.log('🚀 Uploading image to IPFS...')
		const uploadResult = await uploadFileToIPFS(imageFile)

		if (!uploadResult.success || !uploadResult.cid) {
			throw new Error(`IPFS upload failed: ${uploadResult.error}`)
		}

		// Step 4: Return the IPFS URLs and metadata
		const ipfsHash = uploadResult.cid
		const ipfsUrl = `ipfs://${ipfsHash}`
		const gatewayUrl = `${env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`

		console.log('✅ Image generated and uploaded successfully:', ipfsHash)

		return Response.json({
			success: true,
			image: {
				ipfsHash,
				ipfsUrl,
				gatewayUrl,
				base64: base64Image, // Keep for immediate display
			},
			metadata: {
				name: name || 'AI Generated Artwork',
				description: description || prompt,
				generatedAt: new Date().toISOString(),
			},
		})
	} catch (error) {
		console.error('❌ Image generation failed:', error)
		return Response.json(
			{
				error: 'Image generation failed',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		)
	}
}
