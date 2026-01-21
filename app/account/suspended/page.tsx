"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"

const Clock = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export default function AccountSuspendedPage() {
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    // Optional: Check suspension status periodically
    const interval = setInterval(() => {
      // Could call an API to check if suspension expired
      // and redirect to home if active
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
    }`}>
      <div className={`max-w-md w-full p-8 rounded-2xl border text-center ${
        theme === "light"
          ? "bg-white border-gray-200 shadow-xl"
          : "bg-slate-800/40 border-yellow-500/20"
      }`}>
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full ${
            theme === "light" ? "bg-yellow-100" : "bg-yellow-500/20"
          }`}>
            <Clock className={`w-12 h-12 ${theme === "light" ? "text-yellow-600" : "text-yellow-400"}`} />
          </div>
        </div>

        <h1 className={`text-2xl font-bold mb-4 ${
          theme === "light" ? "text-gray-900" : "text-white"
        }`}>
          Account Suspended
        </h1>

        <p className={`mb-6 ${
          theme === "light" ? "text-gray-600" : "text-white/60"
        }`}>
          Your account has been temporarily suspended for violating our community guidelines.
        </p>

        <div className={`p-4 rounded-lg mb-6 ${
          theme === "light" ? "bg-yellow-50" : "bg-yellow-500/10"
        }`}>
          <p className={`text-sm ${
            theme === "light" ? "text-yellow-800" : "text-yellow-400"
          }`}>
            Your account will be automatically reactivated when the suspension period ends.
          </p>
        </div>

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

