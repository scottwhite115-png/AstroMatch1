"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function GeminiPage() {
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
              <span className="text-4xl">♊</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Gemini
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              May 21 – June 20
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Air | Modality: Mutable | Ruler: Mercury
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Gemini is quick, curious, and versatile. Ruled by Mercury, it governs communication, ideas, and adaptability. Geminis crave stimulation — mentally, socially, and creatively. They love words, stories, and exchange. Their gift is perspective: seeing both sides of a situation with wit and flexibility.
                </p>
                <p>
                  They can juggle many interests but risk spreading themselves too thin. Restless by nature, they thrive on change and novelty. Geminis are social chameleons who easily blend into new circles yet rarely reveal their full inner world.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  In love, Gemini needs connection of the mind first. Conversation, humour, and shared curiosity are aphrodisiacs. They enjoy lightness, play, and variety, but avoid clingy or overly intense partners. They express affection through words and clever banter, preferring relationships that feel alive and evolving.
                </p>
                <p>
                  Their challenge lies in staying present during emotional depth. Once they learn that intimacy doesn't mean boredom, Gemini becomes a loyal and endlessly interesting partner.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Gemini excels in communication-driven fields: writing, media, marketing, teaching, public relations, journalism, and technology. They adapt quickly and multitask with ease. They need intellectual freedom and fast-moving environments.
                </p>
                <p>
                  Repetitive routines stifle them. When trusted with autonomy and variety, Geminis innovate constantly and connect people and ideas that others overlook.
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
                    Gemini × Aries — Compatible (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fast and curious
                  </p>
                  <p>
                    Gemini and Aries form a lively, spontaneous connection full of movement and bright ideas. Aries brings direction and boldness; Gemini contributes flexibility, wit, and curiosity. Together they energise the atmosphere with quick decisions and fresh perspectives. The dynamic feels active, engaging, and naturally uplifting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Taurus — Mismatch (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Ground and air
                  </p>
                  <p>
                    Taurus offers steadiness and grounded presence, while Gemini brings motion and mental variety. Gemini widens Taurus' perspective through ideas and exploration; Taurus calms Gemini's pace with consistency. Their contrasting styles create a measured and thoughtful rhythm. The connection feels balanced, slow-building, and subtly complementary.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Gemini — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Words and motion
                  </p>
                  <p>
                    Two Geminis create a quick, mentally electric pairing full of humour, conversation, and shifting ideas. Both thrive on movement, curiosity, and constant stimulation. The connection unfolds through shared thought and lively interaction. The energy feels bright, restless, and mentally expansive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Cancer — Semi-Compatible (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Mind and mood
                  </p>
                  <p>
                    Cancer leads with emotion and intuition; Gemini leads with thought and adaptability. Cancer softens the emotional tone; Gemini lightens the atmosphere with perspective and playfulness. Together they blend reflection with movement in a gentle, understated way. The dynamic feels tender, thoughtful, and delicately balanced.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Leo — Compatible (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Playful and expressive
                  </p>
                  <p>
                    A warm, expressive pairing filled with creativity, playfulness, and shared enthusiasm. Leo brings charisma and heart; Gemini contributes wit and versatility. Their energy flows brightly, stimulating both socially and mentally. The connection feels vibrant, lively, and confident.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Virgo — Semi-Compatible (Both Mercury-ruled)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Thinking in detail
                  </p>
                  <p>
                    A mentally focused pairing where Gemini explores widely and Virgo refines deeply. Virgo offers structure and clarity; Gemini provides movement and fresh perspective. Conversation becomes a central thread between them, rich with detail and curiosity. The dynamic feels analytical, stimulating, and subtly intricate.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Libra — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Social and smooth
                  </p>
                  <p>
                    This is a harmonious, socially intuitive pairing shaped by shared curiosity and ease of communication. Libra brings balance, grace, and aesthetic awareness; Gemini brings movement, ideas, and humour. Both value freedom and variety within connection. The bond feels light, elegant, and naturally aligned.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Scorpio — Mismatch (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Light vs. depth
                  </p>
                  <p>
                    Scorpio expresses through intensity and depth; Gemini moves through thought and adaptability. Their contrast creates a vivid blend of mental quickness and emotional force. Scorpio adds focus and presence; Gemini introduces flexibility and perspective. The connection feels potent, layered, and dramatically contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Sagittarius — Opposites (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Opposite explorers
                  </p>
                  <p>
                    A bright, expansive polarity rooted in shared freedom, curiosity, and movement. Sagittarius brings big-picture vision and honesty; Gemini offers versatility and playful intelligence. Both value exploration and wide horizons. The pairing feels adventurous, open, and dynamically alive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Capricorn — Mismatch (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Ideas and structure
                  </p>
                  <p>
                    Capricorn seeks structure and long-term clarity, while Gemini prefers multiple pathways and flexible thought. Capricorn grounds the rhythm; Gemini lightens the tone with fresh ideas and spontaneity. Their contrast forms a steady yet mentally stimulating interplay. The dynamic feels measured, spacious, and quietly reflective.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Aquarius — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Mental spark
                  </p>
                  <p>
                    A natural mental connection defined by originality, independence, and shared intellect. Aquarius brings vision and depth; Gemini brings curiosity and adaptable movement. Together they generate innovative, thought-provoking dialogue. The energy feels bright, progressive, and mentally expansive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Pisces — Semi-Compatible (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Imagination and spin
                  </p>
                  <p>
                    Pisces feels through intuition and imagination; Gemini interprets through thought and language. Pisces adds atmosphere and depth; Gemini adds clarity and lightness. Their blend creates a soft and dreamy intellectual-emotional mix. The connection feels gentle, imaginative, and subtly luminous.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Gemini" />
          </div>
        </div>
      </div>
    </div>
  )
}

