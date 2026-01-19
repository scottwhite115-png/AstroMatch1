"use client"

import type React from "react"
import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"

export default function TestMatchesPage() {
  const { theme } = useTheme()
  
  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-white" : "bg-black"}`}>
      <div className="p-8">
        <h1 className={`text-2xl font-bold ${theme === "light" ? "text-black" : "text-white"}`}>
          Test Matches Page
        </h1>
        <p className={`mt-4 ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
          This is a simple test page to check if the basic structure works.
        </p>
      </div>
    </div>
  )
}
