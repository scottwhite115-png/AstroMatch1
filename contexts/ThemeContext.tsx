"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    try {
      const savedTheme = localStorage.getItem("appTheme") as Theme
      if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
        setTheme(savedTheme)
      }
    } catch (error) {
      console.error("Error loading theme from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          localStorage.setItem("appTheme", theme)
          document.documentElement.classList.remove("light", "dark")
          document.documentElement.classList.add(theme)
        }
      } catch (error) {
        console.error("Error saving theme to localStorage:", error)
      }
    }
  }, [theme, mounted])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
