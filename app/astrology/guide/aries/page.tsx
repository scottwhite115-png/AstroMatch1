"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabHeader from "@/components/AstroLabHeader"

export default function AriesPage() {
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
          onMenuClick={() => router.push('/astrology')} 
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
                    Two Aries light up fast with passion, honesty, and instinct. There's big chemistry and a low tolerance for boredom, but also ego clashes and impulsive decisions. This works best when both learn to pause, apologise, and share the steering wheel.
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
                    Aries wants speed and change; Taurus wants calm and security. Taurus can ground Aries and make life more stable, while Aries pushes Taurus to move and take risks. It works when they respect each other's pace instead of treating it as a flaw.
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
                    Both signs thrive on movement and novelty. Aries brings drive and blunt courage; Gemini brings ideas, humour, and mental agility. The energy feels light, fast, and playful, though they need some grounding or things stay at the "fun but unfinished" stage.
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
                    Aries is direct and confrontational; Cancer is protective and sensitive. Aries can accidentally trample Cancer's feelings, while Cancer's indirect moods frustrate Aries. There's care here, but it demands extra patience and emotional skill to avoid constant misunderstandings.
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
                    Strong attraction, shared confidence, and a love of drama. Aries pushes for new experiences; Leo brings loyalty, warmth, and pride. The match feels bold and romantic, as long as they cheer each other on instead of competing over who's the star.
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
                    Aries jumps in; Virgo fine-tunes. Virgo can turn Aries' raw push into something effective, while Aries stops Virgo from overthinking. This pairing can be productive, but criticism and impatience need to be managed carefully or resentment builds.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Libra — Opposites (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Me vs. we
                  </p>
                  <p>
                    Aries is self-led and blunt; Libra is partnership-focused and diplomatic. The polarity is attractive and often sexy, but there's a constant tug-of-war between independence and harmony. It works when both engage honestly instead of framing the other as "selfish" or "needy."
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Aries × Scorpio — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Flash vs. depth
                  </p>
                  <p>
                    Both are intense and ruled by Mars themes, yet in different ways. Aries burns hot and fast; Scorpio digs deep and moves slowly. The connection can be powerful and magnetic, but emotional power struggles and trust issues are common if neither softens.
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
                    Aries and Sagittarius both love freedom, honesty, and action. Aries brings initiative and immediate drive; Sagittarius brings optimism, humour, and big-picture vision. The relationship feels like a shared quest, though someone has to remember practical details.
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
                    Capricorn plays the long game; Aries wants fast results. Capricorn may see Aries as reckless; Aries may see Capricorn as controlling or pessimistic. They're powerful as a team on shared goals, but personally it often feels like brakes versus accelerator.
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
                    Both signs value independence, candour, and doing things differently. Aries supplies raw courage and push; Aquarius contributes perspective, originality, and a cooler head. The bond feels progressive and energising, but they must remember emotional presence, not just plans and ideas.
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
                    Pisces moves through feeling and nuance; Aries through clarity and action. Aries can protect and activate Pisces; Pisces can soften Aries and add empathy. It's a delicate mix that works only if Aries slows down and Pisces doesn't vanish into avoidance.
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

