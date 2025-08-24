import { NFTGallery } from "./_components/nft-gallery";

export default function GalleryPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						My Gallery
					</h1>
					<p className="text-xl text-muted-foreground">
						Your curated collection of AI-generated NFTs
					</p>
				</div>
				<NFTGallery />
			</div>
		</div>
	);
}
