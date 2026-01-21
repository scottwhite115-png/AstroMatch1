import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireStaff } from "@/lib/auth-helpers"

export async function GET() {
  // ADMIN or OWNER only - auto-checks role and account status
  const admin = await requireStaff()

  try {
    // Get all users with moderation fields
    const users = await prisma.profiles.findMany({
      select: {
        id: true,
        display_name: true,
        email: true,
        western_sign: true,
        chinese_sign: true,
        status: true,
        suspensionEndsAt: true,
        role: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
      take: 100,
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

