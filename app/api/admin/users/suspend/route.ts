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

  const { userId, days } = body as { userId?: string; days?: number }

  if (!userId || !days) {
    return NextResponse.json({ error: "userId and days are required" }, { status: 400 })
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
    return NextResponse.json({ error: "Cannot suspend OWNER" }, { status: 403 })
  }

  // Calculate suspension end date
  const suspensionEndsAt = new Date()
  suspensionEndsAt.setDate(suspensionEndsAt.getDate() + days)

  // Update user status
  await prisma.profiles.update({
    where: { id: userId },
    data: {
      status: "SUSPENDED",
      suspensionEndsAt,
    },
  })

  return NextResponse.json({ 
    ok: true,
    message: `User suspended for ${days} days`,
    suspensionEndsAt 
  })
}

