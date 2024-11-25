// src/app/api/sections-status/[topicId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const sections = await prisma.section.findMany({
      where: {
        topicId: params.topicId,
      },
      select: {
        number: true,
        content: true,
      },
    });

    return NextResponse.json({
      sections: sections.map((section) => ({
        number: section.number,
        hasContent: !!section.content,
      })),
    });
  } catch (error) {
    console.error("Error fetching section statuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch section statuses" },
      { status: 500 }
    );
  }
}
