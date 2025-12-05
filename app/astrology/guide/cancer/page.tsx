"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabHeader from "@/components/AstroLabHeader"

export default function CancerPage() {
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
              <span className="text-4xl">♋</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Cancer
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              June 21 – July 22
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Water | Modality: Cardinal | Ruler: Moon
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Cancer is intuitive, protective, and emotionally deep. Ruled by the Moon, their moods ebb and flow like tides. They are the caretakers of the zodiac, guided by empathy and memory. Their intuition is strong; they sense what others feel before it's said.
                </p>
                <p>
                  Though gentle, they possess formidable inner strength. Cancer people crave security, family, and belonging. They dislike coldness or detachment and often shield vulnerability with humour or retreat. At their best, they are nurturing and loyal; at their worst, defensive or moody when unappreciated.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Cancer seeks emotional safety above all. Love for them means care, consistency, and trust. They remember every kindness — and every hurt. They need partners who are patient and who validate feelings rather than dismiss them. Acts of care (home-cooked meals, thoughtful messages) mean more than grand gestures.
                </p>
                <p>
                  Once safe, Cancer loves deeply and for the long haul. Their relationships thrive when both partners feel secure enough to share their softer sides. Their challenge: learning not to take every mood personally and to express needs directly.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  They flourish in environments that value empathy and human connection: counselling, teaching, healthcare, hospitality, and real estate. They excel in nurturing roles and often make workplaces feel like home.
                </p>
                <p>
                  Cancer's emotional intelligence makes them powerful leaders — intuitive yet protective. They build teams that feel like families and measure success not only in profits but in people's wellbeing.
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
                    Cancer × Aries — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft vs. sharp
                  </p>
                  <p>
                    Cancer is sensitive and protective; Aries is blunt and fast. Aries' directness can feel harsh, while Cancer's moods confuse Aries. There can be care here, but emotional safety and communication style are ongoing challenges.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Taurus — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Roots and comfort
                  </p>
                  <p>
                    Both signs value security, loyalty, and a cosy home base. Cancer brings nurturing and emotional awareness; Taurus brings patience, consistency, and practical support. The connection usually feels soothing and protective, as long as they don't cling to the past.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Gemini — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Feeling vs. framing
                  </p>
                  <p>
                    Cancer leads with emotion, Gemini with ideas. Gemini can help Cancer talk things through; Cancer can help Gemini feel things more deeply. The bond is workable but prone to misunderstandings if one talks while the other wants to be held.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Cancer — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Safe harbour or tidal pool
                  </p>
                  <p>
                    Two Cancers create a deeply caring, home-oriented bond. Emotional attunement is high, but so are mood swings and defensiveness. This match thrives when both practice clear communication instead of retreating into silence and expectation.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Leo — Semi-Compatible (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Heart and show
                  </p>
                  <p>
                    Both signs are protective and emotionally expressive, but in different ways. Cancer seeks quiet security; Leo seeks warmth and recognition. The pairing can feel romantic and loyal, yet disagreements about attention, privacy, and family roles can flare.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Virgo — Compatible (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Care and craft
                  </p>
                  <p>
                    Cancer offers emotional understanding; Virgo offers practical help and thoughtful detail. Together they create a supportive, service-oriented relationship where problems are met with both feeling and solutions. The risk is worry and over-functioning if they don't set limits.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Libra — Semi-Compatible (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Mood and manners
                  </p>
                  <p>
                    Cancer tunes into emotional undercurrents; Libra tunes into social harmony and fairness. Libra can help Cancer see other perspectives; Cancer can help Libra honour deeper feelings. Conflicts arise when Libra avoids tension and Cancer feels unseen.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Scorpio — Compatible (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Deep waters
                  </p>
                  <p>
                    Cancer and Scorpio share emotional intensity and strong attachment. Cancer brings care and softness; Scorpio brings depth, focus, and a fierce sense of loyalty. The bond can be powerful and healing, but jealousy and old hurts must be handled carefully.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Sagittarius — Mismatch (Water + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Nest vs. horizon
                  </p>
                  <p>
                    Cancer wants a safe, reliable base; Sagittarius wants freedom and space to explore. Each may feel the other is living the "wrong" priority. It can work in short bursts or with strong synastry elsewhere, but it rarely feels effortless.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Capricorn — Opposites (Water + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Home vs. world
                  </p>
                  <p>
                    Cancer and Capricorn sit opposite, reflecting themes of private life and public life. Cancer cares for the inner world; Capricorn for duty and structure. Together they can build something substantial, but the relationship often hinges on how they handle work, family, and boundaries.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Aquarius — Mismatch (Water + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Feeling vs. distance
                  </p>
                  <p>
                    Cancer seeks emotional bonding and reassurance; Aquarius values space and mental connection. Cancer may feel ignored or "studied"; Aquarius may feel overwhelmed by emotional needs. This match demands a lot of conscious effort to bridge two very different styles.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Cancer × Pisces — Same Element (Water + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Soft tide
                  </p>
                  <p>
                    Both signs are intuitive, emotional, and drawn to caring roles. Cancer provides protection and memory; Pisces adds imagination and spiritual or artistic depth. The relationship can be tender and dreamy, but needs structure so they don't drift into avoidance together.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Cancer" />
          </div>
        </div>
      </div>
    </div>
  )
}

