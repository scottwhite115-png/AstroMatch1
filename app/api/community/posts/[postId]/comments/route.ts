import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;

    // Get all top-level comments (no parentId) and their replies
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      orderBy: { createdAt: "asc" },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            _count: {
              select: { likes: true },
            },
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (err) {
    console.error("[GET /api/community/posts/[postId]/comments]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { postId } = params;
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

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        postId,
        parentId: parentId || null,
        authorId: user.id,
        content: content.trim(),
      },
      include: {
        _count: {
          select: { likes: true },
        },
      },
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

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error("[POST /api/community/posts/[postId]/comments]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

