import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { commentId } = await params;

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

    let liked: boolean;
    let likeCount: number;

    if (existingLike) {
      // Remove like and decrement count in a transaction
      await prisma.$transaction(async (tx) => {
        await tx.commentLike.delete({
          where: {
            id: existingLike.id,
          },
        });

        await tx.comment.update({
          where: { id: commentId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        });
      });

      liked = false;
      likeCount = Math.max(0, comment.likeCount - 1);
    } else {
      // Add like and increment count in a transaction
      await prisma.$transaction(async (tx) => {
        await tx.commentLike.create({
          data: {
            commentId,
            userId: user.id,
          },
        });

        await tx.comment.update({
          where: { id: commentId },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        });
      });

      liked = true;
      likeCount = comment.likeCount + 1;
    }

    return NextResponse.json({ liked, likeCount });
  } catch (err) {
    console.error("[POST /api/community/comments/[commentId]/like]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

