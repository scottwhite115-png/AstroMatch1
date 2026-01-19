/**
 * San He Live Chat Cleanup Utility
 * 
 * Run this periodically (e.g., via cron or scheduled job) to:
 * 1. Mark rooms inactive if no messages/presence updates recently
 * 2. Truncate old messages beyond a threshold per room
 * 3. Clean up stale presence records
 */

import { prisma } from "@/lib/prisma"

const HOURS_UNTIL_INACTIVE = 24 // Mark room inactive after 24 hours of no activity
const MAX_MESSAGES_PER_ROOM = 200 // Keep only last 200 messages per room
const STALE_PRESENCE_HOURS = 2 // Remove presence if not updated in 2 hours

export async function cleanupSanHeRooms() {
  const inactivityThreshold = new Date(Date.now() - HOURS_UNTIL_INACTIVE * 60 * 60 * 1000)
  
  console.log("[Cleanup] Checking for inactive rooms...")
  
  // Find rooms with no recent messages
  const inactiveRooms = await prisma.sanHeRoom.findMany({
    where: {
      isActive: true,
      messages: {
        none: {
          createdAt: {
            gte: inactivityThreshold,
          },
        },
      },
    },
    select: { id: true },
  })

  if (inactiveRooms.length > 0) {
    console.log(`[Cleanup] Marking ${inactiveRooms.length} rooms as inactive`)
    
    await prisma.sanHeRoom.updateMany({
      where: {
        id: { in: inactiveRooms.map((r) => r.id) },
      },
      data: {
        isActive: false,
      },
    })
  }

  return inactiveRooms.length
}

export async function truncateOldMessages() {
  console.log("[Cleanup] Truncating old messages...")
  
  // Get all active rooms
  const rooms = await prisma.sanHeRoom.findMany({
    where: { isActive: true },
    select: { id: true },
  })

  let totalDeleted = 0

  for (const room of rooms) {
    // Count messages in this room
    const messageCount = await prisma.sanHeMessage.count({
      where: { roomId: room.id },
    })

    if (messageCount > MAX_MESSAGES_PER_ROOM) {
      // Get the cutoff message ID
      const cutoffMessages = await prisma.sanHeMessage.findMany({
        where: { roomId: room.id },
        orderBy: { createdAt: "desc" },
        take: MAX_MESSAGES_PER_ROOM,
        select: { id: true, createdAt: true },
      })

      const cutoffDate = cutoffMessages[cutoffMessages.length - 1].createdAt

      // Delete old messages
      const deleted = await prisma.sanHeMessage.deleteMany({
        where: {
          roomId: room.id,
          createdAt: { lt: cutoffDate },
        },
      })

      totalDeleted += deleted.count
      console.log(`[Cleanup] Deleted ${deleted.count} old messages from room ${room.id}`)
    }
  }

  return totalDeleted
}

export async function cleanupStalePresence() {
  const staleThreshold = new Date(Date.now() - STALE_PRESENCE_HOURS * 60 * 60 * 1000)
  
  console.log("[Cleanup] Removing stale presence records...")
  
  // Find stale presence records
  const stalePresence = await prisma.sanHePresence.findMany({
    where: {
      lastSeenAt: {
        lt: staleThreshold,
      },
    },
    select: {
      id: true,
      roomId: true,
    },
  })

  if (stalePresence.length > 0) {
    console.log(`[Cleanup] Removing ${stalePresence.length} stale presence records`)
    
    // Group by room for efficient updates
    const roomUpdates = new Map<string, number>()
    for (const presence of stalePresence) {
      roomUpdates.set(
        presence.roomId,
        (roomUpdates.get(presence.roomId) || 0) + 1
      )
    }

    // Delete presence and update room counts in transaction
    await prisma.$transaction(async (tx) => {
      // Delete stale presence
      await tx.sanHePresence.deleteMany({
        where: {
          id: { in: stalePresence.map((p) => p.id) },
        },
      })

      // Update room user counts
      for (const [roomId, count] of roomUpdates) {
        await tx.sanHeRoom.update({
          where: { id: roomId },
          data: {
            currentUsers: {
              decrement: count,
            },
          },
        })
      }
    })
  }

  return stalePresence.length
}

export async function runFullCleanup() {
  console.log("[Cleanup] Starting San He live chat cleanup...")
  
  const [inactiveRooms, deletedMessages, stalePresence] = await Promise.all([
    cleanupSanHeRooms(),
    truncateOldMessages(),
    cleanupStalePresence(),
  ])

  console.log("[Cleanup] Complete!")
  console.log(`  - Marked ${inactiveRooms} rooms as inactive`)
  console.log(`  - Deleted ${deletedMessages} old messages`)
  console.log(`  - Removed ${stalePresence} stale presence records`)

  return {
    inactiveRooms,
    deletedMessages,
    stalePresence,
  }
}

// If running as a script
if (require.main === module) {
  runFullCleanup()
    .then(() => {
      console.log("[Cleanup] Script completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("[Cleanup] Error:", error)
      process.exit(1)
    })
}


