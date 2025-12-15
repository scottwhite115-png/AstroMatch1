import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    // Get user from auth header or cookie
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ authorized: false, error: "No token" }, { status: 401 })
    }

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ authorized: false, error: "Invalid token" }, { status: 401 })
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, isStaff, status")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ authorized: false, error: "Profile not found" }, { status: 404 })
    }

    // Check if user is ADMIN or OWNER
    if (profile.role === "ADMIN" || profile.role === "OWNER") {
      return NextResponse.json({ 
        authorized: true, 
        role: profile.role,
        isStaff: profile.isStaff
      })
    }

    return NextResponse.json({ authorized: false, error: "Insufficient permissions" }, { status: 403 })
  } catch (error) {
    console.error("Admin access check error:", error)
    return NextResponse.json({ authorized: false, error: "Server error" }, { status: 500 })
  }
}

