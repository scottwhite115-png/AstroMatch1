// lib/utils/block-helpers.ts
import { prisma } from "@/lib/prisma"

/**
 * Check if userA has blocked userB
 */
export async function isUserBlocked(blockerId: string, blockedId: string): Promise<boolean> {
  const block = await prisma.userBlock.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId,
        blockedId,
      },
    },
  })
  return !!block
}

/**
 * Check if there's a mutual block between two users (either direction)
 */
export async function isBlockedEitherWay(userA: string, userB: string): Promise<boolean> {
  const blocks = await prisma.userBlock.findMany({
    where: {
      OR: [
        { blockerId: userA, blockedId: userB },
        { blockerId: userB, blockedId: userA },
      ],
    },
  })
  return blocks.length > 0
}

/**
 * Get all user IDs that the current user has blocked
 */
export async function getBlockedUserIds(userId: string): Promise<string[]> {
  const blocks = await prisma.userBlock.findMany({
    where: { blockerId: userId },
    select: { blockedId: true },
  })
  return blocks.map((b) => b.blockedId)
}

/**
 * Get all user IDs who have blocked the current user
 */
export async function getBlockedByUserIds(userId: string): Promise<string[]> {
  const blocks = await prisma.userBlock.findMany({
    where: { blockedId: userId },
    select: { blockerId: true },
  })
  return blocks.map((b) => b.blockerId)
}

/**
 * Get all user IDs that are involved in blocks with the current user
 * (both users they blocked AND users who blocked them)
 */
export async function getAllBlockedRelationships(userId: string): Promise<{
  blockedByMe: string[]
  blockedMe: string[]
  all: string[]
}> {
  const [blockedByMe, blockedMe] = await Promise.all([
    getBlockedUserIds(userId),
    getBlockedByUserIds(userId),
  ])

  const all = [...new Set([...blockedByMe, ...blockedMe])]

  return { blockedByMe, blockedMe, all }
}

/**
 * Filter an array of user IDs to exclude blocked users
 * (both blocked by current user and users who blocked current user)
 */
export async function filterBlockedUsers(userId: string, userIds: string[]): Promise<string[]> {
  const { all } = await getAllBlockedRelationships(userId)
  return userIds.filter((id) => !all.includes(id))
}

/**
 * Check if user can interact with another user (not blocked either way)
 */
export async function canUsersInteract(userA: string, userB: string): Promise<boolean> {
  return !(await isBlockedEitherWay(userA, userB))
}

