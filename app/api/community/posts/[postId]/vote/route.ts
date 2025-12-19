import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

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

    const { postId } = await context.params
    const body = await request.json()
    const { vote } = body // 1 for upvote, -1 for downvote, 0 to remove vote

    // Validate vote value
    if (vote !== 1 && vote !== -1 && vote !== 0) {
      return NextResponse.json(
        { error: "Invalid vote value. Must be 1 (upvote), -1 (downvote), or 0 (remove vote)" },
        { status: 400 }
      )
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, upvoteCount: true, downvoteCount: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Get existing vote if any
    const existingVote = await prisma.postVote.findFirst({
      where: {
        postId,
        userId: user.id,
      },
    })

    // Handle vote in a transaction
    const result = await prisma.$transaction(async (tx) => {
      let newUpvoteCount = post.upvoteCount
      let newDownvoteCount = post.downvoteCount
      let userVote = 0

      if (vote === 0) {
        // Remove vote
        if (existingVote) {
          if (existingVote.vote === 1) {
            newUpvoteCount = Math.max(0, newUpvoteCount - 1)
          } else if (existingVote.vote === -1) {
            newDownvoteCount = Math.max(0, newDownvoteCount - 1)
          }
          await tx.postVote.delete({
            where: { id: existingVote.id },
          })
        }
      } else {
        // Add or change vote
        if (existingVote) {
          // User already voted - update or remove
          if (existingVote.vote === vote) {
            // Same vote - remove it (toggle off)
            if (vote === 1) {
              newUpvoteCount = Math.max(0, newUpvoteCount - 1)
            } else {
              newDownvoteCount = Math.max(0, newDownvoteCount - 1)
            }
            await tx.postVote.delete({
              where: { id: existingVote.id },
            })
          } else {
            // Different vote - change it
            if (existingVote.vote === 1) {
              newUpvoteCount = Math.max(0, newUpvoteCount - 1)
            } else {
              newDownvoteCount = Math.max(0, newDownvoteCount - 1)
            }
            if (vote === 1) {
              newUpvoteCount += 1
            } else {
              newDownvoteCount += 1
            }
            await tx.postVote.update({
              where: { id: existingVote.id },
              data: { vote, updatedAt: new Date() },
            })
            userVote = vote
          }
        } else {
          // New vote
          if (vote === 1) {
            newUpvoteCount += 1
          } else {
            newDownvoteCount += 1
          }
          await tx.postVote.create({
            data: {
              postId,
              userId: user.id,
              vote,
            },
          })
          userVote = vote
        }
      }

      // Update post counts
      await tx.post.update({
        where: { id: postId },
        data: {
          upvoteCount: newUpvoteCount,
          downvoteCount: newDownvoteCount,
        },
      })

      return {
        upvoteCount: newUpvoteCount,
        downvoteCount: newDownvoteCount,
        score: newUpvoteCount - newDownvoteCount,
        userVote,
      }
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("[POST /api/community/posts/[postId]/vote] Error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to vote on post" },
      { status: 500 }
    )
  }
}

// GET endpoint to check user's vote on a post
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ userVote: 0 })
    }

    const { postId } = await context.params

    const vote = await prisma.postVote.findFirst({
      where: {
        postId,
        userId: user.id,
      },
      select: { vote: true },
    })

    return NextResponse.json({
      userVote: vote?.vote || 0,
    })
  } catch (error: any) {
    console.error("[GET /api/community/posts/[postId]/vote] Error:", error)
    return NextResponse.json({ userVote: 0 })
  }
}

