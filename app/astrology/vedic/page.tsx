"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { VedicSection } from "@/components/astrolab/VedicSection"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function VedicPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLElement>(null)
  const drawerButtonRef = useRef<HTMLButtonElement>(null)

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

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24`}
    >
      <div className="relative z-10">
        {/* Header with drawer button */}
        <AstroLabNavigationHeader theme={theme} setTheme={setTheme} />

        {/* Slide-out drawer */}
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

        <div className="px-4 pt-6 pb-3 sm:px-6 lg:px-8">
          {/* Page Title */}
              <div className="mb-6 text-center">
                <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                  Vedic Astrology
                </h1>
              </div>

          {/* Vedic Section Component */}
          <VedicSection theme={theme} />
        </div>
      </div>
    </div>
  )
}
