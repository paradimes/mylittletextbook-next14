// src/app/api/generate-section/route.ts

import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

console.log("Prisma imported:", !!prisma);
console.log("Prisma section model:", !!prisma?.section);

export async function POST(request: Request) {
  try {
    const { topicId, section } = await request.json();

    console.log("Received request:", { topicId, section });

    // Check if section content already exists
    const existingSection = await prisma.section.findFirst({
      where: {
        topicId,
        number: section.id,
      },
    });

    console.log("existingSection", existingSection);

    if (existingSection?.content) {
      return NextResponse.json({ content: existingSection.content });
    }

    // Get topic details for context
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    console.log("topic", topic);

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Generate content using Gemini
    const prompt = `
As MyLittleTextbook, generate comprehensive educational content for the following section:

Topic: ${topic.name}
Section: ${section.number} ${section.title}

Generate educational content that teaches this topic effectively. Structure your response in Markdown format using:

# For main headings
## For subheadings
- Bullet points for key concepts
* Lists for examples
> Blockquotes for important definitions or quotes
\`\`\`code blocks\`\`\` for technical examples when relevant

Include:
1. Clear introduction to the topic
2. Main concepts and explanations
3. Relevant examples
4. Key terms and definitions
5. Summary points

Make the content engaging and educational while maintaining academic rigor.
`;

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    // Save the generated content
    const savedSection = await prisma.section.create({
      data: {
        topicId: topicId,
        number: section.id,
        title: section.title,
        content: content,
      },
    });

    return NextResponse.json({ content: savedSection.content });
  } catch (error) {
    console.error("Error generating section:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
