"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { 
  AriesSymbol, TaurusSymbol, GeminiSymbol, CancerSymbol, LeoSymbol, VirgoSymbol,
  LibraSymbol, ScorpioSymbol, SagittariusSymbol, CapricornSymbol, AquariusSymbol, PiscesSymbol
} from "@/components/western-zodiac-symbols"
import { ConnectionBoxNew } from "@/components/ConnectionBoxNew"
import { buildMatchResultForProfiles } from "@/lib/matchGlue"
import { getWesternSignFromDate, getChineseAnimalFromDate, getWuXingElementFromDate } from "@/lib/zodiacHelpers"
import type { WesternSign, ChineseAnimal, WuXingElement } from "@/lib/matchEngine"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function AstrologySection() {
  const [selectedWestern, setSelectedWestern] = useState<string | null>(null)
  const [selectedChinese, setSelectedChinese] = useState<string | null>(null)
  const [birthdate1, setBirthdate1] = useState<string>("")
  const [birthdate2, setBirthdate2] = useState<string>("")
  const [showMatchResult, setShowMatchResult] = useState(false)
  const [matchData, setMatchData] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Section menu items for the drawer
  const sectionItems = [
    {
      id: 'match-generator',
      label: 'Match Generator',
      description: 'Calculate compatibility between two birthdates',
      icon: '🧮',
    },
    {
      id: 'what-shapes-score',
      label: 'What Shapes Your Score',
      description: 'How the match engine works',
      icon: '⚙️',
    },
    {
      id: 'chinese-patterns',
      label: 'Chinese Pattern Ranking',
      description: 'Traditional Chinese zodiac compatibility patterns',
      icon: '📊',
    },
  ]

  // Astrology pages menu items
  const astrologyPages = [
    {
      id: 'combinations',
      label: 'Sign Combinations',
      description: 'Explore Western × Chinese zodiac matches',
      icon: '⭐',
      path: '/astrology',
    },
    {
      id: 'western-guide',
      label: 'Western Zodiac Guide',
      description: 'Learn about the 12 sun signs',
      icon: '☀️',
      path: '/astrology/guide',
    },
    {
      id: 'chinese-guide',
      label: 'Chinese Zodiac Guide',
      description: 'Discover the 12 animals',
      icon: '🐉',
      path: '/astrology/guide/next',
    },
  ]

  const handleWesternClick = (sign: string) => {
    const newWestern = sign
    setSelectedWestern(newWestern)

    if (selectedChinese) {
      router.push(`/astrology/${newWestern}/${selectedChinese}`)
    }
  }

  const handleChineseClick = (sign: string) => {
    const newChinese = sign
    setSelectedChinese(newChinese)

    if (selectedWestern) {
      router.push(`/astrology/${selectedWestern}/${newChinese}`)
    }
  }

  const calculateMatch = () => {
    if (!birthdate1 || !birthdate2) return

    console.log('[Match Generator] Starting calculation...', { birthdate1, birthdate2 })

    try {
      const date1 = new Date(birthdate1)
      const date2 = new Date(birthdate2)

      console.log('[Match Generator] Dates parsed:', { date1, date2 })

      // Get astro data for both people
      const person1 = {
        westernSign: getWesternSignFromDate(date1) as WesternSign,
        chineseAnimal: getChineseAnimalFromDate(date1) as ChineseAnimal,
        wuXingElement: getWuXingElementFromDate(date1) as WuXingElement,
      }

      const person2 = {
        westernSign: getWesternSignFromDate(date2) as WesternSign,
        chineseAnimal: getChineseAnimalFromDate(date2) as ChineseAnimal,
        wuXingElement: getWuXingElementFromDate(date2) as WuXingElement,
      }

      console.log('[Match Generator] Person 1:', person1)
      console.log('[Match Generator] Person 2:', person2)

      // Build match result
      const matchResult = buildMatchResultForProfiles(person1, person2)

      console.log('[Match Generator] Match result:', matchResult)

      // Create connection box data
      const boxData = {
        score: matchResult.score,
        tier: "Neutral Match" as any, // This will be overridden by pattern colors
        rankLabel: matchResult.patternShortLabelEn,
        rank: matchResult.patternShortLabelEn,
        pillLabel: matchResult.pillLabel,
        pattern: matchResult.pattern,
        patternFullLabel: matchResult.patternFullLabel,
        baseTagline: matchResult.baseTagline,
        patternEmoji: matchResult.patternEmoji,
        chemistryStars: matchResult.chemistryStars,
        stabilityStars: matchResult.stabilityStars,
        a: {
          west: person1.westernSign,
          east: person1.chineseAnimal,
          westGlyph: "",
          eastGlyph: "",
          chineseElement: person1.wuXingElement,
        },
        b: {
          west: person2.westernSign,
          east: person2.chineseAnimal,
          westGlyph: "",
          eastGlyph: "",
          chineseElement: person2.wuXingElement,
        },
        east_relation: "",
        east_summary: "",
        west_relation: "",
        west_summary: "",
        chineseLine: `${person1.chineseAnimal} × ${person2.chineseAnimal}`,
        westernLine: `${person1.westernSign} × ${person2.westernSign}`,
        sunMatchBlurb: "Match generated from birthdates",
      }

      console.log('[Match Generator] Box data:', boxData)
      console.log('[Match Generator] Setting showMatchResult to true')

      setMatchData(boxData)
      setShowMatchResult(true)
    } catch (error) {
      console.error("[Match Generator] Error calculating match:", error)
    }
  }

  const buttonBaseClass = "zodiac-list-item astro-highlight-card"

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
                Astrology
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

              {/* Section heading for Charts & Sections */}
              <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${theme === "light" ? "text-gray-500" : "text-slate-500"}`}>
                Charts & Sections
              </div>

              {sectionItems.map((section) => {
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      const element = document.getElementById(section.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

        <div className="px-4 pt-2 pb-3 sm:px-6 lg:px-8" ref={scrollContainerRef}>
          {/* Main Heading */}
          <div className="relative flex items-center justify-center mb-6">
            <h1 className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Sign Combinations
            </h1>
            <button
              onClick={() => {
                router.push('/astrology/guide')
              }}
              className={`absolute right-0 p-2 rounded-lg transition-colors flex items-center justify-center ${
                theme === "light" ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-white"
              }`}
              aria-label="Navigate to guide page"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Match Engine Generator */}
          <div id="match-generator" className={`mb-6 p-4 rounded-2xl border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
            <h2 className={`text-lg font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Match Engine Generator
            </h2>
            <p className={`text-sm mb-4 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              Enter two birthdates to see their compatibility
            </p>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                  Person 1 Birthdate
                </label>
                <input
                  type="date"
                  value={birthdate1}
                  onChange={(e) => setBirthdate1(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-slate-800 border-white/20 text-white"}`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                  Person 2 Birthdate
                </label>
                <input
                  type="date"
                  value={birthdate2}
                  onChange={(e) => setBirthdate2(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-slate-800 border-white/20 text-white"}`}
                />
              </div>
              
              <button
                onClick={calculateMatch}
                disabled={!birthdate1 || !birthdate2}
                className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
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

          <div className="grid grid-cols-2 gap-6 mb-4">
            {/* Western Astrology Section */}
            <div className="space-y-2">
              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "aries" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "aries" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("aries")}
              >
                <AriesSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Aries</span>
                </div>
              </button>

              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "taurus" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "taurus" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("taurus")}
              >
                <TaurusSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Taurus</span>
                </div>
              </button>

              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "gemini" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "gemini" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("gemini")}
              >
                <GeminiSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Gemini</span>
                </div>
              </button>

              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "cancer" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "cancer" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("cancer")}
              >
                <CancerSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Cancer</span>
                </div>
              </button>

              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "leo" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "leo" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("leo")}
              >
                <LeoSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Leo</span>
                </div>
              </button>

              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "virgo" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "virgo" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("virgo")}
              >
                <VirgoSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Virgo</span>
                </div>
              </button>

              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "libra" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "libra" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("libra")}
              >
                <LibraSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Libra</span>
                </div>
              </button>

              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "scorpio" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "scorpio" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("scorpio")}
              >
                <ScorpioSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Scorpio</span>
                </div>
              </button>

              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "sagittarius" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "sagittarius" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("sagittarius")}
              >
                <SagittariusSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Sagittarius</span>
                </div>
              </button>

              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "capricorn" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "capricorn" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("capricorn")}
              >
                <CapricornSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Capricorn</span>
                </div>
              </button>

              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "aquarius" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "aquarius" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("aquarius")}
              >
                <AquariusSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Aquarius</span>
                </div>
              </button>

              <button
                type="button"
                className={`${buttonBaseClass} western ${selectedWestern === "pisces" ? "border-2 border-amber-400" : ""}`}
                style={selectedWestern === "pisces" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleWesternClick("pisces")}
              >
                <PiscesSymbol className="w-8 h-8 text-white" />
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Pisces</span>
                </div>
              </button>
            </div>

            {/* Eastern Astrology Section */}
            <div className="space-y-2">
              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "rat" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "rat" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("rat")}
              >
                <div className="text-2xl">🐭</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Rat</span>
                </div>
              </button>

              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "ox" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "ox" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("ox")}
              >
                <div className="text-2xl">🐂</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Ox</span>
                </div>
              </button>

              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "tiger" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "tiger" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("tiger")}
              >
                <div className="text-2xl">🐅</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Tiger</span>
                </div>
              </button>

              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "rabbit" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "rabbit" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("rabbit")}
              >
                <div className="text-2xl">🐰</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Rabbit</span>
                </div>
              </button>

              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "dragon" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "dragon" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("dragon")}
              >
                <div className="text-2xl">🐉</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Dragon</span>
                </div>
              </button>

              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "snake" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "snake" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("snake")}
              >
                <div className="text-2xl">🐍</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Snake</span>
                </div>
              </button>

              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "horse" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "horse" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("horse")}
              >
                <div className="text-2xl">🐎</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Horse</span>
                </div>
              </button>

              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "goat" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "goat" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("goat")}
              >
                <div className="text-2xl">🐐</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Goat</span>
                </div>
              </button>

              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "monkey" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "monkey" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("monkey")}
              >
                <div className="text-2xl">🐒</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Monkey</span>
                </div>
              </button>

              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "rooster" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "rooster" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("rooster")}
              >
                <div className="text-2xl">🐓</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Rooster</span>
                </div>
              </button>

              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "dog" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "dog" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("dog")}
              >
                <div className="text-2xl">🐕</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Dog</span>
                </div>
              </button>

              <button
                className={`${buttonBaseClass} chinese ${selectedChinese === "pig" ? "border-2 border-amber-400" : ""}`}
                style={selectedChinese === "pig" ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' } : {}}
                onClick={() => handleChineseClick("pig")}
              >
                <div className="text-2xl">🐷</div>
                <div className="zodiac-info">
                  <span className="zodiac-name-small text-white/95">Pig</span>
                </div>
              </button>
            </div>
          </div>

          {/* Compatibility Guides Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">

          {/* What Shapes Your Match Score Section */}
          <div id="what-shapes-score" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">What Shapes Your Match Score</h2>
              
              <div className="space-y-3">
                {/* Spark & Harmony */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-purple-100" : "bg-white/5 border-purple-500/20"}`}>
                  <h4 className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-purple-700" : ""}`} style={theme === "light" ? {} : { background: "linear-gradient(to right, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Spark & Harmony
                  </h4>
                  <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                    Your match is evaluated on two dimensions: <span className="font-medium">Spark</span> (excitement, chemistry, dynamic energy) and <span className="font-medium">Harmony</span> (stability, compatibility, ease). Final score = 60% Harmony + 40% Spark.
                  </p>
                </div>

                {/* Chinese Patterns */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-emerald-100" : "bg-white/5 border-emerald-500/20"}`}>
                  <h4 className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-emerald-700" : ""}`} style={theme === "light" ? {} : { background: "linear-gradient(to right, #6ee7b7, #2dd4bf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Chinese patterns
                  </h4>
                  <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                    Trines and relationship lines like <span className="font-medium">San He 三合</span> (Three Harmonies), <span className="font-medium">Liu He 六合</span> (Six Harmonies), <span className="font-medium">Liu Chong 六冲</span> (Conflicts), <span className="font-medium">Liu Hai 六害</span> (Harms), and <span className="font-medium">Xing 刑</span> (Punishment).
                  </p>
                </div>

                {/* Western Zodiac */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-blue-100" : "bg-white/5 border-blue-500/20"}`}>
                  <h4 className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-blue-700" : ""}`} style={theme === "light" ? {} : { background: "linear-gradient(to right, #60a5fa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Western zodiac
                  </h4>
                  <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                    Element harmony (Fire, Earth, Air, Water) and sign relationships (oppositions, squares, trines, sextiles).
                  </p>
                </div>

                {/* Chinese Year Elements */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-amber-100" : "bg-white/5 border-amber-500/20"}`}>
                  <h4 className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-amber-700" : ""}`} style={theme === "light" ? {} : { background: "linear-gradient(to right, #fbbf24, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Wu Xing (Five Elements)
                  </h4>
                  <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                    How your year elements (Wood, Fire, Earth, Metal, Water) interact through the generating and controlling cycles. Directly affects the Harmony score.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Match Engine Ranking - Chinese Pattern Based */}
          <div id="chinese-patterns" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Chinese Pattern Ranking</h2>
              
              {/* Compact card layout for mobile */}
              <div className="space-y-3">
                {/* San He - Triple Harmony */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 
                      className="text-sm font-semibold"
                      style={{ 
                        backgroundImage: "linear-gradient(to right, #fbbf24, #f59e0b)", 
                        WebkitBackgroundClip: "text", 
                        WebkitTextFillColor: "transparent", 
                        backgroundClip: "text" 
                      }}
                    >
                      🌟 San He 三合
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded font-medium text-white" style={{ background: "linear-gradient(to right, #fbbf24, #f59e0b)" }}>82-96%</span>
                  </div>
                  <p className={`text-sm mb-1 font-medium ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>Triple Harmony</p>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Triple Harmony – easy flow and strong support. Classic trine alliance with natural alignment and long-term growth potential.</p>
                </div>

                {/* Liu He - Secret Friends */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 
                      className="text-sm font-semibold"
                      style={{ 
                        backgroundImage: "linear-gradient(to right, #c084fc, #e879f9)", 
                        WebkitBackgroundClip: "text", 
                        WebkitTextFillColor: "transparent", 
                        backgroundClip: "text" 
                      }}
                    >
                      💫 Liu He 六合
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded font-medium text-white" style={{ background: "linear-gradient(to right, #c084fc, #e879f9)" }}>72-94%</span>
                  </div>
                  <p className={`text-sm mb-1 font-medium ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>Secret Friends</p>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Close one-to-one bond with a soft, quietly supportive tone. One-to-one pattern with personal bonding and stability.</p>
                </div>

                {/* Same Sign */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 
                      className="text-sm font-semibold"
                      style={{ 
                        backgroundImage: "linear-gradient(to right, #2dd4bf, #14b8a6)", 
                        WebkitBackgroundClip: "text", 
                        WebkitTextFillColor: "transparent", 
                        backgroundClip: "text" 
                      }}
                    >
                      🪞 Same Sign 同生肖
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded font-medium text-white" style={{ background: "linear-gradient(to right, #2dd4bf, #14b8a6)" }}>58-68%</span>
                  </div>
                  <p className={`text-sm mb-1 font-medium ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>Mirror Match</p>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Double dose of one energy; high familiarity, medium harmony. Deeply familiar mirror-style connection.</p>
                </div>

                {/* Neutral Pattern */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 
                      className="text-sm font-semibold"
                      style={{ 
                        backgroundImage: "linear-gradient(to right, #60a5fa, #818cf8, #3b82f6)", 
                        WebkitBackgroundClip: "text", 
                        WebkitTextFillColor: "transparent", 
                        backgroundClip: "text" 
                      }}
                    >
                      ◽ Neutral 中
                    </h3>
                    <span 
                      className="text-xs px-2 py-0.5 rounded font-medium text-white" 
                      style={{ background: "linear-gradient(to right, #60a5fa, #818cf8, #3b82f6)" }}
                    >
                      50-65%
                    </span>
                  </div>
                  <p className={`text-sm mb-1 font-medium ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>No Major Pattern</p>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>No big traditional pattern. Quality depends more on Western signs and elements. Open-ended dynamic.</p>
                </div>

                {/* Liu Chong - Six Conflicts */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 
                      className="text-sm font-semibold"
                      style={{ 
                        backgroundImage: "linear-gradient(to right, #fb923c, #f97316)", 
                        WebkitBackgroundClip: "text", 
                        WebkitTextFillColor: "transparent", 
                        backgroundClip: "text" 
                      }}
                    >
                      ⚠️ Liu Chong 六冲
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded font-medium text-white" style={{ background: "linear-gradient(to right, #fb923c, #f97316)" }}>38-72%</span>
                  </div>
                  <p className={`text-sm mb-1 font-medium ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>Six Conflicts</p>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Magnetic opposites – high spark, low long-term harmony. Opposing branches with dynamic tension.</p>
                </div>

                {/* Liu Hai - Six Harms */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 
                      className="text-sm font-semibold"
                      style={{ 
                        backgroundImage: "linear-gradient(to right, #fb7185, #f43f5e)", 
                        WebkitBackgroundClip: "text", 
                        WebkitTextFillColor: "transparent", 
                        backgroundClip: "text" 
                      }}
                    >
                      💔 Liu Hai 六害
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded font-medium text-white" style={{ background: "linear-gradient(to right, #fb7185, #f43f5e)" }}>35-68%</span>
                  </div>
                  <p className={`text-sm mb-1 font-medium ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>Six Harms</p>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Drains and misunderstandings; small hurts can build up over time. Needs gentle pacing and clear boundaries.</p>
                </div>

                {/* Xing - Punishment */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 
                      className="text-sm font-semibold"
                      style={{ 
                        backgroundImage: "linear-gradient(to right, #f87171, #ef4444)", 
                        WebkitBackgroundClip: "text", 
                        WebkitTextFillColor: "transparent", 
                        backgroundClip: "text" 
                      }}
                    >
                      🔥 Xing 刑
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded font-medium text-white" style={{ background: "linear-gradient(to right, #f87171, #ef4444)" }}>35-66%</span>
                  </div>
                  <p className={`text-sm mb-1 font-medium ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>Punishment Pattern</p>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Tension and sharp edges; situations can feel strict or demanding. Grinding tension that exposes differences.</p>
                </div>

                {/* Po - Break */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 
                      className="text-sm font-semibold"
                      style={{ 
                        backgroundImage: "linear-gradient(to right, #f43f5e, #e11d48)", 
                        WebkitBackgroundClip: "text", 
                        WebkitTextFillColor: "transparent", 
                        backgroundClip: "text" 
                      }}
                    >
                      💥 Po 破
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded font-medium text-white" style={{ background: "linear-gradient(to right, #f43f5e, #e11d48)" }}>32-64%</span>
                  </div>
                  <p className={`text-sm mb-1 font-medium ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>Break Pattern</p>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Breaks, instability and disruption in the flow of the relationship. Represents break-ups and disrupted flow.</p>
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
