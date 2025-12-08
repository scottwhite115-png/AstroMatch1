// /components/AstroLabHeader.tsx
"use client"

import { useRouter } from "next/navigation"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

interface AstroLabHeaderProps {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
  onMenuClick: () => void
}

export default function AstroLabHeader({ theme, setTheme, onMenuClick }: AstroLabHeaderProps) {
  return (
    <header className={`sticky top-0 z-50 flex items-center justify-between border-b px-4 py-3 ${
      theme === "light"
        ? "bg-white/80 backdrop-blur-sm border-gray-200"
        : "bg-slate-900/80 backdrop-blur-sm border-slate-800"
    }`}>
      <div className="flex items-center gap-2">
        {/* Menu icon to toggle drawer */}
        <button
          type="button"
          onClick={onMenuClick}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
            theme === "light"
              ? "border-gray-200 hover:bg-gray-100"
              : "border-slate-700 hover:bg-slate-800"
          }`}
          aria-label="Open menu"
        >
          {/* List icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={theme === "light" ? "text-gray-700" : "text-slate-300"}
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-0.5">
          <FourPointedStar className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            AstroLab
          </span>
        </div>
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
    </header>
  )
}

