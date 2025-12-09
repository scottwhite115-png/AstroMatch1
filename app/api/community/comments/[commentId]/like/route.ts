import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ commentId: string }>
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

    const { commentId } = await context.params

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    })

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      )
    }

    // Check if user already liked this comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: user.id,
        },
      },
    })

    let liked: boolean
    let likeCount: number

    if (existingLike) {
      // Unlike - remove the like
      await prisma.$transaction(async (tx) => {
        await tx.commentLike.delete({
          where: { id: existingLike.id },
        })

        await tx.comment.update({
          where: { id: commentId },
          data: { likeCount: { decrement: 1 } },
        })
      })

      liked = false

      // Get updated count
      const updated = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { likeCount: true },
      })
      likeCount = updated?.likeCount || 0
    } else {
      // Like - create the like
      await prisma.$transaction(async (tx) => {
        await tx.commentLike.create({
          data: {
            commentId,
            userId: user.id,
          },
        })

        await tx.comment.update({
          where: { id: commentId },
          data: { likeCount: { increment: 1 } },
        })
      })

      liked = true

      // Get updated count
      const updated = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { likeCount: true },
      })
      likeCount = updated?.likeCount || 0
    }

    return NextResponse.json({
      liked,
      likeCount,
    })
  } catch (error) {
    console.error("[POST /api/community/comments/[commentId]/like] Error:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}
