"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabHeader from "@/components/AstroLabHeader"

export default function PiscesPage() {
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
                    Pisces × Aries — Semi-Compatible (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dream and drive
                  </p>
                  <p>
                    Pisces moves through intuition and emotion; Aries through direct action. Aries can protect and energise Pisces; Pisces can soften Aries and add empathy. The mix is touching but delicate, requiring honest communication and good boundaries.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Taurus — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Dreams with soil
                  </p>
                  <p>
                    Taurus offers stability and practical care; Pisces offers imagination, sensitivity, and emotional colour. Taurus helps give Pisces' visions a solid base; Pisces keeps Taurus from becoming too rigid. The relationship often feels gentle and quietly secure.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Gemini — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Waves and words
                  </p>
                  <p>
                    Pisces senses, Gemini explains. Gemini can help Pisces sort and name feelings; Pisces helps Gemini feel beyond the rational. The connection can be creative and confusing, needing extra clarity to prevent crossed wires.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Cancer — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Safe tide
                  </p>
                  <p>
                    Both are compassionate and emotionally tuned-in. Cancer brings protection and memory; Pisces brings imagination and spiritual or artistic depth. The match can be deeply nurturing, but must guard against shared avoidance and over-attachment.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Leo — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Stage and dream
                  </p>
                  <p>
                    Leo wants visible expression and clear recognition; Pisces wants subtle emotional and imaginative connection. Leo can offer protection and warmth; Pisces offers inspiration and empathy. The dynamic is romantic but can be ungrounded without practical agreements.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Virgo — Opposites (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Chaos and order
                  </p>
                  <p>
                    Pisces and Virgo mirror each other's blind spots and strengths. Virgo brings analysis, boundaries, and practicality; Pisces brings compassion, intuition, and surrender. It can be a healing match or a frustrating one, depending on how kindly they view each other's differences.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Libra — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft focus romance
                  </p>
                  <p>
                    Libra seeks harmony and aesthetic balance; Pisces seeks emotional and spiritual connection. Together they can create a charming, romantic atmosphere. But decision-making and boundaries can blur unless someone chooses to lead clearly.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Scorpio — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Mystic depth
                  </p>
                  <p>
                    Scorpio offers intensity, focus, and emotional courage; Pisces offers empathy, forgiveness, and imagination. The bond can feel soulful, even fated. The challenge is avoiding co-dependence and drama disguised as destiny.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Sagittarius — Semi-Compatible (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Faith and freedom
                  </p>
                  <p>
                    Both are idealistic and oriented toward something larger than themselves. Sagittarius looks for truth in exploration; Pisces finds it in feeling and symbolism. The relationship can be inspiring, yet everyday routines and practicalities can easily slip.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Capricorn — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Vision anchored
                  </p>
                  <p>
                    Capricorn gives Pisces structure, protection, and a container for their dreams. Pisces softens Capricorn's edges and reminds them of the inner life. The match can be quietly strong, as long as Capricorn doesn't dismiss feelings and Pisces doesn't disappear into fantasy.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Aquarius — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cloud and current
                  </p>
                  <p>
                    Aquarius thinks about humanity; Pisces feels it. Aquarius offers perspective and detachment; Pisces offers compassion and emotional nuance. The connection can be subtly profound, but they must work to stay grounded and present.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pisces × Pisces — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Double dream
                  </p>
                  <p>
                    Two Pisceans create a sensitive, intuitive, and often otherworldly bond. The empathy is deep, but so is the temptation to escape reality together. This pairing needs clear boundaries, routines, and honesty to turn shared dreams into something livable.
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

