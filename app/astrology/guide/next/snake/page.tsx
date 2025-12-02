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
                    Quiet operators
                  </p>
                  <p>
                    Snake and Rat share quiet intelligence and emotional depth, forming a connection that unfolds gradually but meaningfully. Rat brings strategic clarity; Snake contributes insight and intuition. The pairing feels private, thoughtful, and quietly steady when understood. The energy is subtle and perceptive, with a natural respect for each other's inner world.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Ox — Same Trine (San He 三合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Calm strategists
                  </p>
                  <p>
                    Snake and Ox belong to the San He (三合) strategic trine, creating a bond grounded in trust, patience, and long-range thinking. Ox offers strength and consistency; Snake offers perception and calm understanding. Together the relationship feels steady, intentional, and quietly powerful. This is one of Snake's most harmonious and dependable connections.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Tiger — Six Harms (Liu Hai 六害)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Impulse vs. calculation
                  </p>
                  <p>
                    Snake's introspective style contrasts with Tiger's bold, outward energy. Tiger brings force and immediacy; Snake brings secrecy and subtlety. These differences create emotional friction beneath the surface. The connection feels sharp, reactive, and sensitive to misunderstanding.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Rabbit — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft and strategic
                  </p>
                  <p>
                    Snake and Rabbit share sensitivity expressed in different ways — Rabbit through emotion, Snake through intuition. Rabbit brings warmth and gentleness; Snake contributes depth and quiet reassurance. The pairing is reflective and subtle, growing best through trust. The connection feels soft, composed, and delicately balanced.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Dragon — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Charisma and strategy
                  </p>
                  <p>
                    Snake and Dragon create a bond marked by intuition, strategy, and mutual understanding. Snake brings insight and psychological depth; Dragon adds strength and expressive confidence. While they don't form a classical Liu He pair, their mix of depth and drive can feel quietly powerful when aligned. The connection feels calm, perceptive, and purpose-driven.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Snake — Same Sign (同生肖)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Quiet intensity
                  </p>
                  <p>
                    Two Snakes create a deep, intuitive connection filled with quiet understanding and emotional complexity. Shared sensitivity can create calm unity or silent tension depending on communication. The relationship feels intimate, thoughtful, and almost telepathic at times. When balanced, the bond carries a composed, timeless quality.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Horse — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Stillness vs. motion
                  </p>
                  <p>
                    Snake's deliberation contrasts with Horse's momentum, creating a rhythm defined by differing speeds. Horse brings energy and optimism; Snake offers reflection and depth. The pairing works through appreciation of contrast. The connection feels dynamic, thoughtful, and shaped by pacing.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Goat — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Calm and receptive
                  </p>
                  <p>
                    Snake and Goat form a gentle, emotionally aware pairing with warmth on one side and calm insight on the other. Goat offers empathy and openness; Snake provides steadiness and subtle understanding. Together the relationship feels soft, reflective, and quietly resilient. The bond strengthens slowly through kindness and consistency.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Monkey — Secret Friend (Liu He 六合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Clever and composed
                  </p>
                  <p>
                    Snake and Monkey share the Liu He (六合) harmony, blending intelligence, adaptability, and psychological depth. Monkey brings inventive spark; Snake brings clarity and composure. The match is mentally stimulating and emotionally nuanced. The connection feels bright, clever, and naturally supportive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Rooster — Same Trine (San He 三合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Exact and incisive
                  </p>
                  <p>
                    Snake and Rooster share the San He (三合) strategic trine, creating precision, focus, and strong mutual respect. Rooster contributes structure and insight; Snake adds intuition and calm perception. The relationship feels clear, deliberate, and strongly aligned in purpose. This is one of Snake's most stable and harmoniously matched pairings.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Dog — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Insight and loyalty
                  </p>
                  <p>
                    Snake and Dog form a thoughtful, sincere bond grounded in emotional honesty. Dog brings loyalty and clarity; Snake brings depth and intuition. The pairing feels steady, heartfelt, and quietly secure. Trust and emotional steadiness shape the connection's tone.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Snake × Pig — Clash Pair (Liu Chong 六冲)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Guarded vs. open
                  </p>
                  <p>
                    Snake's inward, measured nature contrasts sharply with Pig's open emotional expression. Pig brings warmth and vulnerability; Snake brings restraint and introspection. This difference creates tension in communication and emotional pace. The connection feels contrasting, sensitive, and easily imbalanced without awareness.
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

