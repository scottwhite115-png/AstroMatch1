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

    // If COUNTRY scope, require countryCode
    let finalCountryCode = countryCode
    if (regionScope === ChatRegionScope.COUNTRY) {
      if (!countryCode) {
        // Try to get from user profile
        const profile = await prisma.profiles.findUnique({
          where: { id: user.id },
          select: { id: true },
        })
        // For now, default to null if not provided
        // In future, extract from profile when country field exists
        finalCountryCode = null
      }
    }

    // Find an active room with available space and recent activity
    let room = await prisma.sanHeRoom.findFirst({
      where: {
        house,
        regionScope,
        countryCode: regionScope === ChatRegionScope.COUNTRY ? finalCountryCode : null,
        isActive: true,
        currentUsers: { lt: prisma.sanHeRoom.fields.maxUsers },
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // If no suitable room found, create a new one
    if (!room) {
      room = await prisma.sanHeRoom.create({
        data: {
          house,
          regionScope,
          countryCode: regionScope === ChatRegionScope.COUNTRY ? finalCountryCode : null,
          maxUsers: 40,
          currentUsers: 0,
          isActive: true,
        },
        include: {
          messages: true,
        },
      })
    }

    // Upsert user presence in this room
    await prisma.$transaction(async (tx) => {
      // Remove any existing presence for this user in this house/scope
      const existing = await tx.sanHePresence.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          room: {
            select: {
              id: true,
              house: true,
              regionScope: true,
            },
          },
        },
      })

      if (existing && existing.room.id !== room.id) {
        // Decrement old room's user count
        await tx.sanHeRoom.update({
          where: { id: existing.room.id },
          data: { currentUsers: { decrement: 1 } },
        })

        // Delete old presence
        await tx.sanHePresence.delete({
          where: { id: existing.id },
        })
      }

      // Create or update presence in new room
      await tx.sanHePresence.upsert({
        where: {
          roomId_userId: {
            roomId: room.id,
            userId: user.id,
          },
        },
        create: {
          roomId: room.id,
          userId: user.id,
          lastSeenAt: new Date(),
        },
        update: {
          lastSeenAt: new Date(),
        },
      })

      // Increment room's user count (only if new presence)
      if (!existing || existing.room.id !== room.id) {
        await tx.sanHeRoom.update({
          where: { id: room.id },
          data: { currentUsers: { increment: 1 } },
        })
      }
    })

    // Get updated room info
    const updatedRoom = await prisma.sanHeRoom.findUnique({
      where: { id: room.id },
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
    console.error("[POST /api/community/live/join] Error:", error)
    return NextResponse.json(
      { error: "Failed to join room" },
      { status: 500 }
    )
  }
}


