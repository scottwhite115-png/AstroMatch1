"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SunSignCompatibilityTable } from "@/components/SunSignCompatibilityTable"
import AstroLabHeader from "@/components/AstroLabHeader"

export default function LeoPage() {
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
              <span className="text-4xl">♌</span>
              <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Leo
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
            <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              July 23 – August 22
            </div>

            <div>
              <p className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                Element: Fire | Modality: Fixed | Ruler: Sun
              </p>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Personality
              </h2>
              <div className="space-y-3">
                <p>
                  Leo shines. Ruled by the Sun, this sign radiates vitality, charisma, and purpose. Fixed Fire gives Leo courage, pride, and loyalty. They thrive when expressing creativity and being appreciated for who they are. Their warmth draws people in; their confidence inspires.
                </p>
                <p>
                  At best, they are generous and protective leaders. At worst, they can drift into ego or stubbornness if they feel ignored. Recognition matters to them not from vanity but from a need to know their efforts touch others.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Relationships
              </h2>
              <div className="space-y-3">
                <p>
                  Leo loves passionately and wholeheartedly. They value devotion, affection, and being seen. They need admiration, yes, but they give it in return — uplifting their partner's self-worth. They are fiercely loyal and protective once they commit.
                </p>
                <p>
                  Public support means a lot; they dislike being humiliated or dismissed. The best relationships for Leo involve laughter, pride, and shared growth. Their lesson is to balance leading with listening and to love without needing control.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Career & Profession
              </h2>
              <div className="space-y-3">
                <p>
                  Leos excel in leadership, entertainment, art, fashion, branding, education, or anything visible. They want to make a mark and see their creative essence shine through their work.
                </p>
                <p>
                  They perform best when appreciated, not micromanaged. A Leo who feels valued can light up an entire organisation, turning passion into productivity and optimism into influence.
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
                    Leo × Aries — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Big energy
                  </p>
                  <p>
                    Leo and Aries share boldness, passion, and forward momentum. Aries brings raw drive and initiative; Leo adds warmth, charisma, and creative presence. The connection feels confident and lively, though clashes around ego and control are part of the package.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Taurus — Mismatch (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fixed tastes
                  </p>
                  <p>
                    Leo wants expression and recognition; Taurus wants calm and consistency. Taurus grounds Leo's enthusiasm with steady loyalty; Leo adds colour and drama to Taurus' world. It can be affectionate but stubborn, with neither quick to compromise.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Gemini — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Playful and expressive
                  </p>
                  <p>
                    This pairing is socially bright and mentally stimulating. Gemini adds wit and variety; Leo adds heart and theatrical flair. The dynamic feels fun and uplifting, though Leo may want more depth and Gemini may want more flexibility around focus.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Cancer — Semi-Compatible (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Heart and show
                  </p>
                  <p>
                    Leo expresses feelings openly; Cancer protects their softer side. Cancer deepens Leo's emotional world; Leo brings optimism and courage to Cancer. The connection can be warm and devoted, but prone to drama if Leo feels unappreciated and Cancer feels unsafe.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Leo — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Big personalities
                  </p>
                  <p>
                    Two Leos create a radiant, dramatic bond with strong loyalty and pride. There's plenty of warmth and mutual encouragement, but also potential for ego contests. The relationship works well when they genuinely celebrate each other instead of silently keeping score.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Virgo — Semi-Compatible (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Show and service
                  </p>
                  <p>
                    Leo leads with heart and creativity; Virgo with practicality and refinement. Virgo can support Leo's visions in concrete ways; Leo can remind Virgo life isn't only about fixing problems. The bond is quietly strong when appreciation flows both ways.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Libra — Compatible (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Charming and social
                  </p>
                  <p>
                    Both enjoy beauty, romance, and social settings. Libra brings grace and relational awareness; Leo brings warmth, generosity, and flair. The connection tends to feel bright and harmonious, though decisions may be delayed if neither wants to break the pleasant mood.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Scorpio — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Intensity squared
                  </p>
                  <p>
                    Leo is outwardly expressive; Scorpio is inwardly intense. Both are loyal and proud but handle power differently. The pairing can be magnetic and passionate, yet prone to stand-offs and control battles if vulnerability is treated as weakness.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Sagittarius — Same Element (Fire + Fire)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Fire on fire
                  </p>
                  <p>
                    Leo and Sagittarius share enthusiasm, courage, and a desire for a big life. Sagittarius offers honesty and adventure; Leo offers devotion and heart. The relationship usually feels uplifting and inspiring, though their combined fire can overlook practical realities.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Capricorn — Semi-Compatible (Fire + Earth)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Pride and strategy
                  </p>
                  <p>
                    Capricorn focuses on goals and status; Leo on self-expression and recognition. Together they can be a strong power couple, with Capricorn setting long-term plans and Leo handling warmth and visibility. The risk is slipping into roles and forgetting emotional nuance.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Aquarius — Opposites (Fire + Air)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Bold and unconventional
                  </p>
                  <p>
                    Leo brings heart, presence, and personal passion; Aquarius brings vision, objectivity, and a group-focused outlook. Their polarity is striking and often fascinating. The connection feels innovative and charged, but tensions arise between personal drama and impersonal ideals.
                  </p>
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Leo × Pisces — Mismatch (Fire + Water)
                  </h3>
                  <p className={`text-base font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                    Drama and dream
                  </p>
                  <p>
                    Pisces moves through softness and intuition; Leo through boldness and performance. Pisces offers imagination and empathy; Leo offers protection and confidence. The dynamic can be tender and visually romantic, yet also confusing if expectations stay unspoken.
                  </p>
                </div>
              </div>
            </div>

            <SunSignCompatibilityTable sign="Leo" />
          </div>
        </div>
      </div>
    </div>
  )
}

