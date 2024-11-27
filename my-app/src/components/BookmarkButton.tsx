// src/components/BookmarkButton.tsx

"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SignInModal from "./SignInModal";

interface BookmarkButtonProps {
  topicId: string;
  onStateChange?: (isBookmarked: boolean) => void;
}

export default function BookmarkButton({
  topicId,
  onStateChange,
}: BookmarkButtonProps) {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check initial bookmark status
  useEffect(() => {
    if (session?.user) {
      checkBookmarkStatus();
    } else {
      setIsLoading(false); // Ensure loading state is false for non-authenticated users
    }
  }, [session, topicId]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(`/api/bookmarks/${topicId}`);
      const data = await response.json();
      setIsBookmarked(data.isBookmarked);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = async () => {
    if (!session?.user) {
      setIsModalOpen(true);
      return;
    }

    await toggleBookmark();
  };

  const toggleBookmark = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      if (isBookmarked) {
        await fetch(`/api/bookmarks/${topicId}`, {
          method: "DELETE",
        });
        setIsBookmarked(false);
      } else {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicId }),
        });
        setIsBookmarked(true);
      }
      onStateChange?.(isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // if (!session?.user) return null;

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-md px-3 py-1 text-sm
      bg-neutral-950 text-white shadow-sm hover:bg-neutral-800 
      border-2 border-neutral-800 disabled:opacity-50"
      >
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </>
        )}
      </button>

      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
