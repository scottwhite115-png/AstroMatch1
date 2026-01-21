import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error("Error exchanging code for session:", error)
      return NextResponse.redirect(`${origin}/login?error=verification_failed`)
    }

    // Get the user to update their email_verified status in profile
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Update profile to mark email as verified
      await supabase
        .from("profiles")
        .update({ email_verified: true })
        .eq("id", user.id)
      
      console.log("Email verified for user:", user.id)
    }
  }

  // Redirect to matches page after email verification
  return NextResponse.redirect(`${origin}/matches`)
}

