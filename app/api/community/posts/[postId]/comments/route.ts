import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    // Get all top-level comments (no parentId) and their replies
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: {
            id: true,
            display_name: true,
            western_sign: true,
            chinese_sign: true,
            east_west_code: true,
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: {
                id: true,
                display_name: true,
                western_sign: true,
                chinese_sign: true,
                east_west_code: true,
              },
            },
          },
        },
      },
    });

    // Format with author info
    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      authorId: comment.authorId,
      parentId: comment.parentId,
      likeCount: comment.likeCount,
      author: {
        id: comment.author?.id || comment.authorId,
        displayName: comment.author?.display_name || "Anonymous",
        westSign: comment.author?.western_sign || "",
        chineseSign: comment.author?.chinese_sign || "",
        eastWestCode: comment.author?.east_west_code || "",
      },
      replies: comment.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        authorId: reply.authorId,
        parentId: reply.parentId,
        likeCount: reply.likeCount,
        author: {
          id: reply.author?.id || reply.authorId,
          displayName: reply.author?.display_name || "Anonymous",
          westSign: reply.author?.western_sign || "",
          chineseSign: reply.author?.chinese_sign || "",
          eastWestCode: reply.author?.east_west_code || "",
        },
      })),
    }));

    return NextResponse.json(formattedComments);
  } catch (err) {
    console.error("[GET /api/community/posts/[postId]/comments]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

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
    const body = await req.json();
    const { content, parentId } = body as {
      content?: string;
      parentId?: string;
    };

    if (!content || !content.trim()) {
      return new NextResponse("Missing content", { status: 400 });
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // If parentId is provided, verify parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment || parentComment.postId !== postId) {
        return new NextResponse("Parent comment not found", { status: 404 });
      }
    }

    // Create the comment and increment post comment count in a transaction
    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          postId,
          parentId: parentId || null,
          authorId: user.id,
          content: content.trim(),
        },
        include: {
          author: {
            select: {
              id: true,
              display_name: true,
              western_sign: true,
              chinese_sign: true,
              east_west_code: true,
            },
          },
        },
      });

      // Increment post comment count
      await tx.post.update({
        where: { id: postId },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      });

      return newComment;
    });

    // Create notification
    try {
      if (parentId) {
        // Reply to comment - notify parent comment author
        const parentComment = await prisma.comment.findUnique({
          where: { id: parentId },
          select: { authorId: true },
        });

        if (parentComment && parentComment.authorId !== user.id) {
          await prisma.notification.create({
            data: {
              userId: parentComment.authorId,
              actorId: user.id,
              type: "COMMENT_REPLY",
              postId,
              commentId: comment.id,
            },
          });
        }
      } else {
        // Reply to post - notify post author
        if (post.authorId !== user.id) {
          await prisma.notification.create({
            data: {
              userId: post.authorId,
              actorId: user.id,
              type: "POST_REPLY",
              postId,
              commentId: comment.id,
            },
          });
        }
      }
    } catch (notifErr) {
      // Don't fail the comment creation if notification fails
      console.error("[Notification creation error]", notifErr);
    }

    // Format response
    const formattedComment = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      parentId: comment.parentId,
      likeCount: comment.likeCount,
      author: {
        id: comment.author?.id || comment.authorId,
        displayName: comment.author?.display_name || "Anonymous",
        westSign: comment.author?.western_sign || "",
        chineseSign: comment.author?.chinese_sign || "",
        eastWestCode: comment.author?.east_west_code || "",
      },
    };

    return NextResponse.json(formattedComment, { status: 201 });
  } catch (err) {
    console.error("[POST /api/community/posts/[postId]/comments]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

