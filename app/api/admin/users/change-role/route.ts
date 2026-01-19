import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireOwner } from "@/lib/auth-helpers"

export async function POST(req: Request) {
  const owner = await requireOwner() // Only OWNER can change roles

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { userId, role } = body as { userId?: string; role?: "USER" | "ADMIN" }

  if (!userId || !role) {
    return NextResponse.json(
      { error: "userId and role are required" },
      { status: 400 }
    )
  }

  if (role !== "USER" && role !== "ADMIN") {
    return NextResponse.json(
      { error: "Role must be USER or ADMIN" },
      { status: 400 }
    )
  }

  // Prevent changing own role
  if (userId === owner.id) {
    return NextResponse.json(
      { error: "You cannot change your own role." },
      { status: 400 }
    )
  }

  const target = await prisma.profiles.findUnique({ where: { id: userId } })
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Prevent changing OWNER role
  if (target.role === "OWNER") {
    return NextResponse.json(
      { error: "Cannot change the role of an OWNER account." },
      { status: 403 }
    )
  }

  // Update role and set isStaff flag accordingly
  const updated = await prisma.profiles.update({
    where: { id: userId },
    data: {
      role,
      isStaff: role === "ADMIN", // ADMIN = staff, USER = not staff
    },
  })

  return NextResponse.json({
    ok: true,
    userId: updated.id,
    role: updated.role,
    isStaff: updated.isStaff,
  })
}

