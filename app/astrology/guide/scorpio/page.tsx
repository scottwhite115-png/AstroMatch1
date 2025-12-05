"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabHeader from "@/components/AstroLabHeader"

export default function ScorpioPage() {
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
              <span className="text-4xl">♏</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Scorpio
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              October 23 – November 21
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Water | Modality: Fixed | Ruler: Pluto (traditional ruler Mars)
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Scorpio is the sign of transformation — intense, private, and powerful. Fixed Water gives emotional depth, endurance, and insight. They see beyond appearances, often sensing what others hide. They are not afraid of the dark or the truth; in fact, they're drawn to both.
                </p>
                <p>
                  Scorpios crave authenticity and detest superficiality. They can be reserved, but their feelings run deep. At best, they are healers, protectors, and strategists; at worst, they can slip into control or suspicion. Trust is sacred to them — once earned, it's forever, but betrayal cuts deep.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Scorpio loves with totality. They want emotional and physical intimacy that feels transformative. They expect honesty and loyalty and give it in return.
                </p>
                <p>
                  Their love is magnetic and protective, but they need partners who can handle intensity and privacy. They dislike manipulation yet can unintentionally test commitment. When they feel safe, they open up to profound passion and devotion.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Scorpio thrives in fields demanding focus, strategy, or emotional insight: psychology, investigation, finance, surgery, crisis management, research, or any transformative work. They prefer depth over breadth and impact over noise.
                </p>
                <p>
                  Their power lies in persistence and precision. When channelled positively, Scorpio becomes a catalyst for growth — guiding people or systems through renewal and rebirth.
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
                    Scorpio × Aries — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Depth vs. blaze
                  </p>
                  <p>
                    Scorpio moves slowly and intensely; Aries moves quickly and openly. The attraction can be strong, but so are power struggles. Scorpio seeks emotional honesty; Aries seeks direct action, and they may clash over what "honest" really looks like.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Taurus — Opposites (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Possession and surrender
                  </p>
                  <p>
                    Both signs are fixed and focused on security, but in different realms. Taurus cares about material and bodily comfort; Scorpio about emotional and psychological bonds. This can be a deep, long-lasting match or a stubborn deadlock.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Gemini — Mismatch (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    X-ray vs. snapshot
                  </p>
                  <p>
                    Scorpio wants depth and consistency; Gemini wants movement and variety. Scorpio may see Gemini as slippery; Gemini may find Scorpio intense or suspicious. Fascination is possible, but so is mutual mistrust.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Cancer — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Deep tide
                  </p>
                  <p>
                    Scorpio and Cancer both value emotional loyalty and privacy. Cancer offers care and softness; Scorpio offers depth and staying power. The bond can feel family-like and protective, but needs trust, not tests, to stay healthy.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Leo — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Power faces
                  </p>
                  <p>
                    Leo wants to be seen; Scorpio wants to see what's hidden. Both have strong pride and dislike feeling controlled. The connection can be sexy and dramatic, but who holds power becomes a recurring theme.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Virgo — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Strategic support
                  </p>
                  <p>
                    Virgo and Scorpio both notice what others miss. Virgo brings analysis and practical solutions; Scorpio brings insight and emotional focus. Together they can tackle life's messes effectively, but they should avoid bonding only over problems.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Libra — Mismatch (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Polite vs. piercing
                  </p>
                  <p>
                    Scorpio seeks raw truth; Libra seeks balanced interaction. Scorpio may find Libra evasive; Libra may feel overwhelmed by Scorpio's intensity. This pair must decide whether they can meet in the middle or if they're always negotiating depth vs. comfort.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Scorpio — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Intensity mirrored
                  </p>
                  <p>
                    Two Scorpios create a powerful, private, and emotionally charged relationship. They understand each other's need for depth and loyalty, but also share jealousy and a tendency to hold grudges. This can be transformative or toxic; it rarely feels neutral.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Sagittarius — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Secrets vs. bluntness
                  </p>
                  <p>
                    Scorpio is private and strategic; Sagittarius is open and straightforward. Scorpio may see Sagittarius as careless; Sagittarius may see Scorpio as heavy or controlling. There's potential for growth, but it often feels like work.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Capricorn — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Serious alliance
                  </p>
                  <p>
                    Both signs are determined and future-oriented. Scorpio brings emotional depth and focus; Capricorn brings structure, ambition, and steadiness. The connection feels serious and committed, though they need room for softness to avoid life becoming all duty.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Aquarius — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fixated minds
                  </p>
                  <p>
                    Both are fixed signs with strong opinions, but express it differently. Scorpio operates emotionally and instinctively; Aquarius intellectually and idealistically. They can bond over intensity and conviction, yet struggle when neither will shift their stance.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Pisces — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Mystic waters
                  </p>
                  <p>
                    Scorpio and Pisces both tune into the unseen. Pisces brings compassion and imagination; Scorpio brings focus and emotional courage. The bond can feel soulful and healing, but they must guard against shared escapism or martyrdom.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Scorpio" />
          </div>
        </div>
      </div>
    </div>
  )
}

