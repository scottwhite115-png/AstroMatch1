"use client"

import { ThemeProvider } from "@/contexts/ThemeContext"
import { ErrorBoundary } from "@/components/error-boundary"
import { type ReactNode } from "react"
import { useState, useEffect } from "react"
// import { preloadBlurbs } from "@/lib/blurbLookup"

export function Providers({ children }: { children: ReactNode }) {
  // Always start as mounted on client to prevent blank screen
  const [mounted, setMounted] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Ensure mounted is true on client
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])

  // Temporarily disabled - 4.9MB JSON file causes white screen on mobile
  // useEffect(() => {
  //   preloadBlurbs()
  // }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-white text-lg mb-2">Error Loading App</p>
          <p className="text-white/60 text-sm mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            Reload
          </button>
        </div>
      </div>
    )
  }

  // Always render on client - don't block
  if (typeof window === 'undefined') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900">Loading...</p>
        </div>
      </div>
    )
  }

  // On client, always render immediately
  return (
    <ErrorBoundary>
      <ThemeProvider>{children}</ThemeProvider>
    </ErrorBoundary>
  )
}
