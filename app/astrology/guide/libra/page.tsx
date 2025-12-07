"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function LibraPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

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

            <CompatibilitySection currentSign="libra" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Libra" />
          </div>
        </div>
      </div>
    </div>
  )
}
