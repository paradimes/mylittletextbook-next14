// src/app/bookmarks/page.tsx
import Header from "@/components/Header";
import BookmarksList from "@/components/BookmarksList";

export default function BookmarksPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Bookmarks</h1>
          <BookmarksList />
        </div>
      </main>
    </>
  );
}
