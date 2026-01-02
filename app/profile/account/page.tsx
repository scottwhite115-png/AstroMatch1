"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import {
  getSunSignSystem,
  setSunSignSystem,
  getBothSunSigns,
  saveSunSigns,
  type SunSignSystem,
} from "@/lib/sunSignCalculator"
import { getBlockedUsers, unblockUser, type BlockedUser } from "@/lib/utils/blocked-users"
import { createClient } from "@/lib/supabase/client"
import { fetchUserProfile } from "@/lib/supabase/profileQueries"
import { updateInstantMessagingSettings } from "@/lib/supabase/profileSave"

interface AccountPageProps {
  pageIndex?: number
  totalPages?: number
  onNavigatePrev?: () => void
  onNavigateNext?: () => void
}

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
    />
  </svg>
)

const AppleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ChevronDown = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const ExternalLink = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

export default function AccountPage({
  pageIndex = 0,
  totalPages = 1,
  onNavigatePrev,
  onNavigateNext,
}: AccountPageProps = {}) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [instantMessageEnabled, setInstantMessageEnabled] = useState(true)
  const [friendFinderEnabled, setFriendFinderEnabled] = useState(false)
  const [sunSignSystem, setSunSignSystemState] = useState<SunSignSystem>("tropical")
  const [isStaff, setIsStaff] = useState(false)
  const [linkedAccounts, setLinkedAccounts] = useState({
    google: false,
    apple: false,
  })
  const [verifiedAccounts, setVerifiedAccounts] = useState({
    email: false,
    google: false,
    apple: false,
  })
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false)
  const [guidelinesOpen, setGuidelinesOpen] = useState(false)
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false)
  const [termsOfServiceOpen, setTermsOfServiceOpen] = useState(false)
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([])

  useEffect(() => {
    const savedName = localStorage.getItem("userFullName")
    const savedEmail = localStorage.getItem("userEmail")

    if (savedName) {
      setName(savedName)
    }
    if (savedEmail) {
      setEmail(savedEmail)
    }

    const emailVerified = localStorage.getItem("auth_email_verified") === "true"
    const googleVerified = localStorage.getItem("auth_google_verified") === "true"
    const facebookVerified = localStorage.getItem("auth_facebook_verified") === "true"
    const appleVerified = localStorage.getItem("auth_apple_verified") === "true"

    setVerifiedAccounts({
      email: emailVerified,
      google: googleVerified,
      facebook: facebookVerified,
      apple: appleVerified,
    })

    setLinkedAccounts({
      google: googleVerified,
      facebook: facebookVerified,
      apple: appleVerified,
    })

    const deactivated = localStorage.getItem("accountDeactivated") === "true"
    setIsAccountDeactivated(deactivated)

    // Load instant message settings from DATABASE
    async function loadInstantMessageSettings() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const profile = await fetchUserProfile(user.id)
          if (profile) {
            // Use database value, default to TRUE if not set
            setInstantMessageEnabled(profile.allow_instant_messages_connections ?? true)
          }
        }
      } catch (error) {
        console.error('[Account] Error loading instant message settings:', error)
        // Default to true on error
        setInstantMessageEnabled(true)
      }
    }
    loadInstantMessageSettings()

    const savedFriendFinder = localStorage.getItem("friendFinderEnabled")
    if (savedFriendFinder !== null) {
      setFriendFinderEnabled(JSON.parse(savedFriendFinder))
    }

    // Load sun sign system preference
    const savedSunSignSystem = getSunSignSystem()
    setSunSignSystemState(savedSunSignSystem)

    // Calculate and save both sun signs from birthdate if not already saved
    const savedMonth = localStorage.getItem("selectedMonth")
    const savedDay = localStorage.getItem("selectedDay")
    
    if (savedMonth && savedDay) {
      const month = parseInt(savedMonth)
      const day = parseInt(savedDay)
      
      // Calculate both sun signs
      const { tropical, sidereal } = getBothSunSigns(month, day)
      
      // Save both signs to localStorage
      saveSunSigns(tropical, sidereal)
    }

    // Load blocked users
    setBlockedUsers(getBlockedUsers())

    // Check if user is staff (ADMIN or OWNER) to show Backoffice tab
    async function checkStaffStatus() {
      try {
        const res = await fetch('/api/admin/check-access')
        const data = await res.json()
        setIsStaff(data.hasAccess && (data.role === 'ADMIN' || data.role === 'OWNER'))
      } catch (error) {
        setIsStaff(false)
      }
    }
    checkStaffStatus()
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    if (newName.trim()) {
      localStorage.setItem("userFullName", newName.trim())
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    if (newEmail.trim()) {
      localStorage.setItem("userEmail", newEmail.trim())
    }
  }

  const handlePasswordChange = () => {
    if (currentPassword && newPassword) {
      // In a real app, this would call an API
      alert("Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
    }
  }

  const toggleLinkedAccount = (provider: "google" | "apple") => {
    const isCurrentlyLinked = linkedAccounts[provider]

    if (isCurrentlyLinked) {
      localStorage.removeItem(`auth_${provider}_verified`)
      setLinkedAccounts((prev) => ({
        ...prev,
        [provider]: false,
      }))
      setVerifiedAccounts((prev) => ({
        ...prev,
        [provider]: false,
      }))
      alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} account disconnected`)
    } else {
      localStorage.setItem(`auth_${provider}_verified`, "true")
      setLinkedAccounts((prev) => ({
        ...prev,
        [provider]: true,
      }))
      setVerifiedAccounts((prev) => ({
        ...prev,
        [provider]: true,
      }))
      alert(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} account connected! (In a real app, this would open OAuth flow)`,
      )
    }
  }

  const handleDeactivateAccount = () => {
    if (
      confirm(
        "Are you sure you want to deactivate your account? Your profile will be hidden from matches. You can reactivate it anytime.",
      )
    ) {
      localStorage.setItem("accountDeactivated", "true")
      setIsAccountDeactivated(true)
      alert("Account deactivated. Your profile is now hidden from matches.")
    }
  }

  const handleReactivateAccount = () => {
    if (confirm("Reactivate your account? Your profile will be visible to matches again.")) {
      localStorage.setItem("accountDeactivated", "false")
      setIsAccountDeactivated(false)
      alert("Account reactivated! Your profile is now visible to matches.")
    }
  }

  const toggleInstantMessage = async () => {
    const newValue = !instantMessageEnabled
    setInstantMessageEnabled(newValue)
    
    // Save to DATABASE
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const result = await updateInstantMessagingSettings(user.id, newValue, newValue)
        if (result.success) {
          console.log('[Account] ✅ Instant message settings saved to database')
        } else {
          console.error('[Account] ❌ Failed to save instant message settings:', result.error)
        }
      }
    } catch (error) {
      console.error('[Account] Error saving instant message settings:', error)
    }
  }

  const toggleFriendFinder = () => {
    const newValue = !friendFinderEnabled
    setFriendFinderEnabled(newValue)
    localStorage.setItem("friendFinderEnabled", JSON.stringify(newValue))
  }

  const toggleSunSignSystem = () => {
    const newSystem: SunSignSystem = sunSignSystem === "tropical" ? "sidereal" : "tropical"
    setSunSignSystemState(newSystem)
    setSunSignSystem(newSystem)
    
    // Force a page refresh to update all displays
    window.dispatchEvent(new Event("sunSignSystemChanged"))
  }

  const handleUnblock = (userId: number) => {
    unblockUser(userId)
    setBlockedUsers(getBlockedUsers())
  }

  const handleDeleteAccount = () => {
    const firstConfirm = confirm(
      "⚠️ WARNING: This will PERMANENTLY delete your account!\n\n" +
        "All your data including:\n" +
        "• Profile information\n" +
        "• Photos and preferences\n" +
        "• Matches and messages\n" +
        "• Account settings\n\n" +
        "This action CANNOT be undone.\n\n" +
        "Are you absolutely sure you want to continue?",
    )

    if (!firstConfirm) {
      return
    }

    const secondConfirm = prompt('To confirm permanent deletion, please type "DELETE" (in capital letters):')

    if (secondConfirm === "DELETE") {
      // Clear all user data from localStorage
      const keysToRemove = [
        "userFullName",
        "userEmail",
        "userCity",
        "userBirthDate",
        "userGender",
        "userOccupation",
        "userHeight",
        "userChildren",
        "userAbout",
        "userInterests",
        "auth_email_verified",
        "auth_google_verified",
        "auth_facebook_verified",
        "accountDeactivated",
        "distanceRadius",
        "ageRange",
        "matchFilter",
        "useGPS",
        "manualCity",
        "blockedUsers",
        "visibilitySettings",
      ]

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
      })

      alert(
        "Your account has been permanently deleted.\n\n" +
          "All your data has been removed.\n\n" +
          "Thank you for using AstroMatch. We hope to see you again in the future.",
      )

      // Redirect to login page
      router.push("/login")
    } else if (secondConfirm !== null) {
      alert('Deletion cancelled. You must type "DELETE" exactly to confirm.')
    }
  }

  const communityGuidelines = [
    "Be respectful and kind to all users",
    "No harassment, hate speech, or discriminatory behavior",
    "Keep conversations appropriate and consensual",
    "Don't share personal information too quickly",
    "Report suspicious or concerning behavior",
    "No spam, scams, or promotional content",
    "Respect others' boundaries and preferences",
    "Be honest in your profile and interactions",
  ]

  const handleContactSupport = () => {
    window.location.href = "mailto:astromatchchat@gmail.com?subject=Support Request"
  }

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} profile-page min-h-screen relative overflow-x-hidden touch-pan-y`}
      style={{ overscrollBehavior: 'contain' }}
    >
      <header className={`sticky top-0 z-50 ${
        theme === "light"
          ? "bg-white/80 backdrop-blur-sm"
          : "bg-slate-900/80 backdrop-blur-sm"
      }`} style={{ paddingTop: 'max(env(safe-area-inset-top), 44px)' }}>
        <div className="mx-auto max-w-full px-2 pt-0.5 pb-1.5 sm:px-3 lg:px-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex-1 -ml-8">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-transparent">
                <div className="flex gap-0.5 min-w-max ml-8">
                  <div className="flex items-center gap-0.5">
                    <FourPointedStar className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-lg bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      AstroMatch
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Theme Toggle Button */}
            <div className="flex items-center gap-2 ml-2">
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
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* Horizontal Tabs Navigation */}
        <div className="px-3 pt-0 pb-2 -mt-3">
          <div className="flex justify-start gap-8">
              <button
                onClick={() => router.push("/profile/profile")}
                className={`relative px-5 py-1.5 text-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  theme === "light"
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Profile
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600 rounded-full transition-colors" />
              </button>
              <button
                onClick={() => router.push("/profile/account")}
                className={`relative px-5 py-1.5 text-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Account
              </button>
              {isStaff && (
                <button
                  onClick={() => router.push("/admin")}
                  className={`relative px-5 py-1.5 text-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    theme === "light"
                      ? "text-gray-600 hover:text-gray-900"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Backoffice
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600 rounded-full transition-colors" />
                </button>
              )}
          </div>
        </div>

        {/* Account Content */}
        <div className="px-5 pt-4 pb-24">
          <div className="max-w-md mx-auto space-y-8">

            {/* Instant Message Section */}
            <div>
              <h2
                className={`font-semibold text-base mb-4 flex items-center gap-2 ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Instant Message
              </h2>
              <div className={`p-4 ${theme === "light" ? "bg-gray-100" : "bg-slate-800/40 border border-indigo-500/20 shadow-lg shadow-indigo-950/30"} backdrop-blur-sm rounded-lg`}>
                <div className="mb-3">
                  <div className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium mb-2`}>Allow Instant Messages</div>
                  <div className={`${theme === "light" ? "!text-black/60" : "!text-white/60"} text-sm`}>
                    {instantMessageEnabled 
                      ? "Others can message you directly without matching first"
                      : "Users must match with you (mutual like) before they can message you"
                    }
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={toggleInstantMessage}
                    className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors ${
                      instantMessageEnabled
                        ? "bg-purple-600"
                        : "bg-transparent border border-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transition-all ${
                        instantMessageEnabled ? "translate-x-6" : "translate-x-0.5 border border-gray-300"
                      }`}
                      style={!instantMessageEnabled ? { position: 'absolute', top: '50%', transform: 'translateY(-50%) translateX(2px)' } : {}}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Friend Finder Section */}
            <div>
              <h2
                className={`font-semibold text-base mb-4 flex items-center gap-2 ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Friend Finder
              </h2>
              <div className={`p-4 ${theme === "light" ? "bg-gray-100" : "bg-slate-800/40 border border-indigo-500/20 shadow-lg shadow-indigo-950/30"} backdrop-blur-sm rounded-lg`}>
                <div className="mb-3">
                  <div className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium mb-2`}>Friend Finder</div>
                  <div className={`${theme === "light" ? "!text-black/60" : "!text-white/60"} text-sm`}>
                    Shows your profile to the opposite sex and users of the same sex who are also interested in finding
                    friends
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={toggleFriendFinder}
                    className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors ${
                      friendFinderEnabled
                        ? "bg-purple-600"
                        : "bg-transparent border border-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transition-all ${
                        friendFinderEnabled ? "translate-x-6" : "translate-x-0.5 border border-gray-300"
                      }`}
                      style={!friendFinderEnabled ? { position: 'absolute', top: '50%', transform: 'translateY(-50%) translateX(2px)' } : {}}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Sun Signs Section */}
            <div>
              <h2
                className={`font-semibold text-base mb-4 flex items-center gap-2 ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Sun Signs
              </h2>
              <div className={`p-4 ${theme === "light" ? "bg-gray-100" : "bg-slate-800/40 border border-indigo-500/20 shadow-lg shadow-indigo-950/30"} backdrop-blur-sm rounded-lg`}>
                <div className="mb-3">
                  <div className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium mb-2`}>
                    Zodiac System
                  </div>
                  <div className={`${theme === "light" ? "!text-black/60" : "!text-white/60"} text-sm mb-2`}>
                    Choose between the Tropical (Western) or Sidereal (Vedic) zodiac calendar. This allows you to view profiles through each system.
                  </div>
                  <div className={`${theme === "light" ? "!text-black/50" : "!text-white/50"} text-xs`}>
                    • Tropical: Based on seasons (e.g., Aries: Mar 21 - Apr 19)
                    <br />
                    • Sidereal: Based on constellations (~23 days earlier)
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`${theme === "light" ? "!text-black/70" : "!text-white/70"} text-sm font-medium`}>
                    {sunSignSystem === "tropical" ? "Tropical (Western)" : "Sidereal (Vedic)"}
                  </div>
                  <button
                    onClick={toggleSunSignSystem}
                    className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors ${
                      sunSignSystem === "sidereal"
                        ? "bg-purple-600"
                        : "bg-transparent border border-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transition-all ${
                        sunSignSystem === "sidereal" ? "translate-x-6" : "translate-x-0.5 border border-gray-300"
                      }`}
                      style={sunSignSystem !== "sidereal" ? { position: 'absolute', top: '50%', transform: 'translateY(-50%) translateX(2px)' } : {}}
                    />
                  </button>
                </div>
                <div className={`mt-2 text-xs ${theme === "light" ? "text-black/50" : "text-white/50"}`}>
                </div>
              </div>
            </div>

            <div>
              <h2
                className={`font-semibold text-base mb-4 flex items-center gap-2 ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Profile Details
              </h2>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className={`${theme === "light" ? "text-black/95" : "text-white/95"} text-sm`}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 ${theme === "light" ? "bg-white !text-black/95 placeholder-black/50 border border-gray-300" : "bg-slate-900/50 border border-indigo-400/20 !text-white/95 placeholder-white/50 focus:border-indigo-400/40"} rounded-lg focus:outline-none text-lg`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`${theme === "light" ? "text-black/95" : "text-white/95"} text-sm`}>Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 ${theme === "light" ? "bg-white !text-black/95 placeholder-black/50 border border-gray-300" : "bg-slate-900/50 border border-indigo-400/20 !text-white/95 placeholder-white/50 focus:border-indigo-400/40"} rounded-lg focus:outline-none text-lg`}
                    />
                    {verifiedAccounts.email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <CheckIcon className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-400">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2
                className={`font-semibold text-base mb-4 flex items-center gap-2 ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Change Password
              </h2>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className={`${theme === "light" ? "text-black/95" : "text-white/95"} text-sm`}>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={`w-full px-4 py-3 ${theme === "light" ? "bg-white !text-black/95 placeholder-black/50 border border-gray-300" : "bg-slate-900/50 border border-indigo-400/20 !text-white/95 placeholder-white/50 focus:border-indigo-400/40"} rounded-lg focus:outline-none text-lg`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`${theme === "light" ? "text-black/95" : "text-white/95"} text-sm`}>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={`w-full px-4 py-3 ${theme === "light" ? "bg-white !text-black/95 placeholder-black/50 border border-gray-300" : "bg-slate-900/50 border border-indigo-400/20 !text-white/95 placeholder-white/50 focus:border-indigo-400/40"} rounded-lg focus:outline-none text-lg`}
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 !text-white rounded-lg transition-colors font-medium"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* Report & Block Management Section */}
            <div className="mb-8">
              <h2
                className={`font-semibold text-base mb-4 flex items-center gap-2 ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Blocked Users
              </h2>
              {blockedUsers.length > 0 ? (
                <div className="space-y-3">
                  {blockedUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-4 ${theme === "light" ? "bg-gray-100 border-gray-300" : "bg-slate-800/40 border-indigo-500/20 shadow-lg shadow-indigo-950/30"} backdrop-blur-sm rounded-lg border`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={user.photo || "/placeholder.svg"}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                        />
                        <div>
                          <div className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium`}>
                            {user.name}, {user.age}
                          </div>
                          <div className={`${theme === "light" ? "!text-black/60" : "!text-white/60"} text-sm`}>Blocked on {user.blockedDate}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnblock(user.id)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-6 ${theme === "light" ? "bg-gray-100" : "bg-slate-800/40 border border-indigo-500/20 shadow-lg shadow-indigo-950/30"} backdrop-blur-sm rounded-lg text-center`}>
                  <p className={`${theme === "light" ? "!text-black/95" : "!text-white/95"}`}>No blocked users</p>
                </div>
              )}
            </div>

            <div>
              <h2
                className={`font-semibold text-base mb-4 flex items-center gap-2 ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Linked Logins
              </h2>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-4 ${theme === "light" ? "bg-gray-100" : "bg-slate-800/40 border border-indigo-500/20 shadow-lg shadow-indigo-950/30"} backdrop-blur-sm rounded-lg`}>
                  <div className="flex items-center gap-3">
                    <GoogleIcon className="w-6 h-6" />
                    <div>
                      <span className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium`}>Google</span>
                      {verifiedAccounts.google && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <CheckIcon className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleLinkedAccount("google")}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                      linkedAccounts.google
                        ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        : "bg-blue-500 hover:bg-blue-600 !text-white"
                    }`}
                  >
                    {linkedAccounts.google ? "Disconnect" : "Connect"}
                  </button>
                </div>

                <div className={`flex items-center justify-between p-4 ${theme === "light" ? "bg-gray-100" : "bg-slate-800/40 border border-indigo-500/20 shadow-lg shadow-indigo-950/30"} backdrop-blur-sm rounded-lg`}>
                  <div className="flex items-center gap-3">
                    <AppleIcon className="w-6 h-6" />
                    <div>
                      <span className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium`}>Apple</span>
                      {verifiedAccounts.apple && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <CheckIcon className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleLinkedAccount("apple")}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                      linkedAccounts.apple
                        ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        : "bg-blue-500 hover:bg-blue-600 !text-white"
                    }`}
                  >
                    {linkedAccounts.apple ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Support Section */}
            <div>
              <h2
                className={`font-semibold text-base mb-4 flex items-center gap-2 ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Contact Support
              </h2>
              <button
                onClick={handleContactSupport}
                className={`w-full flex items-center justify-between p-4 ${theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-indigo-900/40 hover:bg-indigo-900/60"} backdrop-blur-sm rounded-lg transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium`}>Email Support</div>
                    <div className={`${theme === "light" ? "!text-black/60" : "!text-white/60"} text-sm`}>astromatchchat@gmail.com</div>
                  </div>
                </div>
                <ExternalLink className={`w-5 h-5 ${theme === "light" ? "!text-black/50" : "!text-white/50"}`} />
              </button>
            </div>

            {/* Community Guidelines Section */}
            <div>
              <h2
                className={`font-semibold text-base mb-4 flex items-center gap-2 ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Community Guidelines
              </h2>
              <div className={`${theme === "light" ? "bg-gray-100" : "bg-slate-800/40 border border-indigo-500/20 shadow-lg shadow-indigo-950/30"} backdrop-blur-sm rounded-lg overflow-hidden`}>
                <button
                  onClick={() => setGuidelinesOpen(!guidelinesOpen)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-black/30 transition-colors"
                >
                  <span className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium`}>View Guidelines</span>
                  <ChevronDown
                    className={`w-5 h-5 ${theme === "light" ? "!text-black" : "!text-white"} transition-transform ${guidelinesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {guidelinesOpen && (
                  <div className="px-4 pb-4">
                    <ul className="space-y-2">
                      {communityGuidelines.map((guideline, index) => (
                        <li key={index} className={`flex items-start gap-2 ${theme === "light" ? "!text-black/95" : "!text-white/95"} text-sm`}>
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Legal Section */}
            <div>
              <h2
                className={`font-semibold text-base mb-4 flex items-center gap-2 ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Legal
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setTermsOfServiceOpen(true)}
                  className={`w-full block p-4 ${theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-indigo-900/40 hover:bg-indigo-900/60"} backdrop-blur-sm rounded-lg transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium`}>Terms of Service</span>
                    <ExternalLink className={`w-5 h-5 ${theme === "light" ? "!text-black/50" : "!text-white/50"}`} />
                  </div>
                </button>
                <button
                  onClick={() => setPrivacyPolicyOpen(true)}
                  className={`w-full block p-4 ${theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-indigo-900/40 hover:bg-indigo-900/60"} backdrop-blur-sm rounded-lg transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium`}>Privacy Policy</span>
                    <ExternalLink className={`w-5 h-5 ${theme === "light" ? "!text-black/50" : "!text-white/50"}`} />
                  </div>
                </button>
              </div>
            </div>

            {/* Account Actions Section */}
            <div>
              <h2
                className={`font-semibold text-base mb-4 flex items-center gap-2 ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Account Actions
              </h2>
              <div className="space-y-3">
                {isAccountDeactivated && (
                  <div className="p-4 bg-orange-500/20 rounded-lg">
                    <p className="text-orange-400 text-sm font-medium text-center">
                      Your account is currently deactivated. Your profile is hidden from matches.
                    </p>
                  </div>
                )}

                {isAccountDeactivated ? (
                  <button
                    onClick={handleReactivateAccount}
                    className="w-full px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors font-medium"
                  >
                    Reactivate Account
                  </button>
                ) : (
                  <button
                    onClick={handleDeactivateAccount}
                    className="w-full px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors font-medium"
                  >
                    Deactivate Account
                  </button>
                )}

                <button
                  onClick={handleDeleteAccount}
                  className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-medium"
                >
                  Delete Account Permanently
                </button>

                <div className={`p-3 ${theme === "light" ? "bg-gray-200" : "bg-black/20"} rounded-lg`}>
                  <p className={`${theme === "light" ? "text-black/50" : "text-white/50"} text-xs text-center`}>
                    Deactivating your account will hide your profile. Deleting is permanent and cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* App Version Section */}
            <div className={`p-4 ${theme === "light" ? "bg-purple-100" : "bg-purple-500/10"} backdrop-blur-sm rounded-lg text-center`}>
              <div className={`${theme === "light" ? "!text-black/60" : "!text-white/60"} text-sm mb-1`}>App Version</div>
              <div className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium`}>1.1.3 (Build 2025.12)</div>
              <div className={`${theme === "light" ? "!text-black/50" : "!text-white/50"} text-xs mt-2`}>© 2025 Cosmic Connections</div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {privacyPolicyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                AstroMatch Privacy Policy
              </h2>
              <button
                onClick={() => setPrivacyPolicyOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto p-6 space-y-6">
              <div className="text-sm text-gray-600">
                <strong>Last Updated:</strong> 17 December 2025
              </div>

              <p className="text-gray-900">
                AstroMatch is a dating and astrology-based application (the "App"). This Privacy Policy explains how AstroMatch ("AstroMatch," "we," "us," "our") collects, uses, shares, and protects information about you, and the choices you have.
              </p>
              <p className="text-gray-900">
                This policy applies when you use our App, websites, and related services (collectively, the "Services").
              </p>

              {/* Section 1 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1) Who We Are (Controller) and How to Contact Us</h3>
                <p className="text-gray-900 mb-2">
                  AstroMatch is the entity responsible for processing your personal information (the "data controller" in many regions).
                </p>
                <p className="text-gray-900 mb-2">
                  <strong>Privacy Contact:</strong> astromatchchat@gmail.com
                </p>
                <p className="text-gray-900 mb-2">
                  <strong>Controller details:</strong> Harry Bundock Lawyer and Solicitor
                </p>
                <p className="text-gray-900">
                  If required by local law, we may appoint a local representative (for example, in the EEA/UK). If appointed, those details will be listed in this section.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2) Information We Collect</h3>
                <p className="text-gray-900 mb-3">
                  We collect information in three ways: (A) you provide it, (B) we collect it automatically, and (C) we receive it from others.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">A. Information you provide</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
                  <li><strong>Account and profile details:</strong> name (or display name), email, date of birth, gender (if provided), profile text, interests, preferences, and settings.</li>
                  <li><strong>Photos and media:</strong> profile photos and other media you choose to upload.</li>
                  <li><strong>Optional birth details:</strong> birth time and birth location (if you choose to provide them) for astrological features.</li>
                  <li><strong>Messages and interactions:</strong> chat messages and content you send, and metadata about messages (e.g., time sent, delivery status).</li>
                  <li><strong>Community content (if enabled):</strong> posts, comments, reports, and other contributions.</li>
                  <li><strong>Support communications:</strong> information you provide when you contact us (including attachments).</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">B. Information collected automatically</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
                  <li><strong>Device and app data:</strong> device type, operating system, app version, language, time zone, and unique device/app identifiers.</li>
                  <li><strong>Log and usage data:</strong> feature usage, clicks, pages/screens viewed, crash logs, diagnostic events, and performance data.</li>
                  <li><strong>Network and approximate location:</strong> IP address and inferred approximate location (e.g., city/region/country).</li>
                  <li><strong>Precise location (optional):</strong> if you enable location permissions, we may collect precise location for features such as showing nearby users or distance. You can disable this in device settings.</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">C. Information from others</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
                  <li><strong>Other users:</strong> reports you submit about other users, or reports submitted about you; content that others share with you (e.g., messages).</li>
                  <li><strong>App stores and platforms:</strong> basic purchase/transaction confirmations for in-app purchases (we generally do not receive your full payment card details; those are handled by Apple/Google or their payment processors).</li>
                  <li><strong>Service providers:</strong> we may receive fraud, security, or analytics signals from vendors that help us operate and protect the Services.</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3) Sensitive Information</h3>
                <p className="text-gray-900">
                  Some information used in a dating app context may be considered sensitive in certain countries (for example: date of birth, precise location, messages, and content that may reveal sexual life/sexual orientation if you choose to share it).
                </p>
                <p className="text-gray-900 mt-2">
                  Where required, we process sensitive information only with your consent or another lawful basis permitted by law, and we provide controls to limit what you share publicly.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4) How We Use Your Information</h3>
                <p className="text-gray-900 mb-2">We use information to operate, improve, secure, and personalize the Services, including to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li><strong>Provide the Services:</strong> create accounts, display profiles, enable matching, and enable chat and community features.</li>
                  <li><strong>Astrology and compatibility features:</strong> calculate compatibility and provide astrological insights based on information you provide (including optional birth details).</li>
                  <li><strong>Safety and integrity:</strong> detect, prevent, and investigate spam, fraud, harassment, and other harmful activity; enforce our Terms; respond to reports; and protect users.</li>
                  <li><strong>Support:</strong> respond to requests, troubleshoot issues, and provide customer assistance.</li>
                  <li><strong>Improve and develop:</strong> understand usage trends, fix bugs, improve features, and develop new functionality.</li>
                  <li><strong>Communications:</strong> send service-related messages (e.g., account notices, security alerts) and, where permitted, marketing communications you can opt out of.</li>
                  <li><strong>Legal compliance:</strong> comply with applicable laws, lawful requests, and regulatory obligations.</li>
                </ul>
                <p className="text-gray-900">
                  We do not sell your personal information in the traditional sense. Some jurisdictions define "sell" or "share" broadly (including certain advertising-related disclosures). See Section 10 (Region Notices) for related rights.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5) Legal Bases for Processing (EEA/UK/Switzerland and similar regions)</h3>
                <p className="text-gray-900 mb-2">Where required, we rely on one or more of the following legal bases:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900">
                  <li><strong>Contract necessity:</strong> to provide the Services you request (e.g., account, matching, chat).</li>
                  <li><strong>Consent:</strong> for optional data (e.g., birth time/location), precise location (where required), certain analytics, and advertising/marketing where required.</li>
                  <li><strong>Legitimate interests:</strong> to secure and improve the Services, prevent abuse, and operate our business (balanced against your rights).</li>
                  <li><strong>Legal obligation:</strong> to comply with laws and lawful requests.</li>
                  <li><strong>Vital interests:</strong> to protect someone's safety where necessary.</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">6) How We Share Information</h3>
                <p className="text-gray-900 mb-3">We share information only as described below:</p>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">A. With other users (your choices)</h4>
                <p className="text-gray-900 mb-3">
                  We share information you choose to display on your profile and through your interactions (e.g., chat messages). Your profile visibility and settings control what others can see.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">B. With service providers (processors)</h4>
                <p className="text-gray-900 mb-2">We use vendors to help run the Services, such as:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-900 mb-3">
                  <li>Hosting and databases (e.g., Supabase and associated infrastructure providers)</li>
                  <li>Analytics and crash reporting</li>
                  <li>Customer support tools</li>
                  <li>Content moderation and safety tooling</li>
                  <li>Email and communications tooling</li>
                  <li>Payment and subscription support (typically via Apple/Google)</li>
                </ul>
                <p className="text-gray-900 mb-3">
                  These providers are permitted to process personal information only to perform services for us under contractual confidentiality and security obligations.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">C. For legal, safety, and enforcement reasons</h4>
                <p className="text-gray-900 mb-2">We may disclose information if we believe it is reasonably necessary to:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-900 mb-3">
                  <li>comply with law, regulation, legal process, or lawful government requests;</li>
                  <li>enforce our Terms and policies;</li>
                  <li>detect, prevent, or address fraud, security, or technical issues; or</li>
                  <li>protect the rights, property, and safety of AstroMatch, our users, or the public.</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">D. Business transfers</h4>
                <p className="text-gray-900">
                  If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of company assets, information may be transferred as part of that transaction, subject to standard protections.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">7) International Data Transfers</h3>
                <p className="text-gray-900 mb-2">
                  AstroMatch may process and store information in countries other than where you live. When we transfer personal information internationally, we use appropriate safeguards as required by law, which may include:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-900">
                  <li>adequacy decisions (where recognized),</li>
                  <li>contractual protections such as Standard Contractual Clauses (SCCs),</li>
                  <li>or other lawful transfer mechanisms.</li>
                </ul>
              </div>

              {/* Section 8 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">8) Data Security</h3>
                <p className="text-gray-900 mb-2">
                  We use administrative, technical, and physical safeguards designed to protect personal information, including:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-900 mb-3">
                  <li>access controls and least-privilege practices,</li>
                  <li>encryption in transit and, where applicable, at rest,</li>
                  <li>hashed password storage (where passwords are used),</li>
                  <li>monitoring and logging for security events.</li>
                </ul>
                <p className="text-gray-900">
                  No system is 100% secure. You are responsible for keeping your login credentials confidential and using device-level security.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">9) Data Retention</h3>
                <p className="text-gray-900 mb-2">
                  We retain personal information for as long as necessary to provide the Services and for legitimate business purposes, including safety and legal compliance.
                </p>
                <p className="text-gray-900 mb-2"><strong>Typical retention principles:</strong></p>
                <ul className="list-disc pl-6 space-y-1 text-gray-900 mb-2">
                  <li><strong>Account data:</strong> retained while your account is active.</li>
                  <li><strong>Deletion:</strong> when you request deletion, we delete or anonymize personal information within a reasonable timeframe, subject to: legal requirements, dispute resolution and enforcement needs, safety and abuse-prevention records (e.g., reports, sanctions), and limited backup retention (which may persist for a period before being overwritten).</li>
                </ul>
                <p className="text-gray-900">
                  Some information may be retained in de-identified or aggregated form.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">10) Your Rights and Choices (Including Region Notices)</h3>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4">A. Global controls</h4>
                <p className="text-gray-900 mb-2">You can:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-900 mb-3">
                  <li>access and update profile information in the App,</li>
                  <li>withdraw optional information (e.g., birth time),</li>
                  <li>control permissions (e.g., location, notifications) in device settings,</li>
                  <li>opt out of marketing emails using the unsubscribe link (where applicable),</li>
                  <li>request access, deletion, or a copy of your data by contacting us.</li>
                </ul>
                <p className="text-gray-900 mb-2">
                  <strong>Email:</strong> astromatchchat@gmail.com
                </p>
                <p className="text-gray-900 mb-4">
                  We may need to verify your identity before fulfilling requests.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">B. EEA/UK/Switzerland (GDPR / UK GDPR)</h4>
                <p className="text-gray-900 mb-2">Subject to applicable law, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-900 mb-2">
                  <li>access, correct, delete, and port your data;</li>
                  <li>restrict or object to certain processing (including profiling in some cases);</li>
                  <li>withdraw consent (where processing is based on consent);</li>
                  <li>lodge a complaint with your local data protection authority.</li>
                </ul>
                <p className="text-gray-900 mb-4">
                  <strong>Profiling/automated decisions:</strong> AstroMatch uses algorithms to suggest matches and compatibility insights. This is not intended to produce legal or similarly significant effects. You can adjust preferences and controls within the App.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">C. United States (including California CCPA/CPRA and other state laws)</h4>
                <p className="text-gray-900 mb-2">Depending on your state, you may have rights to:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-900 mb-2">
                  <li>know/access what personal information we collected, used, or disclosed;</li>
                  <li>delete personal information (with legal exceptions);</li>
                  <li>correct inaccurate information;</li>
                  <li>obtain a portable copy of certain data;</li>
                  <li>opt out of certain targeted advertising uses.</li>
                </ul>
                <p className="text-gray-900 mb-2">
                  <strong>Sale/Share:</strong> We do not sell personal information for money. If we use advertising or analytics tools that are considered "sharing" under certain laws, you may request an opt-out by contacting us. We will honor applicable opt-out requests where required.
                </p>
                <p className="text-gray-900 mb-4">
                  <strong>Non-discrimination:</strong> We will not discriminate against you for exercising privacy rights.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">D. Brazil (LGPD), Canada (PIPEDA), and other regions</h4>
                <p className="text-gray-900">
                  You may have similar rights to access, correct, delete, and object to processing, subject to local law.
                </p>
              </div>

              {/* Section 11 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">11) Advertising, Analytics, and Tracking</h3>
                <p className="text-gray-900 mb-2">
                  We may use analytics tools to understand usage and improve performance. Depending on your configuration and region, these tools may involve device identifiers.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-900 mb-2">
                  <li><strong>Consent where required:</strong> In certain regions, we request consent before using non-essential analytics or advertising identifiers.</li>
                  <li><strong>Apple App Tracking Transparency (ATT):</strong> On iOS, if we engage in tracking as defined by Apple, we will request permission via ATT prompts.</li>
                  <li><strong>Advertising identifiers:</strong> Some devices provide advertising IDs (e.g., IDFA on iOS, AAID on Android). You can reset or limit these in device settings.</li>
                </ul>
                <p className="text-gray-900">
                  We do not knowingly allow interest-based advertising targeted to minors.
                </p>
              </div>

              {/* Section 12 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">12) Permissions (Location, Camera, Photos, Notifications)</h3>
                <p className="text-gray-900 mb-2">The App may request device permissions to enable features:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-900 mb-2">
                  <li><strong>Photos/Camera:</strong> to upload profile images.</li>
                  <li><strong>Location:</strong> to show nearby matches and/or distance (if enabled by you).</li>
                  <li><strong>Notifications:</strong> to alert you about messages, matches, and important updates.</li>
                </ul>
                <p className="text-gray-900">
                  You can change permissions at any time in your device settings.
                </p>
              </div>

              {/* Section 13 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">13) User-Generated Content, Reports, and Safety Moderation</h3>
                <p className="text-gray-900 mb-2">
                  AstroMatch is a social platform. Content you share (profile info, photos, messages, posts) may be visible to other users depending on your settings and the feature used.
                </p>
                <p className="text-gray-900 mb-2">We may review content and related information to:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-900 mb-2">
                  <li>respond to reports,</li>
                  <li>enforce Terms and community guidelines,</li>
                  <li>prevent harm and illegal activity,</li>
                  <li>and improve safety.</li>
                </ul>
                <p className="text-gray-900">
                  If you report a user, we may process details of the report and related context for investigation and enforcement.
                </p>
              </div>

              {/* Section 14 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">14) Children's Privacy</h3>
                <p className="text-gray-900 mb-2">
                  AstroMatch is intended only for users 18 years or older (or the age of majority in your jurisdiction, if higher). We do not knowingly collect personal information from minors. If we learn we have collected such information, we will take steps to delete it.
                </p>
              </div>

              {/* Section 15 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">15) Third-Party Links and Services</h3>
                <p className="text-gray-900">
                  The Services may link to third-party sites or services (for example, payment flows or external links). We are not responsible for their privacy practices. Please review their policies before providing information.
                </p>
              </div>

              {/* Section 16 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">16) Changes to This Privacy Policy</h3>
                <p className="text-gray-900 mb-2">
                  We may update this Privacy Policy from time to time. The latest version will be available in the App and/or on our website. If changes are material, we will provide additional notice as required (e.g., in-app notice).
                </p>
              </div>

              {/* Section 17 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">17) Contact Us</h3>
                <p className="text-gray-900 mb-2">
                  For questions, requests, or complaints about privacy, contact:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold">AstroMatch Privacy Team</p>
                  <p className="text-gray-900">
                    📧{" "}
                    <a href="mailto:astromatchchat@gmail.com" className="text-blue-600 hover:underline">
                      astromatchchat@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-900 mt-2">
                    <strong>Controller details:</strong> Harry Bundock Lawyer and Solicitor
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setPrivacyPolicyOpen(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {termsOfServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                AstroMatch – Terms of Service
              </h2>
              <button
                onClick={() => setTermsOfServiceOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto p-6 space-y-6">
              <div className="text-sm text-gray-600">
                <strong>Last Updated:</strong> 17 December 2025
              </div>

              <p className="text-gray-900">
                These Terms of Service (the "Terms") govern your access to and use of AstroMatch's mobile application, websites, and related services (collectively, the "Services"). By creating an account or using the Services, you agree to these Terms.
              </p>
              <p className="text-gray-900 font-semibold">
                If you do not agree, do not use the Services.
              </p>

              {/* Section 1 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1) Who We Are and Contact</h3>
                <p className="text-gray-900 mb-2">
                  The Services are operated by [INSERT LEGAL ENTITY NAME] ("AstroMatch," "we," "us," "our").
                </p>
                <p className="text-gray-900 mb-2">
                  <strong>Contact:</strong> astromatchchat@gmail.com
                </p>
                <p className="text-gray-900 mb-2">
                  <strong>Registered address:</strong> [INSERT ADDRESS]
                </p>
                <p className="text-gray-900">
                  <strong>Country of establishment:</strong> [INSERT COUNTRY]
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2) Eligibility and Age Requirements</h3>
                <p className="text-gray-900 mb-2">You may use the Services only if:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>you are 18 years or older (or the age of majority where you live, if higher);</li>
                  <li>you can form a legally binding contract; and</li>
                  <li>you are not prohibited from using the Services under applicable law.</li>
                </ul>
                <p className="text-gray-900">
                  We do not permit minors. We may suspend or terminate accounts we reasonably believe belong to minors.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3) Account Registration and Security</h3>
                <p className="text-gray-900 mb-2">You are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>providing accurate information when you register;</li>
                  <li>keeping your login credentials secure; and</li>
                  <li>all activity that occurs under your account.</li>
                </ul>
                <p className="text-gray-900">
                  You agree not to share your account or use another person's account without permission.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4) Your Use of the Services</h3>
                <p className="text-gray-900 mb-2">You agree to use the Services lawfully and respectfully.</p>
                <p className="text-gray-900 mb-2">You must not:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>harass, threaten, defame, shame, stalk, or abuse others;</li>
                  <li>post or send content that is illegal, hateful, sexually exploitative, or otherwise harmful;</li>
                  <li>share content depicting or encouraging violence or self-harm;</li>
                  <li>impersonate others or misrepresent your identity;</li>
                  <li>solicit money, financial information, or run scams;</li>
                  <li>share another person's private information without permission ("doxxing");</li>
                  <li>use the Services for commercial solicitation without our written consent;</li>
                  <li>attempt to access or probe our systems, reverse engineer the app, or circumvent security;</li>
                  <li>use bots/scrapers or automated tools without permission; or</li>
                  <li>violate any community guidelines or safety rules we publish.</li>
                </ul>
                <p className="text-gray-900">
                  We may investigate violations and take enforcement action.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5) Community Guidelines, Moderation, and Enforcement</h3>
                <p className="text-gray-900 mb-2">
                  AstroMatch may provide reporting tools and moderation. We may, at our discretion and consistent with applicable law:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>remove or limit visibility of content;</li>
                  <li>restrict features (e.g., messaging);</li>
                  <li>temporarily suspend or permanently ban accounts; and/or</li>
                  <li>refer matters to law enforcement where appropriate.</li>
                </ul>
                <p className="text-gray-900">
                  We may act on reports, automated signals, or other information. We are not obligated to monitor all user content, and we cannot guarantee that all harmful content will be identified or removed.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">6) Dating Safety and User Responsibility</h3>
                <p className="text-gray-900 mb-2">
                  AstroMatch is a platform that helps users meet and communicate. You are responsible for your interactions with others.
                </p>
                <p className="text-gray-900 mb-2">You acknowledge and agree:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>you may encounter content or conduct that is offensive, inaccurate, or inappropriate;</li>
                  <li>you should use caution when communicating with and meeting others;</li>
                  <li>you should never send money or share sensitive financial information with other users; and</li>
                  <li>you will take reasonable steps to protect your personal safety when meeting in person.</li>
                </ul>
                <p className="text-gray-900">
                  To the maximum extent permitted by law, AstroMatch is not responsible for offline conduct or events between users.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">7) Astrology and Compatibility Disclaimer (Entertainment Purposes)</h3>
                <p className="text-gray-900 mb-2">
                  AstroMatch includes astrological profiles, compatibility scores, and related content. You agree and understand:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li><strong>Astrology and compatibility features are provided for entertainment and informational purposes only.</strong></li>
                  <li>They are not professional advice and are not intended to diagnose, treat, cure, or prevent any condition, nor to provide medical, legal, financial, psychological, or relationship counseling.</li>
                  <li>Decisions you make (including relationship decisions) are your responsibility.</li>
                  <li>If you need professional help, seek advice from a qualified professional in your jurisdiction.</li>
                </ul>
              </div>

              {/* Section 8 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">8) User Content and License</h3>
                <p className="text-gray-900 mb-2">
                  User Content includes your profile details, photos, messages, posts, and any content you submit through the Services.
                </p>
                <p className="text-gray-900 mb-2">
                  You retain ownership of your User Content, but you grant AstroMatch a worldwide, non-exclusive, royalty-free, sublicensable license to host, store, reproduce, modify (for formatting), display, and distribute your User Content solely to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>operate, provide, maintain, and improve the Services;</li>
                  <li>display your content to other users according to your settings; and</li>
                  <li>enforce these Terms and protect safety and integrity.</li>
                </ul>
                <p className="text-gray-900 mb-3">
                  This license ends when you delete your content or account, except to the extent we must retain content for legal compliance, dispute resolution, safety, or backups as described in our Privacy Policy.
                </p>
                <p className="text-gray-900">
                  You represent that you have all rights necessary to upload and share your User Content and that it does not violate any laws or third-party rights.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">9) Prohibited Content</h3>
                <p className="text-gray-900 mb-2">You must not upload, post, or transmit content that:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>is illegal or promotes illegal activity;</li>
                  <li>includes sexual content involving minors or exploitation (zero tolerance);</li>
                  <li>is non-consensual intimate imagery (including "revenge porn");</li>
                  <li>contains threats, harassment, hate speech, or incitement of violence;</li>
                  <li>infringes intellectual property rights;</li>
                  <li>contains malware or malicious code; or</li>
                  <li>violates another person's privacy or publicity rights.</li>
                </ul>
                <p className="text-gray-900">
                  We may remove prohibited content and take enforcement action.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">10) Third-Party Services and Links</h3>
                <p className="text-gray-900">
                  The Services may integrate with or link to third-party services. AstroMatch does not control and is not responsible for third-party services, terms, or privacy practices. Your use of those services may be governed by their separate terms.
                </p>
              </div>

              {/* Section 11 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">11) Subscriptions, Purchases, and Billing (If Applicable)</h3>
                <p className="text-gray-900 mb-2">If you purchase subscriptions or in-app features:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>purchases may be processed by Apple, Google, or their payment processors;</li>
                  <li>pricing, taxes, billing periods, and renewal terms will be presented at purchase; and</li>
                  <li>refunds are handled in accordance with the applicable app store's refund policies and local consumer laws.</li>
                </ul>
                <p className="text-gray-900">
                  We may change prices or features in compliance with app store rules and applicable law. Any changes will generally take effect at the next renewal or as otherwise disclosed.
                </p>
              </div>

              {/* Section 12 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">12) Termination</h3>
                <p className="text-gray-900 mb-2">
                  You may stop using the Services or delete your account at any time (subject to in-app controls).
                </p>
                <p className="text-gray-900 mb-2">
                  We may suspend or terminate your access if we believe you violated these Terms, created risk or legal exposure, or if required by law. Where required by law, we will provide notice and/or an opportunity to appeal.
                </p>
              </div>

              {/* Section 13 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">13) Disclaimers</h3>
                <p className="text-gray-900 mb-2">
                  To the maximum extent permitted by law, the Services are provided "as is" and "as available." We do not guarantee that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>the Services will be uninterrupted, secure, or error-free;</li>
                  <li>matches will be accurate or compatible; or</li>
                  <li>content will be accurate, complete, or reliable.</li>
                </ul>
                <p className="text-gray-900 mb-2">
                  We disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement where permitted by law.
                </p>
                <p className="text-gray-900">
                  Some jurisdictions do not allow certain disclaimers, so some of these may not apply to you.
                </p>
              </div>

              {/* Section 14 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">14) Limitation of Liability</h3>
                <p className="text-gray-900 mb-2">To the maximum extent permitted by law:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>
                    AstroMatch will not be liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits/data/goodwill, arising out of or related to your use of the Services.
                  </li>
                  <li>
                    AstroMatch's total liability for any claim will not exceed the greater of: (a) amounts you paid to AstroMatch in the 12 months before the event giving rise to the claim, or (b) USD $100 (or local equivalent), unless applicable law requires otherwise.
                  </li>
                </ul>
                <p className="text-gray-900">
                  Some jurisdictions do not allow limitations of liability, so these limits may not fully apply to you.
                </p>
              </div>

              {/* Section 15 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">15) Indemnity</h3>
                <p className="text-gray-900 mb-2">
                  To the maximum extent permitted by law, you agree to indemnify and hold AstroMatch harmless from claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900">
                  <li>your use of the Services;</li>
                  <li>your User Content; or</li>
                  <li>your violation of these Terms or applicable law.</li>
                </ul>
              </div>

              {/* Section 16 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">16) Dispute Resolution</h3>
                <p className="text-gray-900">
                  Disputes will be resolved in the courts specified in Section 17.
                </p>
              </div>

              {/* Section 17 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">17) Governing Law and Venue</h3>
                <p className="text-gray-900 mb-2">
                  These Terms are governed by the laws of [INSERT STATE/COUNTRY], without regard to conflict of laws rules, except where your local consumer protection laws require otherwise.
                </p>
                <p className="text-gray-900 mb-2">
                  Exclusive venue for disputes (unless prohibited by law): [INSERT COURTS/LOCATION].
                </p>
                <p className="text-gray-900">
                  Consumers in some jurisdictions may have the right to bring claims in their local courts.
                </p>
              </div>

              {/* Section 18 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">18) Consumer Rights (Global Consumer Notice)</h3>
                <p className="text-gray-900">
                  Nothing in these Terms limits rights you may have under applicable consumer protection laws (including statutory guarantees that cannot be excluded). If a disclaimer, limitation, or clause is not enforceable in your jurisdiction, it will apply only to the extent permitted.
                </p>
              </div>

              {/* Section 19 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">19) Changes to the Services and Terms</h3>
                <p className="text-gray-900">
                  We may update the Services and these Terms. If we make material changes, we will provide notice (e.g., in-app notice). Continued use after the effective date of updated Terms means you accept the updated Terms, to the extent allowed by law.
                </p>
              </div>

              {/* Section 20 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">20) Miscellaneous</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-900">
                  <li><strong>Severability:</strong> If any provision is unenforceable, the remainder remains in effect.</li>
                  <li><strong>Assignment:</strong> You may not assign your rights without our consent. We may assign these Terms as part of a merger or sale.</li>
                  <li><strong>Entire agreement:</strong> These Terms, plus the Privacy Policy and any in-app policies, form the entire agreement.</li>
                  <li><strong>No waiver:</strong> Failure to enforce a provision is not a waiver.</li>
                </ul>
              </div>

              {/* Contact Section */}
              <div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold">Contact Information</p>
                  <p className="text-gray-900">
                    📧{" "}
                    <a href="mailto:astromatchchat@gmail.com" className="text-blue-600 hover:underline">
                      astromatchchat@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setTermsOfServiceOpen(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
