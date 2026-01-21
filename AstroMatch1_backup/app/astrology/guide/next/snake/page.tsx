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

export default function SnakePage() {
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
              <span className="text-4xl">🐍</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Snake
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              Year of Birth examples: 1965, 1977, 1989, 2001, 2013, 2025
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Yin Fire | Trine: Strategists (Ox, Snake, Rooster)
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Core Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Snakes are wise, elegant, and intuitive. They symbolize intelligence and mystery. Snakes prefer depth to noise — they think before acting and often see the motives behind others' words. Their composure hides an intense inner life and a powerful intuition. They are strategic and persuasive, often achieving success quietly. They value privacy and refinement, gravitating toward quality over quantity. Their shadow side is suspicion; they can become secretive or jealous if trust is broken.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  In love, Snakes are devoted, sensual, and cautious. They fall deeply but slowly, taking time to trust. They value loyalty and emotional intelligence. When secure, they're passionate and faithful, offering emotional depth and sophistication. However, if they sense betrayal, they can withdraw completely. Compatible signs include Ox and Rooster, who appreciate their refinement and focus. Their lesson is openness — to share feelings rather than protect them with silence.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Life Path
              </h2>
              <div className="space-y-3">
                <p>
                  Snakes excel in strategy-driven and intellectually demanding fields: research, psychology, finance, law, science, or art. They're excellent analysts and negotiators. They prefer independence and dislike micromanagement. They succeed when they trust their instincts and avoid over-caution. As leaders, they are calm and insightful. When balanced, Snakes embody wisdom, serenity, and persuasive power.
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
                    Snake × Rat — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Watcher and mover
                  </p>
                  <p>
                    Snake's private, observant nature meets Rat's quick, adaptable style. Both are strategic but express it differently. The connection feels subtle and calculating, working best when trust is strong and neither plays too many hidden games.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Ox — Same Trine (San He 三合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Quiet power
                  </p>
                  <p>
                    Snake and Ox share the San He (三合) Strategists trine, rooted in patience and depth. Ox offers endurance and solidity; Snake adds insight and intuition. The relationship feels calm, deliberate, and well suited to long-term plans.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Tiger — Six Harms (Liu Hai 六害)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Stillness vs. surge
                  </p>
                  <p>
                    Snake and Tiger form a Liu Hai (六害) pattern, where cool observation meets sudden action. Tiger pushes forward; Snake withdraws and analyses. Tension builds when Snake feels rushed and Tiger feels blocked, making this a challenging but revealing match.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Rabbit — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Depth and gentleness
                  </p>
                  <p>
                    Snake's intensity meets Rabbit's softness in a quiet, emotionally nuanced bond. Rabbit offers tact and kindness; Snake offers depth and insight. The connection can feel safe and intimate when communication stays honest and gentle.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Dragon — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Shadow and show
                  </p>
                  <p>
                    Snake moves in the background; Dragon moves in the spotlight. Dragon brings expressive confidence; Snake brings subtle strategy. The relationship feels layered and intriguing, working best when they respect each other's very different ways of holding power.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Snake — Same Sign (Self-Punishment Xing 相刑)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Double depth
                  </p>
                  <p>
                    Two Snakes create a private, intense, and psychologically rich bond. As a self-punishment Xing (相刑) match, suspicion and over-analysis can undermine trust if emotions are not voiced. The connection is magnetic and transformative, but needs transparency to stay healthy.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Horse — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Strategy and motion
                  </p>
                  <p>
                    Snake prefers careful timing; Horse wants immediate movement. Snake may see Horse as impulsive; Horse may see Snake as evasive. The bond has potential when both respect the other's rhythm and co-create a shared pace.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Goat — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft and enigmatic
                  </p>
                  <p>
                    Snake's quiet intensity meets Goat's sensitivity and artistry. Goat offers warmth and emotional nuance; Snake adds mystery and depth. The connection feels gentle but complex, thriving when neither assumes or projects too much.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Monkey — Secret Friend (Liu He 六合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Smart conspirators
                  </p>
                  <p>
                    Snake and Monkey share a Liu He (六合) "secret friend" bond, blending cleverness with strategy. Monkey brings play and improvisation; Snake brings insight and long-term thinking. The relationship feels mentally alive, mischievous, and subtly powerful.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Rooster — Same Trine (San He 三合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Focused and precise
                  </p>
                  <p>
                    Snake and Rooster share the San He (三合) Strategists trine, oriented toward order and analysis. Rooster contributes clarity and organisation; Snake contributes depth and intuition. The connection feels purposeful, discerning, and detail-aware.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Dog — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Principle and secrecy
                  </p>
                  <p>
                    Dog values open loyalty; Snake values privacy and nuance. Dog may worry about what's unspoken; Snake may feel judged by Dog's strong ethics. The relationship works when they build explicit trust and allow for differences in emotional style.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Pig — Clash Pair (Liu Chong 六冲)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Hidden vs. open
                  </p>
                  <p>
                    Snake and Pig form a Liu Chong (六冲) clash pair, where private intensity meets open-hearted warmth. Pig is generous and straightforward; Snake is guarded and complex. The bond can feel fated and revealing, but rarely simple, pushing both to grow emotionally.
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
                      {getCompatibilityTable("Snake").map((row, index) => (
                        <tr 
                          key={index}
                          className={`border-t ${theme === "light" ? "border-gray-200" : "border-indigo-500/20"} ${index % 2 === 0 ? (theme === "light" ? "bg-white" : "bg-slate-800/40") : (theme === "light" ? "bg-gray-50" : "bg-slate-900/30")}`}
                        >
                          <td className={`px-4 py-3 text-sm font-medium`} style={{ color: row.color }}>
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

