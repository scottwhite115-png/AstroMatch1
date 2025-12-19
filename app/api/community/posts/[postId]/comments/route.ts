import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { checkModerationStatus, moderationErrorResponse } from "@/lib/moderation-guard"

type RouteContext = {
  params: Promise<{ postId: string }>
}

export async function POST(
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

    // MODERATION GUARD: Check if user is suspended/banned
    // Temporarily disabled if moderation helper has issues
    try {
    const moderationCheck = await checkModerationStatus(user.id)
    if (!moderationCheck.allowed) {
      const errorResponse = moderationErrorResponse(moderationCheck)
      if (errorResponse) return errorResponse
      }
    } catch (modError) {
      console.warn("[POST /api/community/posts/[postId]/comments] Moderation check failed, continuing:", modError);
      // Continue without moderation check if it fails
    }

    const { postId } = await context.params
    const body = await request.json()
    const { content, parentId } = body

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Comment must be less than 2000 characters" },
        { status: 400 }
      )
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // If replying to a comment, check if parent exists
    let parentComment = null
    if (parentId) {
      parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, authorId: true, postId: true },
      })

      if (!parentComment || parentComment.postId !== postId) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        )
      }
    }

    // Create comment and update counts in a transaction
    const comment = await prisma.$transaction(async (tx) => {
      // Create the comment
      const newComment = await tx.comment.create({
        data: {
          postId,
          parentId: parentId || null,
          authorId: user.id,
          content,
        },
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
        },
      })

      // Increment comment count on post (only for top-level comments, not replies)
      if (!parentId) {
        await tx.post.update({
          where: { id: postId },
          data: { commentCount: { increment: 1 } },
        })
      }

      // Create notification for post author or parent comment author
      const notifyUserId = parentId ? parentComment!.authorId : post.authorId

      // Don't notify if user is commenting on their own post/comment
      if (notifyUserId !== user.id) {
        await tx.notification.create({
          data: {
            userId: notifyUserId,
            actorId: user.id,
            type: parentId ? "COMMENT_REPLY" : "POST_REPLY",
            postId,
            commentId: newComment.id,
          },
        })
      }

      return newComment
    })

    return NextResponse.json({
      id: comment.id,
      postId: comment.postId,
      parentId: comment.parentId,
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
    })
  } catch (error: any) {
    console.error("[POST /api/community/posts/[postId]/comments] Error:", error)
    console.error("[POST /api/community/posts/[postId]/comments] Error details:", {
      code: error.code,
      message: error.message,
      meta: error.meta,
    })
    return NextResponse.json(
      { error: error.message || "Failed to create comment" },
      { status: 500 }
    )
  }
}
