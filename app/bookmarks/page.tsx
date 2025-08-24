import { BookmarksGrid } from './_components/bookmarks-grid'

export default function BookmarksPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-4">Bookmarks</h1>
					<p className="text-xl text-muted-foreground">
						Save and organize your favorite NFTs
					</p>
				</div>
				<BookmarksGrid />
			</div>
		</div>
	)
}
