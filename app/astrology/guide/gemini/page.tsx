"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabHeader from "@/components/AstroLabHeader"

export default function GeminiPage() {
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
              <span className="text-4xl">♊</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Gemini
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              May 21 – June 20
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Air | Modality: Mutable | Ruler: Mercury
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Gemini is quick, curious, and versatile. Ruled by Mercury, it governs communication, ideas, and adaptability. Geminis crave stimulation — mentally, socially, and creatively. They love words, stories, and exchange. Their gift is perspective: seeing both sides of a situation with wit and flexibility.
                </p>
                <p>
                  They can juggle many interests but risk spreading themselves too thin. Restless by nature, they thrive on change and novelty. Geminis are social chameleons who easily blend into new circles yet rarely reveal their full inner world.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  In love, Gemini needs connection of the mind first. Conversation, humour, and shared curiosity are aphrodisiacs. They enjoy lightness, play, and variety, but avoid clingy or overly intense partners. They express affection through words and clever banter, preferring relationships that feel alive and evolving.
                </p>
                <p>
                  Their challenge lies in staying present during emotional depth. Once they learn that intimacy doesn't mean boredom, Gemini becomes a loyal and endlessly interesting partner.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Gemini excels in communication-driven fields: writing, media, marketing, teaching, public relations, journalism, and technology. They adapt quickly and multitask with ease. They need intellectual freedom and fast-moving environments.
                </p>
                <p>
                  Repetitive routines stifle them. When trusted with autonomy and variety, Geminis innovate constantly and connect people and ideas that others overlook.
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
                    Gemini × Aries — Compatible (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Quick and curious
                  </p>
                  <p>
                    Both thrive on movement, novelty, and direct energy. Aries brings boldness and initiative; Gemini brings ideas, humour, and mental agility. The dynamic feels fast and playful, though it needs grounding to become more than an endless first date.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Taurus — Semi-Compatible (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Wind over soil
                  </p>
                  <p>
                    Gemini wants variety and conversation; Taurus wants calm and predictability. Taurus can steady Gemini and help ideas become real; Gemini keeps Taurus from getting stuck in routine. It works when they respect each other's pace instead of trying to "fix" it.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Gemini — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Mirror minds
                  </p>
                  <p>
                    Two Geminis create a lively, talkative, and changeable bond. There's no shortage of topics, jokes, or social plans, but emotional grounding can be thin. This pairing shines when both commit to some follow-through instead of keeping every option open forever.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Cancer — Semi-Compatible (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Head meets heart
                  </p>
                  <p>
                    Gemini leads with words and ideas; Cancer leads with feelings and tone. Cancer can deepen Gemini's world beyond banter, while Gemini helps Cancer put emotions into perspective. Misunderstandings appear when Cancer takes everything to heart and Gemini treats emotion like just another topic.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Leo — Compatible (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Playful and expressive
                  </p>
                  <p>
                    Leo brings warmth, charisma, and loyalty; Gemini brings wit, adaptability, and social sparkle. The connection often feels bright and entertaining, especially in public. Trouble shows up if Gemini deflects serious issues with humour or Leo demands more focus than Gemini can give.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Virgo — Same Ruler (Mercury); Semi-Compatible (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Analyst and juggler
                  </p>
                  <p>
                    Both signs are Mercurial but use it differently: Gemini scatters and samples; Virgo refines and organises. They can be a clever, problem-solving duo, yet also critical and anxious. This match works best when they use their brains to support each other, not dissect each other.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Libra — Same Element (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Social flow
                  </p>
                  <p>
                    Gemini and Libra both enjoy conversation, ideas, and people. Libra adds charm, tact, and a feel for balance; Gemini adds speed, humour, and flexibility. The pairing is usually easy and stylish, though decisions and deeper commitments can drift if no one takes the lead.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Scorpio — Mismatch (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Surface vs. depth
                  </p>
                  <p>
                    Gemini moves quickly from topic to topic; Scorpio wants sustained focus and emotional honesty. Scorpio may see Gemini as evasive or shallow; Gemini may feel scrutinised or weighed down. The connection can be fascinating but often intense and draining over time.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Sagittarius — Opposites (Air + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Restless axis
                  </p>
                  <p>
                    Gemini collects bits of information; Sagittarius looks for meaning and big-picture truth. Both are curious and freedom-loving, but in opposite directions. The chemistry is real and often fun, yet the relationship constantly asks them to balance scattered interests with shared direction.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Capricorn — Mismatch (Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Talk vs. track record
                  </p>
                  <p>
                    Capricorn focuses on structure, responsibility, and results; Gemini on options, links, and ideas. Capricorn may see Gemini as unreliable; Gemini may see Capricorn as rigid. They can respect each other, but in romance it usually feels like different languages.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Aquarius — Compatible (Air + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Ideas on ideas
                  </p>
                  <p>
                    Both live strongly in the mental realm and value independence. Gemini brings improvisation and social variety; Aquarius brings perspective, originality, and a cause-driven streak. The connection feels stimulating and future-facing, but needs conscious emotional warmth to avoid staying in "interesting conversation" mode.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Pisces — Semi-Compatible (Air + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Words and waves
                  </p>
                  <p>
                    Pisces relates through feeling and atmosphere; Gemini through words and analysis. Pisces can add compassion and imagination to Gemini's life; Gemini offers perspective and humour. It's a poetic but slippery mix that needs clear boundaries and honest check-ins.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Gemini" />
          </div>
        </div>
      </div>
    </div>
  )
}

