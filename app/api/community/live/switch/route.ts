import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { SanHeHouse, ChatRegionScope } from "@prisma/client"

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
    const { house, regionScope, countryCode } = body

    // Validation
    if (!house || !Object.values(SanHeHouse).includes(house)) {
      return NextResponse.json(
        { error: "Invalid house" },
        { status: 400 }
      )
    }

    if (!regionScope || !Object.values(ChatRegionScope).includes(regionScope)) {
      return NextResponse.json(
        { error: "Invalid region scope" },
        { status: 400 }
      )
    }

    // Get user's current presence in this house/scope
    const currentPresence = await prisma.sanHePresence.findFirst({
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

    const currentRoomId = currentPresence?.room.id

    // Handle country code
    let finalCountryCode = countryCode
    if (regionScope === ChatRegionScope.COUNTRY && !countryCode) {
      finalCountryCode = null
    }

    // Find a different room in the same house/scope
    const availableRooms = await prisma.sanHeRoom.findMany({
      where: {
        house,
        regionScope,
        countryCode: regionScope === ChatRegionScope.COUNTRY ? finalCountryCode : null,
        isActive: true,
        currentUsers: { lt: prisma.sanHeRoom.fields.maxUsers },
        id: currentRoomId ? { not: currentRoomId } : undefined,
      },
      orderBy: [
        { currentUsers: "asc" }, // Prefer less crowded rooms
        { createdAt: "desc" },
      ],
      take: 5,
    })

    let newRoom
    if (availableRooms.length > 0) {
      // Pick a random room from available ones
      newRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)]
    } else {
      // Create a new room
      newRoom = await prisma.sanHeRoom.create({
        data: {
          house,
          regionScope,
          countryCode: regionScope === ChatRegionScope.COUNTRY ? finalCountryCode : null,
          maxUsers: 40,
          currentUsers: 0,
          isActive: true,
        },
      })
    }

    // Switch user's presence
    await prisma.$transaction(async (tx) => {
      // Remove presence from old room
      if (currentPresence) {
        await tx.sanHePresence.delete({
          where: { id: currentPresence.id },
        })

        // Decrement old room's user count
        await tx.sanHeRoom.update({
          where: { id: currentPresence.room.id },
          data: { currentUsers: { decrement: 1 } },
        })
      }

      // Create presence in new room
      await tx.sanHePresence.create({
        data: {
          roomId: newRoom.id,
          userId: user.id,
          lastSeenAt: new Date(),
        },
      })

      // Increment new room's user count
      await tx.sanHeRoom.update({
        where: { id: newRoom.id },
        data: { currentUsers: { increment: 1 } },
      })
    })

    // Get updated room info
    const updatedRoom = await prisma.sanHeRoom.findUnique({
      where: { id: newRoom.id },
    })

    return NextResponse.json({
      roomId: updatedRoom!.id,
      house: updatedRoom!.house,
      regionScope: updatedRoom!.regionScope,
      countryCode: updatedRoom!.countryCode,
      maxUsers: updatedRoom!.maxUsers,
      currentUsers: updatedRoom!.currentUsers,
    })
  } catch (error) {
    console.error("[POST /api/community/live/switch] Error:", error)
    return NextResponse.json(
      { error: "Failed to switch room" },
      { status: 500 }
    )
  }
}


