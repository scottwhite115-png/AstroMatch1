import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { SanHeHouse, ChatRegionScope } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const house = searchParams.get("house") as SanHeHouse | null
    const regionScope = searchParams.get("regionScope") as ChatRegionScope | null

    // Find user's current presence
    let presence
    if (house && regionScope) {
      // Find presence for specific house/scope
      presence = await prisma.sanHePresence.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          room: true,
        },
        orderBy: {
          lastSeenAt: "desc",
        },
      })

      // Filter by house/scope if provided
      if (presence && (presence.room.house !== house || presence.room.regionScope !== regionScope)) {
        presence = null
      }
    } else {
      // Get most recent presence
      presence = await prisma.sanHePresence.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          room: true,
        },
        orderBy: {
          lastSeenAt: "desc",
        },
      })
    }

    if (!presence) {
      return NextResponse.json(
        { error: "No active room found. Join a room first." },
        { status: 404 }
      )
    }

    // Update lastSeenAt
    await prisma.sanHePresence.update({
      where: { id: presence.id },
      data: { lastSeenAt: new Date() },
    })

    // Get recent messages (last 100)
    const messages = await prisma.sanHeMessage.findMany({
      where: {
        roomId: presence.room.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
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

    return NextResponse.json({
      room: {
        id: presence.room.id,
        house: presence.room.house,
        regionScope: presence.room.regionScope,
        countryCode: presence.room.countryCode,
        maxUsers: presence.room.maxUsers,
        currentUsers: presence.room.currentUsers,
      },
      messages: messages.reverse().map((msg) => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
        author: {
          id: msg.author.id,
          displayName: msg.author.display_name || "Anonymous",
          eastWestCode: msg.author.east_west_code,
          chineseSign: msg.author.chinese_sign,
          photoUrl: msg.author.photo_url,
        },
      })),
    })
  } catch (error) {
    console.error("[GET /api/community/live/room] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    )
  }
}

