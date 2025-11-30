"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function SagittariusPage() {
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
              <span className="text-4xl">♐</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Sagittarius
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              November 22 – December 21
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Fire | Modality: Mutable | Ruler: Jupiter
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Sagittarius is the explorer and philosopher of the zodiac. Ruled by expansive Jupiter, they hunger for freedom, adventure, and truth. Their optimism is contagious; they see possibility everywhere.
                </p>
                <p>
                  They resist confinement — whether physical, intellectual, or emotional. They're lifelong students, travellers, and storytellers who see life as a grand quest. Their honesty is refreshing, though their bluntness can sting.
                </p>
                <p>
                  At best, Sagittarians inspire others to grow; at worst, they avoid responsibility or commitment in their pursuit of "something better."
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Sagittarius seeks partners who share curiosity, humour, and independence. They fall for adventurous spirits who can laugh at life's absurdities. They need space to roam — emotionally and literally — and can't thrive in controlling or overly serious relationships.
                </p>
                <p>
                  They bring warmth, laughter, and generosity to love, but they must learn consistency and emotional follow-through. Their ideal bond feels like a friendship full of shared experiences and future dreams.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  They excel in travel, education, publishing, sales, coaching, media, spirituality, and global networking. They're natural teachers and motivators.
                </p>
                <p>
                  Routine work suffocates them; growth fuels them. With discipline, they can become visionary leaders who expand not just horizons but perspectives.
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
                    Sagittarius × Aries — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Adventurous and bold
                  </p>
                  <p>
                    Sagittarius and Aries connect instantly through movement, enthusiasm, and shared independence. Aries offers bold direction and decisive drive; Sagittarius brings optimism, curiosity, and broader perspective. Their energies amplify each other in a bright, forward-moving rhythm. The dynamic feels lively, spirited, and naturally energising.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Taurus — Mismatch (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Comfort vs. freedom
                  </p>
                  <p>
                    Sagittarius seeks exploration and freedom, while Taurus values consistency and measured pace. Taurus provides grounding and sensory richness; Sagittarius brings adventure and open horizons. Their interplay blends stability with expansion in a gentle contrast. The connection feels steady, warm, and quietly challenging.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Gemini — Opposites (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Opposite explorers
                  </p>
                  <p>
                    A mentally electric polarity where Sagittarius seeks big truths and Gemini seeks broad possibilities. Gemini adds versatility and quick thinking; Sagittarius brings vision, wisdom, and experiential depth. Together they create a spacious, curious, and animated pairing. The dynamic feels open, expansive, and intellectually vibrant.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Cancer — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Nest vs. open road
                  </p>
                  <p>
                    Sagittarius moves freely toward experience, while Cancer moves inward toward emotional safety. Cancer brings warmth and care to Sagittarius' adventurous path; Sagittarius brings perspective and optimism to Cancer's emotional world. Their blend mixes exploration with nurturing in a subtle, contrasting way. The connection feels gentle, spacious, and emotionally varied.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Leo — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fire on fire
                  </p>
                  <p>
                    A charismatic, high-energy match full of passion, confidence, and shared inspiration. Leo radiates warmth and devotion; Sagittarius brings honesty, humour, and an open spirit. Their interaction feels uplifting and expressive, with both signs encouraging each other's shine. The dynamic feels bold, joyful, and naturally harmonious.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Virgo — Mismatch (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Detail vs. big picture
                  </p>
                  <p>
                    Virgo values structure and precision, while Sagittarius embraces possibility and expansion. Virgo offers focus and grounded clarity; Sagittarius brings optimism and a wider horizon. Their blend mixes detail with vision in an intriguing contrast. The dynamic feels thoughtful, exploratory, and gently challenging.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Libra — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Light and open
                  </p>
                  <p>
                    Sagittarius and Libra share curiosity, openness, and a light-spirited approach to connection. Libra brings harmony and relational ease; Sagittarius adds adventure, honesty, and enthusiasm. Together they create a balanced, socially vibrant rhythm. The connection feels graceful, uplifting, and naturally warm.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Scorpio — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Edgy and honest
                  </p>
                  <p>
                    Sagittarius leads with freedom and expansion; Scorpio leads with emotional depth and intensity. Scorpio adds substance and introspection; Sagittarius brings perspective and movement. Their contrast creates a dynamic of deep questions and bold discovery. The connection feels potent, complex, and richly contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Sagittarius — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Wild at heart
                  </p>
                  <p>
                    Two Sagittarians create a spirited, adventurous connection full of movement, ideas, and possibility. Each understands the other's need for independence and intellectual stimulation. The pairing grows through shared exploration and expansive thinking. The dynamic feels bright, open, and endlessly curious.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Capricorn — Semi-Compatible (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Risk and responsibility
                  </p>
                  <p>
                    Sagittarius brings enthusiasm and vision, while Capricorn provides structure and long-term direction. Together they blend optimism with ambition in a productive, forward-focused way. Capricorn steadies the pace; Sagittarius widens the scope. The connection feels purposeful, grounded, and quietly dynamic.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Aquarius — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Open and future-minded
                  </p>
                  <p>
                    A progressive, idea-driven match where independence and curiosity are mutually understood. Aquarius brings originality and insight; Sagittarius adds honesty, humour, and a sense of discovery. Their blend feels future-focused and mentally engaging. The dynamic is open, stimulating, and naturally expansive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Pisces — Semi-Compatible (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Faith and feeling
                  </p>
                  <p>
                    Pisces expresses through emotion and imagination; Sagittarius through movement and exploration. Pisces adds softness and intuition; Sagittarius offers clarity, optimism, and wider vision. Together they form a gentle, dreamy, and fluid connection. The dynamic feels atmospheric, hopeful, and subtly expressive.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Sagittarius" />
          </div>
        </div>
      </div>
    </div>
  )
}

