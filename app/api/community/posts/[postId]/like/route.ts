import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { postId } = await params;

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.id,
        },
      },
    });

    let liked: boolean;
    let likeCount: number;

    if (existingLike) {
      // Remove like and decrement count in a transaction
      await prisma.$transaction(async (tx) => {
        await tx.postLike.delete({
          where: {
            id: existingLike.id,
          },
        });

        await tx.post.update({
          where: { id: postId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        });
      });

      liked = false;
      likeCount = Math.max(0, post.likeCount - 1);
    } else {
      // Add like and increment count in a transaction
      await prisma.$transaction(async (tx) => {
        await tx.postLike.create({
          data: {
            postId,
            userId: user.id,
          },
        });

        await tx.post.update({
          where: { id: postId },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        });
      });

      liked = true;
      likeCount = post.likeCount + 1;
    }

    return NextResponse.json({ liked, likeCount });
  } catch (err) {
    console.error("[POST /api/community/posts/[postId]/like]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

