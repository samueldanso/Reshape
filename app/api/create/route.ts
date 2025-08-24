import { config } from '@/lib/config'
import { openai } from '@ai-sdk/openai'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { convertToModelMessages, experimental_createMCPClient, streamText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
	const { messages } = await req.json()

	// Convert UIMessage[] to ModelMessage[] for AI SDK v5 compatibility
	const modelMessages = convertToModelMessages(messages)

	const url = new URL(config.mcpServerUrl)
	const mcpClient = await experimental_createMCPClient({
		transport: new StreamableHTTPClientTransport(url),
	})

	const tools = await mcpClient.tools()

	const result = await streamText({
		model: openai('gpt-4o'),
		tools,
		messages: modelMessages,
		system: `You are a helpful AI assistant for the Reshape platform - an AI-powered NFT platform for vibe artists on Shape Network.

You help users create unique NFTs by:
1. Understanding their creative vision and prompts
2. Generating appropriate art descriptions
3. Using the prepareMintSVGNFT tool to create mintable NFTs
4. Providing creative guidance and suggestions

When users want to create NFTs:
- Ask clarifying questions about their vision
- Suggest creative directions
- Use the prepareMintSVGNFT tool to generate the NFT
- Explain the minting process

Be creative, encouraging, and helpful. Focus on making the NFT creation process fun and accessible.`,
		onFinish: async () => {
			await mcpClient.close()
		},
	})

	return result.toTextStreamResponse()
}
