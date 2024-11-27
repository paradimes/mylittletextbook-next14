// src/app/topic/[id]/page.tsx
"use client";

import { TopicResponse } from "@/app/page";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import TableOfContents from "@/components/TableOfContents";
import React, { useEffect, useState } from "react";

export default function TopicPage({ params }: { params: { id: string } }) {
  const [topic, setTopic] = useState<TopicResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        // Fetch topic by ID
        const response = await fetch(`/api/topics/${params.id}`);
        if (!response.ok) throw new Error("Failed to load topic");
        const data = await response.json();
        setTopic(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopic();
  }, [params.id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!topic) return <div>Topic not found</div>;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
                {topic.name}
              </h2>
            </div>

            <TableOfContents
              topicId={topic.id}
              content={topic.content}
              isLoading={false}
            />
          </div>
        </div>
      </main>
    </>
  );
}
