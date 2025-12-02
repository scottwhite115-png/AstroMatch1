"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function CapricornPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24`}
    >
      <div className="relative z-10">
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AstroLibrary
              </span>
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded-lg transition-colors ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </div>
        </div>

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
                    Capricorn × Aries — Semi-Compatible (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Ambition with friction
                  </p>
                  <p>
                    Capricorn moves with intention and long-term focus, while Aries acts with immediacy and bold instinct. Aries introduces momentum and courage that expand Capricorn's pace; Capricorn provides clarity and stability that refine Aries' direction. Together they blend strategy with action in a dynamic, grounded rhythm. The connection feels steady, purposeful, and quietly energising.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Taurus — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Solid and steady
                  </p>
                  <p>
                    A loyal, consistent pairing rooted in practicality, shared values, and mutual reliability. Taurus brings warmth and patience; Capricorn adds structure, ambition, and long-range perspective. Together they build stability in both emotional and material life. The dynamic feels comforting, strong, and deeply dependable.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Gemini — Mismatch (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Serious vs. playful
                  </p>
                  <p>
                    Gemini explores ideas freely, while Capricorn prefers clear plans and grounded structure. Capricorn offers steadiness and follow-through; Gemini introduces flexibility, curiosity, and fresh perspective. Their contrast creates a thoughtful mix of movement and form. The connection feels airy, structured, and quietly contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Cancer — Opposites (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Opposites that build
                  </p>
                  <p>
                    Capricorn leads with discipline and practicality; Cancer leads with feeling and intuition — forming a classic balancing polarity. Cancer adds warmth and emotional depth to Capricorn's steady presence; Capricorn brings protection and reliability to Cancer's softness. Their interaction blends structure with tenderness in a stabilising way. The dynamic feels deeply anchoring, nurturing, and quietly resilient.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Leo — Semi-Compatible (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pride and strategy
                  </p>
                  <p>
                    Leo expresses with warmth, creativity, and boldness; Capricorn acts with focus, discipline, and long-term vision. Their interplay combines passion with purpose, creating a strong sense of potential. Capricorn grounds the atmosphere; Leo brightens it. The connection feels ambitious, warm, and steadily expressive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Virgo — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Quietly powerful
                  </p>
                  <p>
                    Capricorn and Virgo form a thoughtful, diligent match shaped by shared values and quiet devotion. Virgo contributes clarity, detail, and considerate care; Capricorn adds leadership, stability, and long-term commitment. Their teamwork is strong and naturally aligned. The dynamic feels grounded, intentional, and deeply reliable.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Libra — Mismatch (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Style and structure
                  </p>
                  <p>
                    Capricorn focuses on goals and structure, while Libra prioritises connection and balance. Libra brings grace, perspective, and social ease; Capricorn offers steadiness, protection, and clear direction. Together they mix softness with structure in a careful blend. The connection feels refined, measured, and gently contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Scorpio — Compatible (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Focused and formidable
                  </p>
                  <p>
                    A powerful, loyal pairing defined by depth, strength, and shared ambition. Scorpio offers emotional insight and intensity; Capricorn brings grounding, strategy, and persistence. Their bond is steady, protective, and uncompromising in loyalty. The dynamic feels profound, resilient, and purposefully aligned.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Sagittarius — Semi-Compatible (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Risk and responsibility
                  </p>
                  <p>
                    Sagittarius contributes movement, optimism, and a broader horizon; Capricorn provides stability, intention, and practical grounding. Together they merge expansion with structure in a balanced, forward-focused way. Each sign brings what the other lacks in a complementary contrast. The connection feels steady, open, and quietly dynamic.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Capricorn — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Ambitious and serious
                  </p>
                  <p>
                    Two Capricorns create a disciplined, determined partnership built on shared values and unwavering reliability. You understand each other's pace, ambition, and boundaries deeply. Emotional expression unfolds slowly but with sincerity. The dynamic feels solid, responsible, and quietly powerful.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Aquarius — Semi-Compatible (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Structure and innovation
                  </p>
                  <p>
                    Capricorn works through structure and consistency; Aquarius works through innovation and conceptual clarity. Aquarius opens Capricorn's world with originality; Capricorn grounds Aquarius with practicality and focus. Their blend creates a forward-thinking yet stable partnership. The connection feels modern, steady, and intellectually engaging.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Capricorn × Pisces — Compatible (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dream and discipline
                  </p>
                  <p>
                    Pisces brings imagination, empathy, and emotional richness; Capricorn offers grounding, protection, and long-term steadiness. Together they form a gentle, supportive dynamic where feeling meets structure. Pisces softens Capricorn's reserve; Capricorn strengthens Pisces' sense of security. The connection feels comforting, soulful, and deeply balanced.
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

