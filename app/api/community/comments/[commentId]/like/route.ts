import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";

export async function POST(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { commentId } = params;

    // Verify comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    // Check if user already liked this comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      // Remove like
      await prisma.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      const count = await prisma.commentLike.count({
        where: { commentId },
      });

      return NextResponse.json({ liked: false, count });
    } else {
      // Add like
      await prisma.commentLike.create({
        data: {
          commentId,
          userId: user.id,
        },
      });

      const count = await prisma.commentLike.count({
        where: { commentId },
      });

      return NextResponse.json({ liked: true, count });
    }
  } catch (err) {
    console.error("[POST /api/community/comments/[commentId]/like]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

