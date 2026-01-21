"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

interface DiscoveryMatchesPageProps {
  pageIndex?: number
  totalPages?: number
  onNavigatePrev?: () => void
  onNavigateNext?: () => void
}

export default function DiscoveryMatchesPage({
  pageIndex = 0,
  totalPages = 1,
  onNavigatePrev,
  onNavigateNext,
}: DiscoveryMatchesPageProps = {}) {
  const router = useRouter()
  const { theme } = useTheme()

  // Match filter state
  const [matchFilter, setMatchFilter] = useState<"all" | "highly" | "very">("all")

  const handleMatchFilterChange = (filter: "all" | "highly" | "very") => {
    setMatchFilter(filter)
    localStorage.setItem("matchFilter", filter)
  }

  useEffect(() => {
    const savedMatchFilter = localStorage.getItem("matchFilter")
    if (savedMatchFilter) {
      setMatchFilter(savedMatchFilter as "all" | "highly" | "very")
    }
  }, [])

  return (
    <div
      className={`${theme === "starlight" ? "astrology-cosmic-bg" : theme === "light" ? "bg-gradient-to-b from-white to-gray-50" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} profile-page min-h-screen relative`}
    >

      <div className="relative z-10">
        {/* Header */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <button
                onClick={onNavigatePrev}
                className="hover:opacity-70 transition-opacity"
                disabled={pageIndex === 0}
              >
                {pageIndex > 0 && <ChevronLeft className="w-7 h-7 text-gray-400 hover:text-white transition-colors" />}
              </button>
            </div>
            <h1
              className={`font-semibold text-lg whitespace-nowrap ${theme === "starlight" ? "bg-gradient-to-r from-pink-500 via-rose-500 to-red-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-pink-600 via-rose-600 to-red-500 bg-clip-text text-transparent"}`}
            >
              Discovery & Matches
            </h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={onNavigateNext}
                className="hover:opacity-70 transition-opacity"
                disabled={pageIndex >= totalPages - 1}
              >
                <ChevronRight className="w-7 h-7 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 pb-8">
          {/* Match Filters Section */}
          <div className="mb-8">
            <h2
              className={`font-semibold text-base mb-4 ${theme === "starlight" ? "bg-gradient-to-r from-pink-500 via-rose-500 to-red-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-pink-600 via-rose-600 to-red-500 bg-clip-text text-transparent"}`}
            >
              Match Filters
            </h2>
            <div className="text-white/60 text-sm mb-3">Show me matches based on compatibility</div>
            <div className="space-y-3">
              <button
                onClick={() => handleMatchFilterChange("all")}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  matchFilter === "all"
                    ? "bg-blue-500/20 border-blue-500/50"
                    : "bg-white/10 backdrop-blur-sm border-orange-500/30"
                }`}
              >
                <div>
                  <div className="text-white font-medium">Show All Matches</div>
                  <div className="text-white/60 text-sm">See everyone in your preferences</div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    matchFilter === "all" ? "border-blue-500" : "border-white/30"
                  }`}
                >
                  {matchFilter === "all" && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                </div>
              </button>

              <button
                onClick={() => handleMatchFilterChange("highly")}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  matchFilter === "highly"
                    ? "bg-blue-500/20 border-blue-500/50"
                    : "bg-white/10 backdrop-blur-sm border-orange-500/30"
                }`}
              >
                <div>
                  <div className="text-white font-medium">Only Highly Compatible</div>
                  <div className="text-white/60 text-sm">70%+ compatibility score</div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    matchFilter === "highly" ? "border-blue-500" : "border-white/30"
                  }`}
                >
                  {matchFilter === "highly" && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                </div>
              </button>

              <button
                onClick={() => handleMatchFilterChange("very")}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  matchFilter === "very"
                    ? "bg-blue-500/20 border-blue-500/50"
                    : "bg-white/10 backdrop-blur-sm border-orange-500/30"
                }`}
              >
                <div>
                  <div className="text-white font-medium">Only Very Compatible</div>
                  <div className="text-white/60 text-sm">85%+ compatibility score</div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    matchFilter === "very" ? "border-blue-500" : "border-white/30"
                  }`}
                >
                  {matchFilter === "very" && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
