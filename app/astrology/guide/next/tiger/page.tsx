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

export default function TigerPage() {
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
              <span className="text-4xl">🐅</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Tiger
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              Year of Birth examples: 1962, 1974, 1986, 1998, 2010, 2022
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Yang Wood | Trine: Adventurers (Tiger, Horse, Dog)
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Core Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Tigers are courageous, charismatic, and driven by ideals. They embody the spirit of leadership and rebellion, guided by a strong moral compass. Independent by nature, they dislike being controlled and prefer to carve their own path. Tigers thrive in challenges, especially those involving risk or justice. They are passionate and impulsive — quick to act when they believe in something. Their confidence and presence inspire others, but their impatience and pride can make them volatile. The Tiger's true gift lies in combining bravery with strategy.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Tigers love passionately and protectively. They want admiration and independence in equal measure. They are drawn to confident, strong-minded partners who can keep up with their energy without caging it. They dislike routine and need emotional excitement to stay invested. When mature, they become loyal and deeply romantic, willing to fight for those they love. Their best matches include Horse and Dog, who share their intensity and idealism. Their challenge is to balance leadership with listening, realizing love thrives on equality, not conquest.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Life Path
              </h2>
              <div className="space-y-3">
                <p>
                  Tigers excel in careers that reward courage, initiative, and purpose: entrepreneurship, law enforcement, politics, sports, performance, or activism. They lead through inspiration rather than fear. They dislike monotonous work and need autonomy. Their charisma attracts followers, but they must learn patience and humility to sustain success. When they channel passion constructively, Tigers become powerful reformers and protectors.
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
                    Tiger × Rat — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Nerves and impulse
                  </p>
                  <p>
                    Rat and Tiger share strong instincts expressed in very different ways. Rat moves strategically and subtly, while Tiger moves boldly and directly. Their dynamic blends sharp thinking with raw momentum, creating a connection that feels lively and unpredictable. The pairing is spirited, fast-paced, and full of contrast.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tiger × Ox — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Stable vs. impulsive
                  </p>
                  <p>
                    Tiger's intensity contrasts with Ox's steady, grounded approach. Tiger prefers movement and quick impact; Ox prefers structure and patient effort. Together they form a rhythm built on contrast rather than similarity. The dynamic feels firm, centred, and quietly powerful when aligned.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tiger × Tiger — Same Sign (Self-Punishment 相刑)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    High-voltage duo
                  </p>
                  <p>
                    Two Tigers form a passionate, high-energy pairing marked by courage, charisma, and fierce independence. As a self-punishment Xing (相刑) match, shared intensity can amplify both conflict and chemistry. Yet when energy is channelled constructively, the bond feels unstoppable and inspiring. The connection is bold, dynamic, and emotionally electric.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tiger × Rabbit — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Edge and gentleness
                  </p>
                  <p>
                    Tiger brings strength and boldness; Rabbit brings sensitivity and diplomacy. Their blend creates a gentle contrast of courage and calm. The connection grows through emotional awareness and mutual respect. The dynamic feels protective, soft, and subtly balanced.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tiger × Dragon — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Big moves
                  </p>
                  <p>
                    Tiger and Dragon both radiate strong Yang energy, creating a connection full of momentum, ambition, and expressive power. This pairing feels commanding and intense, especially when goals align. Differences in temperament can spark rivalry, but admiration keeps the connection engaging. The dynamic is fiery, forceful, and full of presence.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tiger × Snake — Break (Po 破)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Impulse vs. calculation
                  </p>
                  <p>
                    Tiger and Snake fall under the Po (破) Break pattern, where instinct and emotional style diverge. Tiger is open and direct; Snake is private and inwardly perceptive. Their energies often miss each other's emotional signals. The connection feels enigmatic, tense, and layered beneath the surface.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tiger × Horse — Same Trine (San He 三合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Adventurous and wild
                  </p>
                  <p>
                    Tiger and Horse share the San He (三合) Adventurer trine, forming one of the zodiac's most energising partnerships. Both thrive on movement, freedom, and bold ideas, creating a fast, exciting rhythm. Your shared drive creates natural synergy and forward momentum. The dynamic feels bright, adventurous, and effortlessly aligned.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tiger × Goat — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Brave and tender
                  </p>
                  <p>
                    Tiger moves with intensity and instinct, while Goat moves with softness and emotional sensitivity. Their energy blend requires care but can create unexpected warmth. Goat brings gentleness that softens Tiger's force; Tiger brings courage that supports Goat's confidence. The connection feels tender, contrasting, and delicately balanced.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tiger × Monkey — Clash Pair (Liu Chong 六冲)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Competitive spark
                  </p>
                  <p>
                    Tiger and Monkey sit in a Liu Chong (六冲) opposition, generating a sharp, high-voltage interaction. Monkey's clever adaptability contrasts with Tiger's direct strength. The chemistry is vivid and immediate, often leaving a strong impression. The dynamic is intense, electric, and charged with contrast.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tiger × Rooster — Neutral
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pride and critique
                  </p>
                  <p>
                    Tiger leads with instinct and speed; Rooster leads with precision and analysis. This creates a connection filled with differing methods and pacing. Rooster's clarity challenges Tiger's spontaneity, while Tiger adds boldness to Rooster's structure. The pairing feels sharp, focused, and quietly competitive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tiger × Dog — Same Trine (San He 三合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Loyal fighters
                  </p>
                  <p>
                    Tiger and Dog share the San He (三合) harmony, creating a loyal, principled, and deeply bonded pairing. Dog's sincerity steadies Tiger's intensity; Tiger's bravery strengthens Dog's resolve. This connection feels trustworthy, mission-driven, and naturally aligned. It is one of Tiger's most dependable and heartfelt matches.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tiger × Pig — Secret Friend (Liu He 六合)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Brave and generous
                  </p>
                  <p>
                    Tiger and Pig form the Liu He (六合) secret-friend pairing, offering emotional warmth and mutual encouragement. Pig brings softness and empathy; Tiger brings strength and protection. This combination blends tenderness with boldness in a balanced, heartfelt way. The dynamic feels warm, steady, and quietly harmonious.
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
                      {getCompatibilityTable("Tiger").map((row, index) => (
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

