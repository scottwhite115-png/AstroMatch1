"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"
import { getChinesePattern } from "@/lib/chinesePatternSystem"
import { patternDefinitions } from "@/lib/chinesePatternSystem"
import type { ChinesePatternType } from "@/lib/chinesePatternSystem"
import { getChineseSignGlyph } from "@/lib/zodiacHelpers"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function AstrologySection() {
  const { theme, setTheme } = useTheme()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Show scroll-to-top button when scrolled past menu
  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled more than 200px (past the menu)
      setShowScrollTop(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-top') || '0', 10)
      const headerHeight = 50
      const offset = safeAreaTop + headerHeight
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' })
    }
  }

  // Scroll to section on page load if hash is present
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return true
        }
      }
      return false
    }

    // Try scrolling immediately
    if (!scrollToHash()) {
      // If element not found, wait for page to render
      setTimeout(() => {
        if (!scrollToHash()) {
          // Try one more time after a longer delay
          setTimeout(scrollToHash, 300)
        }
      }, 100)
    }

    // Also listen for hash changes (when navigating within the page)
    const handleHashChange = () => {
      setTimeout(scrollToHash, 50)
    }
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        #same-sign-content,
        #same-sign-content:active,
        #same-sign-content:focus,
        #same-sign-content:hover,
        #same-sign-content:focus-visible,
        #same-sign-content:focus-within {
          background-color: ${theme === "light" ? '#ecfdf5' : 'rgba(6, 78, 59, 0.1)'} !important;
          background: ${theme === "light" ? '#ecfdf5' : 'rgba(6, 78, 59, 0.1)'} !important;
          opacity: 1 !important;
          -webkit-tap-highlight-color: transparent !important;
          -webkit-touch-callout: none !important;
        }
        #same-sign-content * {
          -webkit-tap-highlight-color: transparent !important;
        }
      `}} />
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24 overflow-x-auto`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="relative z-10">
        <AstroLabNavigationHeader theme={theme} setTheme={setTheme} />

        <div className="px-2 pt-2 pb-3 sm:px-3 lg:px-4" ref={scrollContainerRef}>
          {/* Compatibility Guides Section */}
          <div className="mt-2 pt-2">

          {/* Combined Chinese Pattern Ranking & Relationship Patterns */}
          <div id="chinese-patterns" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-2 whitespace-nowrap" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Chinese Zodiac Patterns</h2>
              
              <div className="mb-4">
                <p className={`text-base ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Understanding the traditional Chinese zodiac patterns, their score ranges, and how they're interpreted in the AstroMatch compatibility system.
                </p>
              </div>

              {/* Combined Table - No scrolling, restructured layout */}
              <div className="space-y-3">
                {/* Triple Harmony - San He */}
                <button
                  onClick={() => scrollToSection('triple-harmony-trines')}
                  className={`w-full text-left border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-pointer ${theme === "light" ? "border-gray-200 hover:border-yellow-300" : "border-white/10 hover:border-yellow-700/50"}`}
                >
                  <div className={`${theme === "light" ? "bg-yellow-50" : "bg-yellow-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-yellow-700" : "text-yellow-300"}`}>Triple Harmony</span>
                        <div className="flex flex-col">
                          <span className={`text-base whitespace-nowrap ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>三合</span>
                          <span className={`text-xs whitespace-nowrap ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>Sān Hé</span>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-yellow-100 text-yellow-800" : "bg-yellow-900/30 text-yellow-300"}`}>
                          Harmony
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #fbbf24, #f59e0b)" }}>72-98%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      High natural harmony and shared rhythm; when you're aligned, this connection moves fast and far.
                    </div>
                  </div>
                </button>

                {/* Six Harmonies - Liu He */}
                <button
                  onClick={() => scrollToSection('secret-friends')}
                  className={`w-full text-left border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-pointer ${theme === "light" ? "border-gray-200 hover:border-pink-300" : "border-white/10 hover:border-pink-700/50"}`}
                >
                  <div className={`${theme === "light" ? "bg-pink-50" : "bg-pink-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-pink-600" : "text-pink-400"}`}>Six Harmonies</span>
                        <div className="flex flex-col">
                          <span className={`text-base whitespace-nowrap ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>六合</span>
                          <span className={`text-xs whitespace-nowrap ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>Liù Hé</span>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-pink-100 text-pink-800" : "bg-pink-900/30 text-pink-400"}`}>
                          Harmony
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #c084fc, #e879f9)" }}>68-91%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Quietly strong bond that feels safe, loyal, and steady when you choose each other.
                    </div>
                  </div>
                </button>

                {/* Same Sign */}
                <button
                  onClick={() => scrollToSection('same-sign')}
                  className={`w-full text-left border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-pointer ${theme === "light" ? "border-gray-200 hover:border-emerald-300" : "border-white/10 hover:border-emerald-700/50"}`}
                >
                  <div className={`${theme === "light" ? "bg-emerald-50" : "bg-emerald-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-emerald-600" : "text-emerald-400"}`}>Same Sign</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-emerald-100 text-emerald-800" : "bg-emerald-900/30 text-emerald-400"}`}>
                          Neutral +
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #2dd4bf, #14b8a6)" }}>68-82%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Mirror-match energy with strong familiarity and shared habits; comforting, but not automatically harmonious.
                    </div>
                  </div>
                </button>

                {/* No Major Pattern */}
                <button
                  onClick={() => scrollToSection('what-shapes-score')}
                  className={`w-full text-left border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-pointer ${theme === "light" ? "border-gray-200 hover:border-blue-300" : "border-white/10 hover:border-blue-700/50"}`}
                >
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
                      No classical pattern; the vibe depends more on personal charts, timing, and your Western signs.
                    </div>
                  </div>
                </button>

                {/* Six Conflicts */}
                <button
                  onClick={() => scrollToSection('six-conflicts')}
                  className={`w-full text-left border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-pointer ${theme === "light" ? "border-gray-200 hover:border-orange-300" : "border-white/10 hover:border-orange-700/50"}`}
                >
                  <div className={`${theme === "light" ? "bg-orange-50" : "bg-orange-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-orange-600" : "text-orange-400"}`}>Six Conflicts</span>
                        <div className="flex flex-col">
                          <span className={`text-base whitespace-nowrap ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>六冲</span>
                          <span className={`text-xs whitespace-nowrap ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>Liù Chōng</span>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-orange-100 text-orange-800" : "bg-orange-900/30 text-orange-400"}`}>
                          Conflict
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #fb923c, #f97316)" }}>45-62%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Magnetic opposites with sharp edges; big lessons, not automatic comfort.
                    </div>
                  </div>
                </button>

                {/* Six Harms */}
                <button
                  onClick={() => scrollToSection('six-harms')}
                  className={`w-full text-left border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-pointer ${theme === "light" ? "border-gray-200 hover:border-red-300" : "border-white/10 hover:border-red-700/50"}`}
                >
                  <div className={`${theme === "light" ? "bg-red-50" : "bg-red-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-red-600" : "text-red-400"}`}>Six Harms</span>
                        <div className="flex flex-col">
                          <span className={`text-base whitespace-nowrap ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>六害</span>
                          <span className={`text-xs whitespace-nowrap ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>Liù Hài</span>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-red-100 text-red-800" : "bg-red-900/30 text-red-400"}`}>
                          Conflict
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #fb7185, #f43f5e)" }}>38-60%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Sensitive pattern where small misreads can snowball; this match needs extra patience and very clear communication.
                    </div>
                  </div>
                </button>

                {/* Punishment */}
                <button
                  onClick={() => scrollToSection('punishment')}
                  className={`w-full text-left border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-pointer ${theme === "light" ? "border-gray-200 hover:border-rose-300" : "border-white/10 hover:border-rose-700/50"}`}
                >
                  <div className={`${theme === "light" ? "bg-rose-50" : "bg-rose-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-rose-600" : "text-rose-400"}`}>Punishment</span>
                        <div className="flex flex-col">
                          <span className={`text-base whitespace-nowrap ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>刑</span>
                          <span className={`text-xs whitespace-nowrap ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>Xíng</span>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-rose-100 text-rose-800" : "bg-rose-900/30 text-rose-400"}`}>
                          Conflict
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #f87171, #ef4444)" }}>38-60%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      Tension and sharp edges; situations can feel strict or demanding.
                    </div>
                  </div>
                </button>

                {/* Break */}
                <button
                  onClick={() => scrollToSection('break-pattern')}
                  className={`w-full text-left border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-pointer ${theme === "light" ? "border-gray-200 hover:border-red-300" : "border-white/10 hover:border-red-700/50"}`}
                >
                  <div className={`${theme === "light" ? "bg-red-50" : "bg-red-900/10"}`}>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`font-semibold ${theme === "light" ? "text-red-700" : "text-red-300"}`}>Breakpoint</span>
                        <div className="flex flex-col">
                          <span className={`text-base whitespace-nowrap ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>破</span>
                          <span className={`text-xs whitespace-nowrap ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>Pò</span>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${theme === "light" ? "bg-red-100 text-red-800" : "bg-red-900/30 text-red-300"}`}>
                          Conflict
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold text-white" style={{ background: "linear-gradient(to right, #f43f5e, #e11d48)" }}>38-60%</span>
                    </div>
                    <div className={`px-3 pb-3 text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                      This bond tends to disrupt old patterns; growth is possible but rarely feels easy or predictable.
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Triple Harmony Trine Groups Table */}
          <div id="triple-harmony-trines" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-2" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Triple Harmony · 三合</h2>
              
              <div className="mb-4">
                <p className={`text-base ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Triple Harmony (San He 三合) describes four natural alliance groups, where any two different signs within the same group share strong underlying compatibility.
                </p>
              </div>

              {/* Scrollable Table Container */}
              <div 
                className="border rounded-lg overflow-x-auto -mx-2 sm:-mx-3 lg:-mx-4" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                }}
              >
                <table className="text-sm border-collapse w-full min-w-full">
                  <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                    <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                      <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Theme</th>
                      <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Relationship Pattern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rat–Dragon–Monkey - Visionaries (Yellow/Amber - San He tier) */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>
                        <div className={`font-medium text-lg ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>Visionaries</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap">🐀 🐉 🐒</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Fast, clever, future-oriented. Great for ideas, risk-taking, and bold moves.
                      </td>
                    </tr>

                    {/* Ox–Snake–Rooster - Strategists (Yellow/Amber - San He tier) */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>
                        <div className={`font-medium text-lg ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>Strategists</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap">🐂 🐍 🐓</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Planners and tacticians. Good with long-term plans, structure, and precision.
                      </td>
                    </tr>

                    {/* Tiger–Horse–Dog - Adventurers (Yellow/Amber - San He tier) */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>
                        <div className={`font-medium text-lg ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>Adventurers</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap">🐅 🐎 🐕</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Brave, active, loyal. Strong passion, action, and fight-for-what-matters energy.
                      </td>
                    </tr>

                    {/* Rabbit–Goat–Pig - Artists (Yellow/Amber - San He tier) */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>
                        <div className={`font-medium text-lg ${theme === "light" ? "text-yellow-600" : "text-yellow-300"}`}>Artists</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap">🐇 🐐 🐖</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
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
              <h2 className="astrology-heading-secondary mb-2" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Six Harmonies · 六合</h2>
              
              <div className="mb-4">
                <p className={`text-base ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Six Harmonies (Liu He 六合) pairs two specific signs that form a quiet, supportive bond marked by trust, cooperation, and natural ease.
                </p>
              </div>

              {/* Scrollable Table Container */}
              <div 
                className="border rounded-lg overflow-x-auto -mx-2 sm:-mx-3 lg:-mx-4" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                }}
              >
                <table className="text-sm border-collapse w-full min-w-full">
                  <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                    <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                      <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Pair</th>
                      <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Relationship Pattern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rat × Ox - Pink colors for Liu He tier */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Rat × Ox</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐀 🐂</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Practical protector; Rat's ideas meet Ox's reliability.
                      </td>
                    </tr>

                    {/* Tiger × Pig */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Tiger × Pig</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐅 🐖</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Brave heart + big heart; loyal support in tough times.
                      </td>
                    </tr>

                    {/* Rabbit × Dog */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Rabbit × Dog</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐇 🐕</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Gentle dreamer + loyal guardian; emotional safety and shared ideals.
                      </td>
                    </tr>

                    {/* Dragon × Rooster */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Dragon × Rooster</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐉 🐓</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Charisma meets clarity; helping each other shine and stay grounded.
                      </td>
                    </tr>

                    {/* Snake × Monkey */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Snake × Monkey</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐍 🐒</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Strategist + trickster; clever teamwork, problem-solving, and social wit.
                      </td>
                    </tr>

                    {/* Horse × Goat */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-pink-700" : "text-pink-400"}`}>Horse × Goat</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐎 🐐</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
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
              <h2 className="astrology-heading-secondary mb-2" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Same Sign · 同生肖</h2>
              
              <div className="mb-4">
                <p className={`text-base ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Same Sign (同生肖) is high familiarity and strong similarity—easy to sync, but less naturally balancing.
                </p>
              </div>

              <div 
                className="border rounded-lg overflow-x-auto -mx-2 sm:-mx-3 lg:-mx-4" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <div 
                  id="same-sign-content"
                  className={`p-4 rounded-lg border ${theme === "light" ? "border-emerald-200" : "border-emerald-700/30"}`}
                  style={{
                    backgroundColor: theme === "light" ? '#ecfdf5' : 'rgba(6, 78, 59, 0.1)',
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    touchAction: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    msTouchAction: 'none',
                    WebkitUserDrag: 'none',
                    userDrag: 'none',
                    pointerEvents: 'auto'
                  } as React.CSSProperties}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.style.setProperty('background-color', theme === "light" ? '#ecfdf5' : 'rgba(6, 78, 59, 0.1)', 'important');
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.style.setProperty('background-color', theme === "light" ? '#ecfdf5' : 'rgba(6, 78, 59, 0.1)', 'important');
                  }}
                  onTouchCancel={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.style.setProperty('background-color', theme === "light" ? '#ecfdf5' : 'rgba(6, 78, 59, 0.1)', 'important');
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.style.setProperty('background-color', theme === "light" ? '#ecfdf5' : 'rgba(6, 78, 59, 0.1)', 'important');
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.setProperty('background-color', theme === "light" ? '#ecfdf5' : 'rgba(6, 78, 59, 0.1)', 'important');
                  }}
                  onMouseUp={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.setProperty('background-color', theme === "light" ? '#ecfdf5' : 'rgba(6, 78, 59, 0.1)', 'important');
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.setProperty('background-color', theme === "light" ? '#ecfdf5' : 'rgba(6, 78, 59, 0.1)', 'important');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('background-color', theme === "light" ? '#ecfdf5' : 'rgba(6, 78, 59, 0.1)', 'important');
                  }}
                >
                  <div className="space-y-4">

                    <div>
                      <h3 className={`text-base font-semibold mb-3 ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>
                        What it means:
                      </h3>
                      <ul className={`space-y-2 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        <li>
                          Very similar instincts and timing
                        </li>
                        <li className="whitespace-nowrap">
                          You understand each other's moods quickly
                        </li>
                        <li>
                          Is not as karmically special as a "Triple Harmony or Secret Friends" pattern.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Six Conflicts Table */}
          <div id="six-conflicts" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-2 whitespace-nowrap" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Six Conflicts · 六冲</h2>
              
              <div className="mb-4">
                <p className={`text-base ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Six Conflicts (Liu Chong 六冲) describes opposite-sign pairings with strong attraction through contrast.
                </p>
              </div>
              
              {/* Scrollable Table Container */}
              <div 
                className="border rounded-lg overflow-x-auto -mx-2 sm:-mx-3 lg:-mx-4 mb-4" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                }}
              >
                <table className="text-sm border-collapse w-full min-w-full">
                  <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                    <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                      <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Pair</th>
                      <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Relationship Pattern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rat × Horse - Indigo/Purple colors for Liu Chong (Opposites Attract) tier */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className="p-3 text-center">
                        <div className={`font-semibold text-base six-conflicts-sign-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Rat × Horse</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐀 🐎</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Head vs heart; quick mind vs free spirit; strong push–pull.
                      </td>
                    </tr>

                    {/* Ox × Goat */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className="p-3 text-center">
                        <div className={`font-semibold text-base six-conflicts-sign-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Ox × Goat</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐂 🐐</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Duty vs feelings; stability clashes with sensitivity.
                      </td>
                    </tr>

                    {/* Tiger × Monkey */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className="p-3 text-center">
                        <div className={`font-semibold text-base six-conflicts-sign-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Tiger × Monkey</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐅 🐒</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Rebel vs trickster; bold moves vs clever mischief.
                      </td>
                    </tr>

                    {/* Rabbit × Rooster */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className="p-3 text-center">
                        <div className={`font-semibold text-base six-conflicts-sign-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Rabbit × Rooster</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐇 🐓</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Soft idealist vs sharp critic; values and style clash.
                      </td>
                    </tr>

                    {/* Dragon × Dog */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className="p-3 text-center">
                        <div className={`font-semibold text-base six-conflicts-sign-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Dragon × Dog</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐉 🐕</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Authority vs justice; big visions vs loyalty to truth.
                      </td>
                    </tr>

                    {/* Snake × Pig */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className="p-3 text-center">
                        <div className={`font-semibold text-base six-conflicts-sign-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Snake × Pig</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐍 🐖</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Intensity vs ease; private depth vs open-hearted comfort.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* Six Harms Table */}
          <div id="six-harms" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-2" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Six Harms · 六害</h2>
              
              <div className="mb-4">
                <p className={`text-base ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Six Harms (Liu Hai 六害) refers to pairings where misunderstandings and subtle imbalance can slowly undermine trust.
                </p>
              </div>
              
              {/* Scrollable Table Container */}
              <div 
                className="border rounded-lg overflow-x-auto -mx-2 sm:-mx-3 lg:-mx-4 mb-4" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                }}
              >
                <table className="text-sm border-collapse w-full min-w-full">
                  <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                    <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                      <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Pair</th>
                      <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Relationship Pattern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rat × Goat - Red colors for Liu Hai (Difficult) tier */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Rat × Goat</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐀 🐐</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Practical vs sensitive; small hurts and misunderstandings pile up.
                      </td>
                    </tr>

                    {/* Ox × Horse */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Ox × Horse</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐂 🐎</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Slow and steady vs restless and fast; timing rarely feels aligned.
                      </td>
                    </tr>

                    {/* Tiger × Snake */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Tiger × Snake</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐅 🐍</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Direct fire vs subtle strategy; trust and motives easily questioned.
                      </td>
                    </tr>

                    {/* Rabbit × Dragon */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Rabbit × Dragon</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐇 🐉</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Gentle heart vs big ego; one feels overlooked, the other feels restricted.
                      </td>
                    </tr>

                    {/* Monkey × Pig */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Monkey × Pig</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐒 🐖</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Sharp humour vs soft feelings; jokes or lifestyle can feel cutting or heavy.
                      </td>
                    </tr>

                    {/* Rooster × Dog */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Rooster × Dog</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap">🐓 🐕</div>
                      </td>
                      <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Proud perfectionist vs loyal realist; criticism and disappointment build up.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* Punishment Table */}
          <div id="punishment" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-2" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Punishment · 刑</h2>
              
              <div className="mb-4">
                <p className={`text-base ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Punishment (Xing 刑) highlights pairings that can trigger repeating friction and growth lessons, especially around boundaries, fairness, and emotional maturity.
                </p>
              </div>

              {/* 3 Punishment Groups */}
              <div className="mb-6">
                <div 
                  className="border rounded-lg overflow-x-auto -mx-2 sm:-mx-3 lg:-mx-4 mb-4" 
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'thin',
                    scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                  }}
                >
                  <table className="text-sm border-collapse w-full min-w-full">
                    <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                      <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                        <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Group</th>
                        <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Relationship Pattern</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Rat × Rabbit - Rose colors for Xing (Punishment/Difficult) tier */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        <td className="p-3 text-center">
                          <div className={`font-semibold text-base punishment-group-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Rat × Rabbit</div>
                          <div className={`font-medium text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>🐀 🐇</div>
                        </td>
                        <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          "Impolite punishment" – misaligned habits, mutual irritation.
                        </td>
                      </tr>

                      {/* Tiger × Snake × Monkey */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        <td className="p-3 text-center">
                          <div className={`font-semibold text-base punishment-group-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Tiger × Snake × Monkey</div>
                          <div className={`font-medium text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>🐅 🐍 🐒</div>
                        </td>
                        <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          "Bullying punishment" – power struggles, control issues, pride.
                        </td>
                      </tr>

                      {/* Goat × Ox × Dog */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        <td className="p-3 text-center">
                          <div className={`font-semibold text-base punishment-group-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Goat × Ox × Dog</div>
                          <div className={`font-medium text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>🐐 🐂 🐕</div>
                        </td>
                        <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          "Ungrateful punishment" – duty, blame, and feeling unappreciated.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Self-Punishment Signs */}
              <div className="mb-4">
                <h3 className="astrology-heading-secondary mb-3" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                  Self-Punishment Signs 自刑
                </h3>
                
                <p className={`text-base mb-3 ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Some signs are said to form a "self-punishment" pattern (自刑) when paired with the same sign.
                </p>

                <div 
                  className="border rounded-lg overflow-x-auto -mx-2 sm:-mx-3 lg:-mx-4 mb-4" 
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'thin',
                    scrollbarColor: theme === "light" ? '#d1d5db #f3f4f6' : '#374151 #1f2937'
                  }}
                >
                  <table className="text-sm border-collapse w-full min-w-full">
                    <thead className={`${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
                      <tr className={`border-b ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                        <th className={`p-3 text-left font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Sign</th>
                        <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Relationship Pattern</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Dragon */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        <td className="p-3">
                          <div className={`font-semibold text-base self-punishment-sign-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Dragon</div>
                          <div className={`font-medium text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>🐉 🐉</div>
                        </td>
                        <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          Can be hard on themselves; two Dragons may double the pressure.
                        </td>
                      </tr>

                      {/* Horse */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        <td className="p-3">
                          <div className={`font-semibold text-base self-punishment-sign-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Horse</div>
                          <div className={`font-medium text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>🐎 🐎</div>
                        </td>
                        <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          Restless and self-demanding; double Horse can burn out fast.
                        </td>
                      </tr>

                      {/* Rooster */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        <td className="p-3">
                          <div className={`font-semibold text-base self-punishment-sign-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Rooster</div>
                          <div className={`font-medium text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>🐓 🐓</div>
                        </td>
                        <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          Self-critical; two Roosters may loop in judgement and worry.
                        </td>
                      </tr>

                      {/* Pig */}
                      <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        <td className="p-3">
                          <div className={`font-semibold text-base self-punishment-sign-name ${theme === "light" ? "!text-[#be185d]" : "!text-[#fb7185]"}`} style={{ color: theme === "light" ? "#be185d" : "#fb7185" }}>Pig</div>
                          <div className={`font-medium text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap ${theme === "light" ? "text-rose-600" : "text-rose-300"}`}>🐖 🐖</div>
                        </td>
                        <td className={`p-3 text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          Over-giving then resentful; double Pig may avoid hard truths.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

          {/* Break Table */}
          <div id="break-pattern" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-2" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Breakpoints · 破</h2>
              
              <div className="mb-4">
                <p className={`text-base ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  Breakpoints (Po 破) marks pairings where stability is easily disrupted, leading to sudden rifts, reversals, or broken momentum.
                </p>
              </div>
              
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
                      <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Pair</th>
                      <th className={`p-3 text-center font-semibold text-base ${theme === "light" ? "text-gray-900" : "text-white/90"}`}>Relationship Pattern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rat × Rooster - Deep red colors for Po (Break/Difficult) tier */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Rat × Rooster</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐀 🐓</div>
                      </td>
                      <td className={`p-3 text-center text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Plans vs image; practical moves vs pride and presentation.
                      </td>
                    </tr>

                    {/* Ox × Dragon */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Ox × Dragon</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐂 🐉</div>
                      </td>
                      <td className={`p-3 text-center text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Solid ground vs big change; security shaken by ambition or upheaval.
                      </td>
                    </tr>

                    {/* Tiger × Pig */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Tiger × Pig</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐅 🐖</div>
                      </td>
                      <td className={`p-3 text-center text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Fierce drive vs soft comfort; one pushes, the other resists leaving the nest.
                      </td>
                    </tr>

                    {/* Rabbit × Horse */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Rabbit × Horse</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐇 🐎</div>
                      </td>
                      <td className={`p-3 text-center text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Quiet rhythm vs constant motion; routines get broken, sometimes abruptly.
                      </td>
                    </tr>

                    {/* Snake × Monkey */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Snake × Monkey</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐍 🐒</div>
                      </td>
                      <td className={`p-3 text-center text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Strategy vs spontaneity; schemes and experiments that overturn the usual.
                      </td>
                    </tr>

                    {/* Goat × Dog */}
                    <tr className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`p-3 text-center ${theme === "light" ? "text-red-700" : "text-red-400"}`}>
                        <div className={`font-semibold text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}>Goat × Dog</div>
                        <div className="text-3xl mt-1 flex flex-row gap-1 whitespace-nowrap justify-center">🐐 🐕</div>
                      </td>
                      <td className={`p-3 text-center text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                        Feelings vs duty; emotional needs collide with rules or obligations.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* What Shapes Your Match Score Section */}
          <div id="what-shapes-score" className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4" style={{ fontSize: '1.5rem', fontWeight: '600' }}>What Shapes Your Match Score</h2>
              
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
                    Trines and relationship lines like; <span className="font-medium">Three Harmonies 三合</span>, <span className="font-medium">Secret friends 六合</span>, <span className="font-medium">Conflicts 六冲</span>, <span className="font-medium">Harms 六害</span>, <span className="font-medium">Punishment 刑</span>.
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

          {/* Five Elements Reference Section */}
          <div id="five-elements" className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Five Elements (五行)</h2>

              <div className="mb-6">
                <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h3 className={`text-base font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>The Five Elements</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                    <Link 
                      href="/astrology/five-elements/wood"
                      className={`p-3 rounded-lg border text-center transition-all hover:scale-105 cursor-pointer block relative z-10 ${theme === "light" ? "bg-gray-50 border-gray-200 hover:bg-gray-100" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                    >
                      <div className="text-2xl mb-1">🌳</div>
                      <div className="text-sm font-semibold text-green-500">Wood (木)</div>
                    </Link>
                    <Link 
                      href="/astrology/five-elements/fire"
                      className={`p-3 rounded-lg border text-center transition-all hover:scale-105 cursor-pointer block relative z-10 ${theme === "light" ? "bg-gray-50 border-gray-200 hover:bg-gray-100" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                    >
                      <div className="text-2xl mb-1">🔥</div>
                      <div className="text-sm font-semibold text-orange-500">Fire (火)</div>
                    </Link>
                    <Link 
                      href="/astrology/five-elements/earth"
                      className={`p-3 rounded-lg border text-center transition-all hover:scale-105 cursor-pointer block relative z-10 ${theme === "light" ? "bg-gray-50 border-gray-200 hover:bg-gray-100" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                    >
                      <div className="text-2xl mb-1">⛰️</div>
                      <div className="text-sm font-semibold text-yellow-600">Earth (土)</div>
                    </Link>
                    <Link 
                      href="/astrology/five-elements/metal"
                      className={`p-3 rounded-lg border text-center transition-all hover:scale-105 cursor-pointer block relative z-10 ${theme === "light" ? "bg-gray-50 border-gray-200 hover:bg-gray-100" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                    >
                      <div className="text-2xl mb-1">⚙️</div>
                      <div className={`text-sm font-semibold ${theme === "light" ? "text-gray-500" : "text-gray-300"}`}>Metal (金)</div>
                    </Link>
                    <Link 
                      href="/astrology/five-elements/water"
                      className={`p-3 rounded-lg border text-center transition-all hover:scale-105 cursor-pointer block relative z-10 ${theme === "light" ? "bg-gray-50 border-gray-200 hover:bg-gray-100" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                    >
                      <div className="text-2xl mb-1">💧</div>
                      <div className="text-sm font-semibold text-blue-500">Water (水)</div>
                    </Link>
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
          </div>

          {/* Chinese Zodiac Calendar Section */}
          <div id="chinese-zodiac-calendar" className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Chinese Zodiac Calendar</h2>

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
                          <tr key={row.year} className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
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
      </div>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed top-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer touch-manipulation ${
            theme === "light"
              ? "bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50"
              : "bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 backdrop-blur-sm"
          }`}
          style={{ 
            pointerEvents: 'auto',
            minWidth: '56px',
            minHeight: '56px',
            WebkitTapHighlightColor: 'transparent'
          }}
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pointerEvents: 'none' }}
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      )}
    </div>
    </>
  )
}
