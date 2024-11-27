// src/components/BookmarksList.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";

interface BookmarkedTopic {
  id: string;
  topicId: string;
  createdAt: string;
  topic: {
    id: string;
    name: string;
  };
}

export default function BookmarksList() {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState<BookmarkedTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchBookmarks();
    }
  }, [session]);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/bookmarks");
      const data = await response.json();
      setBookmarks(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to load bookmarks");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <p>Please sign in to view your bookmarks</p>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600 dark:text-neutral-400">
          You haven&apos;t bookmarked any topics yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
        >
          <Link
            href={`/topic/${bookmark.topic.id}`}
            className="block hover:underline"
          >
            <h3 className="text-lg font-medium">{bookmark.topic.name}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
