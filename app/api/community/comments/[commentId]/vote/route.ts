import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ commentId: string }>
}

// GET - Fetch user's current vote on a comment
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ vote: 0 })
    }

    const { commentId } = await context.params

    const existingVote = await prisma.commentVote.findFirst({
      where: {
        commentId,
        userId: user.id,
      },
    })

    return NextResponse.json({
      vote: existingVote?.vote || 0,
    })
  } catch (error: any) {
    console.error("[GET /api/community/comments/[commentId]/vote] Error:", error)
    return NextResponse.json({ vote: 0 })
  }
}

// POST - Vote on a comment (upvote/downvote)
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

    const { commentId } = await context.params
    const { vote } = await request.json() // 1 for upvote, -1 for downvote, 0 to remove

    // Validate vote value
    if (vote !== 1 && vote !== -1 && vote !== 0) {
      return NextResponse.json(
        { error: "Invalid vote value. Must be 1 (upvote), -1 (downvote), or 0 (remove)" },
        { status: 400 }
      )
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, upvoteCount: true, downvoteCount: true },
    })

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      )
    }

    // Get existing vote
    const existingVote = await prisma.commentVote.findFirst({
      where: {
        commentId,
        userId: user.id,
      },
    })

    // Update vote in a transaction
    const result = await prisma.$transaction(async (tx) => {
      let upvoteChange = 0
      let downvoteChange = 0

      if (existingVote) {
        // User has already voted
        if (vote === 0) {
          // Remove vote
          await tx.commentVote.delete({
            where: { id: existingVote.id },
          })
          upvoteChange = existingVote.vote === 1 ? -1 : 0
          downvoteChange = existingVote.vote === -1 ? -1 : 0
        } else if (existingVote.vote !== vote) {
          // Change vote
          await tx.commentVote.update({
            where: { id: existingVote.id },
            data: { vote, updatedAt: new Date() },
          })
          if (existingVote.vote === 1 && vote === -1) {
            upvoteChange = -1
            downvoteChange = 1
          } else if (existingVote.vote === -1 && vote === 1) {
            upvoteChange = 1
            downvoteChange = -1
          }
        }
        // If same vote, do nothing
      } else {
        // New vote
        if (vote !== 0) {
          await tx.commentVote.create({
            data: {
              commentId,
              userId: user.id,
              vote,
            },
          })
          upvoteChange = vote === 1 ? 1 : 0
          downvoteChange = vote === -1 ? 1 : 0
        }
      }

      // Update comment counts
      const updatedComment = await tx.comment.update({
        where: { id: commentId },
        data: {
          upvoteCount: Math.max(0, comment.upvoteCount + upvoteChange),
          downvoteCount: Math.max(0, comment.downvoteCount + downvoteChange),
        },
        select: {
          upvoteCount: true,
          downvoteCount: true,
        },
      })

      return {
        upvoteCount: updatedComment.upvoteCount,
        downvoteCount: updatedComment.downvoteCount,
        userVote: vote,
      }
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("[POST /api/community/comments/[commentId]/vote] Error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to vote on comment" },
      { status: 500 }
    )
  }
}




