"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function PiscesPage() {
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
              <span className="text-4xl">♓</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Pisces
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              February 19 – March 20
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Water | Modality: Mutable | Ruler: Neptune (traditional ruler Jupiter)
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Pisces is intuitive, imaginative, and compassionate. As the final sign of the zodiac, they blend the lessons of all others. Empathy is their superpower — they feel what others feel as if it's their own.
                </p>
                <p>
                  They're artists, dreamers, healers, and mystics who live partly in another world. They crave inspiration, kindness, and beauty. Sensitive to environment, they flourish in peaceful surroundings. Their empathy can also overwhelm them, leading to escapism if not grounded.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Pisces loves with tenderness and devotion. They idealize love, seeing it as a spiritual union. They're giving and forgiving, but can attract those who take advantage.
                </p>
                <p>
                  They need a partner who's gentle yet strong enough to anchor them. Emotional honesty, creativity, and safety matter most. When balanced, Pisces offers unconditional love that feels healing.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Pisces excels in artistic, healing, and service roles: music, film, design, psychology, spirituality, charity, or healthcare. They do best where empathy and imagination meet purpose.
                </p>
                <p>
                  They're intuitive leaders who sense undercurrents others miss. Their challenge is grounding dreams into action. When they do, they become the dreamers who make the world softer and more humane.
                </p>
              </div>
            </div>

            <CompatibilitySection currentSign="pisces" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Pisces" />
          </div>
        </div>
      </div>
    </div>
  )
}
