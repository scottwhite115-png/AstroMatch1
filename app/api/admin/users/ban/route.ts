import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireStaff } from "@/lib/auth-helpers"

export async function POST(req: Request) {
  // ADMIN or OWNER only - auto-checks role and account status
  const admin = await requireStaff()

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { userId, permanent } = body as { userId?: string; permanent?: boolean }

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  // Verify user exists and is not OWNER
  const user = await prisma.profiles.findUnique({ 
    where: { id: userId },
    select: { id: true, role: true }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (user.role === "OWNER") {
    return NextResponse.json({ error: "Cannot ban OWNER" }, { status: 403 })
  }

  // Update user status to BANNED
  await prisma.profiles.update({
    where: { id: userId },
    data: {
      status: "BANNED",
      suspensionEndsAt: null,
    },
  })

  return NextResponse.json({ 
    ok: true,
    message: permanent ? "User permanently banned" : "User banned" 
  })
}

