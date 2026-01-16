"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function AstrologyGuidePage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const sunSignSystem = useSunSignSystem()

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

          {/* Sun Sign Element Compatibility Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <h2 className={`text-lg font-bold mb-6 text-center ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Sun Sign Element Compatibility
            </h2>

            <div className="mb-6">
              <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h3 className={`text-base font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>Element Pairings</h3>
                
                {/* Compact card layout for mobile */}
                <div className="space-y-3">
                  {/* Same Element - Fire */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Fire × Fire</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-300 whitespace-nowrap font-medium">Same Element</span>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Two flames burning bright — passionate, inspiring, and bold. The danger lies only in competing heat.</p>
                  </div>

                  {/* Same Element - Earth */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Earth × Earth</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-300 whitespace-nowrap font-medium">Same Element</span>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Grounded and practical. You build together slowly and surely, valuing security and shared purpose.</p>
                  </div>

                  {/* Same Element - Air */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Air × Air</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-300 whitespace-nowrap font-medium">Same Element</span>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>A meeting of minds — communicative, curious, and light-hearted. The spark thrives on ideas and freedom.</p>
                  </div>

                  {/* Same Element - Water */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Water × Water</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-300 whitespace-nowrap font-medium">Same Element</span>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Deep emotional flow. You understand each other's moods intuitively — soulful, nurturing, and healing.</p>
                  </div>

                  {/* Compatible - Fire × Air */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Fire × Air</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-300 whitespace-nowrap font-medium">Compatible</span>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Air fuels Fire. This match is vibrant, creative, and full of movement — expect fast ideas and shared adventures.</p>
                  </div>

                  {/* Compatible - Earth × Water */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Earth × Water</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-300 whitespace-nowrap font-medium">Compatible</span>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Water nourishes Earth. Stable and tender, this connection brings emotional depth to practical strength.</p>
                  </div>

                  {/* Semi-Compatible - Fire × Earth */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Fire × Earth</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 whitespace-nowrap font-medium">Semi-Compatible</span>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Fire's enthusiasm can warm Earth's steadiness, if grounded in respect and timing.</p>
                  </div>

                  {/* Semi-Compatible - Air × Water */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Air × Water</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 whitespace-nowrap font-medium">Semi-Compatible</span>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Mind meets emotion — fascinating, if communication stays gentle and open.</p>
                  </div>

                  {/* Opposing - Fire × Water */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Fire × Water</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-300 whitespace-nowrap font-medium">Opposing</span>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Steam and storm — intense attraction but turbulent emotions. You must respect each other's pace.</p>
                  </div>

                  {/* Opposing - Air × Earth */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Air × Earth</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-300 whitespace-nowrap font-medium">Opposing</span>
                    </div>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Different speeds — one seeks change, the other stability. Growth comes through patience and curiosity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

