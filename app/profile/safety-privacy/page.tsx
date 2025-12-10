"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)



interface SafetyPrivacyPageProps {
  pageIndex?: number
  totalPages?: number
  onNavigatePrev?: () => void
  onNavigateNext?: () => void
}

export default function SafetyPrivacyPage({
  pageIndex,
  totalPages,
  onNavigatePrev,
  onNavigateNext,
}: SafetyPrivacyPageProps = {}) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} profile-page min-h-screen relative overflow-x-hidden touch-pan-y`}
      style={{ overscrollBehavior: 'contain' }}
    >

      <div className="relative z-10">
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AstroMatch
              </span>
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded-lg transition-colors ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Tabs Navigation */}
        <div className="px-5 pt-1 pb-2">
          <div className="flex justify-center gap-8">
              <button
                onClick={() => router.push("/profile/profile")}
                className={`relative px-5 py-1.5 text-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  theme === "light"
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Profile
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600 rounded-full transition-colors" />
              </button>
              <button
                onClick={() => router.push("/profile/account")}
                className={`relative px-5 py-1.5 text-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  theme === "light"
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Account
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600 rounded-full transition-colors" />
              </button>
          </div>
        </div>

        <div className="px-5 pt-4 pb-32">
        </div>
      </div>

    </div>
  )
}
