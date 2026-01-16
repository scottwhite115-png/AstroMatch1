"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { 
  AriesSymbol, TaurusSymbol, GeminiSymbol, CancerSymbol, LeoSymbol, VirgoSymbol,
  LibraSymbol, ScorpioSymbol, SagittariusSymbol, CapricornSymbol, AquariusSymbol, PiscesSymbol
} from "@/components/western-zodiac-symbols"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function SignCombinationsPage() {
  const [selectedWestern, setSelectedWestern] = useState<string | null>(null)
  const [selectedChinese, setSelectedChinese] = useState<string | null>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

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
        <AstroLabNavigationHeader theme={theme} setTheme={setTheme} />

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

