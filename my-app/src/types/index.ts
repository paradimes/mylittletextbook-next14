// src/types/index.ts

// Base interfaces for the table of contents structure
export interface Section {
  id: string; // e.g., "1" or "1.1" or "1.1.1"
  title: string; // Section title
  children?: Section[]; // Optional subsections
  content?: string; // Optional generated content
}

export interface TableOfContents {
  topic: string; // Main topic title
  sections: Section[]; // Top-level sections
}

// Prisma JSON compatible types
export interface PrismaJsonSection {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Index signature for Prisma compatibility
  id: string;
  title: string;
  children?: PrismaJsonSection[];
  content?: string;
}

export interface PrismaJsonTableOfContents {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Index signature for Prisma compatibility
  topic: string;
  sections: PrismaJsonSection[];
}

// Type conversion helper
export function toPrismaJson(toc: TableOfContents): PrismaJsonTableOfContents {
  return toc as PrismaJsonTableOfContents;
}
