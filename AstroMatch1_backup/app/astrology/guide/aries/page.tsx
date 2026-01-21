"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function AriesPage() {
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
              <span className="text-4xl">♈</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Aries
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              March 21 – April 19
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

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Compatibility with Other Signs
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Aries — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    All gas, no brakes
                  </p>
                  <p>
                    Two Aries create a hot, impulsive, and straightforward connection that moves fast into attraction or conflict. There's big chemistry and shared courage, but also ego clashes and a tendency to react before thinking. This pairing works best when both learn to pause, apologise, and share leadership instead of racing each other.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Taurus — Semi-Compatible (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Spark meets stillness
                  </p>
                  <p>
                    Aries wants speed, change, and direct action; Taurus prefers stability, routine, and slow decisions. Taurus can calm Aries and provide reliability, while Aries nudges Taurus out of ruts. The connection can feel solid yet frustrating if they don't respect each other's very different pace.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Gemini — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Quick and curious
                  </p>
                  <p>
                    Aries and Gemini both like movement, novelty, and spontaneity. Aries brings raw drive and initiative; Gemini brings ideas, humour, and mental flexibility. The dynamic feels light, fast, and playful, though it needs a bit of grounding to keep promises from dissolving into "we'll see."
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Cancer — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Heat and shell
                  </p>
                  <p>
                    Cancer leads with emotion and protection, while Aries leads with blunt action and instinct. Aries can easily scorch Cancer's sensitivities; Cancer can feel clingy or confusing to Aries' direct style. This pairing demands extra care and patience if they want passion without ongoing hurt feelings.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Leo — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Big, bright energy
                  </p>
                  <p>
                    Aries and Leo ignite quickly with shared fire, confidence, and appetite for life. Aries pushes for new experiences; Leo brings warmth, loyalty, and creative flair. The connection feels bold, romantic, and expressive, as long as they don't turn everything into a competition about who's the main character.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Virgo — Semi-Compatible (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Impulse and precision
                  </p>
                  <p>
                    Aries moves first and thinks later; Virgo thinks thoroughly and moves carefully. Virgo can refine Aries' raw ideas, while Aries helps Virgo act before over-analysing. The bond can be productive and surprisingly supportive, but criticism and impatience have to be handled gently.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Libra — Opposites (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pull between "me" and "we"
                  </p>
                  <p>
                    Aries is direct, self-driven, and impulsive; Libra is relational, diplomatic, and focused on balance. The polarity is magnetic and often very attractive, but it constantly asks them to negotiate independence vs. partnership. When they respect each other's style, this is a classic high-spark, low-auto-pilot match.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Scorpio — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Shared edge, different depths
                  </p>
                  <p>
                    Both signs are intense and ruled by Mars themes, but Aries burns hot and fast while Scorpio moves slowly and deeply. Aries wants clear, simple conflict and resolution; Scorpio tracks subtext and remembers everything. The connection can be powerful and obsessive, yet emotionally heavy if neither softens their approach.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Sagittarius — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Adventure allies
                  </p>
                  <p>
                    Aries and Sagittarius share a love of freedom, honesty, and movement. Aries brings initiative and immediate action; Sagittarius brings optimism, humour, and big-picture vision. The dynamic feels upbeat, adventurous, and naturally compatible, as long as someone keeps an eye on follow-through.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Capricorn — Mismatch (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Impulse vs. strategy
                  </p>
                  <p>
                    Capricorn plans, structures, and plays the long game; Aries dives in and adjusts on the fly. Capricorn may see Aries as reckless; Aries may see Capricorn as restrictive or overly serious. The connection can be formidable when they're aligned on a goal, but it rarely feels effortless.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Aquarius — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Rebel team-up
                  </p>
                  <p>
                    Aries and Aquarius both value independence, directness, and doing things their own way. Aries supplies raw courage and action; Aquarius brings perspective, originality, and a cooler head. The relationship feels progressive, slightly unconventional, and energising, though both have to remember to show up emotionally, not just mentally.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Pisces — Semi-Compatible (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Blade and mist
                  </p>
                  <p>
                    Pisces moves through intuition, mood, and subtle signals, while Aries prefers clear, fast decisions. Aries can protect and motivate Pisces; Pisces can soften Aries and introduce empathy and imagination. The bond can be touching and creative, but also confusing if Aries pushes too hard or Pisces drifts away instead of speaking up.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Aries" />
          </div>
        </div>
      </div>
    </div>
  )
}

