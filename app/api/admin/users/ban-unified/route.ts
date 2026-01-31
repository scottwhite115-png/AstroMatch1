// app/api/admin/users/ban/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireStaff } from "@/lib/auth-helpers"

type BanType = "ONE_WEEK" | "PERMANENT" | "UNBAN"

export async function POST(req: Request) {
  const acting = await requireStaff() // ADMIN or OWNER

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { userId, type } = body as { userId?: string; type?: BanType }

  if (!userId || !type) {
    return NextResponse.json(
      { error: "userId and type are required" },
      { status: 400 }
    )
  }

  // Safeguard: Prevent self-modification
  if (userId === acting.id) {
    return NextResponse.json(
      { error: "You cannot change your own status." },
      { status: 400 }
    )
  }

  // Check if target user exists
  const target = await prisma.profiles.findUnique({ 
    where: { id: userId },
    select: { id: true, role: true, display_name: true }
  })
  
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Safeguard: Prevent modifying OWNER (unless acting user is also OWNER)
  if (target.role === "OWNER" && acting.role !== "OWNER") {
    return NextResponse.json(
      { error: "You cannot modify the OWNER account." },
      { status: 403 }
    )
  }

  // Safeguard: Even OWNER cannot ban another OWNER
  if (target.role === "OWNER" && type !== "UNBAN") {
    return NextResponse.json(
      { error: "Cannot ban or suspend OWNER accounts." },
      { status: 403 }
    )
  }

  // Determine status update based on type
  let statusUpdate: any = {}
  let actionMessage = ""

  if (type === "ONE_WEEK") {
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)

    statusUpdate = {
      status: "SUSPENDED",
      suspensionEndsAt: oneWeekFromNow,
    }
    actionMessage = `User suspended for 1 week (until ${oneWeekFromNow.toLocaleDateString()})`
  } else if (type === "PERMANENT") {
    statusUpdate = {
      status: "BANNED",
      suspensionEndsAt: null,
    }
    actionMessage = "User permanently banned"
  } else if (type === "UNBAN") {
    statusUpdate = {
      status: "ACTIVE",
      suspensionEndsAt: null,
    }
    actionMessage = "User unbanned and reactivated"
  } else {
    return NextResponse.json({ error: "Invalid ban type" }, { status: 400 })
  }

  // Update user status
  const updated = await prisma.profiles.update({
    where: { id: userId },
    data: statusUpdate,
  })

  return NextResponse.json({
    ok: true,
    message: actionMessage,
    profileId: updated.id,
    displayName: target.display_name,
    status: updated.status,
    suspensionEndsAt: updated.suspensionEndsAt,
  })
}

