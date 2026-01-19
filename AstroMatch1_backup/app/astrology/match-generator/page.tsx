"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { ConnectionBoxNew } from "@/components/ConnectionBoxNew"
import { buildConnectionBox } from "@/lib/compat/engine"
import type { UserProfile } from "@/lib/compat/types"
import { getWesternSignFromDate, getChineseAnimalFromDate, getWuXingElementFromDate } from "@/lib/zodiacHelpers"
import { getWuXingYearElement } from "@/lib/matchEngine"
import type { WesternSign, ChineseAnimal, WuXingElement } from "@/lib/matchEngine"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function MatchGeneratorPage() {
  const [birthdate1, setBirthdate1] = useState<string>("")
  const [birthdate2, setBirthdate2] = useState<string>("")
  const [showMatchResult, setShowMatchResult] = useState(false)
  const [matchData, setMatchData] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const drawerRef = useRef<HTMLElement>(null)
  const drawerButtonRef = useRef<HTMLButtonElement>(null)

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isDrawerOpen) return

      const target = event.target as Node
      
      // Don't close if clicking on the drawer itself or the toggle button
      if (
        drawerRef.current?.contains(target) ||
        drawerButtonRef.current?.contains(target)
      ) {
        return
      }

      // Close the drawer if clicking anywhere else
      setIsDrawerOpen(false)
    }

    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDrawerOpen])

  // Section menu items for the drawer
  const sectionItems = [
    {
      id: 'match-generator',
      label: 'Match Generator',
      description: 'Calculate compatibility between two birthdates',
      icon: '🧮',
      path: '/astrology/match-generator',
    },
    {
      id: 'chinese-patterns',
      label: 'Chinese Pattern Ranking',
      description: 'Traditional Chinese zodiac compatibility patterns',
      icon: '📊',
      path: '/astrology#chinese-patterns',
    },
    {
      id: 'what-shapes-score',
      label: 'What Shapes Your Score',
      description: 'How the match engine works',
      icon: '⚙️',
      path: '/astrology#what-shapes-score',
    },
  ]

  // Astrology pages menu items
  const astrologyPages = [
    {
      id: 'combinations',
      label: 'Sign Combinations',
      description: 'Explore Western × Chinese zodiac matches',
      icon: '⭐',
      path: '/astrology/combinations',
    },
    {
      id: 'western-guide',
      label: 'Sun Signs',
      description: 'Learn about the 12 sun signs',
      icon: '☀️',
      path: '/astrology/sun-signs',
    },
    {
      id: 'chinese-guide',
      label: 'Chinese Zodiac',
      description: 'Discover the 12 animals',
      icon: '🐉',
      path: '/astrology/chinese-zodiac',
    },
    {
      id: 'vedic-astrology',
      label: 'Vedic Astrology',
      description: 'Ancient Indian astrological wisdom',
      icon: '🕉️',
      path: '/astrology/vedic',
    },
  ]

  const calculateMatch = () => {
    if (!birthdate1 || !birthdate2) return

    console.log('[Match Generator] Starting calculation...', { birthdate1, birthdate2 })

    try {
      const date1 = new Date(birthdate1)
      const date2 = new Date(birthdate2)

      console.log('[Match Generator] Dates parsed:', { date1, date2 })

      const person1: UserProfile = {
        sunSign: getWesternSignFromDate(date1).toLowerCase() as any,
        animal: getChineseAnimalFromDate(date1).toLowerCase() as any,
      }

      const person2: UserProfile = {
        sunSign: getWesternSignFromDate(date2).toLowerCase() as any,
        animal: getChineseAnimalFromDate(date2).toLowerCase() as any,
      }

      console.log('[Match Generator] Person 1:', person1)
      console.log('[Match Generator] Person 2:', person2)

      // Get Wu Xing year elements
      const year1 = date1.getFullYear()
      const year2 = date2.getFullYear()
      const wuXing1 = getWuXingYearElement(year1)
      const wuXing2 = getWuXingYearElement(year2)

      // Use the same engine as discover/matches section
      const simpleBox = buildConnectionBox(
        person1,
        person2,
        wuXing1,
        wuXing2
      )

      console.log('[Match Generator] SimpleBox result:', simpleBox)

      // Map to match label format
      const mapTier = (label: string): "Soulmate Match" | "Twin Flame Match" | "Excellent Match" | "Favourable Match" | "Neutral Match" | "Opposites Attract" | "Difficult Match" => {
        const l = label.toLowerCase();
        if (l.includes("soulmate")) return "Soulmate Match";
        if (l.includes("twin flame")) return "Twin Flame Match";
        if (l.includes("excellent")) return "Excellent Match";
        if (l.includes("favourable") || l.includes("favorable")) return "Favourable Match";
        if (l.includes("opposites attract") || l.includes("magnetic opposites")) return "Opposites Attract";
        if (l.includes("difficult") || l.includes("challenging")) return "Difficult Match";
        return "Neutral Match";
      };

      // Create connection box data matching discover section format
      const boxData = {
        tier: mapTier(simpleBox.matchLabel) as any,
        score: simpleBox.score,
        westA: person1.sunSign.charAt(0).toUpperCase() + person1.sunSign.slice(1),
        eastA: person1.animal.charAt(0).toUpperCase() + person1.animal.slice(1),
        westB: person2.sunSign.charAt(0).toUpperCase() + person2.sunSign.slice(1),
        eastB: person2.animal.charAt(0).toUpperCase() + person2.animal.slice(1),
        chineseLine: simpleBox.chineseLine || "",
        sunMatchBlurb: simpleBox.westernSignLine || "",
        westernLine: simpleBox.westernLine || "",
        wuXingLine: simpleBox.wuXingLine,
        connectionBlurb: simpleBox.overview,
        chineseElementA: wuXing1,
        chineseElementB: wuXing2,
        chinesePattern: simpleBox.chinesePattern as any,
        westAspect: simpleBox.westAspect as any,
        westElementRelation: simpleBox.westElementRelation as any,
        isChineseOpposite: simpleBox.isChineseOpposite,
        isLivelyPair: simpleBox.isLivelyPair,
        patternFullLabel: simpleBox.patternFullLabel,
        pillLabel: simpleBox.pillLabel,
        baseTagline: simpleBox.baseTagline,
        patternEmoji: simpleBox.patternEmoji,
        pattern: simpleBox.pattern,
        chemistryStars: simpleBox.chemistryStars,
        stabilityStars: simpleBox.stabilityStars,
      }

      console.log('[Match Generator] Box data:', boxData)
      console.log('[Match Generator] Setting showMatchResult to true')

      setMatchData(boxData)
      setShowMatchResult(true)
    } catch (error) {
      console.error("[Match Generator] Error calculating match:", error)
    }
  }

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24 overflow-x-auto`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="relative z-10">
        {/* Header with drawer button */}
        <header className={`sticky top-0 z-50 flex items-center justify-between border-b px-4 py-3 ${
          theme === "light"
            ? "bg-white/80 backdrop-blur-sm border-gray-200"
            : "bg-slate-900/80 backdrop-blur-sm border-slate-800"
        }`}>
          <div className="flex items-center gap-2">
            {/* Menu icon to toggle drawer */}
            <button
              ref={drawerButtonRef}
              type="button"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                theme === "light"
                  ? "border-gray-200 hover:bg-gray-100"
                  : "border-slate-700 hover:bg-slate-800"
              }`}
              aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
            >
              {/* List icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={theme === "light" ? "text-gray-700" : "text-slate-300"}
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>

            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AstroLab
              </span>
            </div>
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
        </header>

        {/* Left slide-in drawer */}
        {isDrawerOpen && (
          <aside 
            ref={drawerRef}
            className={`fixed left-0 bottom-0 z-50 w-72 max-w-[80vw] shadow-xl border-r flex flex-col ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-slate-900 border-slate-800"
            }`}
            style={{ top: 'var(--header-height, 60px)' }}
          >
            <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
              {/* Section heading for Pages */}
              <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${theme === "light" ? "text-gray-500" : "text-slate-500"}`}>
                Pages
              </div>
              
              {astrologyPages.map((page) => {
                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => {
                      router.push(page.path);
                      setIsDrawerOpen(false);
                    }}
                    className={[
                      "flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      theme === "light"
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-slate-400 hover:bg-slate-800",
                    ].join(" ")}
                  >
                    <span className="mt-[1px] text-base">{page.icon}</span>
                    <span className="flex flex-col">
                      <span className="font-medium">{page.label}</span>
                      <span className={`text-xs ${
                        theme === "light" ? "text-gray-500" : "text-slate-500"
                      }`}>
                        {page.description}
                      </span>
                    </span>
                  </button>
                );
              })}

              {/* Divider */}
              <div className={`my-2 border-t ${theme === "light" ? "border-gray-200" : "border-slate-700"}`} />

              {/* Section heading for Charts & Tables */}
              <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${theme === "light" ? "text-gray-500" : "text-slate-500"}`}>
                Charts & Tables
              </div>

              {sectionItems.map((section) => {
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      if (section.path) {
                        // Navigate to page if it has a path
                        router.push(section.path);
                      } else {
                        // Navigate to main page with section anchor
                        router.push(`/astrology#${section.id}`);
                      }
                      setIsDrawerOpen(false);
                    }}
                    className={[
                      "flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      theme === "light"
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-slate-400 hover:bg-slate-800",
                    ].join(" ")}
                  >
                    <span className="mt-[1px] text-base">{section.icon}</span>
                    <span className="flex flex-col">
                      <span className="font-medium">{section.label}</span>
                      <span className={`text-xs ${
                        theme === "light" ? "text-gray-500" : "text-slate-500"
                      }`}>
                        {section.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <div className="px-4 py-6 max-w-4xl mx-auto">
          {/* Match Engine Generator */}
          <div className={`mb-6 p-6 rounded-2xl border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
            <h2 className={`text-2xl font-bold mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Match Engine Generator
            </h2>
            <p className={`text-sm mb-6 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              Enter two birthdates to see their compatibility score and detailed analysis
            </p>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                  Person 1 Birthdate
                </label>
                <input
                  type="date"
                  value={birthdate1}
                  onChange={(e) => setBirthdate1(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-lg ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-slate-800 border-white/20 text-white"}`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                  Person 2 Birthdate
                </label>
                <input
                  type="date"
                  value={birthdate2}
                  onChange={(e) => setBirthdate2(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-lg ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-slate-800 border-white/20 text-white"}`}
                />
              </div>
              
              <button
                onClick={calculateMatch}
                disabled={!birthdate1 || !birthdate2}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all ${
                  birthdate1 && birthdate2
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Calculate Match
              </button>
            </div>
          </div>

          {/* Match Result Popup */}
          {showMatchResult && matchData && (
            <>
              {console.log('[Match Generator] Rendering popup', { showMatchResult, matchData })}
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                onClick={() => {
                  console.log('[Match Generator] Overlay clicked, closing popup')
                  setShowMatchResult(false)
                }}
              >
                <div 
                  className={`relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl ${theme === "light" ? "bg-white" : "bg-slate-900"}`}
                  onClick={(e) => {
                    console.log('[Match Generator] Modal content clicked')
                    e.stopPropagation()
                  }}
                >
                  {/* Close button */}
                  <button
                    onClick={() => {
                      console.log('[Match Generator] Close button clicked')
                      setShowMatchResult(false)
                    }}
                    className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${theme === "light" ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-white"}`}
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m18 6-12 12" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>

                  {/* Connection box */}
                  <div className="p-4">
                    <ConnectionBoxNew
                      {...matchData}
                      theme={theme}
                      showElements={true}
                      showProfile={false}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

