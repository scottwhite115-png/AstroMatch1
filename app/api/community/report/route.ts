// app/api/community/report/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"

export async function POST(req: Request) {
  const profile = await getCurrentProfileWithRole()
  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // MODERATION GUARD: Suspended/banned users can't report
  if (profile.status === "SUSPENDED") {
    return NextResponse.json(
      {
        error: "Your account is suspended from posting and messaging.",
        suspensionEndsAt: profile.suspensionEndsAt,
      },
      { status: 403 }
    )
  }

  if (profile.status === "BANNED") {
    return NextResponse.json(
      { error: "Your account has been banned." },
      { status: 403 }
    )
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { postId, reason } = body as { postId?: string; reason?: string }
  if (!postId || !reason) {
    return NextResponse.json(
      { error: "postId and reason are required" },
      { status: 400 }
    )
  }

  if (reason.trim().length < 5) {
    return NextResponse.json(
      { error: "Please provide a detailed reason (at least 5 characters)" },
      { status: 400 }
    )
  }

  // Check if post exists
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  // Check if user already reported this post
  const existingReport = await prisma.postReport.findFirst({
    where: {
      postId,
      reporterId: profile.id,
    },
  })

  if (existingReport) {
    return NextResponse.json(
      { error: "You have already reported this post" },
      { status: 400 }
    )
  }

  // Create the report
  await prisma.postReport.create({
    data: {
      postId,
      reporterId: profile.id,
      reason: reason.slice(0, 500), // Cap at 500 characters
    },
  })

  return NextResponse.json({ ok: true, message: "Report submitted successfully" })
}

