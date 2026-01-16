"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { 
  AriesSymbol, TaurusSymbol, GeminiSymbol, CancerSymbol, LeoSymbol, VirgoSymbol,
  LibraSymbol, ScorpioSymbol, SagittariusSymbol, CapricornSymbol, AquariusSymbol, PiscesSymbol
} from "@/components/western-zodiac-symbols"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function SignCombinationsPage() {
  const [selectedWestern, setSelectedWestern] = useState<string | null>(null)
  const [selectedChinese, setSelectedChinese] = useState<string | null>(null)
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
      description: 'Explore Vedic astrology compatibility',
      icon: '🕉️',
      path: '/astrology/vedic',
    },
  ]

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
                        // Scroll to section if no path
                        const element = document.getElementById(section.id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
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

        <div className="px-4 pt-2 pb-3 sm:px-6 lg:px-8">
          {/* Main Heading */}
          <div className="flex items-center justify-center mb-6">
            <h1 className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Sign Combinations
            </h1>
          </div>

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
        </div>
      </div>
    </div>
  )
}

