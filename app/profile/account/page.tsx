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

    const savedInstantMessage = localStorage.getItem("instantMessageEnabled")
    if (savedInstantMessage !== null) {
      setInstantMessageEnabled(JSON.parse(savedInstantMessage))
    }

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

  const toggleInstantMessage = () => {
    const newValue = !instantMessageEnabled
    setInstantMessageEnabled(newValue)
    localStorage.setItem("instantMessageEnabled", JSON.stringify(newValue))
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
        "pushNotifications",
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
      <div className="relative z-10">
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AstroMatch
              </span>
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
          </div>
        </div>

        {/* Horizontal Tabs Navigation */}
        <div className="px-5 py-4 border-b" style={{ 
          borderColor: theme === "light" ? "#e5e7eb" : "rgba(255, 255, 255, 0.1)"
        }}>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
            <div className="flex gap-1 min-w-max">
              <button
                onClick={() => router.push("/profile/profile")}
                className={`relative px-5 py-2.5 font-medium transition-all duration-200 whitespace-nowrap ${
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
                className={`relative px-5 py-2.5 font-medium transition-all duration-200 whitespace-nowrap ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Account
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full`} />
              </button>
              <button
                onClick={() => router.push("/profile/safety-privacy")}
                className={`relative px-5 py-2.5 font-medium transition-all duration-200 whitespace-nowrap ${
                  theme === "light"
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Safety & Privacy
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600 rounded-full transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => router.push("/profile/profile")}
                className="hover:opacity-70 transition-opacity invisible"
              >
                <ChevronLeft className={`w-7 h-7 ${theme === "light" ? "!text-gray-500 hover:!text-gray-600" : "!text-gray-400 hover:!text-gray-300"} transition-colors`} />
              </button>
            </div>
            <h1 className="font-semibold text-2xl whitespace-nowrap bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              Account
            </h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => router.push("/profile/safety-privacy")}
                className="hover:opacity-70 transition-opacity"
              >
                <ChevronRight className={`w-7 h-7 ${theme === "light" ? "!text-gray-500 hover:!text-gray-600" : "!text-gray-400 hover:!text-gray-300"} transition-colors`} />
              </button>
            </div>
          </div>
        </div>

        {/* Account Content */}
        <div className="px-5 pb-24">
          <div className="max-w-md mx-auto space-y-8">

            {/* Instant Message Section */}
            <div>
              <h2
                className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
              >
                <span role="img" aria-label="lightning">⚡</span>
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
                        ? "bg-gray-300"
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
                className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
              >
                <span role="img" aria-label="handshake">🤝</span>
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
                        ? "bg-gray-300"
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
                className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
              >
                <span role="img" aria-label="sun">☀️</span>
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
                        ? "bg-gray-300"
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
                className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
              >
                <span role="img" aria-label="user">👤</span>
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
                className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
              >
                <span role="img" aria-label="lock">🔒</span>
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

            <div>
              <h2
                className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
              >
                <span role="img" aria-label="link">🔗</span>
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
                className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
              >
                <span role="img" aria-label="headphones">🎧</span>
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
                className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
              >
                <span role="img" aria-label="book">📖</span>
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
                className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
              >
                <span role="img" aria-label="scale">⚖️</span>
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
                className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
              >
                <span role="img" aria-label="warning">⚠️</span>
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
              <div className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium`}>1.0.0 (Build 2024.03)</div>
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
                <strong>Effective Date:</strong> 11th October 2025
              </div>

              <p className="text-gray-900">
                Welcome to <strong>AstroMatch</strong>, a dating and astrology-based app ("the App", "we", "us", or
                "our").
              </p>
              <p className="text-gray-900">
                Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect
                your information when you use AstroMatch.
              </p>

              {/* Section 1 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h3>
                <p className="text-gray-900 mb-3">
                  We collect information that helps us provide you with the best experience possible. This includes:
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">1.1. Information You Provide</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
                  <li>
                    <strong>Account details:</strong> Name, date of birth, email, gender, and any profile information
                    you choose to share.
                  </li>
                  <li>
                    <strong>Optional birth details:</strong> Time and place of birth (if you choose to add them for more
                    accurate astrological matching).
                  </li>
                  <li>
                    <strong>Preferences:</strong> Match settings, compatibility interests, and profile preferences.
                  </li>
                  <li>
                    <strong>User content:</strong> Photos, bios, and chat messages shared within the app.
                  </li>
                  <li>
                    <strong>Support requests:</strong> Information you send when contacting our support team.
                  </li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">1.2. Automatically Collected Information</h4>
                <p className="text-gray-900 mb-2">
                  When you use AstroMatch, we automatically collect limited technical information, such as:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
                  <li>Device type, operating system, and app version</li>
                  <li>IP address and general location (country or region)</li>
                  <li>Usage logs (e.g., feature interactions, crash data, and diagnostics)</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">1.3. Cookies and Analytics</h4>
                <p className="text-gray-900">
                  We may use analytics tools and cookies to understand user behaviour and improve the app experience.
                  These do not identify you personally.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h3>
                <p className="text-gray-900 mb-2">We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>Create and manage your AstroMatch profile</li>
                  <li>Match you with compatible users based on your astrological data and preferences</li>
                  <li>Enable chatting and connection between users</li>
                  <li>Improve app functionality, performance, and safety</li>
                  <li>Communicate with you about updates, matches, and support</li>
                  <li>Comply with legal obligations</li>
                </ul>
                <p className="text-gray-900 font-semibold">We will never sell your personal data.</p>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. How We Store and Protect Your Data</h3>
                <p className="text-gray-900 mb-3">
                  AstroMatch uses Superbase for secure data storage and industry-standard encryption to protect your
                  information.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900">
                  <li>
                    Your data is stored on secure servers located in regions compliant with applicable privacy laws.
                  </li>
                  <li>Access to personal data is limited to authorised personnel.</li>
                  <li>Sensitive information (such as passwords) is hashed or encrypted.</li>
                  <li>We regularly review our systems to maintain security and compliance.</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Data Sharing and Disclosure</h3>
                <p className="text-gray-900 mb-2">We only share your information when necessary:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900">
                  <li>
                    <strong>With other users:</strong> Only the details you choose to make visible in your profile or
                    chat.
                  </li>
                  <li>
                    <strong>With service providers:</strong> For functions like hosting, analytics, or customer support
                    — all under strict confidentiality agreements.
                  </li>
                  <li>
                    <strong>When required by law:</strong> To comply with legal or regulatory obligations, or to prevent
                    harm or fraud.
                  </li>
                </ul>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. International Data Transfers</h3>
                <p className="text-gray-900 mb-2">AstroMatch may process data in multiple countries.</p>
                <p className="text-gray-900">
                  If your data is transferred outside your home country, we ensure it is protected by comparable privacy
                  standards, consistent with the Australian Privacy Act and international regulations like the GDPR.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights and Choices</h3>
                <p className="text-gray-900 mb-2">Depending on your location, you may have rights to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>Access, correct, or delete your personal data</li>
                  <li>Withdraw consent for optional data (like birth time)</li>
                  <li>Request a copy of your data</li>
                  <li>Object to processing or data sharing</li>
                  <li>Close your account at any time via the app settings</li>
                </ul>
                <p className="text-gray-900">
                  To exercise these rights, please contact us at{" "}
                  <a href="mailto:astromatchchat@gmail.com" className="text-blue-600 hover:underline">
                    astromatchchat@gmail.com
                  </a>
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">7. Data Retention</h3>
                <p className="text-gray-900 mb-2">
                  We retain your data for as long as your account is active or as needed to provide our services.
                </p>
                <p className="text-gray-900">
                  If you delete your account, we will remove or anonymise your personal information within a reasonable
                  timeframe, unless required by law to retain it.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">8. Children's Privacy</h3>
                <p className="text-gray-900 mb-2">AstroMatch is intended for users 18 years and older.</p>
                <p className="text-gray-900">
                  We do not knowingly collect data from minors. If we become aware of such data, we delete it promptly.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">9. Third-Party Links</h3>
                <p className="text-gray-900 mb-2">
                  AstroMatch may contain links to third-party websites or services (e.g., payment gateways).
                </p>
                <p className="text-gray-900">
                  We are not responsible for their privacy practices, and we encourage you to review their policies.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h3>
                <p className="text-gray-900 mb-2">We may update this Privacy Policy from time to time.</p>
                <p className="text-gray-900 mb-2">
                  The latest version will always be available within the app settings and on our website.
                </p>
                <p className="text-gray-900">Material changes will be clearly communicated.</p>
              </div>

              {/* Section 11 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">11. Contact Us</h3>
                <p className="text-gray-900 mb-2">
                  If you have questions or concerns about this Privacy Policy, or how your data is handled, please
                  contact:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold">AstroMatch Privacy Team</p>
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
                <strong>Effective Date:</strong> 11th October 2025
              </div>

                  <p className="text-gray-900">
                Welcome to <strong>AstroMatch</strong>, a global dating and astrology-based matchmaking app ("the App",
                "we", "us", or "our").
              </p>
                  <p className="text-gray-900">
                By creating an account or using AstroMatch, you agree to these Terms of Service. Please read them
                carefully.
              </p>
                  <p className="text-gray-900 font-semibold">If you do not agree, please do not use the App.</p>

              {/* Section 1 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Eligibility</h3>
                <p className="text-gray-900 mb-2">You must:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>Be at least 18 years old</li>
                  <li>Have the legal capacity to enter into this agreement</li>
                  <li>Provide accurate, truthful information when creating your profile</li>
                </ul>
                <p className="text-gray-900">
                  We reserve the right to suspend or remove accounts that violate these terms or contain false or
                  misleading information.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Your Account</h3>
                <p className="text-gray-900 mb-2">When you register, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>Keep your login credentials secure</li>
                  <li>Not share your account with others</li>
                  <li>Be responsible for all activity under your account</li>
                </ul>
                <p className="text-gray-900">
                  If you suspect unauthorised use, notify us immediately at{" "}
                  <a href="mailto:astromatchchat@gmail.com" className="text-blue-600 hover:underline">
                    astromatchchat@gmail.com
                  </a>
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. User Conduct</h3>
                <p className="text-gray-900 mb-2">AstroMatch is a respectful, inclusive community.</p>
                <p className="text-gray-900 mb-2">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>Use AstroMatch for any illegal, harmful, or discriminatory activity</li>
                  <li>Harass, threaten, or abuse other users</li>
                  <li>Impersonate another person or misrepresent yourself</li>
                  <li>Post content that is pornographic, offensive, or violates others' rights</li>
                  <li>Use bots, scrapers, or automated systems to access the app</li>
                  <li>Interfere with or disrupt the operation of the app</li>
                </ul>
                <p className="text-gray-900">
                  We reserve the right to moderate, restrict, or remove content or accounts that breach these
                  guidelines.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. User Content and Permissions</h3>
                <p className="text-gray-900 mb-2">You own the content you post (photos, bios, messages, etc.).</p>
                <p className="text-gray-900 mb-2">
                  By posting or uploading content on AstroMatch, you grant us a non-exclusive, worldwide, royalty-free
                  licence to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>Display your content within the app</li>
                  <li>Use it to operate, promote, and improve AstroMatch (in ways consistent with this policy)</li>
                </ul>
                <p className="text-gray-900">
                  We will never sell or publicly distribute your private content (such as chats) outside the platform.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. Privacy and Data Protection</h3>
                <p className="text-gray-900 mb-2">Your privacy is very important to us.</p>
                <p className="text-gray-900 mb-2">
                  Our data collection, use, and storage practices are described in our Privacy Policy, which is part of
                  these Terms.
                </p>
                <p className="text-gray-900">
                  By using the app, you consent to the collection and use of information as described in the Privacy
                  Policy.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">6. Payments and Subscriptions (if applicable)</h3>
                <p className="text-gray-900 mb-2">AstroMatch may offer optional premium features or subscriptions.</p>
                <p className="text-gray-900 mb-2">If you choose to purchase these:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>All payments are processed securely through your app store or payment provider</li>
                  <li>Prices may vary by region and currency</li>
                  <li>
                    Subscriptions renew automatically unless cancelled through your store account before the renewal
                    date
                  </li>
                  <li>We do not offer refunds except where required by law (e.g. under the Australian Consumer Law)</li>
                </ul>
              </div>

              {/* Section 7 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">7. Safety and Disclaimer</h3>
                <p className="text-gray-900 mb-2">
                  AstroMatch provides a digital space for people to connect, but we cannot guarantee compatibility,
                  safety, or accuracy of user information.
                </p>
                <p className="text-gray-900 mb-2">Please:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>Exercise caution when communicating or meeting people</li>
                  <li>Avoid sharing personal or financial information too early</li>
                  <li>Report suspicious behaviour through the in-app reporting tools</li>
                </ul>
                <p className="text-gray-900">
                  We do not verify every user profile and are not responsible for user conduct.
                </p>
              </div>

              {/* Section 8 - Entertainment & Astrology Disclaimer */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">8. Entertainment Purposes & Astrology Disclaimer</h3>
                <p className="text-gray-900 mb-2">
                  <strong>AstroMatch is designed for entertainment and social connection purposes only.</strong>
                </p>
                <p className="text-gray-900 mb-2">
                  The astrology-based compatibility matching system, zodiac analysis, and relationship guidance provided 
                  within the app are <strong>not scientifically proven</strong> and should be viewed as fun, light-hearted 
                  tools to help people connect based on shared interests.
                </p>
                <p className="text-gray-900 mb-2">
                  <strong>Important disclaimers:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>
                    <strong>No guarantee of compatibility:</strong> AstroMatch does not guarantee that astrological 
                    compatibility scores will result in successful relationships, friendships, or romantic outcomes.
                  </li>
                  <li>
                    <strong>Not relationship advice:</strong> The app does not provide professional relationship counseling, 
                    therapy, or advice. If you need support for relationship issues, please consult a qualified professional.
                  </li>
                  <li>
                    <strong>No liability for relationship outcomes:</strong> AstroMatch and its operators are not liable 
                    for any relationship problems, breakups, conflicts, emotional distress, or other issues that may arise 
                    from connections made through the app.
                  </li>
                  <li>
                    <strong>User responsibility:</strong> All decisions made based on astrological information, compatibility 
                    scores, or connections formed through AstroMatch are your sole responsibility.
                  </li>
                  <li>
                    <strong>Personal judgment:</strong> We encourage you to use your own judgment, intuition, and common 
                    sense when forming relationships and making important life decisions.
                  </li>
                </ul>
                <p className="text-gray-900 font-semibold">
                  By using AstroMatch, you acknowledge and agree that the app is for entertainment purposes and that 
                  we are not responsible for any relationship outcomes or personal decisions made through the use of 
                  the service.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">9. Intellectual Property</h3>
                <p className="text-gray-900 mb-2">
                  All app content — including design, text, graphics, and software — is owned or licensed by AstroMatch
                  and protected by copyright and trademark laws.
                </p>
                <p className="text-gray-900">
                  You may not copy, modify, distribute, or reverse-engineer any part of the app without our written
                  permission.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">10. Service Availability</h3>
                <p className="text-gray-900 mb-2">
                  We aim to keep AstroMatch running smoothly but cannot guarantee uninterrupted access.
                </p>
                <p className="text-gray-900 mb-2">
                  We may modify, suspend, or discontinue parts of the app at any time without notice.
                </p>
                <p className="text-gray-900">
                  We are not liable for loss or damage caused by temporary downtime or changes.
                </p>
              </div>

              {/* Section 11 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">11. Termination</h3>
                <p className="text-gray-900 mb-2">You may delete your account at any time in the app settings.</p>
                <p className="text-gray-900 mb-2">We may suspend or terminate your access if:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>You violate these Terms</li>
                  <li>Your activity poses a risk to other users or the platform</li>
                  <li>We are required to do so by law</li>
                </ul>
                <p className="text-gray-900">
                  Termination does not affect rights or obligations that have already accrued.
                </p>
              </div>

              {/* Section 12 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">12. Limitation of Liability</h3>
                <p className="text-gray-900 mb-2">To the fullest extent permitted by law:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-3">
                  <li>
                    AstroMatch and its partners are not liable for any indirect, incidental, or consequential damages
                    arising from your use of the app.
                  </li>
                  <li>We provide AstroMatch "as is", without guarantees of uninterrupted or error-free operation.</li>
                </ul>
                <p className="text-gray-900">
                  Some jurisdictions (including under Australian Consumer Law) may not allow limitations on liability —
                  in those cases, your rights remain unaffected.
                </p>
              </div>

              {/* Section 13 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">13. Governing Law</h3>
                <p className="text-gray-900 mb-2">
                  These Terms are governed by the laws of Queensland, Australia, and subject to the jurisdiction of the
                  courts of Queensland.
                </p>
                <p className="text-gray-900">
                  If you access AstroMatch from outside Australia, you are responsible for complying with local laws.
                </p>
              </div>

              {/* Section 14 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">14. Changes to These Terms</h3>
                <p className="text-gray-900 mb-2">We may update these Terms from time to time.</p>
                <p className="text-gray-900 mb-2">
                  If we make significant changes, we'll notify users in-app or via email.
                </p>
                <p className="text-gray-900">
                  The latest version will always be available under Settings → Legal → Terms of Service.
                </p>
              </div>

              {/* Section 15 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">15. Contact Us</h3>
                <p className="text-gray-900 mb-2">
                  If you have questions about these Terms or your rights, please contact:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold">AstroMatch Support</p>
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
