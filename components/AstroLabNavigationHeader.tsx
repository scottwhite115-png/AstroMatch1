"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

// Navigation sections and pages
const ASTROLAB_SECTIONS = [
  {
    id: 'match-generator',
    label: 'Match Generator',
    icon: '🧮',
    description: 'Calculate compatibility',
    path: '/astrology/match-generator', // This is a page, not a section
  },
  {
    id: 'chinese-patterns',
    label: 'Chinese Patterns',
    icon: '📊',
    description: 'Traditional zodiac compatibility patterns',
  },
  {
    id: 'what-shapes-score',
    label: 'Match Engine',
    icon: '⚙️',
    description: 'How compatibility scores work',
  },
  {
    id: 'sun-sign-compatibility',
    label: 'Sun Sign Compatibility',
    icon: '☀️',
    description: 'Element compatibility chart',
  },
  {
    id: 'five-elements',
    label: 'Five Elements',
    icon: '🌳',
    description: 'Wu Xing (五行) element compatibility',
  },
  {
    id: 'chinese-zodiac-calendar',
    label: 'Zodiac Calendar',
    icon: '📅',
    description: 'Chinese zodiac year calendar',
  },
]

const ASTROLAB_PAGES = [
  {
    id: 'combinations',
    label: 'Sign Combinations',
    icon: '⭐',
    path: '/astrology/combinations',
    description: 'Explore zodiac matches',
  },
  {
    id: 'sun-signs',
    label: 'Sun Signs',
    icon: '☀️',
    path: '/astrology/sun-signs',
    description: 'Western astrology',
  },
  {
    id: 'chinese-zodiac',
    label: 'Chinese Zodiac',
    icon: '🐉',
    path: '/astrology/chinese-zodiac',
    description: 'Animal signs',
  },
  {
    id: 'vedic',
    label: 'Vedic Astrology',
    icon: '🕉️',
    path: '/astrology/vedic',
    description: 'Ancient Indian wisdom',
  },
]

interface AstroLabNavigationHeaderProps {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

export default function AstroLabNavigationHeader({ theme, setTheme }: AstroLabNavigationHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<'matches' | 'astrolab'>('astrolab')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLElement>(null)
  const drawerButtonRef = useRef<HTMLButtonElement>(null)

  // Sync active tab with current route
  useEffect(() => {
    if (pathname === '/matches' || pathname.startsWith('/matches/')) {
      setActiveTab('matches')
    } else if (pathname === '/astrology' || pathname.startsWith('/astrology/')) {
      setActiveTab('astrolab')
    }
  }, [pathname])

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isDrawerOpen) return

      const target = event.target as Node
      
      if (
        drawerRef.current?.contains(target) ||
        drawerButtonRef.current?.contains(target)
      ) {
        return
      }

      setIsDrawerOpen(false)
    }

    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDrawerOpen])

  const handleSectionClick = (sectionId: string) => {
    // Check if this section has a path (like match-generator which is a page)
    const section = ASTROLAB_SECTIONS.find(s => s.id === sectionId)
    if (section && 'path' in section && section.path) {
      // Navigate to the page
      router.push(section.path)
      return
    }

    // If we're on the main page, scroll to section
    if (pathname === '/astrology') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        // If element not found, wait a bit and try again (for dynamic content)
        setTimeout(() => {
          const el = document.getElementById(sectionId)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    } else {
      // Otherwise, navigate to main page with hash
      router.push(`/astrology#${sectionId}`)
    }
  }

  return (
    <header className={`sticky top-0 z-50 border-b ${
      theme === "light"
        ? "bg-white/80 backdrop-blur-sm border-gray-200"
        : "bg-slate-900/80 backdrop-blur-sm border-slate-800"
    }`}>
      <div className="mx-auto max-w-4xl px-4 pt-3 pb-3">
        {/* Tabs: Matches | AstroLab */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 -ml-4">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-transparent">
              <div className="flex gap-0.5 min-w-max">
                <button
                  onClick={() => {
                    setActiveTab('matches')
                    router.push('/matches')
                  }}
                  className={`relative px-5 py-2.5 font-bold whitespace-nowrap transition-all duration-300 ease-in-out ${
                    activeTab === 'matches'
                      ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent"
                      : theme === "light"
                        ? "text-gray-600 hover:text-gray-900"
                        : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  AstroMatch
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300 ease-in-out ${
                      activeTab === 'matches' 
                        ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 opacity-100" 
                        : "opacity-0"
                    }`}
                  />
                </button>
                <button
                  onClick={() => setActiveTab('astrolab')}
                  className={`relative px-5 py-2.5 font-bold whitespace-nowrap transition-all duration-300 ease-in-out ${
                    activeTab === 'astrolab'
                      ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent"
                      : theme === "light"
                        ? "text-gray-600 hover:text-gray-900"
                        : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  AstroLab
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300 ease-in-out ${
                      activeTab === 'astrolab' 
                        ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 opacity-100" 
                        : "opacity-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
          {/* Right side: Drawer toggle button and Theme Toggle */}
          <div className="flex items-center gap-2 ml-2">
            {/* Drawer Toggle Button */}
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

        {/* Pill Navigation - Pages */}
        <div className="mb-2">
          <p className={`text-xs font-medium mb-2 ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
            Pages
          </p>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {ASTROLAB_PAGES.map((page) => (
              <Link
                key={page.id}
                href={page.path}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  theme === "light"
                    ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    : "border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800/80"
                }`}
                title={page.description}
              >
                <span>{page.icon}</span>
                <span>{page.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Pill Navigation - Sections */}
        <div>
          <p className={`text-xs font-medium mb-2 ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
            Sections
          </p>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {ASTROLAB_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSectionClick(section.id)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  theme === "light"
                    ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    : "border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800/80"
                }`}
                title={section.description}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Slide-out drawer */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer */}
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
              
              {ASTROLAB_PAGES.map((page) => {
                const isActive = pathname === page.path
                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => {
                      router.push(page.path)
                      setIsDrawerOpen(false)
                    }}
                    className={[
                      "flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? theme === "light"
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "bg-orange-900/30 text-orange-300 border border-orange-700/50"
                        : theme === "light"
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
                )
              })}

              {/* Divider */}
              <div className={`my-2 border-t ${theme === "light" ? "border-gray-200" : "border-slate-700"}`} />

              {/* Section heading for Sections */}
              <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${theme === "light" ? "text-gray-500" : "text-slate-500"}`}>
                Sections
              </div>

              {ASTROLAB_SECTIONS.map((section) => {
                const sectionPath = (section as any).path
                const isActive = sectionPath ? pathname === sectionPath : 
                  (pathname === '/astrology' && typeof window !== 'undefined' && window.location.hash === `#${section.id}`)
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      handleSectionClick(section.id)
                      setIsDrawerOpen(false)
                    }}
                    className={[
                      "flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? theme === "light"
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "bg-orange-900/30 text-orange-300 border border-orange-700/50"
                        : theme === "light"
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
                )
              })}
            </nav>
          </aside>
        </>
      )}
    </header>
  )
}

