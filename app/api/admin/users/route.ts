import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    // Check admin access
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Verify admin role
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!adminProfile || (adminProfile.role !== "ADMIN" && adminProfile.role !== "OWNER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id, display_name, email, western_sign, chinese_sign, status, suspensionEndsAt, role, created_at")
      .order("created_at", { ascending: false })
      .limit(100)

    if (usersError) {
      throw usersError
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

