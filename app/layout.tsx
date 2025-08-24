import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/sidebar";
import "./globals.css";

const monaSans = Mona_Sans({
	variable: "--font-mona-sans",
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Reshape",
	description: "Reshape is a GenAI NFT platform for vibe artists.",
	keywords: [
		"GenAI",
		"NFT",
		"Vibe Artists",
		"Reshape",
		"AI agent",
		"Art",
		"Music",
		"Vibes",
		"AI Agents",
		"Shape Network",
	],
	metadataBase: new URL("https://reshape-ai.vercel.app"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://reshape-ai.vercel.app",
		title: "Reshape",
		description: "Reshape is a GenAI NFT platform for vibe artists.",
		siteName: "Reshape",
	},
	twitter: {
		card: "summary_large_image",
		title: "Reshape",
		description: "Reshape is a GenAI NFT platform for vibe artists.",
		site: "@Reshape_AI",
		creator: "@Reshape_AI",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: "/favicon.ico",
	},
	manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${monaSans.variable} antialiased`}>
				<Providers>
					<div className="bg-background min-h-screen font-[family-name:var(--font-mona-sans)]">
						<div className="flex h-screen">
							<AppSidebar />
							<div className="flex-1 flex flex-col">
								<Header />
								<main className="flex-1 overflow-auto">
									<div className="container mx-auto px-4 py-8">{children}</div>
								</main>
							</div>
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
