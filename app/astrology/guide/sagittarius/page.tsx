"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function SagittariusPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const sunSignSystem = useSunSignSystem()

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24`}
    >
      <div className="relative z-10">
        <AstroLabNavigationHeader theme={theme} setTheme={setTheme} />

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
              {sunSignSystem === 'sidereal' ? 'December 16 – January 14' : 'November 22 – December 21'}
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

            <CompatibilitySection currentSign="sagittarius" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Sagittarius" />
          </div>
        </div>
      </div>
    </div>
  )
}
