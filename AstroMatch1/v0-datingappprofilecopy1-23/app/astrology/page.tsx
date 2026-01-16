"use client"

import type React from "react"

import { useState, useRef } from "react"
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

export default function AstrologySection() {
  const [selectedWestern, setSelectedWestern] = useState<string | null>(null)
  const [selectedChinese, setSelectedChinese] = useState<string | null>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
      className={`${theme === "light" ? "bg-white" : "bg-zinc-900"} astrology-page min-h-screen w-full relative pb-24 overflow-x-auto`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="relative z-10">
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AstroMatch
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

          <div className="grid grid-cols-2 gap-6 mb-4">
            {/* Western Astrology Section */}
            <div className="space-y-2">
              <button
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
            <h2 className={`text-lg font-bold mb-6 text-center ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Compatibility Guides
            </h2>

          {/* Match Engine Compatibility Guide */}
          <div className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Match Engine Ranking</h2>
              
              {/* Compact card layout for mobile */}
              <div className="space-y-3">
                {/* Soulmate Match */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold" style={{ color: 'rgb(251, 191, 36)' }}>Soulmate Match</h3>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', color: 'rgb(251, 191, 36)' }}>95–100</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Destined Union</p>
                  <p className="text-sm text-white/70">⭐ Two souls born under the same stars — effortless harmony, depth, and shared destiny.</p>
                </div>

                {/* Twin Flame Match */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold" style={{ color: 'rgb(249, 115, 22)' }}>Twin Flame Match</h3>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)', color: 'rgb(249, 115, 22)' }}>85–94</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Magnetic Synergy</p>
                  <p className="text-sm text-white/70">🔥 An electrifying connection that feels fated. Powerful attraction and mutual growth.</p>
                </div>

                {/* Excellent Match */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold" style={{ color: 'rgb(236, 72, 153)' }}>Excellent Match</h3>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(236, 72, 153, 0.2)', color: 'rgb(236, 72, 153)' }}>70–84</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Kindred Spirits</p>
                  <p className="text-sm text-white/70">💖 Natural chemistry and shared values. A strong foundation for lasting compatibility.</p>
                </div>

                {/* Mixed Match */}
                 <div className={`${theme === "light" ? "bg-purple-100" : "bg-purple-900/40"} rounded-xl p-4`}
                 >
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-2xl">🌙</span>
                    <h3 className="text-sm font-semibold" style={{ color: 'rgb(168, 85, 247)' }}>Mixed Match</h3>
                   </div>
                   <p className={`${theme === "light" ? "text-purple-900/70" : "text-purple-100/70"} text-sm leading-relaxed`}>
                     Promising compatibility with balanced strengths. Growth thrives through steady mutual effort.
                   </p>
                 </div>

                {/* Learning Match */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold" style={{ color: 'rgb(59, 130, 246)' }}>Learning Match</h3>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'rgb(59, 130, 246)' }}>40–54</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Karmic Teachers</p>
                  <p className="text-sm text-white/70">🧭 A meaningful pairing that challenges both to grow through understanding and patience.</p>
                </div>

                {/* Challenging Match */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold" style={{ color: 'rgb(239, 68, 68)' }}>Challenging Match</h3>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'rgb(239, 68, 68)' }}>25–39</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Opposite Orbits</p>
                  <p className="text-sm text-white/70">⚡ Strong personalities with conflicting rhythms. Can work through maturity and compromise.</p>
                </div>

                {/* Incompatible Match */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold" style={{ color: 'rgb(107, 114, 128)' }}>Incompatible Match</h3>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(107, 114, 128, 0.2)', color: 'rgb(107, 114, 128)' }}>0–24</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Crossed Paths</p>
                  <p className="text-sm text-white/70">💔 Low natural harmony — brief encounters or lessons learned before moving forward.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chinese Zodiac Trine Compatibility Table */}
          <div className="mt-8 mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Chinese Zodiac Compatibility Guide</h2>
              
              {/* Compact card layout for mobile */}
              <div className="space-y-3">
                {/* 1st Trine */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">1st Trine – Visionaries</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300 whitespace-nowrap">Same Trine</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Rat • Dragon • Monkey</p>
                  <p className="text-sm text-white/70">Ambitious, magnetic, and quick-minded. You share intuition, creativity, and drive — natural leaders who thrive on excitement and challenge.</p>
                </div>

                {/* 2nd Trine */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">2nd Trine – Strategists</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300 whitespace-nowrap">Same Trine</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Ox • Snake • Rooster</p>
                  <p className="text-sm text-white/70">Disciplined, wise, and self-reliant. You value loyalty, logic, and refinement — a steady, enduring rhythm built on trust and respect.</p>
                </div>

                {/* 3rd Trine */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">3rd Trine – Adventurers</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300 whitespace-nowrap">Same Trine</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Tiger • Horse • Dog</p>
                  <p className="text-sm text-white/70">Passionate, loyal, and freedom-loving. Courageous spirits who follow their heart — driven by ideals, justice, and authenticity.</p>
                </div>

                {/* 4th Trine */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">4th Trine – Artists</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300 whitespace-nowrap">Same Trine</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Rabbit • Goat • Pig</p>
                  <p className="text-sm text-white/70">Gentle, romantic, and intuitive. Sensitive souls who seek beauty, peace, and emotional understanding in love and life.</p>
                </div>

                {/* Cross-Trine */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Cross-Trine</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 whitespace-nowrap">Cross-Trine</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Mixed Trines</p>
                  <p className="text-sm text-white/70">You move to different tempos. Connection comes from curiosity and compromise — attraction through contrast, growth through patience.</p>
                </div>

                {/* Natural Enemies */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Natural Enemies</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300 whitespace-nowrap">Opposing</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1">Rat–Horse • Ox–Goat • Tiger–Monkey • Rabbit–Rooster • Dragon–Dog • Snake–Pig</p>
                  <p className="text-sm text-white/70">Opposing instincts — sparks can fly, but friction grows easily. These pairs often teach each other powerful life lessons, not comfort.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Western Zodiac Element Compatibility Table */}
          <div className="mb-6">
            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-4">Western Zodiac Element Compatibility</h2>
              
              {/* Compact card layout for mobile */}
              <div className="space-y-3">
                {/* Same Element - Fire */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Fire × Fire</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300 whitespace-nowrap">Same Element</span>
                  </div>
                  <p className="text-sm text-white/70">Two flames burning bright — passionate, inspiring, and bold. The danger lies only in competing heat.</p>
                </div>

                {/* Same Element - Earth */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Earth × Earth</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300 whitespace-nowrap">Same Element</span>
                  </div>
                  <p className="text-sm text-white/70">Grounded and practical. You build together slowly and surely, valuing security and shared purpose.</p>
                </div>

                {/* Same Element - Air */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Air × Air</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300 whitespace-nowrap">Same Element</span>
                  </div>
                  <p className="text-sm text-white/70">A meeting of minds — communicative, curious, and light-hearted. The spark thrives on ideas and freedom.</p>
                </div>

                {/* Same Element - Water */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Water × Water</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300 whitespace-nowrap">Same Element</span>
                  </div>
                  <p className="text-sm text-white/70">Deep emotional flow. You understand each other's moods intuitively — soulful, nurturing, and healing.</p>
                </div>

                {/* Compatible - Fire × Air */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Fire × Air</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 whitespace-nowrap">Compatible</span>
                  </div>
                  <p className="text-sm text-white/70">Air fuels Fire. This match is vibrant, creative, and full of movement — expect fast ideas and shared adventures.</p>
                </div>

                {/* Compatible - Earth × Water */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Earth × Water</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 whitespace-nowrap">Compatible</span>
                  </div>
                  <p className="text-sm text-white/70">Water nourishes Earth. Stable and tender, this connection brings emotional depth to practical strength.</p>
                </div>

                {/* Semi-Compatible - Fire × Earth */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Fire × Earth</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 whitespace-nowrap">Semi-Compatible</span>
                  </div>
                  <p className="text-sm text-white/70">Fire's enthusiasm can warm Earth's steadiness, if grounded in respect and timing.</p>
                </div>

                {/* Semi-Compatible - Air × Water */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Air × Water</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 whitespace-nowrap">Semi-Compatible</span>
                  </div>
                  <p className="text-sm text-white/70">Mind meets emotion — fascinating, if communication stays gentle and open.</p>
                </div>

                {/* Opposing - Fire × Water */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Fire × Water</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300 whitespace-nowrap">Opposing</span>
                  </div>
                  <p className="text-sm text-white/70">Steam and storm — intense attraction but turbulent emotions. You must respect each other's pace.</p>
                </div>

                {/* Opposing - Air × Earth */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">Air × Earth</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300 whitespace-nowrap">Opposing</span>
                  </div>
                  <p className="text-sm text-white/70">Different speeds — one seeks change, the other stability. Growth comes through patience and curiosity.</p>
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
