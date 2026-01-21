import { createClient } from "@/lib/supabase/server"
import prisma from "@/src/lib/prisma"
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
      // ✨ PRISMA: Update profile to mark email as verified
      try {
        await prisma.profiles.update({
          where: { id: user.id },
          data: { email_verified: true }
        })
        console.log("Email verified for user (via Prisma):", user.id)
      } catch (prismaError) {
        console.error("Prisma update error:", prismaError)
        // Fallback to Supabase if Prisma fails
        await supabase
          .from("profiles")
          .update({ email_verified: true })
          .eq("id", user.id)
        console.log("Email verified for user (via Supabase fallback):", user.id)
      }
    }
  }

  // Redirect to matches page after email verification
  return NextResponse.redirect(`${origin}/matches`)
}

