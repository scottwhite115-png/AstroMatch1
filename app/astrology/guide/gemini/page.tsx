"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"

export default function GeminiPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const sunSignSystem = useSunSignSystem()

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24`}
    >
      <div className="relative z-10">
        <AstroLabNavigationHeader 
          theme={theme} 
          setTheme={setTheme}
        />

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
              <span className="text-4xl">♊</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Gemini
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              {sunSignSystem === 'sidereal' ? 'June 15 – July 16' : 'May 21 – June 20'}
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Air | Modality: Mutable | Ruler: Mercury
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Gemini is quick, curious, and versatile. Ruled by Mercury, it governs communication, ideas, and adaptability. Geminis crave stimulation — mentally, socially, and creatively. They love words, stories, and exchange. Their gift is perspective: seeing both sides of a situation with wit and flexibility.
                </p>
                <p>
                  They can juggle many interests but risk spreading themselves too thin. Restless by nature, they thrive on change and novelty. Geminis are social chameleons who easily blend into new circles yet rarely reveal their full inner world.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  In love, Gemini needs connection of the mind first. Conversation, humour, and shared curiosity are aphrodisiacs. They enjoy lightness, play, and variety, but avoid clingy or overly intense partners. They express affection through words and clever banter, preferring relationships that feel alive and evolving.
                </p>
                <p>
                  Their challenge lies in staying present during emotional depth. Once they learn that intimacy doesn't mean boredom, Gemini becomes a loyal and endlessly interesting partner.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Gemini excels in communication-driven fields: writing, media, marketing, teaching, public relations, journalism, and technology. They adapt quickly and multitask with ease. They need intellectual freedom and fast-moving environments.
                </p>
                <p>
                  Repetitive routines stifle them. When trusted with autonomy and variety, Geminis innovate constantly and connect people and ideas that others overlook.
                </p>
              </div>
            </div>

            <CompatibilitySection currentSign="gemini" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Gemini" />
          </div>
        </div>
      </div>
    </div>
  )
}
