import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ postId: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { postId } = await context.params

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            display_name: true,
            east_west_code: true,
            chinese_sign: true,
            photo_url: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                display_name: true,
                east_west_code: true,
                chinese_sign: true,
                photo_url: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    display_name: true,
                    east_west_code: true,
                    chinese_sign: true,
                    photo_url: true,
                  },
                },
              },
              orderBy: { createdAt: "asc" },
            },
          },
          where: {
            parentId: null, // Only get top-level comments
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Format response
    const formatted = {
      id: post.id,
      topic: post.topic,
      type: post.type,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      author: {
        id: post.author.id,
        displayName: post.author.display_name || "Anonymous",
        eastWestCode: post.author.east_west_code,
        chineseSign: post.author.chinese_sign,
        photoUrl: post.author.photo_url,
      },
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        likeCount: comment.likeCount,
        author: {
          id: comment.author.id,
          displayName: comment.author.display_name || "Anonymous",
          eastWestCode: comment.author.east_west_code,
          chineseSign: comment.author.chinese_sign,
          photoUrl: comment.author.photo_url,
        },
        replies: comment.replies.map((reply) => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt.toISOString(),
          likeCount: reply.likeCount,
          parentId: reply.parentId,
          author: {
            id: reply.author.id,
            displayName: reply.author.display_name || "Anonymous",
            eastWestCode: reply.author.east_west_code,
            chineseSign: reply.author.chinese_sign,
            photoUrl: reply.author.photo_url,
          },
        })),
      })),
    }

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("[GET /api/community/posts/[postId]] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    )
  }
}
