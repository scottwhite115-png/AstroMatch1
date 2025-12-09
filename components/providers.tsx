"use client"

import { ThemeProvider } from "@/contexts/ThemeContext"
import { ErrorBoundary } from "@/components/error-boundary"
import { type ReactNode } from "react"
import { useState, useEffect } from "react"
// import { preloadBlurbs } from "@/lib/blurbLookup"

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Temporarily disabled - 4.9MB JSON file causes white screen on mobile
  // useEffect(() => {
  //   preloadBlurbs()
  // }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>{children}</ThemeProvider>
    </ErrorBoundary>
  )
}
