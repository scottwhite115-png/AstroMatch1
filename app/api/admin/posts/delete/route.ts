import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json()

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 })
    }

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

    // Delete post permanently
    const { error: deleteError } = await supabase
      .from("Post")
      .delete()
      .eq("id", postId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

