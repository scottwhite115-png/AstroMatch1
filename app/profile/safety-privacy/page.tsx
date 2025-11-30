"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { getBlockedUsers, unblockUser, type BlockedUser } from "@/lib/utils/blocked-users"
import {
  requestNotificationPermission,
  saveNotificationPreferences,
  loadNotificationPreferences,
  sendTestNotification,
} from "@/lib/utils/notifications"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

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

const Mail = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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

interface SafetyPrivacyPageProps {
  pageIndex?: number
  totalPages?: number
  onNavigatePrev?: () => void
  onNavigateNext?: () => void
}

export default function SafetyPrivacyPage({
  pageIndex,
  totalPages,
  onNavigatePrev,
  onNavigateNext,
}: SafetyPrivacyPageProps = {}) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([])
  const [guidelinesOpen, setGuidelinesOpen] = useState(false)
  const [pushNotifications, setPushNotifications] = useState({
    messages: true,
  })

  useEffect(() => {
    setBlockedUsers(getBlockedUsers())

    const savedPreferences = loadNotificationPreferences()
    setPushNotifications(savedPreferences)
  }, [])

  const handleUnblock = (userId: number) => {
    unblockUser(userId)
    setBlockedUsers(getBlockedUsers())
  }

  const togglePushNotification = async (setting: keyof typeof pushNotifications) => {
    const newValue = !pushNotifications[setting]

    // If turning ON, request permission first
    if (newValue) {
      const permissionGranted = await requestNotificationPermission()
      if (!permissionGranted) {
        alert("Please enable notifications in your browser settings to receive message alerts")
        return
      }

      // Send a test notification to confirm it's working
      sendTestNotification("Notifications Enabled", "You'll now receive notifications for new messages")
    }

    // Update state
    const newPreferences = {
      ...pushNotifications,
      [setting]: newValue,
    }
    setPushNotifications(newPreferences)

    // Save to localStorage
    saveNotificationPreferences(newPreferences)

    console.log("[v0] Notification preferences updated:", newPreferences)
  }

  const safetyResources = [
    {
      name: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      url: "https://www.thehotline.org",
    },
    {
      name: "1800RESPECT",
      phone: "1800 737 732",
      url: "https://1800respect.org.au/?utm_source=Google+Hotline+DV+One+Box&utm_medium=search&utm_campaign=DV+One+Box&utm_id=GHOB&utm_term=domestic+violence",
    },
    {
      name: "Beyond Blue",
      phone: "1300 22 4636",
      url: "https://www.beyondblue.org.au",
    },
  ]

  const communityGuidelines = [
    "Be respectful and kind to all users",
    "No harassment, hate speech, or discriminatory behavior",
    "Keep conversations appropriate and consensual",
    "Don't share personal information too quickly",
    "Report suspicious or concerning behavior",
    "Respect boundaries and consent",
    "Don't use the platform for commercial purposes",
    "Be honest in your profile and interactions",
  ]

  const handleContactSupport = () => {
    window.location.href = "mailto:astromatchchat@gmail.com?subject=Support Request"
  }

  const handlePrevious = () => {
    if (onNavigatePrev) {
      onNavigatePrev()
    } else {
      router.push("/profile/account")
    }
  }

  const handleNext = () => {
    if (onNavigateNext) {
      onNavigateNext()
    } else {
      router.push("/profile/profile")
    }
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
        <div className="px-5 py-4">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => router.push("/profile/profile")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  theme === "light"
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-slate-800/40 text-white/70 hover:bg-slate-800/60"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => router.push("/profile/account")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  theme === "light"
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-slate-800/40 text-white/70 hover:bg-slate-800/60"
                }`}
              >
                Account
              </button>
              <button
                onClick={() => router.push("/profile/safety-privacy")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  theme === "light"
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-purple-600/90 text-white shadow-lg"
                }`}
              >
                Safety & Privacy
              </button>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <button
                onClick={handlePrevious}
                className="hover:opacity-70 transition-opacity invisible"
                aria-label="Previous"
              >
                <ChevronLeft className={`w-7 h-7 ${theme === "light" ? "!text-gray-500 hover:!text-gray-600" : "!text-gray-400 hover:!text-gray-300"} transition-colors`} />
              </button>
            </div>
            <h1 className="font-semibold text-2xl whitespace-nowrap bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              Safety & Privacy
            </h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleNext}
                className="hover:opacity-70 transition-opacity"
                aria-label="Next"
              >
                <ChevronRight className={`w-7 h-7 ${theme === "light" ? "!text-gray-500 hover:!text-gray-600" : "!text-gray-400 hover:!text-gray-300"} transition-colors`} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 pb-32">
          {/* Notifications Section */}
          <div className="mb-8">
            <h2
              className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
            >
              <span role="img" aria-label="bell">🔔</span>
              Notifications
            </h2>
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-4 ${theme === "light" ? "bg-gray-100" : "bg-slate-800/40 border border-indigo-500/20 shadow-lg shadow-indigo-950/30"} backdrop-blur-sm rounded-lg`}>
                <div>
                  <div className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium`}>Messages</div>
                  <div className={`${theme === "light" ? "!text-black/60" : "!text-white/60"} text-sm`}>Get notified when you receive a message</div>
                </div>
                <button
                  onClick={() => togglePushNotification("messages")}
                  className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors ${
                    pushNotifications.messages
                      ? "bg-gray-300"
                      : "bg-transparent border border-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transition-all ${
                      pushNotifications.messages ? "translate-x-[26px]" : "translate-x-0.5 border border-gray-300"
                    }`}
                    style={!pushNotifications.messages ? { position: 'absolute', top: '50%', transform: 'translateY(-50%) translateX(2px)' } : {}}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Report & Block Management Section */}
          <div className="mb-8">
            <h2
              className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
            >
              <span role="img" aria-label="shield">🛡️</span>
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

          {/* Safety Resources Section */}
          <div className="mb-8">
            <h2
              className="font-semibold text-base mb-4 text-rank-purple/90 dark:text-purple-300 flex items-center gap-2"
            >
              <span role="img" aria-label="lifebuoy">🆘</span>
              Safety Resources
            </h2>
            <div className="space-y-3">
              {safetyResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-4 ${theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "bg-slate-800/40 border border-indigo-500/20 hover:bg-slate-800/60 hover:border-indigo-400/40"} backdrop-blur-sm rounded-lg transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`${theme === "light" ? "!text-black/95" : "!text-white/95"} font-medium mb-1`}>{resource.name}</div>
                      <div className="text-blue-400 text-sm">{resource.phone}</div>
                    </div>
                    <ExternalLink className={`w-5 h-5 ${theme === "light" ? "!text-black/50" : "!text-white/50"} flex-shrink-0 ml-2`} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Support Section */}
          <div className="mb-8">
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
          <div className="mb-8">
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

        </div>
      </div>

    </div>
  )
}
