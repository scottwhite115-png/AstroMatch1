"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabHeader from "@/components/AstroLabHeader"

export default function CapricornPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24`}
    >
      <div className="relative z-10">
        <AstroLabHeader 
          theme={theme} 
          setTheme={setTheme} 
          onMenuClick={() => router.push("/astrology")} 
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

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Compatibility with Other Signs
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Aries — Mismatch (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Plan vs. push
                  </p>
                  <p>
                    Capricorn prefers strategy and delayed gratification; Aries prefers action and fast results. Each can see the other as naïve or restrictive. They're strong as a team on shared goals, but romance can feel like constant negotiation.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Taurus — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Slow build
                  </p>
                  <p>
                    Both signs value stability, loyalty, and tangible progress. Taurus offers patience and pleasure; Capricorn offers ambition and structure. The relationship can be solid and enduring, though they should guard against becoming too rigid or work-obsessed.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Gemini — Mismatch (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Results vs. options
                  </p>
                  <p>
                    Capricorn measures by outcomes; Gemini by experiences and connections. Capricorn may find Gemini scattered; Gemini may find Capricorn heavy. Respect can exist, but everyday rhythm and priorities often clash.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Cancer — Opposites (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Roof and roots
                  </p>
                  <p>
                    Capricorn and Cancer mirror themes of work and home, public and private. Capricorn focuses on responsibility and achievement; Cancer on care and emotional safety. This can be a strong, interdependent bond if they don't use those differences as weapons.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Leo — Semi-Compatible (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Status and stage
                  </p>
                  <p>
                    Leo wants recognition and heart connection; Capricorn wants respect and tangible success. Together they can be a visible, effective pair. Tension appears when Capricorn dismisses Leo's emotional needs or Leo sees Capricorn as joyless.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Virgo — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Competent duo
                  </p>
                  <p>
                    Capricorn and Virgo both appreciate reliability and effort. Virgo handles details; Capricorn handles long-term direction. The relationship is capable and steady, but they must consciously cultivate lightness and intimacy, not just shared tasks.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Libra — Semi-Compatible (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Structure and style
                  </p>
                  <p>
                    Libra brings charm, diplomacy, and a sense of aesthetics; Capricorn brings authority and organisation. They can look like a power couple, but privately have to work hard on emotional honesty and vulnerability.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Scorpio — Compatible (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Serious and deep
                  </p>
                  <p>
                    Both signs are cautious about trust and serious about commitment. Scorpio offers emotional intensity; Capricorn offers stability and follow-through. The bond can feel powerful and purposeful, though they should make room for joy.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Sagittarius — Semi-Compatible (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fence and field
                  </p>
                  <p>
                    Sagittarius wants wide open space; Capricorn wants a fenced, managed field. Sagittarius pushes for exploration; Capricorn for consolidation. They can balance each other if they see it as teamwork instead of tug-of-war.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Capricorn — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Double duty
                  </p>
                  <p>
                    Two Capricorns create a highly responsible, goal-focused partnership. They respect each other's work ethic and resilience, but tenderness can fall to the bottom of the list. The relationship is strongest when they deliberately prioritise affection and rest.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Aquarius — Semi-Compatible (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Old rule, new rule
                  </p>
                  <p>
                    Capricorn embodies tradition and hierarchy; Aquarius challenges systems and norms. Together they can reform or reinforce structures, depending on their dynamic. Personally, this pairing is interesting but can feel emotionally cool unless both open up.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Pisces — Compatible (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Form and feeling
                  </p>
                  <p>
                    Pisces brings compassion, creativity, and emotional nuance; Capricorn brings containment, stability, and realism. Capricorn helps give Pisces' dreams shape; Pisces reminds Capricorn there's more to life than achievement. The match can be quietly powerful and supportive.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Capricorn" />
          </div>
        </div>
      </div>
    </div>
  )
}

