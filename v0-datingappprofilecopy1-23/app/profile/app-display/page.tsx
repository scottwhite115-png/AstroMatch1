"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useState, useEffect } from "react"

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

type Theme = "light" | "starlight"
type Language =
  | "english"
  | "spanish"
  | "french"
  | "german"
  | "italian"
  | "portuguese"
  | "japanese"
  | "korean"
  | "chinese"

export default function AppDisplayPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState<Language>("english")

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) setLanguage(savedLanguage)
  }, [])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const languageNames: Record<Language, string> = {
    english: "English",
    spanish: "Español",
    french: "Français",
    german: "Deutsch",
    italian: "Italiano",
    portuguese: "Português",
    japanese: "日本語",
    korean: "한국어",
    chinese: "中文",
  }

  return (
    <div
      className={`profile-page min-h-screen relative ${
        theme === "starlight" ? "astrology-cosmic-bg" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <h1
                className={`font-semibold text-lg whitespace-nowrap ${theme === "starlight" ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent" : "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent"}`}
              >
                App & Display
              </h1>
            </div>
            <ChevronRight className="w-7 h-7 text-gray-400" />
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-8 pb-24">
          <div className="max-w-md mx-auto space-y-8">
            {/* Theme Section */}
            <div>
              <h2
                className={`font-semibold text-base mb-4 ${theme === "starlight" ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent" : "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent"}`}
              >
                Theme
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleThemeChange("starlight")}
                  className={`w-full p-4 rounded-lg border transition-colors ${
                    theme === "starlight"
                      ? "bg-white/20 border-orange-500/50"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className={`${theme === "starlight" ? "text-white" : "text-gray-900"} font-medium mb-1`}>
                        🌌 Starlight Theme
                      </div>
                      <div className={`${theme === "starlight" ? "text-white/60" : "text-gray-600"} text-sm`}>
                        Soft pastel cosmic vibes
                      </div>
                    </div>
                    {theme === "starlight" && <CheckIcon className="w-5 h-5 text-orange-400" />}
                  </div>
                </button>

                <button
                  onClick={() => handleThemeChange("light")}
                  className={`w-full p-4 rounded-lg border transition-colors ${
                    theme === "light"
                      ? "bg-white border-orange-500 shadow-md"
                      : theme === "starlight"
                        ? "bg-white/10 border-orange-500/30 hover:bg-white/15"
                        : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className={`${theme === "starlight" ? "text-white" : "text-gray-900"} font-medium mb-1`}>
                        ☀️ Light Mode
                      </div>
                      <div className={`${theme === "starlight" ? "text-white/60" : "text-gray-600"} text-sm`}>
                        Bright and clean interface
                      </div>
                    </div>
                    {theme === "light" && <CheckIcon className="w-5 h-5 text-orange-400" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className={`border-t ${theme === "starlight" ? "border-orange-500/30" : "border-gray-300"}`}></div>

            {/* Language Section */}
            <div>
              <h2
                className={`font-semibold text-base mb-4 ${theme === "starlight" ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent" : "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent"}`}
              >
                Language
              </h2>
              <div className="space-y-3">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full p-4 rounded-lg border transition-colors ${
                      language === lang
                        ? theme === "starlight"
                          ? "bg-white/20 border-orange-500/50"
                          : "bg-white border-orange-500 shadow-md"
                        : theme === "starlight"
                          ? "bg-white/10 border-orange-500/30 hover:bg-white/15"
                          : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`${theme === "starlight" ? "text-white" : "text-gray-900"} font-medium`}>
                        {languageNames[lang]}
                      </div>
                      {language === lang && <CheckIcon className="w-5 h-5 text-orange-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
