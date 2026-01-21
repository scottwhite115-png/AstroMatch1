"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { setSunSignSystem, type SunSignSystem } from "@/lib/sunSignCalculator"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function AstrologyGuidePage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const sunSignSystem = useSunSignSystem()
  const isSidereal = sunSignSystem === "sidereal"

  const toggleSunSignSystem = () => {
    const newSystem: SunSignSystem = isSidereal ? "tropical" : "sidereal"
    setSunSignSystem(newSystem)

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("sunSignSystemChanged"))
    }
  }

  // Sun sign data with both tropical and sidereal dates
  const sunSigns = [
    { 
      name: 'Aries', 
      symbol: '♈', 
      tropicalDates: 'Mar 21 - Apr 19',
      siderealDates: 'Apr 13 - May 14'
    },
    { 
      name: 'Taurus', 
      symbol: '♉', 
      tropicalDates: 'Apr 20 - May 20',
      siderealDates: 'May 15 - Jun 14'
    },
    { 
      name: 'Gemini', 
      symbol: '♊', 
      tropicalDates: 'May 21 - Jun 20',
      siderealDates: 'Jun 15 - Jul 16'
    },
    { 
      name: 'Cancer', 
      symbol: '♋', 
      tropicalDates: 'Jun 21 - Jul 22',
      siderealDates: 'Jul 17 - Aug 16'
    },
    { 
      name: 'Leo', 
      symbol: '♌', 
      tropicalDates: 'Jul 23 - Aug 22',
      siderealDates: 'Aug 17 - Sep 16'
    },
    { 
      name: 'Virgo', 
      symbol: '♍', 
      tropicalDates: 'Aug 23 - Sep 22',
      siderealDates: 'Sep 17 - Oct 17'
    },
    { 
      name: 'Libra', 
      symbol: '♎', 
      tropicalDates: 'Sep 23 - Oct 22',
      siderealDates: 'Oct 18 - Nov 16'
    },
    { 
      name: 'Scorpio', 
      symbol: '♏', 
      tropicalDates: 'Oct 23 - Nov 21',
      siderealDates: 'Nov 17 - Dec 15'
    },
    { 
      name: 'Sagittarius', 
      symbol: '♐', 
      tropicalDates: 'Nov 22 - Dec 21',
      siderealDates: 'Dec 16 - Jan 14'
    },
    { 
      name: 'Capricorn', 
      symbol: '♑', 
      tropicalDates: 'Dec 22 - Jan 19',
      siderealDates: 'Jan 15 - Feb 12'
    },
    { 
      name: 'Aquarius', 
      symbol: '♒', 
      tropicalDates: 'Jan 20 - Feb 18',
      siderealDates: 'Feb 13 - Mar 14'
    },
    { 
      name: 'Pisces', 
      symbol: '♓', 
      tropicalDates: 'Feb 19 - Mar 20',
      siderealDates: 'Mar 15 - Apr 12'
    },
  ]

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-zinc-900"} astrology-page min-h-screen w-full relative pb-24`}
    >
      <div className="relative z-10">
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AstroMatch
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
          {/* Page Title with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 flex justify-start">
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
            </div>
            <h1 className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Sun Signs
            </h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => router.push('/astrology/guide/next')}
                className={`p-2 rounded-lg transition-colors ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
                aria-label="Next page"
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
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>

          <div
            className={`mb-6 rounded-lg border ${
              theme === "light"
                ? "bg-gray-50/90 border-gray-200"
                : "bg-white/5 border-white/10"
            } p-4 transition-colors`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={`text-sm font-semibold ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                  Calendar System
                </p>
                <p className={`mt-1 text-xs sm:text-sm ${theme === "light" ? "text-gray-500" : "text-white/60"}`}>
                  User profiles will be displayed under Tropical or Vedic sun sign calendar dates.<br />
                  Tropical dates are fixed to the solstices; Vedic dates follow the constellations.
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={toggleSunSignSystem}
                  role="switch"
                  aria-checked={isSidereal}
                  aria-label={`Toggle calendar system (currently ${isSidereal ? "Vedic" : "Tropical"})`}
                  className={`astro-highlight-card relative inline-flex items-center gap-4 rounded-full px-4 py-2 transition-colors ${
                    theme === "light" ? "bg-white shadow-sm" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold transition-colors ${
                      isSidereal
                        ? theme === "light" ? "text-gray-400" : "text-white/50"
                        : theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Tropical
                  </span>
                  <span className="relative flex h-6 w-12 items-center">
                    <span
                      className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                        theme === "light" ? "bg-orange-200/60" : "bg-white/10"
                      }`}
                    />
                    <span
                      className={`absolute left-0 h-6 w-6 rounded-full border transition-all duration-300 ease-out ${
                        theme === "light"
                          ? "border-orange-300 bg-white shadow"
                          : "border-white/30 bg-white/80"
                      }`}
                      style={{ transform: isSidereal ? "translateX(100%)" : "translateX(0%)" }}
                    />
                  </span>
                  <span
                    className={`text-xs font-semibold transition-colors ${
                      isSidereal
                        ? theme === "light" ? "text-gray-900" : "text-white"
                        : theme === "light" ? "text-gray-400" : "text-white/50"
                    }`}
                  >
                    Vedic
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Sun Signs List */}
          <div className="space-y-3 mb-6">
            {sunSigns.map((sign) => (
              <button
                key={sign.name}
                onClick={() => router.push(`/astrology/guide/${sign.name.toLowerCase()}`)}
                className={`astro-highlight-card w-full p-4 rounded-lg border transition-colors ${
                  theme === "light"
                    ? "bg-white border-gray-200 hover:bg-gray-50"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{sign.symbol}</span>
                    <div className="text-left">
                      <h3 className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                        {sign.name}
                      </h3>
                      <p className={`text-sm ${theme === "light" ? "text-gray-500" : "text-white/60"}`}>
                        {sunSignSystem === 'sidereal' ? sign.siderealDates : sign.tropicalDates}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg 
                      className={`w-5 h-5 ${theme === "light" ? "text-gray-400" : "text-white/40"}`}
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

