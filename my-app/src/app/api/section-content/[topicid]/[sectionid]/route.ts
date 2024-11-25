// src/app/api/section-content/[topicId]/[sectionId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { topicId: string; sectionId: string } }
) {
  try {
    const section = await prisma.section.findFirst({
      where: {
        topicId: params.topicId,
        number: params.sectionId,
      },
      select: {
        content: true,
      },
    });

    if (!section?.content) {
      return NextResponse.json(
        { error: "Section content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ content: section.content });
  } catch (error) {
    console.error("Error fetching section content:", error);
    return NextResponse.json(
      { error: "Failed to fetch section content" },
      { status: 500 }
    );
  }
}
