"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { createClient } from "@/lib/supabase/client"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

const BACKROOM_EMAIL = "scottwhite115@gmail.com"

interface ReportedAccount {
  userId: string
  displayName: string
  reportCount: number
  banStatus: string
  status: string
  action: string
  suspensionEndsAt: string | null
  reports: { id: string; reason: string; createdAt: string }[]
}

export default function BackroomPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [reportedAccounts, setReportedAccounts] = useState<ReportedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAccess = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email || user.email.toLowerCase() !== BACKROOM_EMAIL.toLowerCase()) {
        router.replace("/profile/profile")
        return
      }
      setUserEmail(user.email)
    }
    checkAccess()
  }, [router])

  useEffect(() => {
    if (!userEmail) return

    const fetchReports = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/backroom/reports")
        if (!res.ok) {
          if (res.status === 403) {
            router.replace("/profile/profile")
            return
          }
          throw new Error("Failed to fetch reports")
        }
        const data = await res.json()
        setReportedAccounts(data.reportedAccounts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports")
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [userEmail, router])

  if (!userEmail && !loading) return null

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} profile-page min-h-screen relative pb-24`}
    >
      <header
        className={`sticky top-0 z-50 ${
          theme === "light" ? "bg-white/80 backdrop-blur-sm" : "bg-slate-900/80 backdrop-blur-sm"
        }`}
        style={{ paddingTop: "max(env(safe-area-inset-top), 44px)" }}
      >
        <div className="mx-auto max-w-full px-2 pt-0.5 pb-1.5 sm:px-3 lg:px-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex-1 -ml-8">
              <div className="flex items-center gap-0.5">
                <FourPointedStar className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-lg bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Lunar Backroom
                </span>
              </div>
            </div>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              ) : (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 px-5 pt-4 pb-32">
        {/* Tabs: Profile, Account, Backroom */}
        <div className="flex justify-start gap-8 mb-6 -mt-2">
          <button
            onClick={() => router.push("/profile/profile")}
            className={`relative px-5 py-1.5 text-xl font-medium transition-all duration-200 ${
              theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => router.push("/profile/account")}
            className={`relative px-5 py-1.5 text-xl font-medium transition-all duration-200 ${
              theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Account
          </button>
          <button
            className={`relative px-5 py-1.5 text-xl font-medium transition-all duration-200 ${
              theme === "light" ? "text-purple-600" : "text-purple-400"
            }`}
          >
            Backroom
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
          </button>
        </div>

        <div className="mb-4">
          <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
            Report rules: 3 reports = 1 month ban. 4 reports = permanent ban (email banned).
          </p>
        </div>

        {loading ? (
          <p className={`${theme === "light" ? "text-gray-700" : "text-white/80"}`}>Loading reported accounts...</p>
        ) : error ? (
          <p className={`text-red-500`}>{error}</p>
        ) : reportedAccounts.length === 0 ? (
          <div
            className={`p-8 rounded-lg text-center ${
              theme === "light" ? "bg-gray-100" : "bg-slate-800/40 border border-indigo-500/20"
            }`}
          >
            <p className={`${theme === "light" ? "text-gray-700" : "text-white/80"}`}>No reported accounts yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reportedAccounts.map((account) => (
              <div
                key={account.userId}
                className={`p-4 rounded-lg border ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-slate-800/40 border-indigo-500/20"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {account.displayName}
                    </div>
                    <div className={`text-xs ${theme === "light" ? "text-gray-500" : "text-white/60"}`}>
                      ID: {account.userId.slice(0, 8)}...
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        account.reportCount >= 4
                          ? "bg-red-500/20 text-red-400"
                          : account.reportCount >= 3
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {account.reportCount} report{account.reportCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                    Status: {account.status || "ACTIVE"}
                  </span>
                  <span className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                    Ban: {account.banStatus}
                  </span>
                  <span className={`text-sm font-medium ${theme === "light" ? "text-purple-600" : "text-purple-400"}`}>
                    {account.action}
                  </span>
                </div>
                <details className="mt-2">
                  <summary className={`cursor-pointer text-sm ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                    View {account.reports.length} report(s)
                  </summary>
                  <ul className="mt-2 space-y-1 pl-4">
                    {account.reports.map((r) => (
                      <li key={r.id} className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
                        {r.reason || "No reason"} — {new Date(r.createdAt).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </details>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => router.push(`/profile/backroom/${account.userId}`)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      theme === "light"
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-orange-500/80 hover:bg-orange-600 text-white"
                    }`}
                  >
                    View Profile
                  </button>
                  {account.status !== "BANNED" && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Permanently ban ${account.displayName}? This cannot be undone.`)) return
                        try {
                          const res = await fetch("/api/backroom/ban", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: account.userId }),
                          })
                          const data = await res.json()
                          if (res.ok && data.success) {
                            alert(`${account.displayName} has been banned.`)
                            setReportedAccounts((prev) =>
                              prev.map((a) =>
                                a.userId === account.userId
                                  ? { ...a, status: "BANNED", banStatus: "Permanent (email banned)" }
                                  : a
                              )
                            )
                          } else {
                            alert(`Failed to ban: ${data.error || "Unknown error"}`)
                          }
                        } catch (err) {
                          alert(`Failed to ban: ${err instanceof Error ? err.message : "Unknown error"}`)
                        }
                      }}
                      className="py-2 px-3 rounded-lg text-sm font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                    >
                      Ban
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
