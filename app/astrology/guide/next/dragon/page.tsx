"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { chinesePairBlurbs, cnKey } from "@/lib/chinesePairBlurbs"
import { getChinesePattern } from "@/lib/chinesePatternSystem"
import type { ChineseAnimal } from "@/lib/chinesePairBlurbs"
import { getCompatibilityTable } from "@/lib/chineseCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function DragonPage() {
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
              <span className="text-4xl">🐉</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Dragon
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              Year of Birth examples: 1964, 1976, 1988, 2000, 2012, 2024
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Yang Earth | Trine: Visionaries (Rat, Dragon, Monkey)
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Core Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Dragons are magnetic, confident, and powerful. They symbolize vitality, fortune, and leadership. Charismatic and ambitious, they often rise naturally to positions of influence. Dragons have visionary minds — they dream big and inspire others with optimism. Their energy is bold and creative, but their pride can make them sensitive to criticism. They dislike mediocrity and crave excellence. When self-aware, they are inspiring leaders who elevate others; when unbalanced, they can become domineering or restless.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Dragons are passionate and romantic partners who love with intensity. They seek admiration and respect but also give warmth and protection in return. They're drawn to independent and capable partners who can challenge them without threatening their pride. The best matches include Rat and Monkey (same Trine) and Rooster, who share their ambition. Their challenge is humility — learning to express vulnerability as strength and recognizing that love is collaboration, not control.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Life Path
              </h2>
              <div className="space-y-3">
                <p>
                  Dragons excel in leadership, innovation, and creative industries: entrepreneurship, entertainment, politics, media, and design. They perform best when they have autonomy and a platform for expression. Routine drains them; visionary work excites them. They achieve greatness when they combine passion with discipline. When they lead through inspiration rather than ego, Dragons become transformative figures who change their world.
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
                    Dragon × Rat — Same Trine (San He 三合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Ambitious and bold
                  </p>
                  <p>
                    Dragon and Rat share the San He (三合) visionary trine, creating a dynamic bond full of momentum and clarity. Rat brings strategy and insight; Dragon brings strength and ambition. Together the connection feels energised, purposeful, and naturally aligned. This is one of Dragon's most confident and mutually empowering matches.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dragon × Ox — Break (Po 破)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Weight and flare
                  </p>
                  <p>
                    Dragon's bold movement contrasts with Ox's steady, practical rhythm. Ox prefers measured progress, while Dragon charges forward with instinct and intensity. The pairing holds tension around pacing and priorities but also a quiet respect underneath. The connection feels firm, grounded, and shaped by contrasting styles.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dragon × Tiger — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Big moves
                  </p>
                  <p>
                    Dragon and Tiger share powerful Yang energy expressed through confidence, drive, and action. Tiger brings courage and immediacy; Dragon brings presence and ambition. The dynamic is strong and expressive, with moments of intensity when neither yields. At its best, the connection feels bold, spirited, and vividly alive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dragon × Rabbit — Six Damages / Harm (Liu Hai 六害)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Quiet vs. bold
                  </p>
                  <p>
                    Dragon's direct force meets Rabbit's gentle caution, creating a contrast in expression and emotional pace. Rabbit brings softness and quiet perception; Dragon offers protection and decisive strength. Differences in rhythm and temperament shape the interaction. The connection feels delicate, expressive, and sensitive to imbalance.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dragon × Dragon — Same Sign (Self-Punishment 相刑)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Big presence
                  </p>
                  <p>
                    Two Dragons create a striking, high-energy partnership filled with charisma and ambition. Shared intensity can heighten both synergy and conflict, forming a dynamic that feels powerful yet demanding. The pairing radiates presence and determination. When emotions align, the connection feels magnetic, bold, and unmistakably strong.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dragon × Snake — Secret Friend (Liu He 六合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Charisma and strategy
                  </p>
                  <p>
                    Dragon and Snake form a Liu He (六合) secret-friend bond marked by quiet understanding and strategic depth. Snake brings insight and emotional nuance; Dragon contributes strength and direction. The relationship unfolds with calm intensity and intuitive trust. The bond feels composed, perceptive, and deeply supportive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dragon × Horse — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fire and motion
                  </p>
                  <p>
                    Dragon and Horse both move quickly, valuing freedom, exploration, and forward energy. Horse contributes enthusiasm and movement; Dragon adds vision and momentum. The dynamic is spirited and expressive with a bright, active flow. When aligned, the connection feels adventurous and mutually uplifting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dragon × Goat — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Strong and sensitive
                  </p>
                  <p>
                    Dragon's strong presence contrasts with Goat's gentle emotional tone. Goat brings warmth and empathy; Dragon offers protection and confidence. The pairing depends on pacing and emotional awareness rather than instinctive harmony. The connection feels soft, expressive, and quietly balanced.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dragon × Monkey — Same Trine (San He 三合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Ambitious and inventive
                  </p>
                  <p>
                    Dragon and Monkey share the San He (三合) visionary trine, forming a naturally synergistic and creative bond. Monkey brings cleverness and agility; Dragon brings ambition and drive. The pairing lights up quickly and stays dynamic through shared inspiration. The relationship feels bright, innovative, and mutually energising.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dragon × Rooster — Secret Friend (Liu He 六合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Show and precision
                  </p>
                  <p>
                    Dragon and Rooster create a Liu He (六合) bond built on clarity, loyalty, and purposeful cooperation. Rooster offers precision and steadiness; Dragon brings direction and daring vision. Together they create structure infused with momentum. The connection feels capable, reliable, and naturally aligned toward growth.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dragon × Dog — Clash Pair (Liu Chong 六冲)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pride vs. principle
                  </p>
                  <p>
                    Dragon moves with power and outward ambition; Dog moves with sincerity and cautious depth. Dog brings integrity and perceptiveness, while Dragon brings confidence and momentum. Differences appear strongly in priorities and emotional expression. The connection feels intense, candid, and shaped by contrasting values.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dragon × Pig — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Bold and kind
                  </p>
                  <p>
                    Dragon's bold energy meets Pig's warmth and open-hearted nature, forming a calm yet expressive dynamic. Pig contributes generosity and emotional depth; Dragon offers protection and direction. The relationship grows gently when energies blend in harmony. The connection feels kind, steady, and quietly uplifting.
                  </p>
                </div>
              </div>
              
              {/* Compatibility Table */}
              <div className="mt-8">
                <h3 className={`text-lg font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                  Compatibility Summary
                </h3>
                <div className="overflow-x-auto">
                  <table className={`w-full border-collapse ${theme === "light" ? "bg-white" : "bg-slate-800/40 border border-indigo-500/20 shadow-lg shadow-indigo-950/30"} rounded-lg overflow-hidden`}>
                    <thead>
                      <tr className={theme === "light" ? "bg-gray-100" : "bg-slate-900/50"}>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === "light" ? "text-gray-700" : "text-white"}`}>
                          Pattern
                        </th>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === "light" ? "text-gray-700" : "text-white"}`}>
                          Partner Animal(s)
                        </th>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === "light" ? "text-gray-700" : "text-white"}`}>
                          Strength
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCompatibilityTable("Dragon").map((row, index) => (
                        <tr 
                          key={index}
                          className={`border-t ${theme === "light" ? "border-gray-200" : "border-indigo-500/20"} ${index % 2 === 0 ? (theme === "light" ? "bg-white" : "bg-slate-800/40") : (theme === "light" ? "bg-gray-50" : "bg-slate-900/30")}`}
                        >
                          <td className={`px-4 py-3 text-sm ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                            {row.pattern}
                          </td>
                          <td className={`px-4 py-3 text-sm ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                            {row.partners.join(", ")}
                          </td>
                          <td className={`px-4 py-3 text-sm ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                            {row.strength}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

