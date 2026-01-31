"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { createClient } from "@/lib/supabase/client"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

const MessageCircle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const BACKROOM_EMAIL = "scottwhite115@gmail.com"

export default function BackroomProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.userId as string
  const { theme, setTheme } = useTheme()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [banning, setBanning] = useState(false)
  const [banned, setBanned] = useState(false)

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
    if (!userEmail || !userId) return

    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/backroom/profile/${userId}`)
        if (!res.ok) {
          if (res.status === 403) {
            router.replace("/profile/profile")
            return
          }
          throw new Error("Failed to load profile")
        }
        const data = await res.json()
        setProfile(data.profile)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [userEmail, userId, router])

  const handleBan = async () => {
    if (!confirm(`Permanently ban ${profile?.display_name || "this user"}? This action cannot be undone.`)) return
    setBanning(true)
    try {
      const res = await fetch("/api/backroom/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setBanned(true)
        setProfile((p: any) => (p ? { ...p, status: "BANNED" } : p))
        alert(`User has been permanently banned.`)
      } else {
        alert(`Failed to ban: ${data.error || "Unknown error"}`)
      }
    } catch (err) {
      alert(`Failed to ban: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setBanning(false)
    }
  }

  const handleMessage = () => {
    router.push(`/messages/${userId}`)
  }

  if (!userEmail && !loading) return null

  return (
    <div
      className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} min-h-screen pb-24`}
    >
      <header
        className={`sticky top-0 z-50 ${
          theme === "light" ? "bg-white/80 backdrop-blur-sm" : "bg-slate-900/80 backdrop-blur-sm"
        }`}
        style={{ paddingTop: "max(env(safe-area-inset-top), 44px)" }}
      >
        <div className="mx-auto max-w-full px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => router.push("/profile/backroom")}
            className="p-2 -ml-2"
            aria-label="Back"
          >
            <ArrowLeft className={`w-5 h-5 ${theme === "light" ? "text-gray-700" : "text-white"}`} />
          </button>
          <div className="flex items-center gap-2">
            <FourPointedStar className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-lg bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Backroom Profile
            </span>
          </div>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2"
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
      </header>

      <div className="px-5 pt-4 pb-32">
        {loading ? (
          <p className={`${theme === "light" ? "text-gray-700" : "text-white/80"}`}>Loading profile...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : profile ? (
          <>
            {/* Profile header */}
            <div className="mb-6">
              <div className="relative w-full aspect-[3/4] max-h-[400px] rounded-xl overflow-hidden bg-gray-200">
                {(profile.photos?.[0] || profile.photo_url) ? (
                  <img
                    src={profile.photos?.[0] || profile.photo_url}
                    alt={profile.display_name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${theme === "light" ? "bg-gray-200 text-gray-500" : "bg-slate-800 text-white/60"}`}>
                    No photo
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h1 className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                  {profile.display_name || "Unknown"}
                </h1>
                <p className={`text-base ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  {(() => {
                    const age = profile.age ?? (profile.birthdate ? new Date().getFullYear() - new Date(profile.birthdate).getFullYear() : null)
                    const signs = `${profile.western_sign || "—"} / ${profile.chinese_sign || "—"}`
                    return age ? `${age} • ${signs}` : signs
                  })()}
                </p>
                {profile.city && (
                  <p className={`text-sm ${theme === "light" ? "text-gray-500" : "text-white/60"}`}>
                    {profile.city}
                  </p>
                )}
                <p className={`text-xs mt-1 ${theme === "light" ? "text-gray-400" : "text-white/50"}`}>
                  ID: {profile.id}
                </p>
                {(profile.status === "BANNED" || banned) && (
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                    BANNED
                  </span>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className={`mb-6 p-4 rounded-lg ${theme === "light" ? "bg-gray-100" : "bg-slate-800/40"}`}>
                <h3 className={`font-semibold mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}>About</h3>
                <p className={`text-sm whitespace-pre-wrap ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              {profile.status !== "BANNED" && !banned && (
                <>
                  <button
                    onClick={handleMessage}
                    className="w-full py-3 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message (send warning)
                  </button>
                  <button
                    onClick={handleBan}
                    disabled={banning}
                    className="w-full py-3 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium border border-red-500/30 disabled:opacity-50"
                  >
                    {banning ? "Banning..." : "Ban Account Permanently"}
                  </button>
                </>
              )}
              {(profile.status === "BANNED" || banned) && (
                <p className={`text-center text-sm ${theme === "light" ? "text-gray-500" : "text-white/60"}`}>
                  This account has been banned.
                </p>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
