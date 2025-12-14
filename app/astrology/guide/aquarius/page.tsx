"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"

export default function AquariusPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const sunSignSystem = useSunSignSystem()

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24`}
    >
      <div className="relative z-10">
        <AstroLabNavigationHeader theme={theme} setTheme={setTheme} />

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
              <span className="text-4xl">♒</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Aquarius
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              {sunSignSystem === 'sidereal' ? 'February 13 – March 14' : 'January 20 – February 18'}
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Air | Modality: Fixed | Ruler: Uranus (traditional ruler Saturn)
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Aquarius is the visionary and reformer. Independent, curious, and original, they see patterns others miss. They value progress, freedom, and humanity more than tradition.
                </p>
                <p>
                  As a fixed Air sign, Aquarius combines intellect with persistence. They thrive in communities, innovation, and causes that improve society. They can seem detached but are deeply idealistic. Their friendships are broad; their inner circle is selective.
                </p>
                <p>
                  At best, they're innovators and humanitarians; at worst, stubborn contrarians or emotionally aloof thinkers.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  They love with their mind first. Friendship is their entry point to romance. They need space, equality, and shared ideals. Possessiveness repels them, but mutual respect and curiosity win their heart.
                </p>
                <p>
                  Aquarians are loyal when trusted and intellectually engaged. Their challenge is translating ideas into emotions — remembering that love needs warmth as much as understanding.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  They thrive in technology, science, social reform, art, innovation, and any unconventional field. They prefer autonomy and dislike strict hierarchies.
                </p>
                <p>
                  When inspired by a mission, they work tirelessly to create change. They're the architects of progress — connecting people, systems, and ideas to build the future.
                </p>
              </div>
            </div>

            <CompatibilitySection currentSign="aquarius" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Aquarius" />
          </div>
        </div>
      </div>
    </div>
  )
}
