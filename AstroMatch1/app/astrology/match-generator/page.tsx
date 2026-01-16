"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { ConnectionBoxNew } from "@/components/ConnectionBoxNew"
import { buildConnectionBox } from "@/lib/compat/engine"
import type { UserProfile } from "@/lib/compat/types"
import { getWesternSignFromDateWithSystem, getChineseAnimalFromDate, getWuXingElementFromDate } from "@/lib/zodiacHelpers"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { getWuXingYearElement } from "@/lib/matchEngine"
import type { WesternSign, ChineseAnimal, WuXingElement } from "@/lib/matchEngine"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function MatchGeneratorPage() {
  const [birthdate1, setBirthdate1] = useState<string>("")
  const [birthdate2, setBirthdate2] = useState<string>("")
  const [showMatchResult, setShowMatchResult] = useState(false)
  const [matchData, setMatchData] = useState<any>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const sunSignSystem = useSunSignSystem() // Get user's system preference

  const calculateMatch = () => {
    if (!birthdate1 || !birthdate2) return

    console.log('[Match Generator] Starting calculation...', { birthdate1, birthdate2 })

    try {
      const date1 = new Date(birthdate1)
      const date2 = new Date(birthdate2)

      console.log('[Match Generator] Dates parsed:', { date1, date2 })

      const person1: UserProfile = {
        sunSign: getWesternSignFromDateWithSystem(date1, sunSignSystem).toLowerCase() as any,
        animal: getChineseAnimalFromDate(date1).toLowerCase() as any,
      }

      const person2: UserProfile = {
        sunSign: getWesternSignFromDateWithSystem(date2, sunSignSystem).toLowerCase() as any,
        animal: getChineseAnimalFromDate(date2).toLowerCase() as any,
      }

      console.log('[Match Generator] Person 1:', person1)
      console.log('[Match Generator] Person 2:', person2)

      // Get Wu Xing year elements
      const year1 = date1.getFullYear()
      const year2 = date2.getFullYear()
      const wuXing1 = getWuXingYearElement(year1)
      const wuXing2 = getWuXingYearElement(year2)

      // Use the same engine as discover/matches section
      const simpleBox = buildConnectionBox(
        person1,
        person2,
        wuXing1,
        wuXing2
      )

      console.log('[Match Generator] SimpleBox result:', simpleBox)

      // Map to match label format (updated to support new match engine labels)
      const mapTier = (label: string): "Soulmate Match" | "Twin Flame Match" | "Excellent Match" | "Favourable Match" | "Neutral Match" | "Opposites Attract" | "Difficult Match" => {
        const l = label.toLowerCase();
        // New match engine labels
        if (l.includes("six conflicts match")) return "Opposites Attract";
        if (l.includes("six harmonies match") || l.includes("triple harmony match")) return "Excellent Match";
        if (l.includes("same sign match")) return "Neutral Match";
        if (l.includes("challenging match")) return "Difficult Match";
        if (l.includes("neutral match")) return "Neutral Match";
        // Legacy labels
        if (l.includes("soulmate")) return "Soulmate Match";
        if (l.includes("twin flame")) return "Twin Flame Match";
        if (l.includes("excellent")) return "Excellent Match";
        if (l.includes("favourable") || l.includes("favorable")) return "Favourable Match";
        if (l.includes("opposites attract") || l.includes("magnetic opposites")) return "Opposites Attract";
        if (l.includes("difficult") || l.includes("challenging")) return "Difficult Match";
        return "Neutral Match";
      };

      // Use pillLabel if available (new match engine), otherwise fall back to matchLabel
      const displayLabel = simpleBox.pillLabel || simpleBox.matchLabel;
      
      // Create connection box data matching discover section format
      const boxData = {
        tier: mapTier(displayLabel) as any,
        score: simpleBox.score,
        westA: person1.sunSign.charAt(0).toUpperCase() + person1.sunSign.slice(1),
        eastA: person1.animal.charAt(0).toUpperCase() + person1.animal.slice(1),
        westB: person2.sunSign.charAt(0).toUpperCase() + person2.sunSign.slice(1),
        eastB: person2.animal.charAt(0).toUpperCase() + person2.animal.slice(1),
        chineseLine: simpleBox.chineseLine || "",
        sunMatchBlurb: simpleBox.westernSignLine || "",
        westernLine: simpleBox.westernLine || "",
        wuXingLine: simpleBox.wuXingLine,
        connectionBlurb: simpleBox.overview,
        chineseElementA: wuXing1,
        chineseElementB: wuXing2,
        chinesePattern: simpleBox.chinesePattern as any,
        westAspect: simpleBox.westAspect as any,
        westElementRelation: simpleBox.westElementRelation as any,
        isChineseOpposite: simpleBox.isChineseOpposite,
        isLivelyPair: simpleBox.isLivelyPair,
        patternFullLabel: simpleBox.patternFullLabel,
        pillLabel: simpleBox.pillLabel,
        baseTagline: simpleBox.baseTagline,
        patternEmoji: simpleBox.patternEmoji,
        pattern: simpleBox.pattern,
        chemistryStars: simpleBox.chemistryStars,
        stabilityStars: simpleBox.stabilityStars,
      }

      console.log('[Match Generator] Box data:', boxData)
      console.log('[Match Generator] Setting showMatchResult to true')

      setMatchData(boxData)
      setShowMatchResult(true)
    } catch (error) {
      console.error("[Match Generator] Error calculating match:", error)
    }
  }

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24 overflow-x-auto`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="relative z-10">
        {/* Header with navigation pills */}
        <AstroLabNavigationHeader theme={theme} setTheme={setTheme} />

        {/* Main Content */}
        <div className="px-4 py-6 max-w-4xl mx-auto">
          {/* Match Engine Generator */}
          <div className={`mb-6 p-6 rounded-2xl border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
            <h2 className={`text-2xl font-bold mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Match Engine Generator
            </h2>
            <p className={`text-sm mb-6 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              Enter two birthdates to see their compatibility score and detailed analysis
            </p>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                  Person 1 Birthdate
                </label>
                <input
                  type="date"
                  value={birthdate1}
                  onChange={(e) => setBirthdate1(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-lg ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-slate-800 border-white/20 text-white"}`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                  Person 2 Birthdate
                </label>
                <input
                  type="date"
                  value={birthdate2}
                  onChange={(e) => setBirthdate2(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-lg ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-slate-800 border-white/20 text-white"}`}
                />
              </div>
              
              <button
                onClick={calculateMatch}
                disabled={!birthdate1 || !birthdate2}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all ${
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
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('[Match Generator] Close button clicked')
                      setShowMatchResult(false)
                    }}
                    className={`absolute top-4 right-4 z-[100] p-2 rounded-full transition-colors ${theme === "light" ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-white"}`}
                    aria-label="Close"
                    style={{ zIndex: 100 }}
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
        </div>
      </div>
    </div>
  )
}

