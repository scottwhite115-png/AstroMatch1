"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabHeader from "@/components/AstroLabHeader"

export default function AquariusPage() {
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
                    Rebel alliance
                  </p>
                  <p>
                    Aquarius and Aries both value independence and directness. Aries brings courage and immediate action; Aquarius brings strategy and long-range vision. The connection feels energising and future-focused, though they need to consciously show emotional care.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Taurus — Semi-Compatible (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Future vs. familiar
                  </p>
                  <p>
                    Aquarius is drawn to the unconventional; Taurus to the tried-and-true. Aquarius opens doors to new ideas and lifestyles; Taurus anchors the pair in reality. The pairing can be rich and frustrating, often arguing about what "security" really means.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Gemini — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Ideas on ideas
                  </p>
                  <p>
                    Both signs thrive on conversation and mental stimulation. Gemini offers flexibility and social variety; Aquarius offers perspective, eccentricity, and a cause-driven streak. The relationship feels lively and intellectually engaging, but can float if feelings aren't named.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Cancer — Mismatch (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Detachment vs. closeness
                  </p>
                  <p>
                    Cancer wants emotional reassurance and homey bonding; Aquarius wants space and connection through ideas or shared causes. Cancer may feel sidelined; Aquarius may feel smothered. This match requires conscious, ongoing translation between head and heart.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Leo — Opposites (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Star and satellite
                  </p>
                  <p>
                    Aquarius and Leo sit opposite each other. Leo brings personal passion and visibility; Aquarius brings group focus and objectivity. The connection can be magnetic and creative, but tension arises between individual drama and collective ideals.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Virgo — Semi-Compatible (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Theory and method
                  </p>
                  <p>
                    Aquarius imagines new systems; Virgo refines existing ones. Virgo can help Aquarius implement ideas; Aquarius helps Virgo see beyond immediate flaws. The bond is mentally rich and useful, though emotional intimacy must be built consciously.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Libra — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Diplomat and reformer
                  </p>
                  <p>
                    Both care about fairness and social dynamics. Libra handles one-on-one harmony; Aquarius looks at broader systems. Together they can be charming and principled, though they may postpone hard emotional talks in favour of discussion and ideals.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Scorpio — Semi-Compatible (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fixed intensity
                  </p>
                  <p>
                    Both are fixed and intense, but Aquarius channels it through ideas while Scorpio channels it through emotion. They can challenge each other profoundly. The relationship can feel like a long-running negotiation over control, truth, and freedom.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Sagittarius — Compatible (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Big sky thinkers
                  </p>
                  <p>
                    Aquarius and Sagittarius both look beyond the here-and-now. Sagittarius brings humour, adventure, and a quest for meaning; Aquarius brings innovation and concern for the bigger picture. The connection feels open, stimulating, and fairly low-drama.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Capricorn — Semi-Compatible (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    System architects
                  </p>
                  <p>
                    Capricorn manages structures as they are; Aquarius wants to evolve them. Together they can build or reform institutions, projects, or shared plans. Personally, they need to work at emotional warmth, not just shared responsibility.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Aquarius — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Echo chamber of ideas
                  </p>
                  <p>
                    Two Aquarians create a mentally electric, unusual, and often friend-based bond. Shared values of autonomy and authenticity are strong. The risk is drifting into parallel lives with lots of theory and not enough emotional anchoring.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aquarius × Pisces — Semi-Compatible (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cosmos and ocean
                  </p>
                  <p>
                    Pisces feels into the collective; Aquarius thinks about it. Pisces brings compassion and softness; Aquarius brings clarity and distance. This can be a quietly spiritual match, but everyday life can feel vague unless someone grounds it.
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

