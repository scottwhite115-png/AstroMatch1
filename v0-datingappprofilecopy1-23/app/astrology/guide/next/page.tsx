"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function ChineseSignsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // Chinese zodiac signs data
  const chineseSigns = [
    { name: 'Rat', symbol: '🐀', years: '1948, 1960, 1972, 1984, 1996, 2008, 2020' },
    { name: 'Ox', symbol: '🐂', years: '1949, 1961, 1973, 1985, 1997, 2009, 2021' },
    { name: 'Tiger', symbol: '🐅', years: '1950, 1962, 1974, 1986, 1998, 2010, 2022' },
    { name: 'Rabbit', symbol: '🐇', years: '1951, 1963, 1975, 1987, 1999, 2011, 2023' },
    { name: 'Dragon', symbol: '🐉', years: '1952, 1964, 1976, 1988, 2000, 2012, 2024' },
    { name: 'Snake', symbol: '🐍', years: '1953, 1965, 1977, 1989, 2001, 2013, 2025' },
    { name: 'Horse', symbol: '🐎', years: '1954, 1966, 1978, 1990, 2002, 2014, 2026' },
    { name: 'Goat', symbol: '🐐', years: '1955, 1967, 1979, 1991, 2003, 2015, 2027' },
    { name: 'Monkey', symbol: '🐒', years: '1956, 1968, 1980, 1992, 2004, 2016, 2028' },
    { name: 'Rooster', symbol: '🐓', years: '1957, 1969, 1981, 1993, 2005, 2017, 2029' },
    { name: 'Dog', symbol: '🐕', years: '1958, 1970, 1982, 1994, 2006, 2018, 2030' },
    { name: 'Pig', symbol: '🐖', years: '1959, 1971, 1983, 1995, 2007, 2019, 2031' },
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
          {/* Page Title with Navigation */}
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
              Chinese Signs
            </h1>
            <div className="flex-1"></div>
          </div>

          {/* Chinese Signs List */}
          <div className="space-y-3 mb-6">
            {chineseSigns.map((sign) => (
              <button
                key={sign.name}
                onClick={() => router.push(`/astrology/guide/next/${sign.name.toLowerCase()}`)}
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
                        {sign.years}
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

