// src/components/TableOfContents.tsx

"use client";

import { useEffect, useRef, useState } from "react";

import { SectionContent } from "./SectionContent";
import { Section, TableOfContents as TOC } from "@/types";
import LoadingSpinner from "./LoadingSpinner";

interface SectionState {
  [key: string]: {
    isGenerating: boolean;
    isFetching: boolean;
    hasContent: boolean;
  };
}

interface TableOfContentsProps {
  topicId: string;
  content: TOC;
  isLoading?: boolean;
}

export default function TableOfContents({
  topicId,
  content,
  isLoading = false,
}: TableOfContentsProps) {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [sectionStates, setSectionStates] = useState<SectionState>({});
  const [error, setError] = useState<string | null>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const sectionContentRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);

  // Reset selected section whe topic changes
  useEffect(() => {
    setSelectedSection(null);
  }, [topicId]);

  // Effect for scrolling behavior
  useEffect(() => {
    if (shouldScroll && sectionContentRef.current) {
      // Small delay to ensure content is rendered
      const timeoutId = setTimeout(() => {
        sectionContentRef.current?.scrollIntoView({ behavior: "smooth" });
        setShouldScroll(false);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [shouldScroll, selectedSection]);

  // Fetch section states
  useEffect(() => {
    const fetchSectionStates = async () => {
      if (!topicId) return;

      try {
        const response = await fetch(`/api/sections-status/${topicId}`);
        const data = await response.json();

        // Convert array of sections with content to state object
        const states: SectionState = {};
        data.sections.forEach(
          (section: { number: string; hasContent: boolean }) => {
            states[section.number] = {
              isGenerating: false,
              isFetching: false,
              hasContent: section.hasContent,
            };
          }
        );
        setSectionStates(states);
      } catch (err) {
        console.error("Failed to fetch section states:", err);
      }
    };

    fetchSectionStates();
  }, [topicId]);

  const handleGenerateContent = async (section: Section) => {
    // Update generating state for this specific section
    setSectionStates((prev) => ({
      ...prev,
      [section.id]: { ...prev[section.id], isGenerating: true },
    }));
    setError(null);

    try {
      const response = await fetch("/api/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          section: {
            id: section.id,
            title: section.title,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setSelectedSection({ ...section, content: data.content });
      setShouldScroll(true); // Trigger scroll after content is set

      // Update section state to show it now has content
      setSectionStates((prev) => ({
        ...prev,
        [section.id]: {
          isGenerating: false,
          isFetching: false,
          hasContent: true,
        },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSectionStates((prev) => ({
        ...prev,
        [section.id]: { ...prev[section.id], isGenerating: false },
      }));
    }
  };

  const handleSectionClick = async (section: Section) => {
    const state = sectionStates[section.id];

    if (state?.hasContent) {
      // If content exists, fetch and display it
      try {
        // Fetching
        setSectionStates((prev) => ({
          ...prev,
          [section.id]: { ...prev[section.id], isFetching: true },
        }));

        const response = await fetch(
          `/api/section-content/${topicId}/${section.id}`
        );
        const data = await response.json();
        setSelectedSection({ ...section, content: data.content });
        // Scroll to the section content
        // sectionContentRef.current?.scrollIntoView({ behavior: "smooth" });
        setShouldScroll(true); // Trigger scroll after content is set
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setSectionStates((prev) => ({
          ...prev,
          [section.id]: { ...prev[section.id], isFetching: false },
        }));
      }
    } else {
      // If no content exists, generate it
      handleGenerateContent(section);
    }
  };

  const renderSection = (section: Section, depth: number = 0) => (
    <div key={section.id} className={`pl-${depth * 4} py-1`}>
      <div className="flex items-center gap-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-md">
        <span className="text-sm font-medium text-gray-500">{section.id}</span>
        <span className="flex-1">{section.title}</span>
        {!section.children?.length && (
          <button
            onClick={() => handleSectionClick(section)}
            disabled={sectionStates[section.id]?.isGenerating}
            className={`rounded-md  px-3 py-1 text-sm text-white  disabled:opacity-50 ${
              sectionStates[section.id]?.hasContent
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {sectionStates[section.id]?.isGenerating
              ? "Generating..."
              : sectionStates[section.id]?.isFetching
              ? "Loading..."
              : sectionStates[section.id]?.hasContent
              ? "Open"
              : "Generate"}
          </button>
        )}
      </div>
      {section.children?.map((child) => renderSection(child, depth + 1))}
    </div>
  );

  const handleBackToTop = () => {
    tocRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-8">
      <div
        ref={tocRef}
        className="rounded-lg border border-gray-200 p-6 shadow-sm"
      >
        <h2 className="mb-4 text-xl font-semibold">{content.topic}</h2>
        <div className="space-y-2">
          {content.sections.map((section) => renderSection(section))}
        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>

      {selectedSection?.content && (
        <div
          ref={sectionContentRef}
          className="rounded-lg border border-gray-200 p-6 shadow-sm"
        >
          <h2 className="mb-4 text-xl font-semibold text-black dark:text-neutral-300">
            {selectedSection.id} {selectedSection.title}
          </h2>
          <SectionContent content={selectedSection.content} />
          <button
            onClick={handleBackToTop}
            className="my-4 rounded-md bg-neutral-500 px-3 py-1 text-sm text-white hover:bg-neutral-600 font-bold"
          >
            Back to Top
          </button>
        </div>
      )}
    </div>
  );
}
