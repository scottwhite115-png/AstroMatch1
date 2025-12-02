"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function CancerPage() {
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
              <span className="text-4xl">♋</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Cancer
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              June 21 – July 22
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Water | Modality: Cardinal | Ruler: Moon
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Cancer is intuitive, protective, and emotionally deep. Ruled by the Moon, their moods ebb and flow like tides. They are the caretakers of the zodiac, guided by empathy and memory. Their intuition is strong; they sense what others feel before it's said.
                </p>
                <p>
                  Though gentle, they possess formidable inner strength. Cancer people crave security, family, and belonging. They dislike coldness or detachment and often shield vulnerability with humour or retreat. At their best, they are nurturing and loyal; at their worst, defensive or moody when unappreciated.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Cancer seeks emotional safety above all. Love for them means care, consistency, and trust. They remember every kindness — and every hurt. They need partners who are patient and who validate feelings rather than dismiss them. Acts of care (home-cooked meals, thoughtful messages) mean more than grand gestures.
                </p>
                <p>
                  Once safe, Cancer loves deeply and for the long haul. Their relationships thrive when both partners feel secure enough to share their softer sides. Their challenge: learning not to take every mood personally and to express needs directly.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  They flourish in environments that value empathy and human connection: counselling, teaching, healthcare, hospitality, and real estate. They excel in nurturing roles and often make workplaces feel like home.
                </p>
                <p>
                  Cancer's emotional intelligence makes them powerful leaders — intuitive yet protective. They build teams that feel like families and measure success not only in profits but in people's wellbeing.
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
                    Cancer × Aries — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fire and feeling
                  </p>
                  <p>
                    Cancer feels through emotion while Aries moves through instinct, creating a vivid contrast in rhythm. Aries brings momentum and courage that brighten Cancer's world; Cancer brings warmth and sensitivity that soften Aries' edges. Their different approaches create a dynamic filled with contrast and intuitive depth. The connection feels expressive, protective, and delicately balanced.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Taurus — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cozy and caring
                  </p>
                  <p>
                    A gentle, comforting pairing shaped by loyalty, tenderness, and emotional steadiness. Taurus provides grounding and security; Cancer adds warmth, intuition, and a deep sense of care. Their shared love of closeness and stability creates a slow-growing, heartfelt bond. The energy feels nurturing, calm, and quietly enduring.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Gemini — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Mind and mood
                  </p>
                  <p>
                    Cancer leads with emotion while Gemini leads with thought, forming a soft blend of feeling and curiosity. Gemini brings movement and mental brightness; Cancer offers sincerity and emotional grounding. Together they create a connection marked by contrast and gentle adaptability. The dynamic feels thoughtful, tender, and lightly textured.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Cancer — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Deep water
                  </p>
                  <p>
                    Two Cancers form an intuitive, deeply emotional bond with a natural flow of empathy and understanding. Both value safety, reassurance, and heartfelt connection. Feelings run strong, giving the relationship a soulful, protective tone. The energy feels intimate, reflective, and richly attuned.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Leo — Semi-Compatible (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Heart and show
                  </p>
                  <p>
                    Cancer expresses through sensitivity; Leo expresses through warmth and presence. Leo lifts the emotional tone with confidence and light; Cancer brings depth and authentic feeling. Their interaction blends nurturing emotion with expressive fire. The connection feels affectionate, vivid, and gently contrasting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Virgo — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Caring in practice
                  </p>
                  <p>
                    A thoughtful, caring match grounded in trust, sincerity, and mutual support. Virgo offers structure, clarity, and reliability; Cancer adds warmth, intuition, and emotional depth. Together they create a quiet, steady rhythm of understanding. The dynamic feels nurturing, stable, and deeply considerate.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Libra — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Harmony and home
                  </p>
                  <p>
                    Cancer moves through emotion, while Libra moves through balance and perspective. Libra brings calm communication and soft refinement; Cancer brings sincerity and emotional presence. Their blend forms a delicate interplay of feeling and harmony. The connection feels graceful, gentle, and subtly expressive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Scorpio — Compatible (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Intense and private
                  </p>
                  <p>
                    A powerful emotional pairing marked by loyalty, intuition, and depth. Scorpio brings intensity and focus; Cancer offers warmth and emotional safety. Their energies merge naturally, creating profound emotional resonance. The dynamic feels deep, magnetic, and transformative.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Sagittarius — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Nest vs. open road
                  </p>
                  <p>
                    Cancer seeks closeness and emotional continuity; Sagittarius seeks freedom and wide horizons. Sagittarius introduces optimism and movement; Cancer adds warmth and heartfelt presence. Their contrasting styles create a vivid, expansive dynamic. The energy feels expressive, exploratory, and full of contrast.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Capricorn — Opposites (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Opposites that build
                  </p>
                  <p>
                    Cancer leads with heart and intuition; Capricorn leads with structure and long-range vision. Capricorn grounds Cancer's emotional tides; Cancer softens Capricorn's restraint. Their differences create a stabilising, purposeful polarity. The connection feels steady, complementary, and quietly powerful.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Aquarius — Mismatch (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Feeling vs. distance
                  </p>
                  <p>
                    Aquarius approaches life through ideas and independence; Cancer approaches through emotion and closeness. Aquarius brings perspective and clarity; Cancer adds warmth and intuitive depth. Their contrasting rhythms shape a thoughtful, spacious dynamic. The energy feels reflective, airy, and emotionally nuanced.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Pisces — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft and intuitive
                  </p>
                  <p>
                    Cancer and Pisces form an empathetic, intuitive bond rich with imagination and emotional resonance. Pisces brings creativity and compassion; Cancer brings steadiness and protective warmth. The connection flows naturally with shared emotional language. The dynamic feels gentle, soulful, and deeply connected.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Cancer" />
          </div>
        </div>
      </div>
    </div>
  )
}

