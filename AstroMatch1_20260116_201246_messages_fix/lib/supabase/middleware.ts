import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Environment variables check:", {
    url: supabaseUrl ? "✓ Found" : "✗ Missing",
    key: supabaseKey ? "✓ Found" : "✗ Missing",
    urlValue: supabaseUrl?.substring(0, 20) + "...",
    keyValue: supabaseKey?.substring(0, 20) + "...",
  })

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const pathname = decodeURIComponent(request.nextUrl.pathname)
  console.log("[v0] Middleware processing path:", pathname)

  // Handle profile settings URL variations by redirecting to root
  if (pathname === "/profile settings" || pathname === "/profile-settings" || pathname === "/profilesettings") {
    console.log("[v0] Redirecting profile settings variant to root")
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] User authentication status:", {
    authenticated: !!user,
    userId: user?.id?.substring(0, 8) + "..." || "none",
    path: pathname,
  })

  // Allow unauthenticated access only to login, signup, and auth callback pages
  const publicPaths = ["/login", "/signup", "/auth"]
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  if (!user && !isPublicPath) {
    console.log("[v0] Redirecting unauthenticated user to signup from:", pathname)
    const url = request.nextUrl.clone()
    url.pathname = "/signup"
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && isPublicPath) {
    console.log("[v0] Redirecting authenticated user away from auth page:", pathname)
    const url = request.nextUrl.clone()
    url.pathname = "/matches"
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users from root to matches page
  if (user && pathname === "/") {
    console.log("[v0] Redirecting authenticated user from root to matches")
    const url = request.nextUrl.clone()
    url.pathname = "/matches"
    return NextResponse.redirect(url)
  }

  console.log("[v0] Allowing access to:", pathname)
  return supabaseResponse
}
