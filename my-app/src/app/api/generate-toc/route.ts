/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/generate-toc/route.ts

import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { TableOfContents, toPrismaJson } from "@/types";

function cleanJsonString(str: string): string {
  // Remove markdown code block markers and any surrounding whitespace
  return str.replace(/```json\n?|\n?```/g, "").trim();
}

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    const normalizedInput = topic.toLowerCase().trim();

    // Server-side validation
    if (normalizedInput.length <= 2) {
      return NextResponse.json(
        { error: "Topic must be longer than 2 characters" },
        { status: 400 }
      );
    }

    // Prompt to normalize topic from search query
    const normalizePrompt = `Given the search query "${topic}", return ONLY a JSON object with the standardized academic topic name: {"normalizedTopic": "string"}
    
    Example inputs and outputs:
    "data structs & alg" -> {"normalizedTopic": "Data Structures and Algorithms"}
    "machine learning intro" -> {"normalizedTopic": "Introduction to Machine Learning"}`;

    // Step 1: Normalize topic
    const normalization = await model.generateContent(normalizePrompt);
    const normalizationJSON = normalization.response.text();
    // Clean the JSON string before parsing
    const normalizationCleanJSON = cleanJsonString(normalizationJSON);
    // Parse and validate the JSON
    const parsedNormalization = JSON.parse(normalizationCleanJSON);
    const academicTopic = parsedNormalization.normalizedTopic;

    // Step 2: Check for existing topic (case-insensitive)
    const existingTopic = await prisma.topic.findFirst({
      where: {
        name: {
          equals: academicTopic,
          mode: "insensitive",
        },
      },
    });

    if (existingTopic) {
      return NextResponse.json({
        id: existingTopic.id,
        name: existingTopic.name,
        content: existingTopic.content,
      });
    }

    const tocPrompt = `Generate a table of contents for a textbook about ${academicTopic}.

Return your response as a JSON object with the following structure:
${"```json"}
{
  "topic": string,
  "sections": [{
    "id": string,     // Format: "1", "1.1", "1.1.1" 
    "title": string,
    "children": []    // Optional, same structure
  }]
}
${"```json"}


Here is an example:
${"```json"}
{
  "topic": "Complete topic title",
  "sections": [
    {
      "id": "1",
      "title": "Main section title",
      "children": [
        {
          "id": "1.1",
          "title": "Subsection title",
          "children": [
            {
              "id": "1.1.1",
              "title": "Sub-subsection title"
            }
          ]
        }
      ]
    }
  ]
}
${"```"}

You must ONLY return valid JSON matching this exact structure. Under no circumstances should you return anything else.

Requirements:
- Use exactly 3 levels of depth maximum
- The number of sections to be generated is relative to the topic. Ensure all the essential sections are covered.
- There should be a maximum of 5-10 main sections (level 1).
- Number sections hierarchically (1, 1.1, 1.1.1)
- Focus on creating a logical learning progression
- Ensure section titles are clear and descriptive
- Return valid JSON only, no additional text or explanation

Structure progression from fundamentals to advanced concepts.`;

    // Step 3. Generate TOC if no existing topic
    const result = await model.generateContent(tocPrompt);
    const tocJSON = result.response.text();

    // Clean the JSON string before parsing
    const cleanJSON = cleanJsonString(tocJSON);

    // Parse and validate the JSON
    const parsedTOC: TableOfContents = JSON.parse(cleanJSON);

    // Validate the structure matches what we expect
    if (!parsedTOC.topic || !Array.isArray(parsedTOC.sections)) {
      throw new Error("Invalid response structure");
    }

    // Save to database
    const savedTopic = await prisma.topic.create({
      data: {
        name: academicTopic,
        content: toPrismaJson(parsedTOC), // Convert to Prisma-compatible JSON
      },
    });

    return NextResponse.json({
      id: savedTopic.id,
      name: savedTopic.name,
      content: parsedTOC,
    });
  } catch (error) {
    console.error("Error generating TOC:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
