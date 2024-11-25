// src/app/page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import TableOfContents from "@/components/TableOfContents";
import { TableOfContents as TOC } from "@/types";
import Header from "@/components/Header";

export interface TopicResponse {
  id: string;
  name: string;
  content: TOC;
}

export default function Home() {
  const [topic, setTopic] = useState<TopicResponse | null>(null);
  const [isLoadingToc, setIsLoadingToc] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // console.log("topic: TopicResponse", topic);

  const handleSearchStart = () => {
    setIsLoadingToc(true);
    // Clear current topic while loading the new one
    setTopic(null);
    setError(null);
  };

  const handleTopicGeneration = async (data: TopicResponse) => {
    setTopic(data);
    setIsLoadingToc(false);
  };

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8 text-3xl font-bold">MyLittleTextbook</h1>
          <p className="mb-8 text-neutral-600 dark:text-neutral-300">
            Generate comprehensive learning materials for any topic. Enter a
            subject to get started.
          </p>

          <SearchForm
            onResults={handleTopicGeneration}
            onSearchStart={handleSearchStart}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {(isLoadingToc || topic) && (
            <div className="mt-8">
              {topic && !isLoadingToc && (
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
                    {topic.name}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mt-2">
                    Select sections below to generate detailed content.
                  </p>
                </div>
              )}

              {topic ? (
                <TableOfContents
                  topicId={topic.id}
                  content={topic.content}
                  isLoading={isLoadingToc}
                />
              ) : (
                <TableOfContents
                  topicId=""
                  content={{ topic: "", sections: [] }}
                  isLoading={true}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
