"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"

const Shield = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const Users = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const FileText = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export default function AdminBackoffice() {
  const router = useRouter()
  const { theme } = useTheme()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<"USER" | "ADMIN" | "OWNER">("USER")

  useEffect(() => {
    checkAdminAccess()
  }, [])

  async function checkAdminAccess() {
    try {
      const res = await fetch("/api/admin/check-access")
      const data = await res.json()
      
      if (data.authorized && (data.role === "ADMIN" || data.role === "OWNER")) {
        setIsAuthorized(true)
        setUserRole(data.role)
      } else {
        router.push("/community")
      }
    } catch (error) {
      console.error("Admin access check failed:", error)
      router.push("/community")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`}>
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/community")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              theme === "light" 
                ? "text-gray-700 hover:bg-gray-100" 
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Community</span>
          </button>
          
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-orange-500" />
            <div>
              <h1 className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Admin Backoffice
              </h1>
              <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-white/50"}`}>
                {userRole === "OWNER" ? "Owner Access" : "Admin Access"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <button
            onClick={() => router.push("/admin/users")}
            className={`p-6 rounded-xl border transition-all hover:scale-105 ${
              theme === "light"
                ? "bg-white border-gray-200 hover:border-orange-500 hover:shadow-lg"
                : "bg-slate-800/40 border-indigo-500/20 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
            }`}
          >
            <Users className={`w-12 h-12 mb-4 ${theme === "light" ? "text-orange-600" : "text-orange-400"}`} />
            <h2 className={`text-xl font-bold mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              User Management
            </h2>
            <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              View users, manage suspensions, and handle bans
            </p>
          </button>

          {/* Content Moderation */}
          <button
            onClick={() => router.push("/admin/posts")}
            className={`p-6 rounded-xl border transition-all hover:scale-105 ${
              theme === "light"
                ? "bg-white border-gray-200 hover:border-orange-500 hover:shadow-lg"
                : "bg-slate-800/40 border-indigo-500/20 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
            }`}
          >
            <FileText className={`w-12 h-12 mb-4 ${theme === "light" ? "text-orange-600" : "text-orange-400"}`} />
            <h2 className={`text-xl font-bold mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Content Moderation
            </h2>
            <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
              Hide/unhide posts and manage reported content
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}

