"use client"

import { ThemeProvider } from "@/contexts/ThemeContext"
import { ErrorBoundary } from "@/components/error-boundary"
import { type ReactNode } from "react"
// import { preloadBlurbs } from "@/lib/blurbLookup"

export function Providers({ children }: { children: ReactNode }) {
  // Temporarily disabled - 4.9MB JSON file causes white screen on mobile
  // useEffect(() => {
  //   preloadBlurbs()
  // }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider>{children}</ThemeProvider>
    </ErrorBoundary>
  )
}
