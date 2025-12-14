"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function CancerPage() {
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
              <span className="text-4xl">♋</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Cancer
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              {sunSignSystem === 'sidereal' ? 'July 17 – August 16' : 'June 21 – July 22'}
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Water | Modality: Cardinal | Ruler: Moon
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Cancer is intuitive, protective, and emotionally deep. Ruled by the Moon, their moods ebb and flow like tides. They are the caretakers of the zodiac, guided by empathy and memory. Their intuition is strong; they sense what others feel before it's said.
                </p>
                <p>
                  Though gentle, they possess formidable inner strength. Cancer people crave security, family, and belonging. They dislike coldness or detachment and often shield vulnerability with humour or retreat. At their best, they are nurturing and loyal; at their worst, defensive or moody when unappreciated.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Cancer seeks emotional safety above all. Love for them means care, consistency, and trust. They remember every kindness — and every hurt. They need partners who are patient and who validate feelings rather than dismiss them. Acts of care (home-cooked meals, thoughtful messages) mean more than grand gestures.
                </p>
                <p>
                  Once safe, Cancer loves deeply and for the long haul. Their relationships thrive when both partners feel secure enough to share their softer sides. Their challenge: learning not to take every mood personally and to express needs directly.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  They flourish in environments that value empathy and human connection: counselling, teaching, healthcare, hospitality, and real estate. They excel in nurturing roles and often make workplaces feel like home.
                </p>
                <p>
                  Cancer's emotional intelligence makes them powerful leaders — intuitive yet protective. They build teams that feel like families and measure success not only in profits but in people's wellbeing.
                </p>
              </div>
            </div>

            <CompatibilitySection currentSign="cancer" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Cancer" />
          </div>
        </div>
      </div>
    </div>
  )
}
