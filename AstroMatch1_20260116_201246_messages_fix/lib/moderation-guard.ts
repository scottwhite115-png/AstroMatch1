// lib/moderation-guard.ts
// Reusable guard to prevent suspended/banned users from writing actions
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function checkModerationStatus(userId: string) {
  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
    select: {
      id: true,
      status: true,
      suspensionEndsAt: true,
    },
  })

  if (!profile) {
    return { allowed: false, error: "Profile not found", status: 404 }
  }

  if (profile.status === "SUSPENDED") {
    return {
      allowed: false,
      error: "Your account is suspended from posting and messaging.",
      suspensionEndsAt: profile.suspensionEndsAt,
      status: 403,
    }
  }

  if (profile.status === "BANNED") {
    return {
      allowed: false,
      error: "Your account has been banned.",
      status: 403,
    }
  }

  return { allowed: true }
}

export function moderationErrorResponse(checkResult: Awaited<ReturnType<typeof checkModerationStatus>>) {
  if (checkResult.allowed) {
    return null
  }

  const body: any = { error: checkResult.error }
  if ('suspensionEndsAt' in checkResult) {
    body.suspensionEndsAt = checkResult.suspensionEndsAt
  }

  return NextResponse.json(body, { status: checkResult.status })
}

