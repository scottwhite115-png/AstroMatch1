import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    // Fetch post with author and comments
    const post = await prisma.post.findUnique({
      where: { id: postId },
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

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // Fetch comments separately (all top-level and their replies)
    const topLevelComments = await prisma.comment.findMany({
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

    // Format comments with author info
    const formattedComments = topLevelComments.map((comment) => ({
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
      replies: comment.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
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

    // Format response
    const response = {
      id: post.id,
      topic: post.topic,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      author: {
        id: post.author.id,
        displayName: post.author.display_name || "Anonymous",
        westSign: post.author.western_sign || "",
        chineseSign: post.author.chinese_sign || "",
        eastWestCode: post.author.east_west_code || "",
      },
      comments: formattedComments,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[GET /api/community/posts/[postId]]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

