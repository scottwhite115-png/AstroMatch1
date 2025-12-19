import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

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
            western_sign: true,
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
        eastWestCode: (post.author.western_sign && post.author.chinese_sign
          ? `${post.author.western_sign} ${post.author.chinese_sign}`.trim()
          : ""),
        chineseSign: post.author.chinese_sign || "",
        photoUrl: post.author.photo_url || null,
      },
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        likeCount: comment.likeCount,
        author: {
          id: comment.author.id,
          displayName: comment.author.display_name || "Anonymous",
          eastWestCode: (comment.author.western_sign && comment.author.chinese_sign
            ? `${comment.author.western_sign} ${comment.author.chinese_sign}`.trim()
            : ""),
          chineseSign: comment.author.chinese_sign || "",
          photoUrl: comment.author.photo_url || null,
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
            eastWestCode: (reply.author.western_sign && reply.author.chinese_sign
              ? `${reply.author.western_sign} ${reply.author.chinese_sign}`.trim()
              : ""),
            chineseSign: reply.author.chinese_sign || "",
            photoUrl: reply.author.photo_url || null,
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

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { postId } = await context.params

    // Check if post exists and get author
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Check if user is the post owner
    if (post.authorId !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      )
    }

    // Delete the post (cascade will handle comments, votes, etc.)
    await prisma.post.delete({
      where: { id: postId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[DELETE /api/community/posts/[postId]] Error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete post" },
      { status: 500 }
    )
  }
}
