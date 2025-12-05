"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabHeader from "@/components/AstroLabHeader"

export default function SagittariusPage() {
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
                    Adventure fire
                  </p>
                  <p>
                    Both signs are bold, straightforward, and restless. Aries supplies raw drive; Sagittarius offers optimism and a bigger vision. The relationship often feels like a shared road trip—fun and energising, though someone must eventually handle logistics.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Taurus — Mismatch (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Wander vs. nest
                  </p>
                  <p>
                    Sagittarius wants exploration and open horizons; Taurus wants a secure, predictable base. Each can see the other as limiting their freedom or safety. There's learning here, but everyday compatibility can be tricky.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Gemini — Opposites (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Student and teacher, both ways
                  </p>
                  <p>
                    Both are curious and freedom-loving, but Sagittarius seeks overarching meaning while Gemini collects facts and stories. They can be great travel or debate partners. The challenge is committing to a shared path instead of just sharing a phase.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Cancer — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Hearth vs. horizon
                  </p>
                  <p>
                    Cancer seeks emotional continuity and home; Sagittarius seeks growth through movement and change. Cancer may feel abandoned; Sagittarius may feel smothered. This pairing requires unusually high maturity to balance both needs.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Leo — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Festival energy
                  </p>
                  <p>
                    Sagittarius and Leo share enthusiasm, warmth, and a taste for drama. Leo offers loyalty and heart; Sagittarius offers humour and adventure. The relationship often feels celebratory, but responsibilities can be pushed aside if no one grounds it.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Virgo — Mismatch (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Story vs. spreadsheet
                  </p>
                  <p>
                    Virgo wants detail and precision; Sagittarius wants broad strokes and possibility. Virgo may see Sagittarius as careless; Sagittarius may see Virgo as nitpicky. Respect for each other's role is essential if this is going to work.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Libra — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Light and bright
                  </p>
                  <p>
                    Both signs enjoy social life, ideas, and a measure of freedom. Libra brings charm and relational awareness; Sagittarius brings honesty and adventure. The connection feels upbeat and engaging, though deeper emotional work can be delayed.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Scorpio — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Truth vs. control
                  </p>
                  <p>
                    Sagittarius is blunt and future-focused; Scorpio is guarded and past-aware. Scorpio may feel exposed by Sagittarius' openness; Sagittarius may feel trapped by Scorpio's intensity. Growth is possible, but it's rarely a "light" match.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Sagittarius — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Two wild cards
                  </p>
                  <p>
                    Two Sagittarians create a high-energy, exploratory relationship. Shared humour, bluntness, and love of space abound. Commitment and consistency are the main challenges; this works when they choose each other as consciously as they choose freedom.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Capricorn — Semi-Compatible (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Vision and structure
                  </p>
                  <p>
                    Sagittarius dreams big and pushes outward; Capricorn builds and contains. Together they can achieve a lot—Sagittarius opens doors, Capricorn keeps them stable. Friction appears around rules, timing, and how much risk is acceptable.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Aquarius — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Future friends
                  </p>
                  <p>
                    Both signs look ahead, not back. Sagittarius brings enthusiasm and philosophical curiosity; Aquarius brings ideas about systems and change. The connection feels open, progressive, and relatively low-drama, though emotional depth must be chosen intentionally.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Sagittarius × Pisces — Semi-Compatible (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Faith and fantasy
                  </p>
                  <p>
                    Both are idealistic and drawn to meaning beyond the material. Sagittarius seeks truth out there; Pisces feels it in here. The relationship can be inspiring and creative, but practical life and boundaries can blur if they're not careful.
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

