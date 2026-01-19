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

export default function GoatPage() {
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
              <span className="text-4xl">🐐</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Goat
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              Year of Birth examples: 1967, 1979, 1991, 2003, 2015, 2027
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Yin Fire | Trine: Artists (Rabbit, Goat, Pig)
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Core Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Goats (or Sheep) are artistic, gentle, and empathetic. They embody kindness and compassion, often putting others' needs before their own. They appreciate beauty, nature, and emotional connection. Their creativity is strong, and they express it through art, design, or caregiving. They dislike confrontation and chaotic environments, preferring peace and security. Their challenge lies in assertiveness — learning to stand firm instead of retreating to comfort.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Goats are loving, sensitive, and romantic. They value tenderness and understanding, often idealizing their partners. They need reassurance and thrive in stable, emotionally safe relationships. They may avoid conflict, sometimes at their own expense. Compatible signs include Rabbit and Pig, who share their gentle nature, and Horse, who adds energy. Their lesson is self-worth — realizing that kindness doesn't mean self-sacrifice.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Life Path
              </h2>
              <div className="space-y-3">
                <p>
                  Goats excel in creative and caring professions: art, therapy, education, design, healthcare, or charity work. They need supportive teams and encouraging mentors. Their empathy makes them excellent collaborators. They must guard against procrastination and self-doubt. When they balance creativity with discipline, they produce work that uplifts and heals.
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
                    Goat × Rat — Six Harms (Liu Hai 六害)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft vs. alert
                  </p>
                  <p>
                    Goat and Rat sit in a Liu Hai (六害) pattern, where sensitivity meets constant mental scanning. Goat can feel judged or unsettled; Rat can feel burdened or unsure. The connection needs strong reassurance and boundaries to avoid quiet drain.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Goat × Ox — Clash Pair (Liu Chong 六冲)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Security vs. softness
                  </p>
                  <p>
                    Goat and Ox form a Liu Chong (六冲) clash pair, highlighting differences in emotional and practical needs. Ox leans into duty and structure; Goat leans into feeling and atmosphere. The relationship can feel caring but tense unless both honour each other's priorities.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Goat × Tiger — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gentle vs. bold
                  </p>
                  <p>
                    Goat's sensitivity meets Tiger's assertiveness. Goat may retreat under pressure; Tiger may misread softness as weakness. The bond can be protective and inspiring when Tiger learns gentleness and Goat stands firm.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Goat × Rabbit — Same Trine (San He 三合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Artists and empaths
                  </p>
                  <p>
                    Goat and Rabbit share the San He (三合) Artists trine, rich in feeling, aesthetics, and atmosphere. Rabbit brings grace and tact; Goat brings warmth and emotional nuance. The connection feels nurturing, creative, and emotionally safe.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Goat × Dragon — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Quiet strength and drama
                  </p>
                  <p>
                    Goat's gentle presence meets Dragon's strong, expressive energy. Goat softens the tone; Dragon provides protection and confidence. The relationship feels tender and vivid when neither overwhelms the other.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Goat × Snake — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft and subtle
                  </p>
                  <p>
                    Goat and Snake create a quiet, layered match without classical harmony. Goat offers empathy and artistic flair; Snake adds depth and intrigue. The bond feels intimate and slightly mysterious, thriving on trust and privacy.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Goat × Horse — Secret Friend (Liu He 六合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Heart and motion
                  </p>
                  <p>
                    Goat and Horse share a Liu He (六合) "secret friend" pairing that mixes emotional warmth with freedom. Goat creates a soft, welcoming base; Horse brings fresh experiences and movement. The connection feels kind, inspiring, and gently liberating.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Goat × Goat — Same Sign (Self-Punishment Xing 相刑)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Double sensitivity
                  </p>
                  <p>
                    Two Goats form a deeply empathetic, cosy, and artistic bond. As a self-punishment Xing (相刑) match, shared insecurity and avoidance can lead to hidden tension. The relationship is tender but needs clear boundaries and honest talk to stay strong.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Goat × Monkey — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Play and feeling
                  </p>
                  <p>
                    Monkey brings humour and mental agility; Goat brings emotion and atmosphere. Goat may feel unsettled by too much teasing; Monkey may feel weighed down by moods. The connection can be charming and fun when both respect each other's inner world.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Goat × Rooster — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Critique and care
                  </p>
                  <p>
                    Goat prefers gentle tones; Rooster prefers straightforward critique. Rooster may push for improvement; Goat may feel exposed. The relationship works when Rooster softens delivery and Goat recognises the care behind the feedback.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Goat × Dog — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Care and duty
                  </p>
                  <p>
                    Goat and Dog both want to protect and care for others, but express it differently. Dog offers loyalty and practical support; Goat offers emotional warmth and comfort. The bond feels safe and sincere, though it can slip into worry if not balanced with joy.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Goat × Pig — Same Trine (San He 三合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Comfort and kindness
                  </p>
                  <p>
                    Goat and Pig share the San He (三合) Artists trine, centred on comfort, pleasure, and emotional connection. Pig brings generosity and ease; Goat brings depth of feeling and aesthetic sense. The relationship feels cosy, affectionate, and deeply caring.
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
                      {getCompatibilityTable("Goat").map((row, index) => (
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

