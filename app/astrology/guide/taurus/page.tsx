"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function TaurusPage() {
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

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Compatibility with Other Signs
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Aries — Semi-Compatible (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Drive meets stability
                  </p>
                  <p>
                    Taurus moves with steadiness and intention, while Aries charges forward with speed and boldness. Aries brings spark and momentum to Taurus' grounded nature; Taurus adds calm, stability, and rhythm. Together they create a blend of movement and reliability. The dynamic feels solid, warm, and quietly energising.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Taurus — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Calm and steady
                  </p>
                  <p>
                    Two Taurus partners form a calm, sensual connection built on loyalty, comfort, and shared values. Both bring patience, warmth, and a preference for consistency. The pairing deepens gradually, creating a strong sense of emotional security. The energy feels soft, steady, and deeply anchored.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Gemini — Mismatch (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Ground and air
                  </p>
                  <p>
                    Taurus seeks constancy while Gemini thrives on variety, creating a contrast of stability and motion. Gemini brings curiosity and flexibility; Taurus contributes grounding and presence. Their different tempos shape a dynamic filled with subtle contrast. The connection feels measured, thoughtful, and gently balanced.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Cancer — Compatible (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cozy and caring
                  </p>
                  <p>
                    A tender and nurturing pairing where Taurus provides reliability and Cancer offers emotional depth. Both value safety, comfort, and small rituals of care. Cancer softens Taurus' world; Taurus steadies Cancer's emotional landscape. The bond feels warm, protective, and quietly intimate.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Leo — Mismatch (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fixed tastes
                  </p>
                  <p>
                    Taurus moves with patience and consistency, while Leo radiates expression and boldness. Leo adds vitality and colour to Taurus' calm approach; Taurus provides grounding to Leo's flair. Their strong personalities create a notable contrast. The connection feels vivid, steady, and full of presence.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Virgo — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Practical and grounded
                  </p>
                  <p>
                    A practical, dependable match defined by shared values and steady emotional pacing. Virgo brings refinement and clarity; Taurus offers warmth and constancy. Both appreciate small routines and reliable gestures of care. The energy feels stable, sincere, and quietly harmonious.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Libra — Mismatch (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tasteful but indecisive
                  </p>
                  <p>
                    Both admire beauty and comfort, though they approach it from different angles. Libra brings elegance, charm, and social ease; Taurus adds grounding, warmth, and simplicity. Their interaction blends movement with stillness in a balanced, measured way. The connection feels gentle, refined, and subtly contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Scorpio — Opposites (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Deep and intense
                  </p>
                  <p>
                    A magnetic polarity where Taurus offers sensual stability and Scorpio brings emotional intensity. Their contrast creates depth, presence, and strong mutual fascination. Scorpio adds transformative depth; Taurus adds grounding and endurance. The dynamic feels powerful, intimate, and richly layered.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Sagittarius — Mismatch (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Comfort vs. freedom
                  </p>
                  <p>
                    Taurus seeks predictability while Sagittarius seeks freedom and exploration. Sagittarius brings enthusiasm and fresh perspective; Taurus contributes solidity and emotional steadiness. Together they blend adventure with calm in an unexpected way. The energy feels bright, grounded, and subtly expansive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Capricorn — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Long-game builders
                  </p>
                  <p>
                    A long-term oriented pairing rooted in shared values, loyalty, and practicality. Capricorn adds discipline and ambition; Taurus brings patience and consistent emotional presence. Together they create a solid, goal-focused rhythm. The connection feels stable, enduring, and deeply reliable.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Aquarius — Mismatch (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Solid vs. disruptive
                  </p>
                  <p>
                    Taurus approaches life through the tangible, while Aquarius navigates through ideas and innovation. Aquarius widens Taurus' horizons; Taurus offers grounding and emotional consistency. Their contrasting styles create a reflective, steady-paced dynamic. The bond feels thoughtful, spacious, and distinctly balanced.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Pisces — Compatible (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft and supportive
                  </p>
                  <p>
                    A gentle, intuitive pairing shaped by emotional softness and shared serenity. Pisces brings imagination and empathy; Taurus offers grounding and warmth. Their energies blend smoothly, creating a calm, heartfelt tone. The connection feels compassionate, steady, and quietly resonant.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Taurus" />
          </div>
        </div>
      </div>
    </div>
  )
}

