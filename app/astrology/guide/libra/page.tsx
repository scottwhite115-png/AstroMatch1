"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function LibraPage() {
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
              <span className="text-4xl">♎</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Libra
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              September 23 – October 22
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Air | Modality: Cardinal | Ruler: Venus
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Libra embodies balance, beauty, and diplomacy. As a cardinal Air sign ruled by Venus, it blends intellect with artistry and social grace. Librans crave harmony — in aesthetics, relationships, and ideas. They naturally mediate tension, instinctively smoothing rough edges. Fairness is their compass; they can't bear injustice or ugliness in any form.
                </p>
                <p>
                  They're charming conversationalists who see multiple perspectives easily, making them empathetic but sometimes indecisive. They're idealists who want the world to be both kind and elegant. At their best, they're refined peacemakers; at their worst, they can lose themselves in pleasing others or avoiding confrontation.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Love and partnership define Libra. They thrive when the connection feels equal — mutual effort, mutual respect, mutual beauty. Romantic by nature, they value gestures, thoughtfulness, and aesthetics in their relationships.
                </p>
                <p>
                  They're turned off by rudeness or imbalance in give and take. When secure, they're attentive, affectionate, and committed to creating a shared world of comfort and peace. Their challenge is voicing personal needs instead of keeping the peace at their own expense.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Libras excel in professions blending communication, beauty, and justice: law, design, fashion, art, diplomacy, marketing, and mediation. They make strong negotiators and creatives who understand what others find appealing.
                </p>
                <p>
                  They dislike conflict-heavy environments but thrive when collaboration is valued. Their ability to unite teams and make projects harmonious often turns chaos into coherence.
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
                    Libra × Aries — Opposites (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Opposites in balance
                  </p>
                  <p>
                    Libra seeks harmony and measured pacing, while Aries moves with direct instinct and bold momentum. Aries brings courage and clarity that energise Libra; Libra adds refinement, diplomacy, and emotional balance. Their contrast creates a vibrant push-pull dynamic full of mutual growth. The connection feels lively, magnetic, and boldly complementary.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Taurus — Mismatch (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Tasteful but indecisive
                  </p>
                  <p>
                    Both signs appreciate comfort and aesthetic beauty, yet approach the world differently. Taurus expresses through steadiness and the senses; Libra expresses through thoughtfulness and relational flow. Taurus grounds Libra with calm presence, while Libra softens Taurus with charm and grace. The dynamic feels warm, steady, and quietly contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Gemini — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Social and smooth
                  </p>
                  <p>
                    A smooth, conversational pairing full of shared curiosity, social ease, and mental agility. Gemini brings movement and ideas; Libra brings balance, intention, and emotional understanding. Their connection flows naturally with lightness and intellectual spark. The energy feels effortless, sociable, and mentally alive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Cancer — Semi-Compatible (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Harmony and home
                  </p>
                  <p>
                    Cancer leads with emotion and intuition; Libra leads with perspective and gentle clarity. Libra helps guide Cancer toward understanding; Cancer deepens Libra's emotional awareness. Together they blend softness with thoughtfulness in a careful, expressive rhythm. The dynamic feels tender, reflective, and delicately attuned.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Leo — Compatible (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Charming and social
                  </p>
                  <p>
                    Leo offers warmth, confidence, and creative flair; Libra contributes harmony, grace, and social intelligence. Their energies uplift each other naturally in a bright, expressive way. The pairing mixes passion with elegance, forming a charming and vibrant rhythm. The connection feels warm, playful, and irresistibly magnetic.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Virgo — Semi-Compatible (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Considerate but indecisive
                  </p>
                  <p>
                    Libra looks for balance and emotional resonance, while Virgo focuses on structure and refinement. Virgo provides thoughtful grounding; Libra offers perspective and relational ease. Their interaction blends precision with harmony in a subtle, complementary mix. The dynamic feels careful, measured, and quietly supportive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Libra — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Charming mirrors
                  </p>
                  <p>
                    Two Libras form an intuitive, graceful bond built on mutual understanding and shared values. Both bring charm, fairness, and a natural sensitivity to emotional tone. Their mirrored energy creates harmony and a refined sense of partnership. The connection feels elegant, balanced, and deeply familiar.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Scorpio — Mismatch (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Smooth and intense
                  </p>
                  <p>
                    Libra navigates through diplomacy and equilibrium, while Scorpio moves with depth, focus, and emotional intensity. Scorpio adds substance and passion to Libra's world; Libra brings calm and clarity to Scorpio's emotional landscape. Their contrast forms a magnetic yet demanding rhythm. The connection feels potent, layered, and deeply transformative.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Sagittarius — Compatible (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Light and open
                  </p>
                  <p>
                    A lively, upbeat pairing full of curiosity, movement, and shared ideals. Sagittarius brings exploration and honesty; Libra brings harmony and aesthetic warmth. Together they create a free-spirited, socially vibrant dynamic. The connection feels optimistic, open, and naturally energising.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Capricorn — Mismatch (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Style and structure
                  </p>
                  <p>
                    Libra seeks connection and balance; Capricorn seeks structure and long-term purpose. Capricorn provides stability and clear direction; Libra adds relational softness and social refinement. Their blend combines order with grace in a steady, slow-building rhythm. The dynamic feels grounded, composed, and carefully aligned.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Aquarius — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Social and idealistic
                  </p>
                  <p>
                    Both value ideas, independence, and a forward-thinking approach to relationships. Aquarius brings vision and originality; Libra brings warmth, balance, and relational clarity. Their connection flows with ease and mutual understanding. The energy feels modern, intellectually rich, and naturally coherent.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Pisces — Semi-Compatible (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft and romantic
                  </p>
                  <p>
                    Pisces moves through emotion and intuition; Libra moves through thought and gentle expression. Pisces adds imagination and empathy to Libra's world; Libra offers balance and clear perspective. Together they create a soft, artistic, and atmospheric blend. The connection feels dreamy, tender, and quietly expressive.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Libra" />
          </div>
        </div>
      </div>
    </div>
  )
}

