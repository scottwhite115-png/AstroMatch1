"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { createClient } from "@/lib/supabase/client"

interface User {
  id: string
  email: string
  display_name: string | null
  role: "USER" | "ADMIN" | "OWNER"
  status: "ACTIVE" | "SUSPENDED" | "BANNED"
  created_at: string
  photo_url: string | null
}

export default function BackofficePage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [promoteEmail, setPromoteEmail] = useState("")
  const [isPromoting, setIsPromoting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    checkAccessAndLoadUsers()
  }, [])

  async function checkAccessAndLoadUsers() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      // Check if user is OWNER (scottwhite115@gmail.com)
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("id", user.id)
        .single()

      if (!profile || (profile.role !== "OWNER" && profile.email !== "scottwhite115@gmail.com")) {
        router.push("/profile/profile")
        return
      }

      setCurrentUser(profile as any)
      await loadUsers()
    } catch (error) {
      console.error("Access check error:", error)
      router.push("/profile/profile")
    } finally {
      setIsLoading(false)
    }
  }

  async function loadUsers() {
    try {
      const response = await fetch("/api/admin/users?limit=100")
      if (!response.ok) throw new Error("Failed to load users")
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Load users error:", error)
      setMessage({ type: "error", text: "Failed to load users" })
    }
  }

  async function banUser(userId: string) {
    if (!confirm("Are you sure you want to permanently ban this user?")) return

    try {
      const response = await fetch("/api/admin/users/ban-unified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type: "PERMANENT" }),
      })

      const data = await response.json()
      if (data.ok) {
        setMessage({ type: "success", text: `User banned successfully` })
        await loadUsers()
      } else {
        setMessage({ type: "error", text: data.error || "Failed to ban user" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to ban user" })
    }
  }

  async function unbanUser(userId: string) {
    try {
      const response = await fetch("/api/admin/users/ban-unified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type: "UNBAN" }),
      })

      const data = await response.json()
      if (data.ok) {
        setMessage({ type: "success", text: `User unbanned successfully` })
        await loadUsers()
      } else {
        setMessage({ type: "error", text: data.error || "Failed to unban user" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to unban user" })
    }
  }

  async function promoteByEmail() {
    if (!promoteEmail.trim()) {
      setMessage({ type: "error", text: "Please enter an email address" })
      return
    }

    setIsPromoting(true)
    try {
      // First find user by email
      const response = await fetch(`/api/admin/users?email=${encodeURIComponent(promoteEmail.trim())}`)
      const data = await response.json()
      
      if (!data.user) {
        setMessage({ type: "error", text: "User not found with that email" })
        setIsPromoting(false)
        return
      }

      // Then promote to ADMIN
      const promoteResponse = await fetch("/api/admin/users/change-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.user.id, role: "ADMIN" }),
      })

      const promoteData = await promoteResponse.json()
      if (promoteData.ok) {
        setMessage({ type: "success", text: `User ${promoteEmail} promoted to ADMIN` })
        setPromoteEmail("")
        await loadUsers()
      } else {
        setMessage({ type: "error", text: promoteData.error || "Failed to promote user" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to promote user" })
    } finally {
      setIsPromoting(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase()
    return (
      user.email.toLowerCase().includes(query) ||
      (user.display_name && user.display_name.toLowerCase().includes(query))
    )
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-white" : theme === "starlight" ? "bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900" : "bg-slate-900"}`}>
      <div className="max-w-7xl mx-auto px-4" style={{ paddingTop: 'max(env(safe-area-inset-top), 44px)', paddingBottom: '2rem' }}>
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Backoffice
          </h1>
          <p className={`text-sm mt-1 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
            User management and moderation
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {message.text}
            <button
              onClick={() => setMessage(null)}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Promote Admin Section */}
        <div className={`mb-6 p-4 rounded-lg border ${theme === "light" ? "bg-white border-gray-200" : "bg-slate-800 border-slate-700"}`}>
          <h2 className={`text-lg font-semibold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Promote to Admin
          </h2>
          <div className="flex gap-2">
            <input
              type="email"
              value={promoteEmail}
              onChange={(e) => setPromoteEmail(e.target.value)}
              placeholder="Enter email address"
              className={`flex-1 px-4 py-2 rounded-lg border ${
                theme === "light"
                  ? "bg-white border-gray-300 text-gray-900"
                  : "bg-slate-700 border-slate-600 text-white"
              }`}
            />
            <button
              onClick={promoteByEmail}
              disabled={isPromoting}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {isPromoting ? "Promoting..." : "Promote"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email or name..."
            className={`w-full px-4 py-2 rounded-lg border ${
              theme === "light"
                ? "bg-white border-gray-300 text-gray-900"
                : "bg-slate-800 border-slate-700 text-white"
            }`}
          />
        </div>

        {/* Users List */}
        <div className={`rounded-lg border overflow-hidden ${theme === "light" ? "bg-white border-gray-200" : "bg-slate-800 border-slate-700"}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${theme === "light" ? "bg-gray-50" : "bg-slate-700"}`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                    User
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                    Role
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                    Status
                  </th>
                  <th className={`px-4 py-3 text-right text-xs font-medium uppercase ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={`hover:${theme === "light" ? "bg-gray-50" : "bg-slate-700/50"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.photo_url ? (
                          <img
                            src={user.photo_url}
                            alt={user.display_name || "User"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                            {user.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                            {user.display_name || "Unnamed User"}
                          </div>
                          <div className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "OWNER"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : user.role === "ADMIN"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.status === "ACTIVE" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      )}
                      {user.status === "SUSPENDED" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          Suspended
                        </span>
                      )}
                      {user.status === "BANNED" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Banned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {user.status === "BANNED" ? (
                          <button
                            onClick={() => unbanUser(user.id)}
                            className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                          >
                            Unban
                          </button>
                        ) : user.role !== "OWNER" ? (
                          <button
                            onClick={() => banUser(user.id)}
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                          >
                            Ban
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className={`text-center py-12 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

