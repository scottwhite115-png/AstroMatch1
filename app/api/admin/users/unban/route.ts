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

  const { userId } = body as { userId?: string }

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  // Verify user exists
  const user = await prisma.profiles.findUnique({ 
    where: { id: userId },
    select: { id: true, status: true }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Update user status to ACTIVE
  await prisma.profiles.update({
    where: { id: userId },
    data: {
      status: "ACTIVE",
      suspensionEndsAt: null,
    },
  })

  return NextResponse.json({ 
    ok: true,
    message: "User unbanned and reactivated" 
  })
}

