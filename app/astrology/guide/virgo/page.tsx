"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function VirgoPage() {
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
              <span className="text-4xl">♍</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Virgo
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              {sunSignSystem === 'sidereal' ? 'September 17 – October 17' : 'August 23 – September 22'}
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Earth | Modality: Mutable | Ruler: Mercury
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Virgo represents order, refinement, and improvement. Analytical and observant, they see what others miss. Ruled by Mercury, their minds process life through logic and detail. They seek mastery, health, and clarity — but sometimes chase perfection.
                </p>
                <p>
                  Practical yet sensitive, they find satisfaction in being useful and in constant learning. Virgos are rarely loud but often indispensable. Their modesty hides a sharp intellect and a kind heart.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Virgo loves quietly but deeply. They show care through acts of service, small improvements, and reliability. They appreciate sincerity, consistency, and cleanliness in both space and communication.
                </p>
                <p>
                  They can overthink or worry about not being "enough." Partners who appreciate their effort and help them relax emotionally bring out their best. Their growth lies in allowing love to be imperfect — and trusting they're loved as they are.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  They excel in editing, healthcare, research, administration, analytics, and any precision field. They bring structure and sanity to complex systems.
                </p>
                <p>
                  Virgos thrive on routine, skill-building, and meaningful contribution. They make excellent mentors and problem solvers, turning chaos into function through quiet excellence.
                </p>
              </div>
            </div>

            <CompatibilitySection currentSign="virgo" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Virgo" />
          </div>
        </div>
      </div>
    </div>
  )
}
