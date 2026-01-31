import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireStaff } from "@/lib/auth-helpers"

export async function GET(req: NextRequest) {
  // ADMIN or OWNER only - auto-checks role and account status
  const admin = await requireStaff()

  const { searchParams } = new URL(req.url)
  const showHidden = searchParams.get("showHidden") === "true"

  try {
    // Build query
    const where = showHidden ? {} : { isHidden: false }

    // Get posts with author info
    const posts = await prisma.Post.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        topic: true,
        type: true,
        isHidden: true,
        createdAt: true,
        likeCount: true,
        commentCount: true,
        author: {
          select: {
            id: true,
            display_name: true,
            western_sign: true,
            chinese_sign: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

