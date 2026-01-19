"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import {
  requestNotificationPermission,
  saveNotificationPreferences,
  loadNotificationPreferences,
  sendTestNotification,
} from "@/lib/utils/notifications"

interface ChatNotificationsPageProps {
  pageIndex?: number
  totalPages?: number
  onNavigatePrev?: () => void
  onNavigateNext?: () => void
}

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

export default function ChatNotificationsPage({
  pageIndex = 0,
  totalPages = 1,
  onNavigatePrev,
  onNavigateNext,
}: ChatNotificationsPageProps = {}) {
  const router = useRouter()
  const { theme } = useTheme()

  const [pushNotifications, setPushNotifications] = useState({
    messages: true,
  })

  useEffect(() => {
    const savedPreferences = loadNotificationPreferences()
    setPushNotifications(savedPreferences)
  }, [])

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

    // TODO: When you integrate with backend in Cursor, send preferences to server
    // Example: await updateUserNotificationPreferences(userId, newPreferences)

    console.log("[v0] Notification preferences updated:", newPreferences)
  }

  return (
    <div
      className={`${theme === "starlight" ? "astrology-cosmic-bg" : theme === "light" ? "bg-gradient-to-b from-white to-gray-50" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} profile-page min-h-screen relative`}
    >

      <div className="relative z-10">
        {/* Header */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <button
                onClick={onNavigatePrev}
                className="hover:opacity-70 transition-opacity"
                disabled={pageIndex === 0}
              >
                {pageIndex > 0 && <ChevronLeft className="w-7 h-7 text-gray-400 hover:text-white transition-colors" />}
              </button>
            </div>
            <h1
              className={`font-semibold text-lg whitespace-nowrap ${theme === "starlight" ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent" : "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent"}`}
            >
              Chat & Notifications
            </h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={onNavigateNext}
                className="hover:opacity-70 transition-opacity"
                disabled={pageIndex >= totalPages - 1}
              >
                <ChevronRight className="w-7 h-7 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 pb-8">
          {/* Push Notifications Section */}
          <div className="mb-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-orange-500/30">
                <div>
                  <div className="text-white font-medium">Messages</div>
                  <div className="text-white/60 text-sm">Get notified when you receive a message</div>
                </div>
                <button
                  onClick={() => togglePushNotification("messages")}
                  className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors ${
                    pushNotifications.messages
                      ? "bg-gradient-to-r from-orange-500 to-red-500"
                      : theme === "starlight"
                        ? "bg-white/20"
                        : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      pushNotifications.messages ? "translate-x-[26px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
