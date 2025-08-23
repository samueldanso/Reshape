import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Reshape",
		short_name: "Reshape",
		description: "Reshape is a GenAI NFT platform for vibe artists.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#ffffff",
	};
}
