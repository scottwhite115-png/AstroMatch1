"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { fetchUserProfile, updateUserProfile } from "@/lib/supabase/profileQueries"
import { checkProfileCompletion, getCompletionMessage } from "@/lib/profileCompletion"
import type { UserProfile } from "@/lib/profileCompletion"

export default function OnboardingPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [completionStatus, setCompletionStatus] = useState<any>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    const userProfile = await fetchUserProfile()
    
    if (!userProfile) {
      // No profile found, redirect to signup
      router.push('/signup')
      return
    }

    setProfile(userProfile)
    const status = checkProfileCompletion(userProfile)
    setCompletionStatus(status)

    // If profile is already complete, redirect to matches
    if (status.isComplete) {
      router.push('/matches')
      return
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={theme === "light" ? "text-gray-900" : "text-white"}>Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-500">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
          </div>
          
          {completionStatus && (
            <div className="mb-6">
              <p className={`text-lg mb-2 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                {getCompletionMessage(completionStatus)}
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-600 to-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionStatus.percentage}%` }}
                ></div>
              </div>
              <p className={`text-sm mt-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                {completionStatus.percentage}% Complete
              </p>
            </div>
          )}
        </div>

        {/* Missing Fields */}
        {completionStatus && completionStatus.missingFields.length > 0 && (
          <div className={`rounded-2xl border p-6 mb-6 ${theme === "light" ? "border-gray-200 bg-white" : "border-gray-700 bg-zinc-800"}`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Required to Complete:
            </h2>
            <ul className="space-y-3">
              {completionStatus.missingFields.map((field: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">●</span>
                  <span className={theme === "light" ? "text-gray-700" : "text-gray-300"}>
                    {field}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Email Verification */}
          {completionStatus && !completionStatus.requiredFields.emailVerified && (
            <button
              onClick={() => router.push('/auth/verify-email')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              ✉️ Verify Email
            </button>
          )}

          {/* Phone Verification */}
          {completionStatus && !completionStatus.requiredFields.phoneVerified && (
            <button
              onClick={() => router.push('/auth/verify-phone')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              📱 Verify Phone Number
            </button>
          )}

          {/* Complete Profile */}
          <button
            onClick={() => router.push('/profile/profile')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            ✏️ Complete Profile Details
          </button>
        </div>

        {/* Skip for now (only if >50% complete) */}
        {completionStatus && completionStatus.percentage >= 50 && (
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/matches')}
              className={`text-sm underline ${theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-gray-200"}`}
            >
              I'll finish this later
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className={`mt-8 p-4 rounded-lg ${theme === "light" ? "bg-orange-50 border border-orange-200" : "bg-orange-900/20 border border-orange-800"}`}>
          <p className={`text-sm ${theme === "light" ? "text-orange-900" : "text-orange-300"}`}>
            <strong>Why complete your profile?</strong> Complete profiles get 10x more matches! Help others find their perfect cosmic connection. ✨
          </p>
        </div>
      </div>
    </div>
  )
}

