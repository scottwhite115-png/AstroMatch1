"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function CapricornPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

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
              <span className="text-4xl">♑</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Capricorn
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              December 22 – January 19
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Earth | Modality: Cardinal | Ruler: Saturn
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Capricorn is the builder of the zodiac — ambitious, patient, and pragmatic. Ruled by Saturn, they respect structure and long-term results. They carry an air of maturity and gravitas even when young.
                </p>
                <p>
                  They thrive on responsibility and progress through endurance rather than luck. Their humour is dry but sharp, and their loyalty runs deep. They can appear reserved but feel deeply; their emotions are often channelled into duty and protection.
                </p>
                <p>
                  Capricorn's gift is mastery. They climb mountains slowly but surely, defining success by effort and legacy. Their shadow lies in overworking or isolating emotionally to stay in control.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Capricorn loves through reliability and action. They value loyalty, patience, and mutual respect. They're attracted to competence and dislike frivolity or drama.
                </p>
                <p>
                  They might take time to open up emotionally, preferring to show affection through support and commitment. Once trust is earned, they're unwaveringly loyal. Their lesson in love is vulnerability — learning that strength includes softness.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Capricorns excel in leadership, business, engineering, law, politics, finance, and management. They like systems that reward merit and consistency.
                </p>
                <p>
                  They approach career like an art form: strategic, enduring, and goal-oriented. When they balance ambition with empathy, they become leaders who inspire through integrity and example.
                </p>
              </div>
            </div>

            <CompatibilitySection currentSign="capricorn" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Capricorn" />
          </div>
        </div>
      </div>
    </div>
  )
}
