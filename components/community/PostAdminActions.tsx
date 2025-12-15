"use client"

import { useState, useRef, useEffect } from "react"

const MoreVertical = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
)

const EyeOff = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const Clock = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const Ban = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
)

interface PostAdminActionsProps {
  postId: string
  authorId: string
  authorName?: string
  isHidden?: boolean // Whether post is currently hidden
  canModerate: boolean // true if current user is ADMIN or OWNER
  theme?: "light" | "dark"
  onActionComplete?: () => void
}

export function PostAdminActions({
  postId,
  authorId,
  authorName = "this user",
  isHidden = false,
  canModerate,
  theme = "light",
  onActionComplete,
}: PostAdminActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  if (!canModerate) return null

  async function handleToggleHidePost() {
    const action = isHidden ? "unhide" : "hide"
    const confirmMsg = isHidden
      ? "Unhide this post? It will become visible to all users."
      : "Hide this post? It will no longer be visible to users."
    
    if (!confirm(confirmMsg)) return

    setLoading(true)
    try {
      const res = await fetch("/api/admin/posts/hide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, hide: !isHidden }),
      })

      if (res.ok) {
        const data = await res.json()
        alert(data.message || `Post ${action}d successfully`)
        setIsOpen(false)
        onActionComplete?.()
      } else {
        const error = await res.json()
        alert(`Failed to ${action} post: ${error.error}`)
      }
    } catch (error) {
      console.error(`${action} post error:`, error)
      alert(`Failed to ${action} post`)
    } finally {
      setLoading(false)
    }
  }

  async function handleBanUser(type: "ONE_WEEK" | "PERMANENT") {
    const message =
      type === "ONE_WEEK"
        ? `Suspend ${authorName} for 1 week? They won't be able to post or comment.`
        : `Permanently ban ${authorName}? This action is severe and should only be used for serious violations.`

    if (!confirm(message)) return

    setLoading(true)
    try {
      const res = await fetch("/api/admin/users/ban-unified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authorId, type }),
      })

      if (res.ok) {
        const data = await res.json()
        alert(data.message)
        setIsOpen(false)
        onActionComplete?.()
      } else {
        const error = await res.json()
        alert(`Failed to ban user: ${error.error}`)
      }
    } catch (error) {
      console.error("Ban user error:", error)
      alert("Failed to ban user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* 3-dot menu button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors ${
          theme === "light"
            ? "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            : "text-white/60 hover:bg-white/10 hover:text-white/80"
        }`}
        aria-label="Moderation actions"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute right-0 mt-2 w-64 rounded-lg border shadow-lg z-50 ${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-slate-800 border-slate-700"
          }`}
        >
          <div className="p-2 space-y-1">
            {/* Header */}
            <div className={`px-3 py-2 text-xs font-semibold ${
              theme === "light" ? "text-gray-500" : "text-white/50"
            }`}>
              Moderation Actions
            </div>

            {/* Hide/Unhide post */}
            <button
              disabled={loading}
              onClick={handleToggleHidePost}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left ${
                theme === "light"
                  ? "text-gray-700 hover:bg-gray-100 disabled:text-gray-400"
                  : "text-white/80 hover:bg-white/10 disabled:text-white/40"
              }`}
            >
              <EyeOff className="w-4 h-4 flex-shrink-0" />
              <span>{isHidden ? "Unhide post" : "Hide post"}</span>
            </button>

            {/* Divider */}
            <div className={`my-1 border-t ${
              theme === "light" ? "border-gray-200" : "border-slate-700"
            }`} />

            {/* 1-week ban */}
            <button
              disabled={loading}
              onClick={() => handleBanUser("ONE_WEEK")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left ${
                theme === "light"
                  ? "text-amber-700 hover:bg-amber-50 disabled:text-amber-400"
                  : "text-amber-400 hover:bg-amber-500/10 disabled:text-amber-400/40"
              }`}
            >
              <Clock className="w-4 h-4 flex-shrink-0" />
              <div>
                <div className="font-medium">Suspend 1 week</div>
                <div className={`text-xs ${
                  theme === "light" ? "text-gray-500" : "text-white/50"
                }`}>
                  User can't post or comment
                </div>
              </div>
            </button>

            {/* Permanent ban */}
            <button
              disabled={loading}
              onClick={() => handleBanUser("PERMANENT")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left ${
                theme === "light"
                  ? "text-red-700 hover:bg-red-50 disabled:text-red-400"
                  : "text-red-400 hover:bg-red-500/10 disabled:text-red-400/40"
              }`}
            >
              <Ban className="w-4 h-4 flex-shrink-0" />
              <div>
                <div className="font-medium">Permanent ban</div>
                <div className={`text-xs ${
                  theme === "light" ? "text-gray-500" : "text-white/50"
                }`}>
                  Blocks all access
                </div>
              </div>
            </button>

            {loading && (
              <div className="px-3 py-2 text-xs text-center text-gray-500">
                Processing...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

