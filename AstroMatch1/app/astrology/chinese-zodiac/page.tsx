"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function ChineseZodiacPage() {
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
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24`}
    >
      <div className="relative z-10">
        {/* Header */}
        <AstroLabNavigationHeader theme={theme} setTheme={setTheme} />

        <div className="px-4 pt-2 pb-3 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="flex items-center justify-center mb-6">
            <h1 className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Chinese Zodiac
            </h1>
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

