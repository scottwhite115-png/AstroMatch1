"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface UserAdminControlsProps {
  targetUserId: string
  targetName: string
  currentRole: "USER" | "ADMIN" | "OWNER"
  currentStatus: "ACTIVE" | "SUSPENDED" | "BANNED"
  canChangeRole: boolean
  isOwnAccount: boolean
}

export function UserAdminControls({
  targetUserId,
  targetName,
  currentRole,
  currentStatus,
  canChangeRole,
  isOwnAccount,
}: UserAdminControlsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"USER" | "ADMIN">(
    currentRole === "ADMIN" ? "ADMIN" : "USER"
  )

  async function handleBanAction(type: "ONE_WEEK" | "PERMANENT" | "UNBAN") {
    const confirmMessages = {
      ONE_WEEK: `Suspend ${targetName} for 1 week?\n\nThey won't be able to post, comment, or message during this time. The suspension will automatically lift after 7 days.`,
      PERMANENT: `⚠️ PERMANENTLY BAN ${targetName}?\n\nThis is a severe action that completely blocks their account. They will not be able to access any part of the app.\n\nOnly use this for serious violations.`,
      UNBAN: `Unban ${targetName}?\n\nThis will restore their account to active status and they'll be able to use the app normally again.`,
    }

    if (!confirm(confirmMessages[type])) return

    setLoading(true)
    try {
      const res = await fetch("/api/admin/users/ban-unified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUserId, type }),
      })

      if (res.ok) {
        const data = await res.json()
        alert(
          type === "ONE_WEEK"
            ? "User suspended for 1 week"
            : type === "PERMANENT"
            ? "User permanently banned"
            : "User unbanned successfully"
        )
        router.refresh()
      } else {
        const error = await res.json()
        alert(`Failed: ${error.error}`)
      }
    } catch (error) {
      console.error("Ban action error:", error)
      alert("Failed to update user status")
    } finally {
      setLoading(false)
    }
  }

  async function handleChangeRole() {
    if (!canChangeRole) return

    const action = selectedRole === "ADMIN" ? "promote to Admin" : "demote to User"
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${targetName}?`))
      return

    setLoading(true)
    try {
      const res = await fetch("/api/admin/users/change-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUserId, role: selectedRole }),
      })

      if (res.ok) {
        alert(`Role changed to ${selectedRole}`)
        router.refresh()
      } else {
        const error = await res.json()
        alert(`Failed: ${error.error}`)
      }
    } catch (error) {
      console.error("Change role error:", error)
      alert("Failed to change role")
    } finally {
      setLoading(false)
    }
  }

  if (isOwnAccount) {
    return (
      <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
        You cannot modify your own account.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Account Status Controls */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Account Status
        </h4>

        {currentStatus === "ACTIVE" && (
          <div className="space-y-2">
            <button
              disabled={loading}
              onClick={() => handleBanAction("ONE_WEEK")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-800 dark:text-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div className="text-left flex-1">
                <div className="font-medium">Suspend for 1 Week</div>
                <div className="text-xs opacity-80">Auto-unbans after 7 days</div>
              </div>
            </button>

            <button
              disabled={loading}
              onClick={() => handleBanAction("PERMANENT")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-800 dark:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
              <div className="text-left flex-1">
                <div className="font-medium">Permanent Ban</div>
                <div className="text-xs opacity-80">Blocks all account access</div>
              </div>
            </button>
          </div>
        )}

        {(currentStatus === "SUSPENDED" || currentStatus === "BANNED") && (
          <button
            disabled={loading}
            onClick={() => handleBanAction("UNBAN")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-800 dark:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div className="text-left flex-1">
              <div className="font-medium">Unban / Restore Account</div>
              <div className="text-xs opacity-80">Return to active status</div>
            </div>
          </button>
        )}
      </div>

      {/* Role Management (OWNER only) */}
      {canChangeRole && currentRole !== "OWNER" && (
        <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Role Management <span className="text-xs text-purple-600 dark:text-purple-400">(Owner Only)</span>
          </h4>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as "USER" | "ADMIN")}
                disabled={loading}
                className="flex-1 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <option value="USER">User (Regular Member)</option>
                <option value="ADMIN">Admin (Moderator)</option>
              </select>

              <button
                disabled={loading || selectedRole === currentRole}
                onClick={handleChangeRole}
                className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Saving..." : "Change Role"}
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400">
              Admins can moderate posts and manage users. Only the Owner can promote/demote Admins.
            </p>
          </div>
        </div>
      )}

      {!canChangeRole && currentRole !== "OWNER" && (
        <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Only the Owner can change user roles
          </p>
        </div>
      )}

      {currentRole === "OWNER" && (
        <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <svg
              className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div className="text-xs text-yellow-800 dark:text-yellow-300">
              <p className="font-medium">Owner Account Protected</p>
              <p className="mt-1">Owner accounts cannot be banned or have their role changed.</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

