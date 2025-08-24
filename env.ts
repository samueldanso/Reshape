import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		PINATA_JWT: z.string().min(1),
		OPENAI_API_KEY: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().min(1),
		NEXT_PUBLIC_ALCHEMY_KEY: z.string().min(1),
		NEXT_PUBLIC_GATEWAY_URL: z.string().min(1),
		NEXT_PUBLIC_CHAIN_ID: z.number().min(1),
	},
	runtimeEnv: {
		PINATA_JWT: process.env.PINATA_JWT,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
		NEXT_PUBLIC_ALCHEMY_KEY: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
		NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
		NEXT_PUBLIC_GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL,
	},
})
