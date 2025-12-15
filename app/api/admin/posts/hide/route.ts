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

  const { postId, hide } = body as { postId?: string; hide?: boolean }

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 })
  }

  // Verify post exists
  const post = await prisma.Post.findUnique({ where: { id: postId } })
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  // Update post visibility
  await prisma.Post.update({
    where: { id: postId },
    data: { isHidden: hide ?? true },
  })

  return NextResponse.json({ 
    ok: true, 
    message: hide ? "Post hidden" : "Post unhidden" 
  })
}

