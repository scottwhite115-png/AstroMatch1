"use client"

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
]

const ASTROLAB_PAGES = [
  {
    id: 'match-generator',
    label: 'Match Generator',
    icon: '🧮',
    path: '/astrology/match-generator',
    description: 'Calculate compatibility',
  },
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

  const handleSectionClick = (sectionId: string) => {
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
      <div className="mx-auto max-w-4xl px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FourPointedStar className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
              AstroLab
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
    </header>
  )
}

