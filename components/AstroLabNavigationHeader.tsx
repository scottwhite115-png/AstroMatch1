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
    id: 'triple-harmony-trines',
    label: '三合 Triple Harmony',
    icon: '',
    description: 'Triple Harmony trine groups table',
  },
  {
    id: 'secret-friends',
    label: '六合 Six Harmonies',
    icon: '',
    description: 'Six Harmonies (Liu He) pairs table',
  },
  {
    id: 'six-conflicts',
    label: '六冲 Six Conflicts',
    icon: '',
    description: 'Six Conflicts (Liu Chong) pairs table',
  },
  {
    id: 'six-harms',
    label: '六害 Six Harms',
    icon: '',
    description: 'Six Harms (Liu Hai) pairs table',
  },
  {
    id: 'punishment',
    label: '刑 Punishment',
    icon: '',
    description: 'Punishment (Xing) groups table',
  },
  {
    id: 'break-pattern',
    label: '破 Breakpoints',
    icon: '',
    description: 'Breakpoints (Po) pairs table',
  },
  {
    id: 'match-generator',
    label: 'Match Generator',
    icon: '🧮',
    description: 'Calculate compatibility',
    path: '/astrology/match-generator', // This is a page, not a section
  },
  {
    id: 'what-shapes-score',
    label: 'Match Engine',
    icon: '⚙️',
    description: 'How compatibility scores work',
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLElement>(null)
  const drawerButtonRef = useRef<HTMLButtonElement>(null)

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

  const handleSectionClick = (sectionId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    
    // Check if this section has a path (like match-generator which is a page)
    const section = ASTROLAB_SECTIONS.find(s => s.id === sectionId)
    if (section && 'path' in section && section.path) {
      // Navigate to the page
      router.push(section.path)
      return
    }

    // If we're on the main page, scroll to section
    if (pathname === '/astrology') {
      const scrollToSection = () => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return true
        }
        return false
      }

      // Try immediately
      if (!scrollToSection()) {
        // If element not found, wait a bit and try again (for dynamic content)
        setTimeout(() => {
          if (!scrollToSection()) {
            // Try one more time after a longer delay
            setTimeout(scrollToSection, 300)
          }
        }, 100)
      }
    } else {
      // Otherwise, navigate to main page with hash
      router.push(`/astrology#${sectionId}`)
      // The page's useEffect will handle scrolling when it loads
    }
  }

  return (
    <header className={`sticky top-0 z-50 ${
      theme === "light"
        ? "bg-white/80 backdrop-blur-sm"
        : "bg-slate-900/80 backdrop-blur-sm"
    }`}>
      <div className="mx-auto max-w-full px-2 pt-0.5 pb-1.5 sm:px-3 lg:px-4">
        {/* AstroLab heading */}
        <div className="flex items-center justify-between mb-1.5">
          {/* Left side: AstroLab heading */}
          <div className="flex-1 -ml-8">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-transparent">
              <div className="flex gap-0.5 min-w-max ml-8">
                <div className="flex items-center gap-0.5">
                  <FourPointedStar className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-lg bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    AstroLab
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side: Theme Toggle */}
          <div className="flex items-center gap-2 ml-2">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-lg transition-colors"
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
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-base font-medium transition-colors ${
                  theme === "light"
                    ? "border-amber-200 text-gray-700 hover:opacity-90"
                    : "border-amber-800/50 text-slate-200 hover:opacity-90"
                }`}
                style={{
                  background: theme === "light"
                    ? "linear-gradient(to right, rgba(254, 240, 138, 0.4), rgba(251, 191, 36, 0.4), rgba(249, 115, 22, 0.4))"
                    : "linear-gradient(to right, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.15), rgba(249, 115, 22, 0.15))"
                }}
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
            Patterns
          </p>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {ASTROLAB_SECTIONS.map((section) => {
              const sectionPath = (section as any).path
              // If section has a path, use Link; otherwise use button for scrolling
              if (sectionPath) {
                return (
                  <Link
                    key={section.id}
                    href={sectionPath}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-base font-medium transition-colors cursor-pointer ${
                      theme === "light"
                        ? "border-amber-200 text-gray-700 hover:opacity-90"
                        : "border-amber-800/50 text-slate-200 hover:opacity-90"
                    }`}
                    style={{
                      background: theme === "light"
                        ? "linear-gradient(to right, rgba(254, 240, 138, 0.4), rgba(251, 191, 36, 0.4), rgba(249, 115, 22, 0.4))"
                        : "linear-gradient(to right, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.15), rgba(249, 115, 22, 0.15))"
                    }}
                    title={section.description}
                  >
                    <span>{section.icon}</span>
                    <span>{section.label}</span>
                  </Link>
                )
              }
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={(e) => handleSectionClick(section.id, e)}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-base font-medium transition-colors cursor-pointer ${
                    theme === "light"
                      ? "border-amber-200 text-gray-700 hover:opacity-90"
                      : "border-amber-800/50 text-slate-200 hover:opacity-90"
                  }`}
                  style={{
                    background: theme === "light"
                      ? "linear-gradient(to right, rgba(254, 240, 138, 0.4), rgba(251, 191, 36, 0.4), rgba(249, 115, 22, 0.4))"
                      : "linear-gradient(to right, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.15), rgba(249, 115, 22, 0.15))"
                  }}
                  title={section.description}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              )
            })}
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
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(page.path)
                      setIsDrawerOpen(false)
                    }}
                    className={[
                      "flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors cursor-pointer",
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

              {/* Section heading for Patterns */}
              <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${theme === "light" ? "text-gray-500" : "text-slate-500"}`}>
                Patterns
              </div>

              {ASTROLAB_SECTIONS.map((section) => {
                const sectionPath = (section as any).path
                const isActive = sectionPath ? pathname === sectionPath : 
                  (pathname === '/astrology' && typeof window !== 'undefined' && window.location.hash === `#${section.id}`)
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSectionClick(section.id, e)
                      setIsDrawerOpen(false)
                    }}
                    className={[
                      "flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors cursor-pointer",
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

