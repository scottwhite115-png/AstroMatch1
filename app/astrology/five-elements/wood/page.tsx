"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function WoodElementPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24`}
    >
      <div className="relative z-10">
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AstroLibrary
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

        <div className="px-4 pt-2 pb-3 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className={`p-2 rounded-lg transition-colors ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
              aria-label="Go back"
            >
              <svg 
                className={`w-6 h-6 ${theme === "light" ? "text-gray-700" : "text-white"}`}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🌳</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Wood (木)
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            {/* Theme and Vibe */}
            <div>
              <div className="mb-2">
                <p className={`text-sm font-semibold mb-1 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                  Theme: Growth, direction, momentum
                </p>
                <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
                  Vibe: Builder energy — forward-moving, principled, ambitious.
                </p>
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Strengths
              </h2>
              <div className="space-y-2">
                <p className={`text-base ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                  Natural leadership, initiative, big-picture thinking
                </p>
                <p className={`text-base ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                  Loyal to values, protective, decisive when inspired
                </p>
              </div>
            </div>

            {/* Watch-outs */}
            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Watch-outs
              </h2>
              <div className="space-y-2">
                <p className={`text-base ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                  Impatience, stubbornness, "my way" intensity
                </p>
                <p className={`text-base ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                  Can push too hard when stressed
                </p>
              </div>
            </div>

            {/* In love */}
            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                In love
              </h2>
              <div className="space-y-2">
                <p className={`text-base ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                  Shows love through effort, planning, and taking the lead
                </p>
                <p className={`text-base ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                  Needs a partner who respects independence and vision
                </p>
              </div>
            </div>

            {/* Helps most */}
            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Helps most
              </h2>
              <p className={`text-base ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Flexibility, shared goals, room to move and progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

