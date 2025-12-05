"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabHeader from "@/components/AstroLabHeader"

export default function TaurusPage() {
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
          onMenuClick={() => router.push('/astrology')} 
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
                    Spark on soil
                  </p>
                  <p>
                    Aries shakes Taurus out of ruts; Taurus steadies Aries when life gets chaotic. The tension is around speed: Aries wants change now, Taurus wants time. The match is sensual and strong when they treat their different pace as complementary, not wrong.
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
                    Two Taureans build a stable, comfort-focused life with strong loyalty and physical affection. The risk is stubborn stand-offs and getting fixed in routines. This pairing thrives when they keep some freshness and don't let comfort become stagnation.
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
                    Taurus seeks calm, tangible pleasures; Gemini seeks variety and mental stimulation. Gemini can lighten Taurus' world and bring new ideas; Taurus can turn some of Gemini's talk into reality. It works if Taurus accepts change and Gemini respects Taurus' need to slow down.
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
                    Both value safety, loyalty, and emotional security. Cancer contributes nurturing and sensitivity; Taurus offers patience, reliability, and practical support. The connection tends to feel warm and protective, though they must avoid holding onto old hurts.
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
                    Taurus wants peace and stability; Leo wants attention and creative expression. Loyalty is a shared strength, but lifestyle clashes can be big: spending, social life, and ego. This pairing can work, yet it rarely feels low-maintenance.
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
                    Taurus and Virgo share realism, persistence, and a preference for tangible results. Taurus brings patience, sensuality, and endurance; Virgo brings refinement, problem-solving, and careful thought. The relationship feels steady and competent, though Virgo's critique and Taurus' resistance to change need soft handling.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taurus × Libra — Semi-Compatible (Earth + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Taste and tempo
                  </p>
                  <p>
                    Both are Venus-ruled and appreciate beauty, comfort, and good atmosphere. Taurus leans toward physical ease and staying put; Libra toward social flow and aesthetic balance. Their bond can be charming and visually appealing, but decision-making and pace often become sticking points.
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
                    This opposite pair often comes with strong attraction. Taurus is open about material wants; Scorpio is private about deeper emotional needs. The connection can feel fated and binding, but also heavy, pushing both into intense lessons around control, loyalty, and letting go.
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
                    Taurus craves security and familiar comforts; Sagittarius wants exploration, growth, and room to roam. Each can feel the other is trying to change their basic nature. This pairing only works when both genuinely respect those differences instead of negotiating them away.
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
                    Capricorn shares Taurus' practicality but adds ambition and strategic focus. Taurus provides patience, sensual grounding, and loyalty; Capricorn provides direction and long-term structure. This can be a durable, productive match, as long as they remember joy isn't a luxury.
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
                    Taurus leans toward what's tried-and-true; Aquarius toward what's new and unconventional. Aquarius can open Taurus' world; Taurus can anchor Aquarius' ideas. The dynamic can be rich but tense, with ongoing negotiations between comfort and change.
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
                    Pisces brings imagination, empathy, and emotional tone; Taurus brings stability, patience, and practical support. Taurus can help Pisces' dreams take form, while Pisces softens Taurus' edges and keeps life from becoming too rigid. The match usually feels gentle and quietly secure.
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

