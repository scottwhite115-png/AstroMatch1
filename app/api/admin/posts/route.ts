import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const showHidden = searchParams.get("showHidden") === "true"

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

    // Get posts - only fetch hidden posts if showHidden is true
    let query = supabase
      .from("Post")
      .select(`
        id,
        title,
        content,
        topic,
        type,
        isHidden,
        createdAt,
        likeCount,
        commentCount,
        author:profiles!authorId (
          id,
          display_name,
          western_sign,
          chinese_sign
        )
      `)
      .order("createdAt", { ascending: false })
      .limit(50)

    if (!showHidden) {
      query = query.eq("isHidden", false)
    }

    const { data: posts, error: postsError } = await query

    if (postsError) {
      throw postsError
    }

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

