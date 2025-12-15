"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function GeminiPage() {
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
                    Gemini and Aries both thrive on movement, novelty, and direct energy. Aries brings boldness and initiative; Gemini brings ideas, humour, and mental agility. The dynamic feels fast, playful, and stimulating, though it can skim the surface if no one slows down to build emotional depth.
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
                    Gemini wants variety and conversation; Taurus wants calm, comfort, and consistency. Taurus can steady Gemini and turn some ideas into something real, while Gemini keeps Taurus from getting stuck in routine. The pairing works when they respect each other's pace, not when Taurus pushes for stillness and Gemini pushes for constant change.
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
                    Two Geminis create a lively, talkative bond full of jokes, tangents, and shared curiosity. There's usually no shortage of topics or social life, but grounding and emotional follow-through can be thin. This match feels light and mentally electric, and does best when both commit to a few solid plans instead of keeping every door open.
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
                    Gemini leads with ideas and words; Cancer leads with feelings and emotional tone. Cancer can deepen Gemini's world beyond banter, while Gemini helps Cancer name and reframe what they're feeling. The connection can be sweet and intimate, but miscommunications are common if Cancer takes everything personally and Gemini treats emotions like just another topic.
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
                    Gemini and Leo tend to have fun together quickly. Leo brings warmth, loyalty, and a clear sense of self; Gemini brings wit, adaptability, and social spark. The relationship often feels bright and entertaining, especially socially, as long as Gemini doesn't deflect everything with jokes and Leo doesn't demand constant centre stage.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Gemini × Virgo — Same Element by Mode (Mutable + Mutable; Air + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Analyst and juggler
                  </p>
                  <p>
                    Both Gemini and Virgo are ruled by Mercury, but use it differently: Gemini scatters, Virgo sorts. Gemini supplies options, stories, and experiments; Virgo applies analysis, discernment, and practical edits. The dynamic can be clever and productive, but also anxious or nitpicky if they overthink each other instead of enjoying the connection.
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
                    Gemini and Libra share an ease with conversation, ideas, and people. Libra adds charm, grace, and a feel for harmony; Gemini adds speed, humour, and flexibility. This pairing usually feels light, sociable, and aesthetically pleasing, but decisions and deeper emotional commitments can take a while if no one wants to break the pleasant mood.
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
                    Gemini moves quickly between topics and moods; Scorpio wants depth, focus, and emotional honesty. Scorpio can feel Gemini avoids real intimacy; Gemini can feel weighed down by Scorpio's intensity and need for certainty. The connection can be fascinating but often demanding, better suited to short intense chapters than easy long-term flow.
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
                    Gemini and Sagittarius sit opposite each other, sharing curiosity and a love of freedom but aiming it in different directions. Gemini collects bits of information; Sagittarius searches for big meanings and overarching truths. The pairing can feel exciting, honest, and adventure-prone, yet it constantly asks them to balance scattered interests with shared direction.
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
                    Capricorn focuses on results, responsibility, and long-term plans; Gemini focuses on options, connections, and ideas. Capricorn may see Gemini as unreliable or distracted; Gemini may see Capricorn as rigid or overly serious. This match can work around shared projects, but in romance it often feels like different languages unless both bend more than they're used to.
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
                    Gemini and Aquarius both live strongly in the mental realm, valuing curiosity, independence, and open-mindedness. Gemini brings improvisation and social variety; Aquarius brings vision, perspective, and a taste for the unconventional. The connection feels stimulating and future-focused, though they'll need to consciously cultivate emotional warmth, not just interesting conversations.
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
                    Gemini relates through language and logic; Pisces relates through feeling and atmosphere. Pisces can add compassion, imagination, and emotional nuance to Gemini's world, while Gemini offers perspective and a way to step back from overwhelm. The bond can be poetic and confusing at the same time, needing clear boundaries and extra patience on both sides.
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

