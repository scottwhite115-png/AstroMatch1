"use client"

import { useState, useEffect } from "react"

const Ban = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

interface BlockedUser {
  id: string
  displayName: string | null
  eastWestCode: string | null
  chineseSign: string | null
  photoUrl: string | null
  blockedAt: string
}

interface BlockedUsersListProps {
  theme?: "light" | "dark"
}

export function BlockedUsersList({ theme = "light" }: BlockedUsersListProps) {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [unblocking, setUnblocking] = useState<string | null>(null)

  useEffect(() => {
    fetchBlockedUsers()
  }, [])

  async function fetchBlockedUsers() {
    setLoading(true)
    try {
      const res = await fetch("/api/community/block")
      if (res.ok) {
        const data = await res.json()
        setBlockedUsers(data.blockedUsers || [])
      }
    } catch (error) {
      console.error("Failed to fetch blocked users:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUnblock(userId: string, userName: string) {
    if (!confirm(`Unblock ${userName}?\n\nYou will see their content again.`)) return

    setUnblocking(userId)
    try {
      const res = await fetch("/api/community/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId, action: "UNBLOCK" }),
      })

      if (res.ok) {
        setBlockedUsers((prev) => prev.filter((u) => u.id !== userId))
      } else {
        const data = await res.json()
        alert(data.error || "Failed to unblock user")
      }
    } catch (error) {
      console.error("Unblock error:", error)
      alert("Failed to unblock user")
    } finally {
      setUnblocking(null)
    }
  }

  if (loading) {
    return (
      <div className={`p-8 text-center ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Loading blocked users...
      </div>
    )
  }

  if (blockedUsers.length === 0) {
    return (
      <div className={`p-8 text-center ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
        <Ban className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">No blocked users</p>
        <p className="text-sm mt-1">When you block someone, they'll appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {blockedUsers.map((user) => (
        <div
          key={user.id}
          className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
            theme === "light"
              ? "bg-white border-gray-200 hover:border-gray-300"
              : "bg-slate-800 border-slate-700 hover:border-slate-600"
          }`}
        >
          {/* Avatar */}
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.displayName || "User"}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
              {user.displayName?.[0]?.toUpperCase() || "?"}
            </div>
          )}

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              {user.displayName || "Unnamed User"}
            </div>
            {user.eastWestCode && (
              <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                {user.eastWestCode}
              </div>
            )}
            <div className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
              Blocked {new Date(user.blockedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Unblock Button */}
          <button
            onClick={() => handleUnblock(user.id, user.displayName || "this user")}
            disabled={unblocking === user.id}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === "light"
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            {unblocking === user.id ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Unblock"
            )}
          </button>
        </div>
      ))}

      {/* Count */}
      <div className={`text-center text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
        {blockedUsers.length} blocked {blockedUsers.length === 1 ? "user" : "users"}
      </div>
    </div>
  )
}

