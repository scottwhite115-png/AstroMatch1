import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")
  const origin = requestUrl.origin

  // Handle error from Supabase (e.g., expired token)
  if (error) {
    console.error("Auth callback error:", error, errorDescription)
    const errorMessage = errorDescription || error === "expired_token" 
      ? "The verification link has expired. Please request a new verification email."
      : "Verification failed. Please try again."
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`)
  }

  if (!code) {
    console.error("No code parameter in callback URL")
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Invalid verification link. Please request a new verification email.")}`)
  }

  try {
    const supabase = await createClient()
    
    // Debug: Log available cookies (for PKCE debugging)
    const requestHeaders = request.headers
    const cookieHeader = requestHeaders.get('cookie')
    const cookieNames = cookieHeader ? cookieHeader.split(';').map(c => c.trim().split('=')[0]) : []
    console.log("Auth callback - Available cookies:", cookieNames.join(', ') || 'none')
    
    // Check for PKCE-related cookies specifically
    const pkceCookies = cookieNames.filter(name => 
      name.includes('code-verifier') || 
      name.includes('pkce') || 
      name.includes('supabase-auth-token') ||
      name.startsWith('sb-')
    )
    console.log("Auth callback - PKCE-related cookies found:", pkceCookies.length > 0 ? pkceCookies.join(', ') : 'NONE - This is likely the problem!')
    
    console.log("Auth callback - Exchanging code for session...")
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error("Error exchanging code for session:", exchangeError)
      console.error("Error details:", JSON.stringify(exchangeError, null, 2))
      
      // Handle specific error types
      let errorMessage = "Verification failed. Please try again."
      if (exchangeError.message.includes("expired") || exchangeError.message.includes("invalid")) {
        errorMessage = "The verification link has expired or is invalid. Please request a new verification email."
      } else if (exchangeError.message) {
        errorMessage = exchangeError.message
      }
      
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`)
    }
    
    console.log("Auth callback - Code exchanged successfully")

    // Get the user to update their email_verified status in profile
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error("Error getting user:", userError)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Failed to verify email. Please try again.")}`)
    }
    
    if (user) {
      // Update profile to mark email as verified (if profile exists)
      // For OAuth users, profile might not exist yet, so we'll use Supabase directly
      try {
        // First try to update via Supabase (works for both email and OAuth users)
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ 
            email_verified: true,
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id)
        
        if (updateError) {
          // Profile might not exist yet for OAuth users - that's okay
          console.log("Profile update note (may not exist yet):", updateError.message)
          
          // Note: Profile will be created/updated when user completes their profile
          // For OAuth users, profile might not exist yet, which is fine
        } else {
          console.log("Email verified for user (via Supabase):", user.id)
        }
      } catch (error) {
        // Don't fail the auth flow if profile update fails
        console.warn("Profile update warning (non-critical):", error)
      }
    }

    // Redirect to matches page after email verification
    return NextResponse.redirect(`${origin}/matches`)
  } catch (err: any) {
    console.error("Unexpected error in auth callback:", err)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("An unexpected error occurred. Please try again.")}`)
  }
}

