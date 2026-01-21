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

          {/* Compatibility Patterns Table Link */}
          <div className="mb-6">
            <button
              onClick={() => router.push(`/astrology/guide/next/patterns`)}
              className={`astro-highlight-card w-full p-4 rounded-lg border transition-colors ${
                theme === "light"
                  ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100"
                  : "bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30 hover:from-purple-900/30 hover:to-pink-900/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  <div className="text-left">
                    <h3 className={`font-semibold ${theme === "light" ? "text-purple-900" : "text-purple-200"}`}>
                      Compatibility Pattern Tables
                    </h3>
                    <p className={`text-sm ${theme === "light" ? "text-purple-700" : "text-purple-300"}`}>
                      View all Chinese zodiac compatibility patterns
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg 
                    className={`w-5 h-5 ${theme === "light" ? "text-purple-600" : "text-purple-400"}`}
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
          </div>

          {/* Chinese Zodiac Trine Compatibility Guide */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <h2 className={`text-lg font-bold mb-6 text-center ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Chinese Zodiac Compatibility Guide
            </h2>

            <div className="mb-6">
              <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h3 className={`text-base font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>The Four Trines</h3>
                
                {/* Compact card layout for mobile */}
                <div className="space-y-3">
                  {/* 1st Trine - Visionaries */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>1st Trine – Visionaries</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-300 whitespace-nowrap font-medium">Same Trine</span>
                    </div>
                    <p className={`text-sm mb-1 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Rat • Dragon • Monkey</p>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Ambitious, magnetic, and quick-minded. You share intuition, creativity, and drive — natural leaders who thrive on excitement and challenge.</p>
                  </div>

                  {/* 2nd Trine - Strategists */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>2nd Trine – Strategists</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-300 whitespace-nowrap font-medium">Same Trine</span>
                    </div>
                    <p className={`text-sm mb-1 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Ox • Snake • Rooster</p>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Disciplined, wise, and self-reliant. You value loyalty, logic, and refinement — a steady, enduring rhythm built on trust and respect.</p>
                  </div>

                  {/* 3rd Trine - Adventurers */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>3rd Trine – Adventurers</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-300 whitespace-nowrap font-medium">Same Trine</span>
                    </div>
                    <p className={`text-sm mb-1 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Tiger • Horse • Dog</p>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Passionate, loyal, and freedom-loving. Courageous spirits who follow their heart — driven by ideals, justice, and authenticity.</p>
                  </div>

                  {/* 4th Trine - Artists */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>4th Trine – Artists</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-300 whitespace-nowrap font-medium">Same Trine</span>
                    </div>
                    <p className={`text-sm mb-1 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Rabbit • Goat • Pig</p>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Gentle, romantic, and intuitive. Sensitive souls who seek beauty, peace, and emotional understanding in love and life.</p>
                  </div>

                  {/* Cross-Trine */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Cross-Trine</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 whitespace-nowrap font-medium">Cross-Trine</span>
                    </div>
                    <p className={`text-sm mb-1 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Mixed Trines</p>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>You move to different tempos. Connection comes from curiosity and compromise — attraction through contrast, growth through patience.</p>
                  </div>

                  {/* Natural Enemies */}
                  <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Natural Enemies</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-300 whitespace-nowrap font-medium">Opposing</span>
                    </div>
                    <p className={`text-sm mb-1 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Rat–Horse • Ox–Goat • Tiger–Monkey • Rabbit–Rooster • Dragon–Dog • Snake–Pig</p>
                    <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Opposing instincts — sparks can fly, but friction grows easily. These pairs often teach each other powerful life lessons, not comfort.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Five Elements Reference Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <h2 className={`text-lg font-bold mb-6 text-center ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Five Elements (五行)
            </h2>

            <div className="mb-6">
              <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h3 className={`text-base font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>The Five Elements</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                  <div className={`p-3 rounded-lg border text-center ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="text-2xl mb-1">🌳</div>
                    <div className="text-sm font-semibold text-green-500">Wood (木)</div>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="text-sm font-semibold text-orange-500">Fire (火)</div>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="text-2xl mb-1">⛰️</div>
                    <div className="text-sm font-semibold text-yellow-600">Earth (土)</div>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="text-2xl mb-1">⚙️</div>
                    <div className={`text-sm font-semibold ${theme === "light" ? "text-gray-500" : "text-gray-300"}`}>Metal (金)</div>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="text-2xl mb-1">💧</div>
                    <div className="text-sm font-semibold text-blue-500">Water (水)</div>
                  </div>
                </div>

                <h4 className={`text-sm font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Two Key Relationship Cycles:</h4>
                
                <div className="space-y-4 mb-6">
                  {/* Generating Cycle */}
                  <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h5 className="text-sm font-semibold text-green-500">Generating / Supportive (生, Shēng)</h5>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-300 whitespace-nowrap">Supportive</span>
                    </div>
                    <p className={`text-sm mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Each element feeds the next:</p>
                    <div className={`text-sm font-mono p-2 rounded ${theme === "light" ? "bg-gray-100 text-gray-800" : "bg-black/20 text-white/80"}`}>
                      Wood → Fire → Earth → Metal → Water → Wood
                    </div>
                    <p className={`text-xs mt-2 italic ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Elements in this cycle support and nourish each other.</p>
                  </div>

                  {/* Controlling Cycle */}
                  <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h5 className="text-sm font-semibold text-red-500">Controlling / Challenging (克, Kè)</h5>
                      <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-300 whitespace-nowrap">Challenging</span>
                    </div>
                    <p className={`text-sm mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>Each element checks or restrains another:</p>
                    <div className={`text-sm font-mono p-2 rounded ${theme === "light" ? "bg-gray-100 text-gray-800" : "bg-black/20 text-white/80"}`}>
                      Wood → Earth → Water → Fire → Metal → Wood
                    </div>
                    <p className={`text-xs mt-2 italic ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Elements in this cycle create tension and challenges.</p>
                  </div>
                </div>

                <h4 className={`text-sm font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Element Compatibility Chart</h4>
                <p className={`text-xs mb-4 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Rows = Person A's element • Columns = Person B's element</p>

                {/* Compatibility Table */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                        <th className={`p-2 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>A \ B</th>
                        <th className="p-2 text-center font-semibold text-green-500">Wood</th>
                        <th className="p-2 text-center font-semibold text-orange-500">Fire</th>
                        <th className="p-2 text-center font-semibold text-yellow-600">Earth</th>
                        <th className={`p-2 text-center font-semibold ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>Metal</th>
                        <th className="p-2 text-center font-semibold text-blue-500">Water</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Wood Row */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        <td className="p-2 font-semibold text-green-500">Wood</td>
                        <td className="p-2 text-center bg-purple-500/20 text-purple-600 dark:text-purple-300">Same</td>
                        <td className="p-2 text-center bg-green-500/20 text-green-600 dark:text-green-300">Supportive</td>
                        <td className="p-2 text-center bg-red-500/20 text-red-600 dark:text-red-300">Challenging</td>
                        <td className="p-2 text-center bg-red-500/20 text-red-600 dark:text-red-300">Challenging</td>
                        <td className="p-2 text-center bg-green-500/20 text-green-600 dark:text-green-300">Supportive</td>
                      </tr>
                      {/* Fire Row */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        <td className="p-2 font-semibold text-orange-500">Fire</td>
                        <td className="p-2 text-center bg-green-500/20 text-green-600 dark:text-green-300">Supportive</td>
                        <td className="p-2 text-center bg-purple-500/20 text-purple-600 dark:text-purple-300">Same</td>
                        <td className="p-2 text-center bg-green-500/20 text-green-600 dark:text-green-300">Supportive</td>
                        <td className="p-2 text-center bg-red-500/20 text-red-600 dark:text-red-300">Challenging</td>
                        <td className="p-2 text-center bg-red-500/20 text-red-600 dark:text-red-300">Challenging</td>
                      </tr>
                      {/* Earth Row */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        <td className="p-2 font-semibold text-yellow-600">Earth</td>
                        <td className="p-2 text-center bg-red-500/20 text-red-600 dark:text-red-300">Challenging</td>
                        <td className="p-2 text-center bg-green-500/20 text-green-600 dark:text-green-300">Supportive</td>
                        <td className="p-2 text-center bg-purple-500/20 text-purple-600 dark:text-purple-300">Same</td>
                        <td className="p-2 text-center bg-green-500/20 text-green-600 dark:text-green-300">Supportive</td>
                        <td className="p-2 text-center bg-red-500/20 text-red-600 dark:text-red-300">Challenging</td>
                      </tr>
                      {/* Metal Row */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        <td className={`p-2 font-semibold ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>Metal</td>
                        <td className="p-2 text-center bg-red-500/20 text-red-600 dark:text-red-300">Challenging</td>
                        <td className="p-2 text-center bg-red-500/20 text-red-600 dark:text-red-300">Challenging</td>
                        <td className="p-2 text-center bg-green-500/20 text-green-600 dark:text-green-300">Supportive</td>
                        <td className="p-2 text-center bg-purple-500/20 text-purple-600 dark:text-purple-300">Same</td>
                        <td className="p-2 text-center bg-green-500/20 text-green-600 dark:text-green-300">Supportive</td>
                      </tr>
                      {/* Water Row */}
                      <tr>
                        <td className="p-2 font-semibold text-blue-500">Water</td>
                        <td className="p-2 text-center bg-green-500/20 text-green-600 dark:text-green-300">Supportive</td>
                        <td className="p-2 text-center bg-red-500/20 text-red-600 dark:text-red-300">Challenging</td>
                        <td className="p-2 text-center bg-red-500/20 text-red-600 dark:text-red-300">Challenging</td>
                        <td className="p-2 text-center bg-green-500/20 text-green-600 dark:text-green-300">Supportive</td>
                        <td className="p-2 text-center bg-purple-500/20 text-purple-600 dark:text-purple-300">Same</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <h5 className={`font-semibold mb-2 ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Legend:</h5>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 whitespace-nowrap">Same</span>
                    <span className={theme === "light" ? "text-gray-700" : "text-white/70"}>Strong resonance; similar pace and priorities.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-300 whitespace-nowrap">Supportive (生 Shēng)</span>
                    <span className={theme === "light" ? "text-gray-700" : "text-white/70"}>One element feeds the other; easier flow and teamwork.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-300 whitespace-nowrap">Challenging (克 Kè)</span>
                    <span className={theme === "light" ? "text-gray-700" : "text-white/70"}>More tests and friction; can still be constructive with maturity.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded bg-gray-500/20 text-gray-600 dark:text-gray-300 whitespace-nowrap">Neutral</span>
                    <span className={theme === "light" ? "text-gray-700" : "text-white/70"}>No strong help or clash from the elements; other parts of the chart matter more.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chinese Zodiac Calendar Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <h2 className={`text-lg font-bold mb-6 text-center ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Chinese Zodiac Calendar
            </h2>

            <div className="mb-6">
              <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                
                {/* Scrollable Table Container - both horizontal and vertical scroll */}
                <div 
                  className="border rounded-lg" 
                  style={{ 
                    maxHeight: '384px',
                    overflowX: 'auto',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'thin',
                    scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                  }}
                >
                  <table className="text-xs border-collapse" style={{ minWidth: '650px', width: '100%' }}>
                    <thead className={`sticky top-0 ${theme === "light" ? "bg-gray-100" : "bg-gray-800"} z-10`}>
                      <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                        <th className={`p-2 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Year</th>
                        <th className={`p-2 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Chinese New Year</th>
                        <th className={`p-2 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Animal</th>
                        <th className={`p-2 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Yin/Yang</th>
                        <th className={`p-2 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Element</th>
                        <th className={`p-2 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Year Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { year: '1960', date: '28 Jan 1960', animal: 'Rat', yinYang: 'Yang', element: 'Metal', name: 'Yang Metal Rat', emoji: '🐀' },
                        { year: '1961', date: '15 Feb 1961', animal: 'Ox', yinYang: 'Yin', element: 'Metal', name: 'Yin Metal Ox', emoji: '🐂' },
                        { year: '1962', date: '05 Feb 1962', animal: 'Tiger', yinYang: 'Yang', element: 'Water', name: 'Yang Water Tiger', emoji: '🐅' },
                        { year: '1963', date: '25 Jan 1963', animal: 'Rabbit', yinYang: 'Yin', element: 'Water', name: 'Yin Water Rabbit', emoji: '🐇' },
                        { year: '1964', date: '13 Feb 1964', animal: 'Dragon', yinYang: 'Yang', element: 'Wood', name: 'Yang Wood Dragon', emoji: '🐉' },
                        { year: '1965', date: '02 Feb 1965', animal: 'Snake', yinYang: 'Yin', element: 'Wood', name: 'Yin Wood Snake', emoji: '🐍' },
                        { year: '1966', date: '21 Jan 1966', animal: 'Horse', yinYang: 'Yang', element: 'Fire', name: 'Yang Fire Horse', emoji: '🐎' },
                        { year: '1967', date: '09 Feb 1967', animal: 'Goat', yinYang: 'Yin', element: 'Fire', name: 'Yin Fire Goat', emoji: '🐐' },
                        { year: '1968', date: '30 Jan 1968', animal: 'Monkey', yinYang: 'Yang', element: 'Earth', name: 'Yang Earth Monkey', emoji: '🐒' },
                        { year: '1969', date: '17 Feb 1969', animal: 'Rooster', yinYang: 'Yin', element: 'Earth', name: 'Yin Earth Rooster', emoji: '🐓' },
                        { year: '1970', date: '06 Feb 1970', animal: 'Dog', yinYang: 'Yang', element: 'Metal', name: 'Yang Metal Dog', emoji: '🐕' },
                        { year: '1971', date: '27 Jan 1971', animal: 'Pig', yinYang: 'Yin', element: 'Metal', name: 'Yin Metal Pig', emoji: '🐖' },
                        { year: '1972', date: '15 Feb 1972', animal: 'Rat', yinYang: 'Yang', element: 'Water', name: 'Yang Water Rat', emoji: '🐀' },
                        { year: '1973', date: '03 Feb 1973', animal: 'Ox', yinYang: 'Yin', element: 'Water', name: 'Yin Water Ox', emoji: '🐂' },
                        { year: '1974', date: '23 Jan 1974', animal: 'Tiger', yinYang: 'Yang', element: 'Wood', name: 'Yang Wood Tiger', emoji: '🐅' },
                        { year: '1975', date: '11 Feb 1975', animal: 'Rabbit', yinYang: 'Yin', element: 'Wood', name: 'Yin Wood Rabbit', emoji: '🐇' },
                        { year: '1976', date: '31 Jan 1976', animal: 'Dragon', yinYang: 'Yang', element: 'Fire', name: 'Yang Fire Dragon', emoji: '🐉' },
                        { year: '1977', date: '18 Feb 1977', animal: 'Snake', yinYang: 'Yin', element: 'Fire', name: 'Yin Fire Snake', emoji: '🐍' },
                        { year: '1978', date: '07 Feb 1978', animal: 'Horse', yinYang: 'Yang', element: 'Earth', name: 'Yang Earth Horse', emoji: '🐎' },
                        { year: '1979', date: '28 Jan 1979', animal: 'Goat', yinYang: 'Yin', element: 'Earth', name: 'Yin Earth Goat', emoji: '🐐' },
                        { year: '1980', date: '16 Feb 1980', animal: 'Monkey', yinYang: 'Yang', element: 'Metal', name: 'Yang Metal Monkey', emoji: '🐒' },
                        { year: '1981', date: '05 Feb 1981', animal: 'Rooster', yinYang: 'Yin', element: 'Metal', name: 'Yin Metal Rooster', emoji: '🐓' },
                        { year: '1982', date: '25 Jan 1982', animal: 'Dog', yinYang: 'Yang', element: 'Water', name: 'Yang Water Dog', emoji: '🐕' },
                        { year: '1983', date: '13 Feb 1983', animal: 'Pig', yinYang: 'Yin', element: 'Water', name: 'Yin Water Pig', emoji: '🐖' },
                        { year: '1984', date: '02 Feb 1984', animal: 'Rat', yinYang: 'Yang', element: 'Wood', name: 'Yang Wood Rat', emoji: '🐀' },
                        { year: '1985', date: '20 Feb 1985', animal: 'Ox', yinYang: 'Yin', element: 'Wood', name: 'Yin Wood Ox', emoji: '🐂' },
                        { year: '1986', date: '09 Feb 1986', animal: 'Tiger', yinYang: 'Yang', element: 'Fire', name: 'Yang Fire Tiger', emoji: '🐅' },
                        { year: '1987', date: '29 Jan 1987', animal: 'Rabbit', yinYang: 'Yin', element: 'Fire', name: 'Yin Fire Rabbit', emoji: '🐇' },
                        { year: '1988', date: '17 Feb 1988', animal: 'Dragon', yinYang: 'Yang', element: 'Earth', name: 'Yang Earth Dragon', emoji: '🐉' },
                        { year: '1989', date: '06 Feb 1989', animal: 'Snake', yinYang: 'Yin', element: 'Earth', name: 'Yin Earth Snake', emoji: '🐍' },
                        { year: '1990', date: '27 Jan 1990', animal: 'Horse', yinYang: 'Yang', element: 'Metal', name: 'Yang Metal Horse', emoji: '🐎' },
                        { year: '1991', date: '15 Feb 1991', animal: 'Goat', yinYang: 'Yin', element: 'Metal', name: 'Yin Metal Goat', emoji: '🐐' },
                        { year: '1992', date: '04 Feb 1992', animal: 'Monkey', yinYang: 'Yang', element: 'Water', name: 'Yang Water Monkey', emoji: '🐒' },
                        { year: '1993', date: '23 Jan 1993', animal: 'Rooster', yinYang: 'Yin', element: 'Water', name: 'Yin Water Rooster', emoji: '🐓' },
                        { year: '1994', date: '10 Feb 1994', animal: 'Dog', yinYang: 'Yang', element: 'Wood', name: 'Yang Wood Dog', emoji: '🐕' },
                        { year: '1995', date: '31 Jan 1995', animal: 'Pig', yinYang: 'Yin', element: 'Wood', name: 'Yin Wood Pig', emoji: '🐖' },
                        { year: '1996', date: '19 Feb 1996', animal: 'Rat', yinYang: 'Yang', element: 'Fire', name: 'Yang Fire Rat', emoji: '🐀' },
                        { year: '1997', date: '07 Feb 1997', animal: 'Ox', yinYang: 'Yin', element: 'Fire', name: 'Yin Fire Ox', emoji: '🐂' },
                        { year: '1998', date: '28 Jan 1998', animal: 'Tiger', yinYang: 'Yang', element: 'Earth', name: 'Yang Earth Tiger', emoji: '🐅' },
                        { year: '1999', date: '16 Feb 1999', animal: 'Rabbit', yinYang: 'Yin', element: 'Earth', name: 'Yin Earth Rabbit', emoji: '🐇' },
                        { year: '2000', date: '05 Feb 2000', animal: 'Dragon', yinYang: 'Yang', element: 'Metal', name: 'Yang Metal Dragon', emoji: '🐉' },
                        { year: '2001', date: '24 Jan 2001', animal: 'Snake', yinYang: 'Yin', element: 'Metal', name: 'Yin Metal Snake', emoji: '🐍' },
                        { year: '2002', date: '12 Feb 2002', animal: 'Horse', yinYang: 'Yang', element: 'Water', name: 'Yang Water Horse', emoji: '🐎' },
                        { year: '2003', date: '01 Feb 2003', animal: 'Goat', yinYang: 'Yin', element: 'Water', name: 'Yin Water Goat', emoji: '🐐' },
                        { year: '2004', date: '22 Jan 2004', animal: 'Monkey', yinYang: 'Yang', element: 'Wood', name: 'Yang Wood Monkey', emoji: '🐒' },
                        { year: '2005', date: '09 Feb 2005', animal: 'Rooster', yinYang: 'Yin', element: 'Wood', name: 'Yin Wood Rooster', emoji: '🐓' },
                        { year: '2006', date: '29 Jan 2006', animal: 'Dog', yinYang: 'Yang', element: 'Fire', name: 'Yang Fire Dog', emoji: '🐕' },
                        { year: '2007', date: '18 Feb 2007', animal: 'Pig', yinYang: 'Yin', element: 'Fire', name: 'Yin Fire Pig', emoji: '🐖' },
                        { year: '2008', date: '07 Feb 2008', animal: 'Rat', yinYang: 'Yang', element: 'Earth', name: 'Yang Earth Rat', emoji: '🐀' },
                        { year: '2009', date: '26 Jan 2009', animal: 'Ox', yinYang: 'Yin', element: 'Earth', name: 'Yin Earth Ox', emoji: '🐂' },
                        { year: '2010', date: '14 Feb 2010', animal: 'Tiger', yinYang: 'Yang', element: 'Metal', name: 'Yang Metal Tiger', emoji: '🐅' },
                        { year: '2011', date: '03 Feb 2011', animal: 'Rabbit', yinYang: 'Yin', element: 'Metal', name: 'Yin Metal Rabbit', emoji: '🐇' },
                        { year: '2012', date: '23 Jan 2012', animal: 'Dragon', yinYang: 'Yang', element: 'Water', name: 'Yang Water Dragon', emoji: '🐉' },
                        { year: '2013', date: '10 Feb 2013', animal: 'Snake', yinYang: 'Yin', element: 'Water', name: 'Yin Water Snake', emoji: '🐍' },
                        { year: '2014', date: '31 Jan 2014', animal: 'Horse', yinYang: 'Yang', element: 'Wood', name: 'Yang Wood Horse', emoji: '🐎' },
                        { year: '2015', date: '19 Feb 2015', animal: 'Goat', yinYang: 'Yin', element: 'Wood', name: 'Yin Wood Goat', emoji: '🐐' },
                        { year: '2016', date: '08 Feb 2016', animal: 'Monkey', yinYang: 'Yang', element: 'Fire', name: 'Yang Fire Monkey', emoji: '🐒' },
                        { year: '2017', date: '28 Jan 2017', animal: 'Rooster', yinYang: 'Yin', element: 'Fire', name: 'Yin Fire Rooster', emoji: '🐓' },
                        { year: '2018', date: '16 Feb 2018', animal: 'Dog', yinYang: 'Yang', element: 'Earth', name: 'Yang Earth Dog', emoji: '🐕' },
                        { year: '2019', date: '05 Feb 2019', animal: 'Pig', yinYang: 'Yin', element: 'Earth', name: 'Yin Earth Pig', emoji: '🐖' },
                        { year: '2020', date: '25 Jan 2020', animal: 'Rat', yinYang: 'Yang', element: 'Metal', name: 'Yang Metal Rat', emoji: '🐀' },
                        { year: '2021', date: '12 Feb 2021', animal: 'Ox', yinYang: 'Yin', element: 'Metal', name: 'Yin Metal Ox', emoji: '🐂' },
                        { year: '2022', date: '01 Feb 2022', animal: 'Tiger', yinYang: 'Yang', element: 'Water', name: 'Yang Water Tiger', emoji: '🐅' },
                        { year: '2023', date: '22 Jan 2023', animal: 'Rabbit', yinYang: 'Yin', element: 'Water', name: 'Yin Water Rabbit', emoji: '🐇' },
                        { year: '2024', date: '10 Feb 2024', animal: 'Dragon', yinYang: 'Yang', element: 'Wood', name: 'Yang Wood Dragon', emoji: '🐉' },
                        { year: '2025', date: '29 Jan 2025', animal: 'Snake', yinYang: 'Yin', element: 'Wood', name: 'Yin Wood Snake', emoji: '🐍' },
                        { year: '2026', date: '17 Feb 2026', animal: 'Horse', yinYang: 'Yang', element: 'Fire', name: 'Yang Fire Horse', emoji: '🐎' },
                        { year: '2027', date: '06 Feb 2027', animal: 'Goat', yinYang: 'Yin', element: 'Fire', name: 'Yin Fire Goat', emoji: '🐐' },
                        { year: '2028', date: '26 Jan 2028', animal: 'Monkey', yinYang: 'Yang', element: 'Earth', name: 'Yang Earth Monkey', emoji: '🐒' },
                        { year: '2029', date: '13 Feb 2029', animal: 'Rooster', yinYang: 'Yin', element: 'Earth', name: 'Yin Earth Rooster', emoji: '🐓' },
                        { year: '2030', date: '03 Feb 2030', animal: 'Dog', yinYang: 'Yang', element: 'Metal', name: 'Yang Metal Dog', emoji: '🐕' },
                        { year: '2031', date: '23 Jan 2031', animal: 'Pig', yinYang: 'Yin', element: 'Metal', name: 'Yin Metal Pig', emoji: '🐖' },
                        { year: '2032', date: '11 Feb 2032', animal: 'Rat', yinYang: 'Yang', element: 'Water', name: 'Yang Water Rat', emoji: '🐀' },
                      ].map((row, idx) => (
                        <tr key={row.year} className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-gray-50" : "hover:bg-white/5"}`}>
                          <td className={`p-2 font-medium ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>{row.year}</td>
                          <td className={`p-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>{row.date}</td>
                          <td className={`p-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                            <span className="inline-flex items-center gap-1">
                              <span>{row.emoji}</span>
                              <span>{row.animal}</span>
                            </span>
                          </td>
                          <td className={`p-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>{row.yinYang}</td>
                          <td className={`p-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>{row.element}</td>
                          <td className={`p-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>{row.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

