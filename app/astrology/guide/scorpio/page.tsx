"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function ScorpioPage() {
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
                    Intense and uncompromising
                  </p>
                  <p>
                    Aries moves with instinct and immediacy, while Scorpio acts through depth, intention, and emotional strategy. Their energies create a charged dynamic full of honesty and momentum on one side, intensity and devotion on the other. Aries stirs Scorpio's boldness; Scorpio deepens Aries' emotional awareness. The connection feels magnetic, demanding, and powerfully transformative.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Taurus — Opposites (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Deep and intense
                  </p>
                  <p>
                    Taurus offers steadiness, sensuality, and calm; Scorpio brings passion, depth, and emotional insight. Together they form a strong polarity rooted in loyalty, intensity, and grounded affection. Scorpio enriches Taurus' emotional world; Taurus stabilises Scorpio's powerful inner landscape. The dynamic feels enduring, magnetic, and deeply anchored.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Gemini — Mismatch (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Light vs. depth
                  </p>
                  <p>
                    Scorpio seeks emotional depth and clear commitment, while Gemini thrives on movement, exploration, and variety. Gemini brings brightness and perspective to Scorpio's depth; Scorpio adds substance and meaning to Gemini's world. Their rhythms differ but can complement each other when understood. The connection feels curious, contrasting, and mentally engaging.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Cancer — Compatible (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Intense and private
                  </p>
                  <p>
                    A natural emotional bond marked by intuition, loyalty, and shared depth. Cancer softens Scorpio's intensity with warmth and empathy; Scorpio strengthens Cancer's emotional confidence. Trust forms quickly in this pairing, creating a protective and resonant connection. The dynamic feels rich, heartfelt, and mutually grounding.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Leo — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Intense and dramatic
                  </p>
                  <p>
                    Leo expresses openly with warmth and charisma, while Scorpio moves more privately through emotion and intention. Leo brightens the dynamic with confidence; Scorpio adds depth, focus, and emotional clarity. Their contrast creates a strong but demanding interplay. The connection feels vivid, intense, and powerfully expressive.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Virgo — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Strategic and serious
                  </p>
                  <p>
                    Virgo offers thoughtful support and quiet reliability; Scorpio brings emotional truth and unwavering commitment. Together they form a purposeful, grounded pairing shaped by clarity and resilience. Virgo steadies Scorpio's depth; Scorpio enriches Virgo's emotional landscape. The dynamic feels strong, intentional, and deeply loyal.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Libra — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Smooth and intense
                  </p>
                  <p>
                    Libra approaches through balance and perspective, while Scorpio approaches through depth and emotional certainty. Libra softens Scorpio's intensity with calm communication; Scorpio deepens Libra's understanding with honesty and insight. Their energies contrast in a quietly complementary way. The connection feels layered, thoughtful, and subtly transformative.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Scorpio — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    All or nothing
                  </p>
                  <p>
                    Two Scorpios create a bond marked by passion, loyalty, and profound emotional recognition. Both understand the other's depth, intuition, and protective instincts. The pairing carries immense emotional power and intensity. The dynamic feels magnetic, consuming, and deeply unspoken.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Sagittarius — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Edgy and honest
                  </p>
                  <p>
                    Scorpio moves through depth and focus; Sagittarius moves through freedom and discovery. Sagittarius opens Scorpio's perspective with optimism; Scorpio offers emotional richness and introspection. Their contrast creates a dynamic of growth and recalibration. The connection feels spirited, challenging, and full of contrast.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Capricorn — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Focused and formidable
                  </p>
                  <p>
                    A strong, steady bond built on resilience, loyalty, and shared ambition. Capricorn contributes structure and long-term vision; Scorpio adds emotional insight and dedication. Together they form a powerful, goal-oriented partnership. The dynamic feels grounded, strategic, and deeply connected.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Aquarius — Mismatch (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Intensity vs. detachment
                  </p>
                  <p>
                    Scorpio leads with emotional truth and intensity; Aquarius leads with ideals and forward-thinking clarity. Aquarius expands Scorpio's world intellectually; Scorpio deepens Aquarius' emotional awareness. Their differences are significant but compelling. The connection feels complex, spacious, and mentally stimulating.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Scorpio × Pisces — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Deep water connection
                  </p>
                  <p>
                    A deeply intuitive pairing where emotional understanding flows freely. Pisces brings softness, imagination, and empathy; Scorpio brings protection, passion, and emotional depth. Together they form a soulful, enveloping bond. The dynamic feels mystical, heartfelt, and profoundly connective.
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

