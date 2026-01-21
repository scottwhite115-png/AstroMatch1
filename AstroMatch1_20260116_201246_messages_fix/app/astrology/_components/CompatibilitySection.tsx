"use client"

import { useMemo } from "react"
import { 
  getWesternDetailedCompat, 
  getChineseDetailedCompat
} from "@/data/detailedCompatDescriptions"

type CompatibilitySectionProps = {
  currentSign: string // e.g. "gemini" or "monkey"
  type: "western" | "chinese"
  theme: "light" | "dark"
}

export function CompatibilitySection({ currentSign, type, theme }: CompatibilitySectionProps) {
  const compatData = useMemo(() => {
    const sign = currentSign.toLowerCase()
    const allSigns = type === "western" 
      ? ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]
      : ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"]
    
    const compatEntries = allSigns
      .map(otherSign => {
        const compat = type === "western"
          ? getWesternDetailedCompat(sign, otherSign)
          : getChineseDetailedCompat(sign, otherSign)
        
        return compat ? { otherSign, ...compat } : null
      })
      .filter((entry): entry is { otherSign: string; heading: string; tagline: string; description: string } => entry !== null)
    
    return compatEntries
  }, [currentSign, type])

  if (compatData.length === 0) {
    return null
  }

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  return (
    <div>
      <h2 className={`text-xl font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
        {capitalize(currentSign)} — Compatibility with Other Signs
      </h2>
      <div className="space-y-6">
        {compatData.map((entry) => (
          <div key={entry.otherSign} className="space-y-2">
            <h3 className={`text-base font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              {entry.heading}
            </h3>
            {entry.tagline && (
              <p className={`text-sm font-semibold italic ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                {entry.tagline}
              </p>
            )}
            <p className={`text-sm leading-relaxed ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
              {entry.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

