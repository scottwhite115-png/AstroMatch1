"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

const Ban = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
)

const Clock = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const CheckCircle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

interface User {
  id: string
  display_name: string | null
  email: string | null
  western_sign: string | null
  chinese_sign: string | null
  status: "ACTIVE" | "SUSPENDED" | "BANNED"
  suspensionEndsAt: string | null
  role: "USER" | "ADMIN" | "OWNER"
  created_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSuspendUser(userId: string, days: number) {
    if (!confirm(`Suspend user for ${days} days?`)) return
    
    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/users/suspend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, days })
      })
      
      if (res.ok) {
        await loadUsers()
        setSelectedUser(null)
        alert(`User suspended for ${days} days`)
      }
    } catch (error) {
      console.error("Suspend failed:", error)
      alert("Failed to suspend user")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleBanUser(userId: string, permanent: boolean) {
    if (!confirm(permanent ? "Permanently ban this user?" : "Ban this user?")) return
    
    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/users/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, permanent })
      })
      
      if (res.ok) {
        await loadUsers()
        setSelectedUser(null)
        alert(permanent ? "User permanently banned" : "User banned")
      }
    } catch (error) {
      console.error("Ban failed:", error)
      alert("Failed to ban user")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleUnbanUser(userId: string) {
    if (!confirm("Unban this user?")) return
    
    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/users/unban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      })
      
      if (res.ok) {
        await loadUsers()
        setSelectedUser(null)
        alert("User unbanned")
      }
    } catch (error) {
      console.error("Unban failed:", error)
      alert("Failed to unban user")
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string, suspensionEndsAt: string | null) => {
    if (status === "BANNED") {
      return <span className="px-2 py-1 text-xs font-bold rounded bg-red-500 text-white">BANNED</span>
    }
    if (status === "SUSPENDED") {
      const endsAt = suspensionEndsAt ? new Date(suspensionEndsAt) : null
      return (
        <span className="px-2 py-1 text-xs font-bold rounded bg-yellow-500 text-white">
          SUSPENDED {endsAt ? `until ${endsAt.toLocaleDateString()}` : ""}
        </span>
      )
    }
    return <span className="px-2 py-1 text-xs font-bold rounded bg-green-500 text-white">ACTIVE</span>
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`}>
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/admin")}
            className={`p-2 rounded-lg transition-colors ${
              theme === "light" 
                ? "text-gray-700 hover:bg-gray-100" 
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            User Management
          </h1>
        </div>
      </div>

      {/* Users List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`p-4 rounded-xl border ${
                theme === "light"
                  ? "bg-white border-gray-200"
                  : "bg-slate-800/40 border-indigo-500/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {user.display_name || "Anonymous"}
                    </h3>
                    {getStatusBadge(user.status, user.suspensionEndsAt)}
                    {user.role !== "USER" && (
                      <span className="px-2 py-1 text-xs font-bold rounded bg-purple-500 text-white">
                        {user.role}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
                    {user.western_sign && user.chinese_sign ? `${user.western_sign} ${user.chinese_sign}` : "Signs not set"}
                  </p>
                  <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-white/50"}`}>
                    {user.email || "No email"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {user.status === "ACTIVE" && (
                    <>
                      <button
                        onClick={() => handleSuspendUser(user.id, 7)}
                        disabled={actionLoading || user.role === "OWNER"}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          theme === "light"
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Clock className="w-4 h-4 inline mr-1" />
                        Suspend 7d
                      </button>
                      <button
                        onClick={() => handleBanUser(user.id, false)}
                        disabled={actionLoading || user.role === "OWNER"}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          theme === "light"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Ban className="w-4 h-4 inline mr-1" />
                        Ban
                      </button>
                    </>
                  )}
                  {(user.status === "SUSPENDED" || user.status === "BANNED") && (
                    <button
                      onClick={() => handleUnbanUser(user.id)}
                      disabled={actionLoading}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        theme === "light"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Unban
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

