"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabHeader from "@/components/AstroLabHeader"

export default function LibraPage() {
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
          onMenuClick={() => router.push("/astrology")} 
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
                    Me and we
                  </p>
                  <p>
                    Libra seeks partnership and fairness; Aries seeks autonomy and direct action. The attraction is strong but so is the polarity. It works when Libra stops over-pleasing and Aries learns that compromise isn't defeat.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Taurus — Semi-Compatible (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Venus in two modes
                  </p>
                  <p>
                    Both signs are Venus-ruled and enjoy beauty, comfort, and relationships. Taurus leans into sensual stability; Libra into charm and social harmony. The connection can feel pleasant and aesthetically pleasing, but can stall if decisions are avoided.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Gemini — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Social flow
                  </p>
                  <p>
                    Libra and Gemini easily fill space with conversation and ideas. Gemini brings humour and variety; Libra brings tact and a feel for balance. The pairing is light and engaging, though it needs emotional depth and clear choices to stay meaningful.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Cancer — Semi-Compatible (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Manners and mood
                  </p>
                  <p>
                    Libra reads the room; Cancer feels the room. Cancer can find Libra too detached or people-pleasing; Libra can find Cancer too moody or personal. Still, this can be a tender, supportive match when they talk openly about needs.
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
                    Both enjoy romance, beauty, and social life. Leo brings warmth and theatrical flair; Libra adds elegance and a talent for smoothing edges. The connection often feels bright and attractive, with occasional friction over decision-making and attention.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Virgo — Semi-Compatible (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Curator and critic
                  </p>
                  <p>
                    Libra wants harmony and aesthetics; Virgo wants functionality and improvement. Virgo can help Libra get practical; Libra helps Virgo soften and see the bigger picture. The match is workable but requires both to tolerate critique.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Libra — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Mirror of charm
                  </p>
                  <p>
                    Two Libras usually get along smoothly and share a taste for beauty, fairness, and partnership. The downside is indecision and conflict avoidance, with issues swept under the rug. The relationship matures when one or both commit to genuine honesty over niceness.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Scorpio — Mismatch (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Smooth vs. intense
                  </p>
                  <p>
                    Libra prefers diplomacy; Scorpio prefers emotional truth, even if it's messy. Scorpio may see Libra as superficial; Libra may see Scorpio as heavy or controlling. Attraction can be high, but the emotional cost often is too.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Sagittarius — Compatible (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Light and bright
                  </p>
                  <p>
                    Libra and Sagittarius typically enjoy each other's company. Sagittarius brings honesty and adventurous energy; Libra contributes charm and social intelligence. The pairing feels lively and optimistic, but they need to anchor things in real commitments eventually.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Capricorn — Semi-Compatible (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Image and structure
                  </p>
                  <p>
                    Capricorn focuses on status and responsibility; Libra on relationships and presentation. Together they can form a capable, outwardly polished duo. Underneath, they must work at emotional transparency, not just looking like they have it together.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Aquarius — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Idealistic allies
                  </p>
                  <p>
                    Both care about justice, ideas, and people. Libra handles one-on-one dynamics; Aquarius looks at systems and groups. The connection feels mentally rich and socially aware, though emotional intimacy can lag if they stay in theory.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Libra × Pisces — Semi-Compatible (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Romantic haze
                  </p>
                  <p>
                    Pisces brings sensitivity and imagination; Libra brings charm and a love of partnership. The relationship can feel poetic and gentle, but it risks indecision and avoidance. It works when someone is willing to name reality and hold boundaries.
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

