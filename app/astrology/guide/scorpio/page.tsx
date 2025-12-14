"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function ScorpioPage() {
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
              <span className="text-4xl">♏</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Scorpio
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              {sunSignSystem === 'sidereal' ? 'November 17 – December 15' : 'October 23 – November 21'}
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Water | Modality: Fixed | Ruler: Pluto (traditional ruler Mars)
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Scorpio is the sign of transformation — intense, private, and powerful. Fixed Water gives emotional depth, endurance, and insight. They see beyond appearances, often sensing what others hide. They are not afraid of the dark or the truth; in fact, they're drawn to both.
                </p>
                <p>
                  Scorpios crave authenticity and detest superficiality. They can be reserved, but their feelings run deep. At best, they are healers, protectors, and strategists; at worst, they can slip into control or suspicion. Trust is sacred to them — once earned, it's forever, but betrayal cuts deep.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Scorpio loves with totality. They want emotional and physical intimacy that feels transformative. They expect honesty and loyalty and give it in return.
                </p>
                <p>
                  Their love is magnetic and protective, but they need partners who can handle intensity and privacy. They dislike manipulation yet can unintentionally test commitment. When they feel safe, they open up to profound passion and devotion.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Scorpio thrives in fields demanding focus, strategy, or emotional insight: psychology, investigation, finance, surgery, crisis management, research, or any transformative work. They prefer depth over breadth and impact over noise.
                </p>
                <p>
                  Their power lies in persistence and precision. When channelled positively, Scorpio becomes a catalyst for growth — guiding people or systems through renewal and rebirth.
                </p>
              </div>
            </div>

            <CompatibilitySection currentSign="scorpio" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Scorpio" />
          </div>
        </div>
      </div>
    </div>
  )
}
