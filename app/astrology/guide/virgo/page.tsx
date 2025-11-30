"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function VirgoPage() {
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
                AstroMatch
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
              <span className="text-4xl">♍</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Virgo
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              August 23 – September 22
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

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Compatibility with Other Signs
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Aries — Semi-Compatible (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Action and analysis
                  </p>
                  <p>
                    Virgo brings structure and thoughtful precision, while Aries adds momentum and bold initiative. Aries widens Virgo's world with spontaneity; Virgo refines Aries' direction with clarity and detail. Together they blend form with movement in a balanced, practical rhythm. The dynamic feels steady, focused, and quietly energised.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Taurus — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Practical and grounded
                  </p>
                  <p>
                    A loyal, grounded pairing marked by patience, reliability, and shared values. Taurus offers warmth and steadiness; Virgo contributes care, clarity, and intention. Their rhythm is calm and deliberate, building trust through consistent gestures. The connection feels stable, sincere, and deeply dependable.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Gemini — Semi-Compatible (Both Mercury-ruled)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Thinking in detail
                  </p>
                  <p>
                    Both are mentally active and curious, but they move differently: Gemini explores widely while Virgo refines deeply. Gemini brings movement and fresh perspective; Virgo adds structure and thoughtful insight. Their conversations are lively, analytical, and varied. The energy feels clever, flexible, and subtly intricate.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Cancer — Compatible (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Caring in practice
                  </p>
                  <p>
                    A caring, steady match shaped by emotional awareness and quiet devotion. Cancer offers intuition and warmth; Virgo offers reliability and thoughtful support. Together they form a rhythm grounded in trust and shared understanding. The dynamic feels nurturing, gentle, and deeply loyal.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Leo — Semi-Compatible (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Show and service
                  </p>
                  <p>
                    Virgo prefers subtle expression; Leo shines with warmth and boldness. Leo adds colour and confidence to Virgo's understated approach; Virgo brings grounding and thoughtful balance. Their interplay mixes practicality with expressive fire. The connection feels steady, warm, and mutually illuminating.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Virgo — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Refined and particular
                  </p>
                  <p>
                    Two Virgos form a considerate, responsible partnership built on shared values and quiet stability. Both bring care, diligence, and a desire to improve their shared life. Emotional expression unfolds gradually through consistent presence. The energy feels organised, sincere, and deeply attentive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Libra — Semi-Compatible (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Considerate but indecisive
                  </p>
                  <p>
                    Virgo leads with structure and discernment; Libra leads with balance and aesthetic refinement. Libra softens Virgo's edges with harmony and perspective; Virgo grounds Libra with clarity and practicality. Their interaction blends movement with steadiness in a gentle way. The dynamic feels graceful, measured, and lightly sophisticated.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Scorpio — Compatible (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Strategic and serious
                  </p>
                  <p>
                    A deep, purposeful pairing marked by loyalty, emotional insight, and mutual respect. Scorpio brings intensity and truth; Virgo offers steadiness and thoughtful care. Together they create a connection rooted in depth and quiet strength. The energy feels powerful, grounded, and transformative.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Sagittarius — Mismatch (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Detail vs. big picture
                  </p>
                  <p>
                    Virgo seeks order and consistency, while Sagittarius moves with freedom and expansion. Sagittarius brightens Virgo's world with openness; Virgo offers focus and grounded intention. Their contrast creates a dynamic of discovery and recalibration. The connection feels spacious, thoughtful, and gently contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Capricorn — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Quietly powerful
                  </p>
                  <p>
                    A practical, long-term pairing grounded in ambition, reliability, and shared purpose. Capricorn contributes vision and discipline; Virgo adds organisation and supportive detail. Together they manifest goals with steady effort and mutual respect. The dynamic feels strong, purposeful, and highly cohesive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Aquarius — Mismatch (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Systems and ideas
                  </p>
                  <p>
                    Virgo moves through detail and refinement; Aquarius moves through ideas and innovation. Aquarius opens new conceptual paths for Virgo; Virgo helps Aquarius anchor ideas in reality. Their interplay mixes precision with imagination in a structured yet spacious way. The connection feels thoughtful, curious, and intellectually stimulating.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Virgo × Pisces — Opposites (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Opposite healers
                  </p>
                  <p>
                    A compelling polarity where Virgo offers structure and clarity while Pisces offers intuition and emotional depth. Pisces brings imagination and soulful insight; Virgo brings grounding and steady presence. Together they form a subtle balance of logic and feeling. The dynamic feels gentle, reflective, and quietly transformative.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Virgo" />
          </div>
        </div>
      </div>
    </div>
  )
}

