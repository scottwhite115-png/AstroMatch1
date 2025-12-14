"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function LeoPage() {
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
              <span className="text-4xl">♌</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Leo
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              {sunSignSystem === 'sidereal' ? 'August 17 – September 16' : 'July 23 – August 22'}
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Fire | Modality: Fixed | Ruler: Sun
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Leo shines. Ruled by the Sun, this sign radiates vitality, charisma, and purpose. Fixed Fire gives Leo courage, pride, and loyalty. They thrive when expressing creativity and being appreciated for who they are. Their warmth draws people in; their confidence inspires.
                </p>
                <p>
                  At best, they are generous and protective leaders. At worst, they can drift into ego or stubbornness if they feel ignored. Recognition matters to them not from vanity but from a need to know their efforts touch others.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Leo loves passionately and wholeheartedly. They value devotion, affection, and being seen. They need admiration, yes, but they give it in return — uplifting their partner's self-worth. They are fiercely loyal and protective once they commit.
                </p>
                <p>
                  Public support means a lot; they dislike being humiliated or dismissed. The best relationships for Leo involve laughter, pride, and shared growth. Their lesson is to balance leading with listening and to love without needing control.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Leos excel in leadership, entertainment, art, fashion, branding, education, or anything visible. They want to make a mark and see their creative essence shine through their work.
                </p>
                <p>
                  They perform best when appreciated, not micromanaged. A Leo who feels valued can light up an entire organisation, turning passion into productivity and optimism into influence.
                </p>
              </div>
            </div>

            <CompatibilitySection currentSign="leo" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Leo" />
          </div>
        </div>
      </div>
    </div>
  )
}
