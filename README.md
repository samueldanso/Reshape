<a href="https://reshape-ai.demo.vercel.app">
  <img alt="Reshape – a GenAI NFT platform for artists, collectors, and vibe creators." src="https://raw.githubusercontent.com/samueldansobelievr/public/banner.png">
  <h1 align="center">Reshape</h1>
</a>

<p align="center">
Reshape is an AI-powered NFT platform where artists, collectors, and vibe creators can generate, mint, and curate art into unique galleries with the help of a Curator Agent. By combining generative AI with NFTs on Shape L2, it unlocks new creative possibilities while giving collectors verifiable ownership of one-of-a-kind vibes.

Reshape is about giving power back to creators and collectors. With AI as a co-creator and Shape as the foundation, anyone can reshape vibes into art, curate them beautifully, and share them with others.

</p>

## ✨ Features

- **AI Art Generation (Curator Agent)** – Generate unique NFT art instantly from text prompts with the Curator Agent.
- **NFT Minting** – Mint your AI-generated art directly to Shape L2 for verifiable ownership.
- **Gallery Curation** – Arrange and showcase your minted NFTs in beautiful, personalised galleries.
- **Wallet Integration** – Connect your Shape-compatible wallet for seamless NFT creation and collection tracking.
- **Curator Agent Guidance** – AI assistant provides layout suggestions, prompts, and creative recommendations.
- **NFT Discovery & Trading (Discovery Agent)** (Roadmap) – Explore trending collections, discover new artists, mint, buy, and sell NFTs.
- **Profiles & Social** (Roadmap) – Public profiles for creators with the ability to like and interact with NFTs.
- **Art Critique(Critique Agent)** (Roadmap) – Receive quick AI-powered feedback on your artwork to improve and iterate.

## 🛠️ How It Works

### 🎨 For Artists & Vibe Creators

1. **Connect Wallet**
   Sign in with your wallet to get started.

2. **Generate Art**
   Enter a text prompt or vibe description—let the Curator Agent create unique AI-powered NFT art for you.

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
   Browse AI-generated NFTs from other users or discover trending collections (Discovery Agent coming soon).

3. **Interact & Curate**
   Like, organize, and display your favorite NFTs in your own galleries.

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

## 🚀 Quick Start

1. **Clone or use as template**

    ```bash
    git clone https://github.com/shape-network/builder-kit.git
    cd builder-kit
    ```

2. **Install dependencies**

    ```bash
    yarn install
    ```

3. **Set up environment variables**

    ```bash
    cp .env-example .env
    ```

    Fill in your environment variables:
    - `NEXT_PUBLIC_ALCHEMY_KEY`: Get from [Alchemy](https://alchemy.com)
    - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Get from [WalletConnect](https://cloud.walletconnect.com)
    - `NEXT_PUBLIC_CHAIN_ID`: Use `11011` for Shape Sepolia or `360` for Shape Mainnet

4. **Start development server**

    ```bash
    yarn dev
    ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint issues
- `yarn type-check` - Run TypeScript type checking
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting

### Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── get-nfts/     # Fetch NFTs for address
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── error-boundary.tsx
│   ├── loading.tsx
│   ├── providers.tsx
│   ├── theme-toggle.tsx
│   └── wallet-connect.tsx
├── hooks/                 # Custom React hooks
│   ├── web3.ts           # Web3 data fetching hooks
│   ├── use-balance.ts    # Wallet balance hook
│   ├── use-mobile.ts     # Mobile detection hook
├── lib/                   # Utility functions and configurations
│   ├── clients.ts        # Alchemy and RPC clients
│   ├── config.ts         # Environment configuration
│   ├── utils.ts          # Helper functions
│   └── web3.ts           # Wagmi configuration
└── public/               # Static assets
```

## 🎨 Customization

### Theme Customization

Edit `app/globals.css` to customize the color scheme:

```css
:root {
	--background: 0 0% 100%;
	--foreground: 222.2 84% 4.9%;
	/* ... other CSS variables */
}
```

### Adding Components

Use Shadcn/ui CLI to add new components:

```bash
npx shadcn@latest add button
```

### Web3 Integration

The template includes examples of Web3 integration:

- Wallet connection with RainbowKit
- Balance fetching with custom hooks
- Chain switching and network detection
- Error handling for Web3 operations

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

## 📚 Documentation

-

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- [Shape Discord](http://discord.com/invite/shape-l2)
- [Twitter/X @Shape_L2](https://x.com/Shape_L2)
- [Twitter/X @williamhzo](https://x.com/williamhzo)
