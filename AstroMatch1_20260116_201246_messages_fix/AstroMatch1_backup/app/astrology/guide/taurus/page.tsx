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
                    Spark meets stillness
                  </p>
                  <p>
                    Aries moves fast and wants immediate action; Taurus prefers to settle, feel safe, and decide slowly. Aries can inspire Taurus to take more risks, while Taurus grounds Aries and brings consistency. The match can be solid and sensual, but only if they respect each other's very different tempo.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Taurus — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Slow and sure
                  </p>
                  <p>
                    Two Taureans create a steady, loyal, and comfort-loving bond. There's a strong focus on security, sensuality, and building a life that feels good in the body. The risk is stubborn stand-offs and getting stuck in routines; this pairing thrives when they keep curiosity and humour alive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Gemini — Semi-Compatible (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Body vs. buzz
                  </p>
                  <p>
                    Taurus wants calm, tangible experiences; Gemini wants variety, ideas, and change. Gemini can bring lightness, humour, and new perspectives to Taurus' world, while Taurus offers grounding and reliability. The connection can work, but it needs patience with Gemini's restlessness and Taurus' dislike of sudden change.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Cancer — Compatible (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Home-builders
                  </p>
                  <p>
                    Taurus and Cancer both care about safety, loyalty, and emotional security. Cancer brings sensitivity, intuition, and nurturing; Taurus brings patience, practicality, and physical comfort. The relationship tends to feel warm and protective, though they'll need to watch for shared stubbornness around old hurts.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Leo — Mismatch (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fixed pride
                  </p>
                  <p>
                    Taurus and Leo are both strong-willed and fixed in their preferences. Taurus wants peace, reliability, and private luxury; Leo wants recognition, drama, and creative expression. There can be real warmth and loyalty, but clashes around attention, spending, and lifestyle are likely unless they consciously meet in the middle.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Virgo — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Practical pair
                  </p>
                  <p>
                    Taurus and Virgo share a grounded, realistic approach to life. Taurus offers patience, sensuality, and endurance; Virgo offers problem-solving, refinement, and attentive care. Together they can build something highly functional and stable, as long as Virgo's criticism and Taurus' resistance to change don't harden into stalemates.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Libra — Semi-Compatible (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taste vs. tempo
                  </p>
                  <p>
                    Both signs are ruled by Venus and care about beauty, comfort, and relationships, but in different ways. Taurus seeks physical ease and stability; Libra seeks harmony, aesthetics, and social flow. The bond can be charming and visually pleasing, yet frictions appear when Libra wants movement and Taurus just wants to settle.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Scorpio — Opposites (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Magnet and stalemate
                  </p>
                  <p>
                    Taurus and Scorpio sit opposite each other in the zodiac, often creating strong attraction and equally strong resistance. Taurus is open about what they want materially; Scorpio is private about emotional and psychological needs. This match can feel deep and binding, but it pushes both into intense lessons around trust, control, and letting go.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Sagittarius — Mismatch (Earth + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Anchor vs. arrow
                  </p>
                  <p>
                    Taurus wants predictability and a familiar base; Sagittarius wants freedom, exploration, and room to roam. Sagittarius can feel boxed in; Taurus can feel unsettled or unimportant. The connection works only if they genuinely respect each other's core needs instead of trying to convert the other.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Capricorn — Same Element (Earth + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Builders of empires
                  </p>
                  <p>
                    Taurus and Capricorn are both practical, long-term focused, and capable of real commitment. Taurus brings patience, pleasure, and a steady pace; Capricorn brings ambition, structure, and strategic thinking. The relationship can be highly durable and productive, but they'll need intentional softness so life doesn't become all work and responsibility.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Aquarius — Semi-Compatible (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tradition vs. experiment
                  </p>
                  <p>
                    Taurus prefers what's tried-and-true; Aquarius is drawn to the unusual and future-focused. Aquarius introduces new ideas and ways of living; Taurus provides tangible stability and follow-through. The dynamic can feel like a tug-of-war between comfort and change, but it's surprisingly rich if both stay curious instead of defensive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Pisces — Compatible (Earth + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dreams with roots
                  </p>
                  <p>
                    Pisces brings imagination, empathy, and emotional nuance; Taurus brings patience, grounding, and practical support. Taurus can help Pisces' dreams take form, while Pisces softens Taurus' edges and keeps life from becoming too rigid. The bond usually feels gentle, romantic, and quietly secure when both handle money and boundaries with care.
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

