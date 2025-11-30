"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"

interface UseAuthRedirectOptions {
  redirectTo?: string
  requireAuth?: boolean
  redirectIfAuth?: boolean
}

export function useAuthRedirect({
  redirectTo = "/login",
  requireAuth = true,
  redirectIfAuth = false,
}: UseAuthRedirectOptions = {}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("[v0] Auth redirect temporarily disabled for design work")
    return

    /* 
    // ORIGINAL AUTH REDIRECT LOGIC - Uncomment when ready to re-enable
    if (loading) return

    if (requireAuth && !user) {
      router.push(redirectTo)
    } else if (redirectIfAuth && user) {
      router.push("/matches")
    }
    */
  }, [user, loading, router, redirectTo, requireAuth, redirectIfAuth])

  return { user, loading }
}
