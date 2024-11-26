// src/app/api/bookmarks/[topicId]/route.ts

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/auth.config";

// Delete bookmark
export async function DELETE(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.bookmark.delete({
      where: {
        userId_topicId: {
          userId: session.user.id,
          topicId: params.topicId,
        },
      },
    });

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}

// Check bookmark status
export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmark = await prisma.bookmark.findUnique({
    where: {
      userId_topicId: {
        userId: session.user.id,
        topicId: params.topicId,
      },
    },
  });

  return NextResponse.json({ isBookmarked: !!bookmark });
}
