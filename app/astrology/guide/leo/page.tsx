"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function LeoPage() {
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
              <span className="text-4xl">♌</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Leo
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              July 23 – August 22
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Fire | Modality: Fixed | Ruler: Sun
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Leo shines. Ruled by the Sun, this sign radiates vitality, charisma, and purpose. Fixed Fire gives Leo courage, pride, and loyalty. They thrive when expressing creativity and being appreciated for who they are. Their warmth draws people in; their confidence inspires.
                </p>
                <p>
                  At best, they are generous and protective leaders. At worst, they can drift into ego or stubbornness if they feel ignored. Recognition matters to them not from vanity but from a need to know their efforts touch others.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Leo loves passionately and wholeheartedly. They value devotion, affection, and being seen. They need admiration, yes, but they give it in return — uplifting their partner's self-worth. They are fiercely loyal and protective once they commit.
                </p>
                <p>
                  Public support means a lot; they dislike being humiliated or dismissed. The best relationships for Leo involve laughter, pride, and shared growth. Their lesson is to balance leading with listening and to love without needing control.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Leos excel in leadership, entertainment, art, fashion, branding, education, or anything visible. They want to make a mark and see their creative essence shine through their work.
                </p>
                <p>
                  They perform best when appreciated, not micromanaged. A Leo who feels valued can light up an entire organisation, turning passion into productivity and optimism into influence.
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
                    Leo × Aries — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Big energy
                  </p>
                  <p>
                    Leo and Aries spark quickly with shared boldness, passion, and forward momentum. Aries brings raw drive and initiative; Leo adds warmth, charisma, and creative presence. Their energies amplify each other in a bright, expressive way. The dynamic feels confident, lively, and full of mutual excitement.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Taurus — Mismatch (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fixed tastes
                  </p>
                  <p>
                    Leo seeks expression and recognition, while Taurus values consistency and calm. Taurus grounds Leo's enthusiasm with steady loyalty; Leo adds colour, warmth, and movement to Taurus' world. Together they blend stillness with flair in a rich contrast of style. The connection feels warm, firm, and quietly vibrant.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Gemini — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Playful and expressive
                  </p>
                  <p>
                    A lively and mentally stimulating pairing full of humour, playfulness, and bright ideas. Gemini brings agility and curiosity; Leo brings warmth, creativity, and heart. They energise each other socially and expressively. The dynamic feels fun, engaging, and effortlessly uplifting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Cancer — Semi-Compatible (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Heart and show
                  </p>
                  <p>
                    Leo expresses openly with confidence, while Cancer leads with emotion and sensitivity. Cancer deepens Leo's emotional world; Leo brightens Cancer's with warmth and optimism. Their blend mixes nurturing with radiance in a soft, expressive way. The energy feels affectionate, heartfelt, and gently contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Leo — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Big personalities
                  </p>
                  <p>
                    Two Leos create a radiant, expressive bond filled with passion, generosity, and creative spirit. Both bring charisma, warmth, and a desire to feel valued. Their mirrored energies create a dynamic of shared confidence and emotional richness. The connection feels bright, affectionate, and dramatically alive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Virgo — Semi-Compatible (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Show and service
                  </p>
                  <p>
                    Leo leads with heart and expression; Virgo leads with practicality and intention. Virgo provides thoughtful grounding; Leo brings warmth, encouragement, and boldness. Together they combine passion with precision in a balanced, productive way. The dynamic feels steady, refined, and quietly expressive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Libra — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Charming and social
                  </p>
                  <p>
                    A graceful, socially intuitive pairing shaped by charm, warmth, and shared appreciation for beauty. Libra offers elegance and harmony; Leo brings generosity and creative energy. Their interaction flows naturally with balanced affection and social ease. The connection feels bright, stylish, and warmly harmonious.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Scorpio — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Intense and dramatic
                  </p>
                  <p>
                    Both signs are loyal and intense, but Leo expresses outwardly while Scorpio moves through depth and introspection. Scorpio brings emotional richness; Leo adds warmth, courage, and expressive clarity. Their contrast creates a potent blend of passion and power. The dynamic feels deep, magnetic, and emotionally charged.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Sagittarius — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fire on fire
                  </p>
                  <p>
                    A spirited, adventurous match full of movement, optimism, and shared enthusiasm. Sagittarius contributes honesty and expansive perspective; Leo brings devotion, warmth, and creative flair. Together they create an uplifting, vibrant rhythm. The connection feels bold, free-spirited, and naturally compatible.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Capricorn — Semi-Compatible (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pride and strategy
                  </p>
                  <p>
                    Capricorn provides structure, strategy, and long-term vision; Leo brings warmth, vitality, and expressive courage. Their energies combine into a strong, purposeful pairing when aligned. Capricorn steadies the pace; Leo brightens the atmosphere. The dynamic feels ambitious, grounded, and quietly powerful.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Aquarius — Opposites (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Bold and unconventional
                  </p>
                  <p>
                    A striking polarity where Leo brings heart and presence while Aquarius brings vision and independence. Their contrast creates a bold interplay of emotion and intellect. Aquarius widens the horizon; Leo strengthens the emotional tone. The connection feels magnetic, innovative, and dynamically balanced.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Pisces — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Drama and dream
                  </p>
                  <p>
                    Pisces expresses through intuition and softness; Leo expresses through warmth and boldness. Pisces brings imagination and empathy; Leo brings protection and radiant confidence. Together they form a gentle yet vivid emotional blend. The dynamic feels dreamy, expressive, and quietly inspiring.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Leo" />
          </div>
        </div>
      </div>
    </div>
  )
}

