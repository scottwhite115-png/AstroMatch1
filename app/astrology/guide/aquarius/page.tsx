"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function AquariusPage() {
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
              <span className="text-4xl">♒</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Aquarius
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              January 20 – February 18
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Air | Modality: Fixed | Ruler: Uranus (traditional ruler Saturn)
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Aquarius is the visionary and reformer. Independent, curious, and original, they see patterns others miss. They value progress, freedom, and humanity more than tradition.
                </p>
                <p>
                  As a fixed Air sign, Aquarius combines intellect with persistence. They thrive in communities, innovation, and causes that improve society. They can seem detached but are deeply idealistic. Their friendships are broad; their inner circle is selective.
                </p>
                <p>
                  At best, they're innovators and humanitarians; at worst, stubborn contrarians or emotionally aloof thinkers.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  They love with their mind first. Friendship is their entry point to romance. They need space, equality, and shared ideals. Possessiveness repels them, but mutual respect and curiosity win their heart.
                </p>
                <p>
                  Aquarians are loyal when trusted and intellectually engaged. Their challenge is translating ideas into emotions — remembering that love needs warmth as much as understanding.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  They thrive in technology, science, social reform, art, innovation, and any unconventional field. They prefer autonomy and dislike strict hierarchies.
                </p>
                <p>
                  When inspired by a mission, they work tirelessly to create change. They're the architects of progress — connecting people, systems, and ideas to build the future.
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
                    Aquarius × Aries — Compatible (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Rebel spark
                  </p>
                  <p>
                    A bold and future-oriented pairing built on independence and momentum. Aries brings courage and spark; Aquarius adds originality and inventive thought. Together they generate a lively, expressive dynamic full of movement and new ideas. The connection feels energising, forward-moving, and naturally inspiring.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Taurus — Mismatch (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fixed vs. free
                  </p>
                  <p>
                    Aquarius moves through innovation and possibility, while Taurus values steadiness and tangible progress. Taurus grounds Aquarius' concepts, and Aquarius widens Taurus' perspective. The blend creates a measured rhythm shaped by contrast and balance. The dynamic feels steady, slow-building, and quietly contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Gemini — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Ideas and wit
                  </p>
                  <p>
                    A bright, mentally active pairing defined by curiosity, humour, and conversation. Gemini brings versatility and wit; Aquarius brings vision and individuality. Ideas flow easily between them, creating a socially intuitive connection. The energy feels light, clever, and effortlessly stimulating.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Cancer — Mismatch (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Feeling vs. distance
                  </p>
                  <p>
                    Logic meets emotion in a pairing defined by sensitivity and contrast. Cancer offers warmth and intuition; Aquarius contributes clarity and perspective. Their differing inner rhythms create a reflective and emotionally textured dynamic. The connection feels atmospheric, delicate, and introspective.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Leo — Opposites (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Bold and unconventional
                  </p>
                  <p>
                    A dramatic polarity where expressive warmth meets originality and intellect. Leo brings heart and radiance; Aquarius brings insight and innovation. Their contrast creates a bold, magnetic interchange of ideas and emotion. The energy feels vivid, charismatic, and charged with presence.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Virgo — Mismatch (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Systems and ideas
                  </p>
                  <p>
                    Virgo focuses on refinement and detail; Aquarius focuses on vision and innovation. Virgo grounds Aquarius' concepts into form, while Aquarius expands Virgo's scope. The pairing blends precision with imagination in a subtle, measured way. The connection feels thoughtful, analytical, and gently contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Libra — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Social and idealistic
                  </p>
                  <p>
                    A socially fluent, balanced connection rooted in shared ideals and intellectual chemistry. Libra adds charm and relational ease; Aquarius brings originality and depth. Together they express a modern, harmonious rhythm with natural understanding. The energy feels fluid, elegant, and quietly aligned.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Scorpio — Mismatch (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Intensity vs. detachment
                  </p>
                  <p>
                    Scorpio brings emotional intensity and depth; Aquarius offers distance, clarity, and insight. The pairing holds a complex blend of magnetism and contrast. Scorpio grounds the emotional tone; Aquarius illuminates the broader perspective. The dynamic feels deep, potent, and richly contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Sagittarius — Compatible (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Open and future-minded
                  </p>
                  <p>
                    A free-spirited, explorative pairing with shared love of ideas and open horizons. Sagittarius brings enthusiasm and candour; Aquarius adds originality and vision. Their energy moves fast and brightly, full of momentum and discovery. The connection feels inspiring, adventurous, and forward-looking.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Capricorn — Semi-Compatible (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Structure and innovation
                  </p>
                  <p>
                    Capricorn provides structure and long-term focus; Aquarius brings invention and broader perspective. Together they create a blend of planning and possibility. Capricorn grounds the rhythm, while Aquarius expands the scope. The dynamic feels steady, strategic, and quietly progressive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Aquarius — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Independent thinkers
                  </p>
                  <p>
                    Two Aquarians form a cerebral, unconventional pairing rooted in shared values and independence. Both bring originality, curiosity, and a strong sense of individuality. The connection feels progressive, idealistic, and mentally open. The energy reads as airy, spacious, and naturally aligned.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Pisces — Semi-Compatible (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Vision and feeling
                  </p>
                  <p>
                    Aquarius expresses through insight and vision; Pisces moves through emotion and intuition. Together they create a soft, perceptive blend of thought and feeling. Pisces adds depth and atmosphere; Aquarius adds clarity and perspective. The dynamic feels gentle, imaginative, and subtly textured.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Aquarius" />
          </div>
        </div>
      </div>
    </div>
  )
}

