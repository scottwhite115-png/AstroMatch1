import { NextRequest, NextResponse } from "next/server"
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"

export async function GET(req: NextRequest) {
  try {
    const profile = await getCurrentProfileWithRole()
    
    if (!profile) {
      return NextResponse.json({ authorized: false, error: "Not authenticated" }, { status: 401 })
    }

    // Check account status
    if (profile.status === "BANNED") {
      return NextResponse.json({ authorized: false, error: "Account banned" }, { status: 403 })
    }

    if (profile.status === "SUSPENDED") {
      return NextResponse.json({ authorized: false, error: "Account suspended" }, { status: 403 })
    }

    // Check if user is ADMIN or OWNER (with auto-promotion already handled)
    if (profile.role === "ADMIN" || profile.role === "OWNER") {
      return NextResponse.json({ 
        authorized: true, 
        role: profile.role,
        isStaff: profile.isStaff,
        status: profile.status
      })
    }

    return NextResponse.json({ authorized: false, error: "Insufficient permissions" }, { status: 403 })
  } catch (error) {
    console.error("Admin access check error:", error)
    return NextResponse.json({ authorized: false, error: "Server error" }, { status: 500 })
  }
}

