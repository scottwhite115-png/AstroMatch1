// app/api/community/block/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"

// GET: Fetch list of blocked users
export async function GET() {
  const profile = await getCurrentProfileWithRole()
  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Get all users this user has blocked
  const blocks = await prisma.userBlock.findMany({
    where: { blockerId: profile.id },
    include: {
      blocked: {
        select: {
          id: true,
          display_name: true,
          east_west_code: true,
          chinese_sign: true,
          photo_url: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    blockedUsers: blocks.map((b) => ({
      id: b.blocked.id,
      displayName: b.blocked.display_name,
      eastWestCode: b.blocked.east_west_code,
      chineseSign: b.blocked.chinese_sign,
      photoUrl: b.blocked.photo_url,
      blockedAt: b.createdAt,
    })),
  })
}

// POST: Block or unblock a user
export async function POST(req: Request) {
  const profile = await getCurrentProfileWithRole()
  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { targetUserId, action } = body as {
    targetUserId?: string
    action?: "BLOCK" | "UNBLOCK"
  }

  if (!targetUserId || !action) {
    return NextResponse.json(
      { error: "targetUserId and action are required" },
      { status: 400 }
    )
  }

  // Validate action
  if (action !== "BLOCK" && action !== "UNBLOCK") {
    return NextResponse.json({ error: "Invalid action. Must be BLOCK or UNBLOCK" }, { status: 400 })
  }

  // Can't block yourself
  if (targetUserId === profile.id) {
    return NextResponse.json(
      { error: "You cannot block yourself." },
      { status: 400 }
    )
  }

  // Verify target user exists
  const targetUser = await prisma.profiles.findUnique({
    where: { id: targetUserId },
    select: { id: true, display_name: true },
  })

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (action === "BLOCK") {
    // Use upsert to avoid errors if already blocked
    await prisma.userBlock.upsert({
      where: {
        blockerId_blockedId: {
          blockerId: profile.id,
          blockedId: targetUserId,
        },
      },
      update: {}, // If already exists, do nothing
      create: {
        blockerId: profile.id,
        blockedId: targetUserId,
      },
    })

    return NextResponse.json({ 
      ok: true, 
      message: `Blocked ${targetUser.display_name || "user"}` 
    })
  } else {
    // UNBLOCK
    await prisma.userBlock.deleteMany({
      where: {
        blockerId: profile.id,
        blockedId: targetUserId,
      },
    })

    return NextResponse.json({ 
      ok: true, 
      message: `Unblocked ${targetUser.display_name || "user"}` 
    })
  }
}

