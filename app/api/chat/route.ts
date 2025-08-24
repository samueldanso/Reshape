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

You have access to multiple MCP tools that can help with blockchain operations and NFT management:
- prepareMintSVGNFT: Prepare NFT minting transactions
- getShapeNft: Fetch NFT collections for addresses
- getCollectionAnalytics: Get collection statistics and market data
- getChainStatus: Check Shape network status and gas prices
- getTopShapeCreators: Find top creators and artists

Guidelines:
- Use multiple tools in sequence when needed to gather comprehensive information
- For NFT operations, always use the appropriate MCP tools
- Provide helpful, creative guidance for artists and collectors
- Format responses using markdown for better readability
- Always try to use available tools first before making assumptions

IMPORTANT: You are specifically designed for Reshape - an AI-powered NFT platform. Help users create, mint, and manage their NFTs using the available tools.`,
		onFinish: async () => {
			await mcpClient.close()
		},
	})

	return result.toTextStreamResponse()
}
