"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { getChinesePattern } from "@/lib/chinesePatternSystem"
import { patternDefinitions } from "@/lib/chinesePatternSystem"
import type { ChinesePatternType } from "@/lib/chinesePatternSystem"
import { getChineseSignGlyph } from "@/lib/zodiacHelpers"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function AstrologySection() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
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

  // Scroll to Chinese Pattern Ranking on page load
  useEffect(() => {
    const element = document.getElementById('chinese-patterns')
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [])

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
    },
    {
      id: 'what-shapes-score',
      label: 'What Shapes Your Score',
      description: 'How the match engine works',
      icon: '⚙️',
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

        <div className="px-4 pt-2 pb-3 sm:px-6 lg:px-8" ref={scrollContainerRef}>
          {/* Compatibility Guides Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">

          {/* Combined Chinese Pattern Ranking & Relationship Patterns */}
          <div id="chinese-patterns" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Chinese Pattern Ranking & Meanings</h2>
              
              <div className="mb-4">
                <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Understanding the traditional Chinese zodiac patterns, their score ranges, and how they're interpreted in the AstroMatch compatibility system.
                </p>
              </div>

              {/* Combined Table - No scrolling, restructured layout */}
              <div className="space-y-3">
                {/* Triple Harmony - San He */}
                <div className={`border rounded-lg overflow-hidden ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                  <div className={`${theme === "light" ? "bg-yellow-50" : "bg-yellow-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-yellow-700" : "text-yellow-300"}`}>Triple Harmony</span>
                        <span className={`text-sm ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>三合 (San He)</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-yellow-100 text-yellow-800" : "bg-yellow-900/30 text-yellow-300"}`}>
                          Harmony
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #fbbf24, #f59e0b)" }}>88-98%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Same trine family. Smooth teamwork, shared direction, and naturally supportive long-term flow. Peaks at Soulmate/Twin Flame tier.
                    </div>
                  </div>
                </div>

                {/* Secret Friends - Liu He */}
                <div className={`border rounded-lg overflow-hidden ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                  <div className={`${theme === "light" ? "bg-pink-50" : "bg-pink-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-pink-600" : "text-pink-400"}`}>Secret Friends</span>
                        <span className={`text-sm ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>六合 (Liu He)</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-pink-100 text-pink-800" : "bg-pink-900/30 text-pink-400"}`}>
                          Harmony
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #c084fc, #e879f9)" }}>82-91%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Quiet allies. Each sign "has the other's back" and tends to protect, encourage, and stabilise the connection. Reaches Twin Flame tier at peak.
                    </div>
                  </div>
                </div>

                {/* Same Sign */}
                <div className={`border rounded-lg overflow-hidden ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                  <div className={`${theme === "light" ? "bg-emerald-50" : "bg-emerald-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-emerald-600" : "text-emerald-400"}`}>Same Sign</span>
                        <span className={`text-sm ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>同生肖</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-emerald-100 text-emerald-800" : "bg-emerald-900/30 text-emerald-400"}`}>
                          Neutral +
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #2dd4bf, #14b8a6)" }}>60-70%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Double dose of one energy. Very familiar, similar instincts. Most score 62-67%, reaching 68-70% only with strong Western support.
                    </div>
                  </div>
                </div>

                {/* No Major Pattern */}
                <div className={`border rounded-lg overflow-hidden ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                  <div className={`${theme === "light" ? "bg-blue-50" : "bg-blue-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-blue-600" : "text-blue-400"}`}>No Major Pattern</span>
                        <span className={`text-sm ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>—</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-blue-100 text-blue-800" : "bg-blue-900/30 text-blue-400"}`}>
                          Neutral
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #60a5fa, #3b82f6)" }}>52-68%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      No big harmony or clash. Neutral pairs can climb with good Western aspects. How it feels depends on Western signs and individual charts.
                    </div>
                  </div>
                </div>

                {/* Six Conflicts */}
                <div className={`border rounded-lg overflow-hidden ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                  <div className={`${theme === "light" ? "bg-orange-50" : "bg-orange-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-orange-600" : "text-orange-400"}`}>Six Conflicts</span>
                        <span className={`text-sm ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>六冲 (Liu Chong)</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-orange-100 text-orange-800" : "bg-orange-900/30 text-orange-400"}`}>
                          Conflict
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #fb923c, #f97316)" }}>45-62%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Opposite branches. Push–pull, strong reactions, magnetic "Opposites Attract" chemistry. Typical range 45-58%, best case 60-62%.
                    </div>
                  </div>
                </div>

                {/* Six Harms */}
                <div className={`border rounded-lg overflow-hidden ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                  <div className={`${theme === "light" ? "bg-red-50" : "bg-red-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-red-600" : "text-red-400"}`}>Six Harms</span>
                        <span className={`text-sm ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>六害 (Liu Hai)</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-red-100 text-red-800" : "bg-red-900/30 text-red-400"}`}>
                          Conflict
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #fb7185, #f43f5e)" }}>38-60%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Hidden annoyances. Little frictions, misunderstandings, or mismatched needs. Can reach 54-60% with strong Western support.
                    </div>
                  </div>
                </div>

                {/* Punishment */}
                <div className={`border rounded-lg overflow-hidden ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                  <div className={`${theme === "light" ? "bg-rose-50" : "bg-rose-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-rose-600" : "text-rose-400"}`}>Punishment</span>
                        <span className={`text-sm ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>刑 (Xing)</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-rose-100 text-rose-800" : "bg-rose-900/30 text-rose-400"}`}>
                          Conflict
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #f87171, #ef4444)" }}>38-60%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Tense dynamics. Lessons around fairness, blame, emotional pressure, and conflict handling. Can reach 54-60% with good Western aspects.
                    </div>
                  </div>
                </div>

                {/* Break */}
                <div className={`border rounded-lg overflow-hidden ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                  <div className={`${theme === "light" ? "bg-red-50" : "bg-red-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-red-700" : "text-red-300"}`}>Break</span>
                        <span className={`text-sm ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>破 (Po)</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-red-100 text-red-800" : "bg-red-900/30 text-red-300"}`}>
                          Conflict
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #f43f5e, #e11d48)" }}>38-60%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Breakpoints. One or both people disrupt the other's routines or comfort zone. Can reach 54-60% with strong Western support.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Triple Harmony Trine Groups Table */}
          <div id="triple-harmony-trines" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Triple Harmony · 三合 (San He) Trine Groups</h2>
              
              <div className="mb-4">
                <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  These are the <strong>four trine families</strong>. Signs in the same group are your <strong>Triple Harmony</strong> connections.
                </p>
              </div>

              {/* Scrollable Table Container */}
              <div 
                className="border rounded-lg overflow-x-auto" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                }}
              >
                <table className="text-sm border-collapse w-full">
                  <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                    <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Trine Name</th>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Theme</th>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Signs in the Group</th>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Vibe in AstroMatch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rat–Dragon–Monkey - Visionaries (Yellow/Amber - San He tier) */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-yellow-50" : "hover:bg-yellow-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-yellow-700" : "text-yellow-400"}`}>Rat–Dragon–Monkey</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>Visionaries</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>
                        <span className="font-medium">Rat (子), Dragon (辰), Monkey (申)</span>
                      </td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Fast, clever, future-oriented. Great for ideas, risk-taking, and bold moves.
                      </td>
                    </tr>

                    {/* Ox–Snake–Rooster - Strategists (Yellow/Amber - San He tier) */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-yellow-50" : "hover:bg-yellow-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-yellow-700" : "text-yellow-400"}`}>Ox–Snake–Rooster</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>Strategists</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>
                        <span className="font-medium">Ox (丑), Snake (巳), Rooster (酉)</span>
                      </td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Planners and tacticians. Good with long-term plans, structure, and precision.
                      </td>
                    </tr>

                    {/* Tiger–Horse–Dog - Adventurers (Yellow/Amber - San He tier) */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-yellow-50" : "hover:bg-yellow-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-yellow-700" : "text-yellow-400"}`}>Tiger–Horse–Dog</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>Adventurers</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>
                        <span className="font-medium">Tiger (寅), Horse (午), Dog (戌)</span>
                      </td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Brave, active, loyal. Strong passion, action, and fight-for-what-matters energy.
                      </td>
                    </tr>

                    {/* Rabbit–Goat–Pig - Artists (Yellow/Amber - San He tier) */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-yellow-50" : "hover:bg-yellow-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-yellow-700" : "text-yellow-400"}`}>Rabbit–Goat–Pig</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>Artists</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>
                        <span className="font-medium">Rabbit (卯), Goat (未), Pig (亥)</span>
                      </td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Gentle, creative, emotional. Focus on care, aesthetics, and emotional connection.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Secret Friends Table */}
          <div id="secret-friends" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Secret Friends · 六合 (Liu He) Pairs</h2>
              
              <div className="mb-4">
                <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  These are the classic <strong>Secret Friend</strong> pairs. They often feel like a quiet ally or hidden support.
                </p>
              </div>

              {/* Scrollable Table Container */}
              <div 
                className="border rounded-lg overflow-x-auto" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                }}
              >
                <table className="text-sm border-collapse w-full">
                  <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                    <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Pair</th>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Chinese</th>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Theme in AstroMatch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rat × Ox - Pink colors for Liu He tier */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-pink-50" : "hover:bg-pink-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Rat × Ox</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-pink-600" : "text-pink-300"}`}>子–丑</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Practical protector; Rat's ideas meet Ox's reliability.
                      </td>
                    </tr>

                    {/* Tiger × Pig */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-pink-50" : "hover:bg-pink-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Tiger × Pig</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-pink-600" : "text-pink-300"}`}>寅–亥</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Brave heart + big heart; loyal support in tough times.
                      </td>
                    </tr>

                    {/* Rabbit × Dog */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-pink-50" : "hover:bg-pink-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Rabbit × Dog</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-pink-600" : "text-pink-300"}`}>卯–戌</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Gentle dreamer + loyal guardian; emotional safety and shared ideals.
                      </td>
                    </tr>

                    {/* Dragon × Rooster */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-pink-50" : "hover:bg-pink-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Dragon × Rooster</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-pink-600" : "text-pink-300"}`}>辰–酉</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Charisma meets clarity; helping each other shine and stay grounded.
                      </td>
                    </tr>

                    {/* Snake × Monkey */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-pink-50" : "hover:bg-pink-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Snake × Monkey</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-pink-600" : "text-pink-300"}`}>巳–申</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Strategist + trickster; clever teamwork, problem-solving, and social wit.
                      </td>
                    </tr>

                    {/* Horse × Goat */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-pink-50" : "hover:bg-pink-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Horse × Goat</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-pink-600" : "text-pink-300"}`}>午–未</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Free spirit + gentle soul; warm, expressive, and mutually encouraging.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Same Sign Explanation */}
          <div id="same-sign" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Same Sign · 同生肖</h2>
              
              <div className="mb-4">
                <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  When both people share the <strong>same animal sign</strong>, AstroMatch shows:
                </p>
              </div>

              <div className="space-y-4">
                {/* Label and Tagline Card */}
                <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-emerald-50 border-emerald-200" : "bg-emerald-900/10 border-emerald-700/30"}`}>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-base font-semibold ${theme === "light" ? "text-emerald-700" : "text-emerald-400"}`}>Label:</span>
                      <span className={`text-base font-bold ${theme === "light" ? "text-emerald-800" : "text-emerald-300"}`}>Same Sign · 同生肖</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className={`text-base font-semibold ${theme === "light" ? "text-emerald-700" : "text-emerald-400"} whitespace-nowrap`}>Tagline:</span>
                      <span className={`text-base ${theme === "light" ? "text-emerald-800" : "text-emerald-300"}`}>
                        "Same sign – double dose of one energy; high familiarity, medium harmony."
                      </span>
                    </div>
                  </div>
                </div>

                {/* What it Means */}
                <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h3 className={`text-base font-semibold mb-3 ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>
                    What it means:
                  </h3>
                  <ul className={`space-y-2 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                    <li className="flex items-start gap-2">
                      <span className={`mt-1 ${theme === "light" ? "text-emerald-600" : "text-emerald-400"}`}>•</span>
                      <span>Very similar instincts and timing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`mt-1 ${theme === "light" ? "text-emerald-600" : "text-emerald-400"}`}>•</span>
                      <span>You understand each other's moods quickly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`mt-1 ${theme === "light" ? "text-emerald-600" : "text-emerald-400"}`}>•</span>
                      <span>But it isn't automatically as "karmically special" as Triple Harmony or Secret Friends</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Six Conflicts Table */}
          <div id="six-conflicts" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Six Conflicts · 六冲 (Liu Chong)</h2>
              
              {/* Scrollable Table Container */}
              <div 
                className="border rounded-lg overflow-x-auto mb-4" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                }}
              >
                <table className="text-sm border-collapse w-full">
                  <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                    <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Pair</th>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Branches</th>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Theme in AstroMatch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rat × Horse - Indigo/Purple colors for Liu Chong (Opposites Attract) tier */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-indigo-50" : "hover:bg-indigo-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-indigo-700" : "text-indigo-400"}`}>Rat × Horse</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-indigo-600" : "text-indigo-300"}`}>子 × 午</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Head vs heart; quick mind vs free spirit; strong push–pull.
                      </td>
                    </tr>

                    {/* Ox × Goat */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-indigo-50" : "hover:bg-indigo-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-indigo-700" : "text-indigo-400"}`}>Ox × Goat</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-indigo-600" : "text-indigo-300"}`}>丑 × 未</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Duty vs feelings; stability clashes with sensitivity.
                      </td>
                    </tr>

                    {/* Tiger × Monkey */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-indigo-50" : "hover:bg-indigo-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-indigo-700" : "text-indigo-400"}`}>Tiger × Monkey</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-indigo-600" : "text-indigo-300"}`}>寅 × 申</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Rebel vs trickster; bold moves vs clever mischief.
                      </td>
                    </tr>

                    {/* Rabbit × Rooster */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-indigo-50" : "hover:bg-indigo-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-indigo-700" : "text-indigo-400"}`}>Rabbit × Rooster</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-indigo-600" : "text-indigo-300"}`}>卯 × 酉</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Soft idealist vs sharp critic; values and style clash.
                      </td>
                    </tr>

                    {/* Dragon × Dog */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-indigo-50" : "hover:bg-indigo-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-indigo-700" : "text-indigo-400"}`}>Dragon × Dog</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-indigo-600" : "text-indigo-300"}`}>辰 × 戌</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Authority vs justice; big visions vs loyalty to truth.
                      </td>
                    </tr>

                    {/* Snake × Pig */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-indigo-50" : "hover:bg-indigo-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-indigo-700" : "text-indigo-400"}`}>Snake × Pig</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-indigo-600" : "text-indigo-300"}`}>巳 × 亥</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Intensity vs ease; private depth vs open-hearted comfort.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Explanation */}
              <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-indigo-50 border-indigo-200" : "bg-indigo-900/10 border-indigo-700/30"}`}>
                <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-indigo-800" : "text-indigo-300"}`}>
                  How it reads in AstroMatch:
                </h3>
                <p className={`text-sm ${theme === "light" ? "text-indigo-900" : "text-indigo-200"}`}>
                  Liu Chong shows <strong>strong reactions and on–off movement</strong>. There's often real attraction, but it's high-maintenance unless both people are very self-aware.
                </p>
              </div>
            </div>
          </div>

          {/* Six Harms Table */}
          <div id="six-harms" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Six Harms · 六害 (Liu Hai)</h2>
              
              {/* Scrollable Table Container */}
              <div 
                className="border rounded-lg overflow-x-auto mb-4" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                }}
              >
                <table className="text-sm border-collapse w-full">
                  <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                    <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Pair</th>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Branches</th>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Theme in AstroMatch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rat × Goat - Red colors for Liu Hai (Difficult) tier */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Rat × Goat</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>子 × 未</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Practical vs sensitive; small hurts and misunderstandings pile up.
                      </td>
                    </tr>

                    {/* Ox × Horse */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Ox × Horse</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>丑 × 午</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Slow and steady vs restless and fast; timing rarely feels aligned.
                      </td>
                    </tr>

                    {/* Tiger × Snake */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Tiger × Snake</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>寅 × 巳</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Direct fire vs subtle strategy; trust and motives easily questioned.
                      </td>
                    </tr>

                    {/* Rabbit × Dragon */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Rabbit × Dragon</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>卯 × 辰</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Gentle heart vs big ego; one feels overlooked, the other feels restricted.
                      </td>
                    </tr>

                    {/* Monkey × Pig */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Monkey × Pig</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>申 × 亥</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Sharp humour vs soft feelings; jokes or lifestyle can feel cutting or heavy.
                      </td>
                    </tr>

                    {/* Rooster × Dog */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Rooster × Dog</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>酉 × 戌</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Proud perfectionist vs loyal realist; criticism and disappointment build up.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Explanation */}
              <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-red-50 border-red-200" : "bg-red-900/10 border-red-700/30"}`}>
                <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-red-800" : "text-red-300"}`}>
                  How it reads in AstroMatch:
                </h3>
                <p className={`text-sm ${theme === "light" ? "text-red-900" : "text-red-200"}`}>
                  Liu Hai is <strong>"hidden irritations"</strong> – less fireworks than Liu Chong, but more <strong>slow, subtle wear-and-tear</strong> on goodwill if people don't communicate well.
                </p>
              </div>
            </div>
          </div>

          {/* Punishment Table */}
          <div id="punishment" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Punishment · 刑 (Xing)</h2>
              
              <div className="mb-4">
                <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Punishment groups (三刑 San Xing) create <strong>tense, corrective</strong> energy. They highlight lessons around <strong>fairness, boundaries, and emotional responsibility</strong>.
                </p>
              </div>

              {/* 3 Punishment Groups */}
              <div className="mb-6">
                <h3 className={`text-base font-semibold mb-3 ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>
                  3 Punishment Groups
                </h3>
                
                <div 
                  className="border rounded-lg overflow-x-auto mb-4" 
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'thin',
                    scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                  }}
                >
                  <table className="text-sm border-collapse w-full">
                    <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                      <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                        <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Group</th>
                        <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Branches</th>
                        <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>How it tends to feel in relationships</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Rat × Rabbit - Rose colors for Xing (Punishment/Difficult) tier */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-rose-50" : "hover:bg-rose-900/10"}`}>
                        <td className={`p-3 font-semibold ${theme === "light" ? "text-rose-700" : "text-rose-400"}`}>Rat × Rabbit</td>
                        <td className={`p-3 font-medium ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>子 × 卯</td>
                        <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          "Impolite punishment" – misaligned habits, mutual irritation.
                        </td>
                      </tr>

                      {/* Tiger × Snake × Monkey */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-rose-50" : "hover:bg-rose-900/10"}`}>
                        <td className={`p-3 font-semibold ${theme === "light" ? "text-rose-700" : "text-rose-400"}`}>Tiger × Snake × Monkey</td>
                        <td className={`p-3 font-medium ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>寅 × 巳 × 申</td>
                        <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          "Bullying punishment" – power struggles, control issues, pride.
                        </td>
                      </tr>

                      {/* Goat × Ox × Dog */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-rose-50" : "hover:bg-rose-900/10"}`}>
                        <td className={`p-3 font-semibold ${theme === "light" ? "text-rose-700" : "text-rose-400"}`}>Goat × Ox × Dog</td>
                        <td className={`p-3 font-medium ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>未 × 丑 × 戌</td>
                        <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          "Ungrateful punishment" – duty, blame, and feeling unappreciated.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Pair-wise note */}
                <div className={`p-3 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                    <strong>For app logic,</strong> these are treated <strong>pair-wise</strong>: Rat × Rabbit • Tiger × Snake, Tiger × Monkey, Snake × Monkey • Goat × Ox, Goat × Dog, Ox × Dog
                  </p>
                </div>
              </div>

              {/* Self-Punishment Signs */}
              <div className="mb-4">
                <h3 className={`text-base font-semibold mb-3 ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>
                  Self-Punishment Signs (Zi Xing 自刑)
                </h3>
                
                <p className={`text-sm mb-3 ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Some signs are said to "punish themselves" when doubled:
                </p>

                <div 
                  className="border rounded-lg overflow-x-auto mb-4" 
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'thin',
                    scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                  }}
                >
                  <table className="text-sm border-collapse w-full">
                    <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                      <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                        <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Sign</th>
                        <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Branch</th>
                        <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Note in AstroMatch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Dragon */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-rose-50" : "hover:bg-rose-900/10"}`}>
                        <td className={`p-3 font-semibold ${theme === "light" ? "text-rose-700" : "text-rose-400"}`}>Dragon</td>
                        <td className={`p-3 font-medium ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>辰</td>
                        <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          Can be hard on themselves; two Dragons may double the pressure.
                        </td>
                      </tr>

                      {/* Horse */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-rose-50" : "hover:bg-rose-900/10"}`}>
                        <td className={`p-3 font-semibold ${theme === "light" ? "text-rose-700" : "text-rose-400"}`}>Horse</td>
                        <td className={`p-3 font-medium ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>午</td>
                        <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          Restless and self-demanding; double Horse can burn out fast.
                        </td>
                      </tr>

                      {/* Rooster */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-rose-50" : "hover:bg-rose-900/10"}`}>
                        <td className={`p-3 font-semibold ${theme === "light" ? "text-rose-700" : "text-rose-400"}`}>Rooster</td>
                        <td className={`p-3 font-medium ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>酉</td>
                        <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          Self-critical; two Roosters may loop in judgement and worry.
                        </td>
                      </tr>

                      {/* Pig */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-rose-50" : "hover:bg-rose-900/10"}`}>
                        <td className={`p-3 font-semibold ${theme === "light" ? "text-rose-700" : "text-rose-400"}`}>Pig</td>
                        <td className={`p-3 font-medium ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>亥</td>
                        <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          Over-giving then resentful; double Pig may avoid hard truths.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Explanation */}
              <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-rose-50 border-rose-200" : "bg-rose-900/10 border-rose-700/30"}`}>
                <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-rose-800" : "text-rose-300"}`}>
                  How it reads in AstroMatch:
                </h3>
                <p className={`text-sm ${theme === "light" ? "text-rose-900" : "text-rose-200"}`}>
                  Xing shows <strong>tension that demands growth</strong>. It doesn't mean "bad", but it pushes topics like respect, fairness, and how each person handles conflict and responsibility.
                </p>
              </div>
            </div>
          </div>

          {/* Break Table */}
          <div id="break-pattern" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Break · 破 (Po)</h2>
              
              {/* Scrollable Table Container */}
              <div 
                className="border rounded-lg overflow-x-auto mb-4" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                }}
              >
                <table className="text-sm border-collapse w-full">
                  <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                    <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Pair</th>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Branches</th>
                      <th className={`p-3 text-left font-semibold ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Theme in AstroMatch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rat × Rooster - Deep red colors for Po (Break/Difficult) tier */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Rat × Rooster</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>子 × 酉</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Plans vs image; practical moves vs pride and presentation.
                      </td>
                    </tr>

                    {/* Ox × Dragon */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Ox × Dragon</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>丑 × 辰</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Solid ground vs big change; security shaken by ambition or upheaval.
                      </td>
                    </tr>

                    {/* Tiger × Pig */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Tiger × Pig</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>寅 × 亥</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Fierce drive vs soft comfort; one pushes, the other resists leaving the nest.
                      </td>
                    </tr>

                    {/* Rabbit × Horse */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Rabbit × Horse</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>卯 × 午</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Quiet rhythm vs constant motion; routines get broken, sometimes abruptly.
                      </td>
                    </tr>

                    {/* Snake × Monkey */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Snake × Monkey</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>巳 × 申</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Strategy vs spontaneity; schemes and experiments that overturn the usual.
                      </td>
                    </tr>

                    {/* Goat × Dog */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"} ${theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/10"}`}>
                      <td className={`p-3 font-semibold ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Goat × Dog</td>
                      <td className={`p-3 font-medium ${theme === "light" ? "text-red-600" : "text-red-300"}`}>未 × 戌</td>
                      <td className={`p-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Feelings vs duty; emotional needs collide with rules or obligations.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Explanation */}
              <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-red-50 border-red-200" : "bg-red-900/10 border-red-700/30"}`}>
                <h3 className={`text-base font-semibold mb-2 ${theme === "light" ? "text-red-800" : "text-red-300"}`}>
                  How it reads in AstroMatch:
                </h3>
                <p className={`text-sm ${theme === "light" ? "text-red-900" : "text-red-200"}`}>
                  Po marks <strong>"breakpoints"</strong> – people who shake each other out of old patterns. It can show up as drama, but also as the relationship that <strong>forces change</strong>, for better or worse.
                </p>
              </div>
            </div>
          </div>

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
          </div>
        </div>
      </div>
    </div>
  )
}
