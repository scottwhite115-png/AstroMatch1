"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"
import { CompatibilitySection } from "@/app/astrology/_components/CompatibilitySection"

export default function AriesPage() {
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
              <span className="text-4xl">♈</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Aries
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              {sunSignSystem === 'sidereal' ? 'April 13 – May 14' : 'March 21 – April 19'}
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Fire | Modality: Cardinal | Ruler: Mars
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Aries is the first spark of the zodiac — direct, daring, and full of momentum. As a cardinal Fire sign ruled by Mars, Aries is driven by action, passion, and the thrill of beginning something new. They thrive on challenges and often feel most alive when leading or competing. Straightforward and decisive, they'd rather make a bold move and fix mistakes later than wait in hesitation.
                </p>
                <p>
                  Aries people radiate vitality and courage, inspiring others through confidence and initiative. Their honesty is refreshing, though it can border on bluntness. They're quick to forgive, quick to move, and sometimes too quick to judge. Beneath their fiery exterior is a sincere desire to carve their own path and protect those they love. When grounded in self-awareness, Aries becomes a force of nature — passionate, pioneering, and unafraid to chase life head-on.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  In love, Aries wants authenticity, chemistry, and adventure. They fall hard and fast, preferring clear signals to subtle games. Their ideal partner is strong enough to keep up but secure enough not to compete. They adore enthusiasm, affection, and direct communication. Boredom or indecision can turn them off quickly; passion, play, and mutual respect keep them engaged.
                </p>
                <p>
                  Once committed, Aries is protective and loyal, though they may need to learn patience and empathy when tempers flare. They respond best to partners who can challenge them in healthy ways — matching their drive without stifling their independence. The healthiest Aries relationships are dynamic and growth-oriented, built on honesty, shared goals, and the freedom to keep evolving.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Aries excels in any field that rewards courage, innovation, and initiative. They are natural self-starters who prefer action over discussion. Leadership, entrepreneurship, sports, emergency services, sales, the military, performing arts, and technology all appeal to their bold spirit. They do best when they can see immediate results and feel ownership over their success.
                </p>
                <p>
                  Routine and heavy bureaucracy drain them; autonomy and clear challenges fuel them. Aries learns over time that real success requires discipline as well as daring. When they master patience without losing their fire, they become unstoppable — the pioneer who opens doors for others through their bravery and conviction.
                </p>
              </div>
            </div>

            <CompatibilitySection currentSign="aries" type="western" theme={theme} />

            <SunSignCompatibilityTable sign="Aries" />
          </div>
        </div>
      </div>
    </div>
  )
}
