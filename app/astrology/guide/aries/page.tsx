"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function AriesPage() {
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
              <span className="text-4xl">♈</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Aries
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              March 21 – April 19
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Fire | Modality: Cardinal | Ruler: Mars
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Aries is the first spark of the zodiac — direct, daring, and full of momentum. As a cardinal Fire sign ruled by Mars, Aries is driven by action, passion, and the thrill of beginning something new. They thrive on challenges and often feel most alive when leading or competing. Straightforward and decisive, they'd rather make a bold move and fix mistakes later than wait in hesitation.
                </p>
                <p>
                  Aries people radiate vitality and courage, inspiring others through confidence and initiative. Their honesty is refreshing, though it can border on bluntness. They're quick to forgive, quick to move, and sometimes too quick to judge. Beneath their fiery exterior is a sincere desire to carve their own path and protect those they love. When grounded in self-awareness, Aries becomes a force of nature — passionate, pioneering, and unafraid to chase life head-on.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  In love, Aries wants authenticity, chemistry, and adventure. They fall hard and fast, preferring clear signals to subtle games. Their ideal partner is strong enough to keep up but secure enough not to compete. They adore enthusiasm, affection, and direct communication. Boredom or indecision can turn them off quickly; passion, play, and mutual respect keep them engaged.
                </p>
                <p>
                  Once committed, Aries is protective and loyal, though they may need to learn patience and empathy when tempers flare. They respond best to partners who can challenge them in healthy ways — matching their drive without stifling their independence. The healthiest Aries relationships are dynamic and growth-oriented, built on honesty, shared goals, and the freedom to keep evolving.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Aries excels in any field that rewards courage, innovation, and initiative. They are natural self-starters who prefer action over discussion. Leadership, entrepreneurship, sports, emergency services, sales, the military, performing arts, and technology all appeal to their bold spirit. They do best when they can see immediate results and feel ownership over their success.
                </p>
                <p>
                  Routine and heavy bureaucracy drain them; autonomy and clear challenges fuel them. Aries learns over time that real success requires discipline as well as daring. When they master patience without losing their fire, they become unstoppable — the pioneer who opens doors for others through their bravery and conviction.
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
                    Aries × Aries — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    All gas, no brakes
                  </p>
                  <p>
                    Two Aries create a bold, high-energy dynamic driven by passion, momentum, and spontaneity. Both bring courage, initiative, and a strong instinct for action. The connection feels fast-moving and intensely expressive, full of shared excitement and challenge. Their mirrored fire energy forms a bright, competitive, and exhilarating bond.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Taurus — Semi-Compatible (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Drive meets stability
                  </p>
                  <p>
                    Aries pushes forward quickly while Taurus holds steady, creating a rhythm of movement and grounded presence. Taurus offers stability and consistency; Aries brings spark and motivation. Together they blend momentum with patience in a natural balancing act. The dynamic feels steady, structured, and quietly resilient.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Gemini — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fast and curious
                  </p>
                  <p>
                    A lively, mentally stimulating pairing full of curiosity and bright interaction. Gemini contributes ideas and flexibility; Aries adds direction and drive. The connection moves quickly, with both signs feeding each other's independence and creativity. The energy feels playful, clever, and naturally uplifting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Cancer — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fire and feeling
                  </p>
                  <p>
                    Aries leads with action and instinct; Cancer responds with emotion and intuition. Their contrasting rhythms create a dynamic that is both sensitive and bold. Cancer brings warmth and emotional depth; Aries adds clarity and forward motion. The connection feels atmospheric, expressive, and delicately balanced between heart and fire.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Leo — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Big energy
                  </p>
                  <p>
                    A charismatic, radiant pairing where enthusiasm and passion meet head-on. Leo brings warmth and presence; Aries brings courage and initiative. Together they amplify each other's confidence and creative force. The bond feels vibrant, expressive, and full of mutual admiration.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Virgo — Semi-Compatible (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Action and analysis
                  </p>
                  <p>
                    Virgo brings refinement, precision, and thoughtful structure to Aries' dynamic momentum. Aries introduces spontaneity and boldness, widening Virgo's perspective. The connection blends detail with drive in a measured, grounded way. The energy feels practical, steady, and subtly complementary.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Libra — Opposites (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Opposites in balance
                  </p>
                  <p>
                    A clear polarity where Aries' directness meets Libra's grace and balance. Libra softens the emotional tone, while Aries brings clarity and decisive energy. The dynamic highlights contrast and mutual fascination. The connection feels magnetic, expressive, and rich with mirrored growth.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Scorpio — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Intense and uncompromising
                  </p>
                  <p>
                    Two strong-willed signs meet in a pairing full of intensity and emotional depth. Scorpio offers focus and profound feeling; Aries contributes momentum and boldness. Their energies collide in a dramatic mix of passion and power. The dynamic feels deep, potent, and transformative.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Sagittarius — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Adventurous and bold
                  </p>
                  <p>
                    A free-spirited, adventurous match full of movement and optimism. Sagittarius brings perspective and humour; Aries adds drive and immediacy. Both value independence and excitement, creating an effortless rapport. The energy feels bright, open, and forward-moving.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Capricorn — Semi-Compatible (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Ambition with friction
                  </p>
                  <p>
                    Aries supplies initiative and spark, while Capricorn provides discipline and strategic focus. Together they balance bold action with long-range planning. Capricorn steadies the pace; Aries pushes momentum. The connection feels grounded, ambitious, and quietly powerful.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Aquarius — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Rebel spark
                  </p>
                  <p>
                    Aries and Aquarius form a progressive, idea-driven pairing with shared independence. Aquarius contributes originality and insight; Aries adds passion and immediacy. The dynamic is bright, creative, and future-focused. The energy feels expansive, exciting, and mentally stimulating.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Pisces — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Action and empathy
                  </p>
                  <p>
                    Aries moves with instinct and speed; Pisces moves with emotion and sensitivity. Pisces brings intuition and empathy; Aries brings direction and strength. The dynamic blends fire with water in a soft yet expressive contrast. The energy feels gentle, atmospheric, and quietly complementary.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Aries" />
          </div>
        </div>
      </div>
    </div>
  )
}

