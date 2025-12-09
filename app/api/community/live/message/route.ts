import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { roomId, content } = body

    // Validation
    if (!roomId || !content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Room ID and content are required" },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: "Message must be less than 500 characters" },
        { status: 400 }
      )
    }

    // Verify user has presence in this room
    const presence = await prisma.sanHePresence.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: user.id,
        },
      },
    })

    if (!presence) {
      return NextResponse.json(
        { error: "You are not in this room. Join first." },
        { status: 403 }
      )
    }

    // Create message and update presence
    const message = await prisma.$transaction(async (tx) => {
      const msg = await tx.sanHeMessage.create({
        data: {
          roomId,
          authorId: user.id,
          content,
        },
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
      })

      // Update user's presence lastSeenAt
      await tx.sanHePresence.update({
        where: { id: presence.id },
        data: { lastSeenAt: new Date() },
      })

      return msg
    })

    return NextResponse.json({
      id: message.id,
      roomId: message.roomId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      author: {
        id: message.author.id,
        displayName: message.author.display_name || "Anonymous",
        eastWestCode: message.author.east_west_code,
        chineseSign: message.author.chinese_sign,
        photoUrl: message.author.photo_url,
      },
    })
  } catch (error) {
    console.error("[POST /api/community/live/message] Error:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

