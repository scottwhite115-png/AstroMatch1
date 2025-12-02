"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"

export default function DetailedBlurbDemoPage() {
  const { theme } = useTheme()
  const [useDetailedBlurbs, setUseDetailedBlurbs] = useState(false)
  
  // Mock connection box data for demo
  const mockBoxData = {
    tier: "Harmonious Match" as any,
    score: 88,
    westA: "Leo",
    eastA: "Dragon",
    westB: "Sagittarius",
    eastB: "Tiger",
    
    // Standard blurbs
    chineseLine: "Dragon and Tiger belong to different trine families, creating dynamic energy.",
    sunMatchBlurb: "Leo and Sagittarius share Fire energy - passionate and bold.",
    westernLine: "Fire signs combine for warmth and enthusiasm.",
    wuXingLine: "Earth and Fire elements create a productive cycle.",
    connectionBlurb: "A bold, adventurous pairing full of optimism and courage.",
    
    chineseElementA: "Earth" as any,
    chineseElementB: "Fire" as any,
    chinesePattern: "cross_trine" as any,
    westAspect: "trine" as any,
    westElementRelation: "same" as any,
    isChineseOpposite: false,
    isLivelyPair: false,
    patternFullLabel: "Cross Trine",
    pillLabel: "Fire × Fire",
    baseTagline: "Dynamic adventurers",
    patternEmoji: "🔥",
    pattern: "cross_trine",
    chemistryStars: 4.5,
    stabilityStars: 4,
  }
  
  // Detailed blurbs from sign pages
  const detailedBoxData = {
    ...mockBoxData,
    chineseLine: "Bold spirits with daring energy: Dragon and Tiger belong to the San He (三合) cross-trine family, forming a powerful, high-energy pairing. Dragon contributes charisma, vision, and bold initiative; Tiger adds courage, instinct, and loyal action. Their chemistry inspires movement and mutual elevation. The dynamic feels confident, lively, and strongly aligned toward adventure.",
    sunMatchBlurb: "Dynamic and bright partnership: Leo and Sagittarius both radiate confidence, enthusiasm, and natural warmth. You both value freedom, creativity, and living boldly. The connection moves quickly, with both signs feeding each other's courage and optimism. The energy feels playful, motivating, and naturally uplifting.",
    connectionBlurb: "Courage meets adventure. Leo–Dragon brings presence and power; Sagittarius–Tiger adds optimism and faith in the future. You fuel each other's fire, laughing through challenges and chasing new horizons together. The chemistry feels warm, creative, and motivating.",
  }
  
  const currentData = useDetailedBlurbs ? detailedBoxData : mockBoxData
  
  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`}>
      <div className="relative z-10">
        {/* Header */}
        <header className={`sticky top-0 z-50 flex items-center justify-between border-b px-4 py-3 ${
          theme === "light"
            ? "bg-white/80 backdrop-blur-sm border-gray-200"
            : "bg-slate-900/80 backdrop-blur-sm border-slate-800"
        }`}>
          <h1 className={`text-lg font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Connection Box - Detailed Blurbs Demo
          </h1>
        </header>

        {/* Main Content */}
        <div className="px-4 py-6 max-w-4xl mx-auto">
          {/* Toggle Controls */}
          <div className={`mb-6 p-6 rounded-2xl border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
            <h2 className={`text-xl font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Demo Controls
            </h2>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDetailedBlurbs}
                    onChange={(e) => setUseDetailedBlurbs(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div>
                    <span className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      Use Detailed Blurbs from Sign Pages
                    </span>
                    <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
                      Toggle to see detailed compatibility descriptions from the sign guide pages
                    </p>
                  </div>
                </label>
              </div>
              
              <div className={`p-4 rounded-lg border ${theme === "light" ? "bg-blue-50 border-blue-200" : "bg-blue-900/10 border-blue-500/20"}`}>
                <h3 className={`font-semibold mb-2 ${theme === "light" ? "text-blue-900" : "text-blue-300"}`}>
                  Current Demo Match:
                </h3>
                <p className={`text-sm ${theme === "light" ? "text-blue-800" : "text-blue-200"}`}>
                  <strong>Person 1:</strong> Leo / Dragon (1988)<br />
                  <strong>Person 2:</strong> Sagittarius / Tiger (1986)
                </p>
                <p className={`text-xs mt-2 ${theme === "light" ? "text-blue-700" : "text-blue-300"}`}>
                  High-compatibility match with cross-trine harmony and Fire × Fire compatibility.
                </p>
              </div>
            </div>
          </div>

          {/* Connection Box Mock */}
          <div className="mb-6">
            <h2 className={`text-xl font-bold mb-4 px-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              {useDetailedBlurbs ? "With Detailed Blurbs" : "Standard Blurbs"}
            </h2>
            
            {/* Simple Connection Box Display */}
            <div className={`rounded-2xl border overflow-hidden ${theme === "light" ? "bg-white border-gray-200" : "bg-slate-900 border-slate-700"}`}>
              {/* Header */}
              <div className={`p-4 border-b ${theme === "light" ? "border-gray-200" : "border-slate-700"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                    {currentData.score}%
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    theme === "light" ? "bg-green-100 text-green-800" : "bg-green-900/30 text-green-400"
                  }`}>
                    {currentData.tier}
                  </span>
                </div>
                
                <div className={`text-lg font-semibold ${theme === "light" ? "text-gray-800" : "text-white/90"}`}>
                  {currentData.westA} / {currentData.eastA} × {currentData.westB} / {currentData.eastB}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Overview */}
                <div>
                  <p className={`text-base ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                    {currentData.connectionBlurb}
                  </p>
                </div>
                
                {/* Chinese Line */}
                <div className={`p-3 rounded-lg ${theme === "light" ? "bg-amber-50 border border-amber-200" : "bg-amber-900/10 border border-amber-500/20"}`}>
                  <div className={`text-xs font-semibold mb-1 ${theme === "light" ? "text-amber-700" : "text-amber-400"}`}>
                    🐉 Chinese Zodiac
                  </div>
                  <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                    {currentData.chineseLine}
                  </p>
                </div>
                
                {/* Western Line */}
                <div className={`p-3 rounded-lg ${theme === "light" ? "bg-blue-50 border border-blue-200" : "bg-blue-900/10 border border-blue-500/20"}`}>
                  <div className={`text-xs font-semibold mb-1 ${theme === "light" ? "text-blue-700" : "text-blue-400"}`}>
                    ☀️ Sun Signs
                  </div>
                  <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                    {currentData.sunMatchBlurb}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className={`p-6 rounded-2xl border ${theme === "light" ? "bg-amber-50 border-amber-200" : "bg-amber-900/10 border-amber-500/20"}`}>
            <h3 className={`font-semibold mb-3 ${theme === "light" ? "text-amber-900" : "text-amber-300"}`}>
              📊 Comparison
            </h3>
            <div className={`space-y-3 text-sm ${theme === "light" ? "text-amber-800" : "text-amber-200"}`}>
              <div>
                <p className="font-semibold mb-1">Standard Blurb (Current):</p>
                <p className="italic">"Dragon and Tiger belong to different trine families, creating dynamic energy."</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Detailed Blurb (From Sign Pages):</p>
                <p className="italic">"Bold spirits with daring energy: Dragon and Tiger belong to the San He (三合) cross-trine family, forming a powerful, high-energy pairing. Dragon contributes charisma, vision, and bold initiative..."</p>
              </div>
              <p className="mt-4">
                <strong>Toggle above to see the difference!</strong> The detailed version provides more context, personality, and storytelling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
