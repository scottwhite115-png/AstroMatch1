"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"

export default function TaurusPage() {
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
              <span className="text-4xl">♉</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Taurus
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              April 20 – May 20
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Earth | Modality: Fixed | Ruler: Venus
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Taurus embodies patience, practicality, and appreciation for life's pleasures. As a fixed Earth sign ruled by Venus, it blends determination with sensuality. Taureans are grounded, loyal, and quietly ambitious. They value stability and comfort — from secure finances to beautiful surroundings — and prefer to build rather than rush. Change unnerves them unless it's proven worthwhile.
                </p>
                <p>
                  At their best, they exude calm strength, reliability, and endurance. They dislike chaos, impulsiveness, or empty talk. Taurus prefers tangible progress and rewards that can be seen or touched. Though sometimes labeled stubborn, their persistence is what transforms dreams into something real.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  In love, Taurus is affectionate, devoted, and sensual. They crave consistency, touch, and emotional safety. They take time to trust but once committed, they're steadfast. They dislike emotional volatility or people who test loyalty. Their love language is often practical — cooking, providing, or creating comfort.
                </p>
                <p>
                  They're romantic but realistic, preferring to show love through presence rather than drama. Stability, routine, and shared values matter deeply. The challenge for Taurus is flexibility — learning that love evolves and that growth doesn't always mean instability. With patience and trust, they form some of the zodiac's most lasting bonds.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Taurus thrives in careers requiring persistence and craftsmanship. They excel in finance, design, real estate, agriculture, beauty, music, and hospitality — anywhere tangible results meet comfort and quality. They prefer predictable schedules and stable income.
                </p>
                <p>
                  Taureans often accumulate wealth slowly but surely through consistency and common sense. They resist risky ventures unless the reward is solid. Their patience and endurance make them valuable long-term assets in any workplace.
                </p>
              </div>
            </div>

            <CompatibilitySection currentSign="taurus" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Taurus" />
          </div>
        </div>
      </div>
    </div>
  )
}
