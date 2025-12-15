"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"

const Ban = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
)

export default function AccountBannedPage() {
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    // Optional: Clear local storage/session
    // localStorage.clear()
  }, [])

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
    }`}>
      <div className={`max-w-md w-full p-8 rounded-2xl border text-center ${
        theme === "light"
          ? "bg-white border-gray-200 shadow-xl"
          : "bg-slate-800/40 border-red-500/20"
      }`}>
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full ${
            theme === "light" ? "bg-red-100" : "bg-red-500/20"
          }`}>
            <Ban className={`w-12 h-12 ${theme === "light" ? "text-red-600" : "text-red-400"}`} />
          </div>
        </div>

        <h1 className={`text-2xl font-bold mb-4 ${
          theme === "light" ? "text-gray-900" : "text-white"
        }`}>
          Account Banned
        </h1>

        <p className={`mb-6 ${
          theme === "light" ? "text-gray-600" : "text-white/60"
        }`}>
          Your account has been permanently banned for violating our community guidelines.
        </p>

        <p className={`mb-8 text-sm ${
          theme === "light" ? "text-gray-500" : "text-white/50"
        }`}>
          If you believe this is an error, please contact support at{" "}
          <a 
            href="mailto:support@astromatch.com" 
            className="text-orange-500 hover:text-orange-600 underline"
          >
            support@astromatch.com
          </a>
        </p>

        <button
          onClick={() => router.push("/auth/login")}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            theme === "light"
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-slate-700 text-white/80 hover:bg-slate-600"
          }`}
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}

