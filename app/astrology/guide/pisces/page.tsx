"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function PiscesPage() {
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
              <span className="text-4xl">♓</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Pisces
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              February 19 – March 20
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Water | Modality: Mutable | Ruler: Neptune (traditional ruler Jupiter)
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Pisces is intuitive, imaginative, and compassionate. As the final sign of the zodiac, they blend the lessons of all others. Empathy is their superpower — they feel what others feel as if it's their own.
                </p>
                <p>
                  They're artists, dreamers, healers, and mystics who live partly in another world. They crave inspiration, kindness, and beauty. Sensitive to environment, they flourish in peaceful surroundings. Their empathy can also overwhelm them, leading to escapism if not grounded.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Pisces loves with tenderness and devotion. They idealize love, seeing it as a spiritual union. They're giving and forgiving, but can attract those who take advantage.
                </p>
                <p>
                  They need a partner who's gentle yet strong enough to anchor them. Emotional honesty, creativity, and safety matter most. When balanced, Pisces offers unconditional love that feels healing.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Pisces excels in artistic, healing, and service roles: music, film, design, psychology, spirituality, charity, or healthcare. They do best where empathy and imagination meet purpose.
                </p>
                <p>
                  They're intuitive leaders who sense undercurrents others miss. Their challenge is grounding dreams into action. When they do, they become the dreamers who make the world softer and more humane.
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
                    Pisces × Aries — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Action and empathy
                  </p>
                  <p>
                    Pisces experiences the world through intuition and feeling, while Aries moves through instinct and action. Aries adds direction and protective energy; Pisces brings imagination, empathy, and emotional nuance. Together they blend softness with boldness in a delicate contrast. The connection feels spirited, sensitive, and quietly transformative.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Taurus — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft and steady
                  </p>
                  <p>
                    Taurus offers stability, warmth, and grounded presence; Pisces brings compassion, creativity, and emotional depth. Their energies form a nurturing, gentle rhythm where both feel understood. Pisces enriches Taurus' inner world with softness; Taurus helps Pisces feel secure and steady. The dynamic feels calm, affectionate, and deeply soothing.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Gemini — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dreamy and curious
                  </p>
                  <p>
                    Gemini engages through ideas; Pisces through emotion and intuition — creating a fluid, intriguing contrast. Gemini brings clarity and movement; Pisces adds empathy, atmosphere, and inner richness. Their interplay mixes thought with feeling in a light yet meaningful way. The connection feels airy, expressive, and delicately balanced.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Cancer — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft and intuitive
                  </p>
                  <p>
                    Pisces and Cancer share intuitive understanding, emotional depth, and a natural sense of comfort. Cancer offers protection and stability; Pisces brings imagination and soulful sensitivity. Their connection flows with ease and heartfelt resonance. The dynamic feels warm, enveloping, and deeply intuitive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Leo — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Drama and dream
                  </p>
                  <p>
                    Leo expresses with boldness and warmth; Pisces expresses with softness and emotional subtlety. Pisces opens Leo's heart to vulnerability; Leo helps Pisces feel seen and uplifted. Their interaction blends courage with compassion in a vivid contrast. The connection feels tender, colourful, and emotionally expansive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Virgo — Opposites (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Opposite healers
                  </p>
                  <p>
                    Pisces moves through intuition and feeling; Virgo through analysis and structure — creating a classic, complementary polarity. Virgo brings clarity, grounding, and thoughtful intention; Pisces brings imagination, empathy, and emotional insight. Together they balance logic with intuition in a deeply meaningful way. The dynamic feels reflective, healing, and quietly transformative.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Libra — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft and romantic
                  </p>
                  <p>
                    Libra approaches through harmony and gentle reason; Pisces through emotion and imagination. Pisces adds depth and creativity; Libra adds calmness and aesthetic balance. Together they form an airy, artistic, and peaceful blend. The connection feels soft, graceful, and atmospherically warm.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Scorpio — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Deep water connection
                  </p>
                  <p>
                    A powerful emotional pairing marked by depth, intuition, and a strong unspoken bond. Scorpio provides protection and emotional intensity; Pisces brings empathy, softness, and spiritual warmth. Their connection holds profound emotional resonance. The dynamic feels soulful, enveloping, and transformational.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Sagittarius — Semi-Compatible (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Faith and feeling
                  </p>
                  <p>
                    Pisces expresses through emotion and inner sensitivity; Sagittarius through exploration and optimism. Sagittarius introduces perspective and openness; Pisces adds imagination and emotional presence. Their energies blend movement with feeling in a gentle, wide-ranging rhythm. The connection feels hopeful, fluid, and quietly uplifting.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Capricorn — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dream and discipline
                  </p>
                  <p>
                    Capricorn provides grounding, stability, and long-term vision; Pisces brings empathy, intuition, and emotional richness. Together they form a connection where structure meets depth and protection meets softness. Pisces softens Capricorn's reserve; Capricorn steadies Pisces' emotional world. The dynamic feels secure, tender, and deeply supportive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Aquarius — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Vision and feeling
                  </p>
                  <p>
                    Aquarius moves through ideals and insight; Pisces moves through emotion and spiritual sensitivity. Aquarius widens Pisces' perspective; Pisces deepens Aquarius' emotional awareness. Their blend forms a thoughtful, unusual connection with quiet complexity. The dynamic feels airy, reflective, and subtly intuitive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Pisces — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dreamy and deep
                  </p>
                  <p>
                    Two Pisces create a dreamy, intuitive, and deeply empathetic bond. Both understand each other's softness, imagination, and need for emotional sanctuary. The pairing feels soulful, atmospheric, and spiritually resonant. The connection flows with depth, creativity, and shared emotional vision.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Pisces" />
          </div>
        </div>
      </div>
    </div>
  )
}

