"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { VedicSection } from "@/components/astrolab/VedicSection"
import AstroLabNavigationHeader from "@/components/AstroLabNavigationHeader"

export default function VedicPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} astrology-page min-h-screen w-full relative pb-24`}
    >
      <div className="relative z-10">
        {/* Header with drawer button */}
        <AstroLabNavigationHeader theme={theme} setTheme={setTheme} />

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
