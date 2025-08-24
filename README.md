
# Reshape – a GenAI NFT platform for artists, collectors, and vibe creators

[Video Demo](https://youtu.be/Vh3QUNtzXGo)

Reshape is an AI-powered NFT platform where artists, collectors, and vibe creators can generate, mint, and curate art into unique galleries with the help of a Curator Agent. By combining generative AI with NFTs on Shape L2, it unlocks new creative possibilities while giving collectors verifiable ownership of one-of-a-kind vibes.

Reshape is about giving power back to creators and collectors. With AI as a co-creator and Shape as the foundation, anyone can reshape vibes into art, curate them beautifully, and share them with others.

## ✨ Features

- **AI Art Generation (Curator Agent)** – Instantly generate unique NFT art from text prompts with the Curator Agent.
- **NFT Minting** – Mint your AI-generated art directly to Shape L2 for verifiable ownership.
- **Gallery Curation** – Arrange and showcase your minted NFTs in beautiful, personalized galleries.
- **Wallet Integration** – Connect your Shape-compatible wallet for seamless NFT creation and collection tracking.
- **NFT Discovery & Trading ** (Roadmap) – Explore trending collections, discover new artists, and mint, buy, or sell NFTs.
- **Art Critique (Critique Agent)** (Roadmap) – Receive quick AI-powered feedback on your artwork to improve and iterate.
- **Profiles & Social** (Roadmap) – Public profiles for creators with the ability to like and interact with NFTs.

## 🛠️ How It Works

### 🎨 For Artists & Vibe Creators

1. **Connect Wallet**
   Sign in with your wallet to get started.

2. **Generate Art**
   Enter a vibe text prompt the Curator Agent create unique AI-powered NFT art for you.

3. **Preview & Edit**
   Instantly view your generated image and refine your prompt if you want to iterate.

4. **Mint NFT**
   Mint your favorite creation directly to the Shape L2 testnet for verifiable on-chain ownership.

5. **Curate Gallery**
   Add your minted NFTs to a personal gallery to showcase your collection.

---

### 🖼️ For Collectors

1. **Connect Wallet**
   Link your Shape-compatible wallet to access and manage your NFT collection.

2. **Explore Collections**
   Browse and trade AI-generated NFTs from other users or discover trending collections

3. **Interact & Curate**
   Like, bookmark, and display your favorite NFTs in your own galleries.

4. **Track Ownership**
   Verify NFT ownership and metadata directly on-chain for authenticity and provenance.

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/), [TypeScript 5](https://www.typescriptlang.org/), [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Forms & Validation**: [react-hook-form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Web3 Integration**:
    - [Wagmi](https://wagmi.sh)
    - [RainbowKit](https://www.rainbowkit.com)
- **Onchain Storage**: [IPFS (Pinata)](https://www.pinata.cloud/)
- **AI Integration**:
    - [Vercel AI SDK](https://ai-sdk.dev/docs/introduction)
    - [OpenAI](https://platform.openai.com/docs/introduction)
- **Smart Contracts**: [Solidity](https://docs.soliditylang.org/) with [Hardhat](https://hardhat.org/)
- **Blockchain**: [Shape Network](https://docs.shape.network)
- **RPC & NFT API**: [Alchemy SDK](https://docs.alchemy.com/reference/alchemy-sdk-quickstart)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- **Package Manager**: [Bun](https://bun.sh/)
- **Formatter & Linter**: [Biome](https://biomejs.dev/)

1. **Clone the repo**

    ```bash
    git clone git@github.com:samueldanso/Reshape.git
    cd Reshape
    ```

2. **Install dependencies**

    ```bash
    bun install
    ```

3. **Set up environment variables**

    ```bash
    cp .env-example .env
    ```

    Fill in your environment variables:
    - `NEXT_PUBLIC_ALCHEMY_KEY`: Get from [Alchemy](https://alchemy.com)
    - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Get from [WalletConnect](https://cloud.walletconnect.com)
    - `NEXT_PUBLIC_CHAIN_ID`: Use `11011` for Shape Sepolia or `360` for Shape Mainnet
    - `OPENAI_API_KEY`: Your_openAI_api_key
    - `PINATA_JWT`: Your_pinata_jwt
    - `NEXT_PUBLIC_GATEWAY_URL`= Your_Pinata_Gateway_URL

4. **Start development server**

    ```bash
    bun dev
    ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Project Structure

```
├── app/                           # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── create/              # AI chat and NFT creation
│   │   ├── generate-image/      # DALL-E image generation
│   │   └── call-mcp-tool/       # MCP tool integration
│   ├── create/                   # NFT creation page
│   │   └── _components/         # Create page components
│   │       └── chat-ui.tsx      # Main chat interface
│   ├── discover/                 # NFT discovery page
│   │   └── _components/         # Discover page components
│   │       ├── discover-tabs.tsx # Discovery tabs
│   │       └── nft-grid.tsx     # NFT grid display
│   ├── gallery/                  # User gallery page
│   │   └── _components/         # Gallery page components
│   │       └── nft-gallery.tsx  # Gallery display
│   ├── profile/                  # User profile page
│   ├── bookmarks/                # Bookmarks page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (redirects to /create)
│   ├── globals.css               # Global styles
│   ├── error.tsx                 # Error boundary
│   └── not-found.tsx            # 404 page
├── components/                    # React components
│   ├── ui/                       # Shadcn/ui components (40+ components)
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card component
│   │   ├── dialog.tsx           # Dialog component
│   │   ├── form.tsx             # Form components
│   │   ├── input.tsx            # Input component
│   │   ├── tabs.tsx             # Tabs component
│   │   └── ...                  # 30+ more UI components
│   ├── ai-elements/              # AI chat components
│   │   ├── conversation.tsx      # Chat conversation
│   │   ├── message.tsx          # Message display
│   │   ├── prompt-input.tsx     # Input interface
│   │   ├── loader.tsx           # Loading states
│   │   └── ...                  # 8 more AI components
│   ├── header.tsx                # Site header
│   ├── sidebar.tsx               # Navigation sidebar
│   ├── wallet-connect.tsx        # Wallet connection
│   ├── mint-transaction-handler.tsx # NFT minting handler
│   ├── providers.tsx             # App providers
│   └── theme-toggle.tsx          # Theme switcher
├── hooks/                         # Custom React hooks
│   ├── use-image-generation.ts   # Image generation hook
│   ├── use-mcp.ts                # MCP integration hook
│   ├── use-balance.ts            # Wallet balance hook
│   ├── use-mobile.ts             # Mobile detection hook
│   └── web3.ts                   # Web3 utilities
├── lib/                           # Utility functions and configurations
│   ├── clients.ts                # Alchemy and RPC clients
│   ├── config.ts                 # Environment configuration
│   ├── utils.ts                  # Helper functions
│   ├── web3.ts                   # Wagmi configuration
│   └── pinata.ts                 # IPFS upload utilities
├── types/                         # TypeScript type definitions
│   └── mcp.ts                    # MCP tool types
├── public/                        # Static assets
├── env.ts                         # Environment validation
├── components.json                # Shadcn/ui configuration
├── biome.json                     # Linter configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## 🌐 Deployment

Deploy your repository to [Vercel](https://vercel.com)

## Roadmap

- [ ] Buy, sell, and trade NFTS
- [ ] Receive quick AI-powered feedback on your artwork to improve and iterate.
- [ ] Social profiles for creators with the ability to like and interact with NFTs.

## 🤝 Contributing

1. Fork this repository
2. Create your feature branch
3. Commit your changes
4. Open a Pull Request

## Team

Samuel Danso - Fullstack Engineer

## Links

- **Live Demo**: [reshape-ai-demo.vercel.app](https://reshape-ai-demo.vercel.app
