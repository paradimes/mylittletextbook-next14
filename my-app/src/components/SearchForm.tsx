// src/components/SearchForm.tsx

"use client";

import { TopicResponse } from "@/app/page";
import { useState } from "react";

interface SearchFormProps {
  onResults: (data: TopicResponse) => void;
  onSearchStart: () => void;
}

export default function SearchForm({
  onResults,
  onSearchStart,
}: SearchFormProps) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    onSearchStart(); // Clear previous results and show loading state

    try {
      const normalizedTopic = topic.trim().toLowerCase();
      const response = await fetch("/api/generate-toc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: normalizedTopic }),
      });

      const data = await response.json();
      // console.log("data", data);

      if (data.content) {
        onResults(data);
      } else {
        setError("Unable to get topic info");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., 'Ancient Rome', 'Machine Learning', 'Photography')"
          className="flex-1 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-black"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-emerald-500 px-6 py-3 text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Table of Contents"
          )}{" "}
        </button>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </form>
  );
}
