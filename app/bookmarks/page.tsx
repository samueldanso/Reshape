import { BookmarksGrid } from "./_components/bookmarks-grid";

export default function BookmarksPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						My Bookmarks
					</h1>
					<p className="text-xl text-muted-foreground">
						Your saved NFTs and favorite creations
					</p>
				</div>
				<BookmarksGrid />
			</div>
		</div>
	);
}
