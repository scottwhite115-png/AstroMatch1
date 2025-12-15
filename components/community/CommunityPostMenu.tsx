"use client"

import { useState, useRef, useEffect } from "react"

const MoreVertical = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
)

const Flag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

const Ban = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
)

const EyeOff = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const UserX = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="17" y1="8" x2="22" y2="13" />
    <line x1="22" y1="8" x2="17" y2="13" />
  </svg>
)

const Clock = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

interface CommunityPostMenuProps {
  postId: string
  authorId: string
  authorName?: string
  canModerate: boolean
  isCurrentUser?: boolean
  theme?: "light" | "dark"
  onAction?: () => void
}

export function CommunityPostMenu({
  postId,
  authorId,
  authorName = "this user",
  canModerate,
  isCurrentUser = false,
  theme = "light",
  onAction,
}: CommunityPostMenuProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  async function handleReport() {
    const reason = window.prompt(
      "Why are you reporting this post?\n\nCommon reasons:\n• Harassment or hate speech\n• Spam or misleading\n• Inappropriate content\n• Violence or dangerous content\n• Misinformation"
    )
    if (!reason || reason.trim().length < 5) {
      if (reason !== null) {
        alert("Please provide a detailed reason (at least 5 characters)")
      }
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/community/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, reason: reason.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Failed to submit report.")
      } else {
        setMessage("✓ Report submitted")
        setTimeout(() => {
          setOpen(false)
          setMessage(null)
        }, 2000)
      }
    } catch (e) {
      alert("Network error while submitting report.")
    } finally {
      setLoading(false)
    }
  }

  async function handleBlock() {
    if (
      !confirm(
        `Block ${authorName}?\n\nYou won't see their posts, comments, or messages. They won't be notified.`
      )
    ) {
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/community/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: authorId, action: "BLOCK" }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Failed to block user.")
      } else {
        setMessage("✓ User blocked")
        setTimeout(() => {
          setOpen(false)
          setMessage(null)
          onAction?.()
        }, 1500)
      }
    } catch (e) {
      alert("Network error while blocking user.")
    } finally {
      setLoading(false)
    }
  }

  async function handleHidePost() {
    if (!confirm("Hide this post from all users?\n\nIt will be marked as hidden but not permanently deleted.")) {
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/posts/hide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, isHidden: true }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Failed to hide post.")
      } else {
        setMessage("✓ Post hidden")
        setTimeout(() => {
          setOpen(false)
          setMessage(null)
          onAction?.()
        }, 1500)
      }
    } catch (e) {
      alert("Network error while hiding post.")
    } finally {
      setLoading(false)
    }
  }

  async function handleBan(type: "ONE_WEEK" | "PERMANENT") {
    const label = type === "ONE_WEEK" ? "1-week suspension" : "permanent ban"
    const description = type === "ONE_WEEK" 
      ? "User will be suspended for 7 days. They'll be automatically unbanned after that."
      : "User will be permanently banned until manually unbanned by an admin."
    
    if (!confirm(`Apply ${label} to ${authorName}?\n\n${description}`)) {
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/users/ban-unified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authorId, type }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Failed to update user status.")
      } else {
        setMessage(`✓ ${label} applied`)
        setTimeout(() => {
          setOpen(false)
          setMessage(null)
          onAction?.()
        }, 1500)
      }
    } catch (e) {
      alert("Network error while updating user status.")
    } finally {
      setLoading(false)
    }
  }

  // Don't show menu on own posts (except for admins who might want to hide their own post)
  if (isCurrentUser && !canModerate) {
    return null
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        disabled={loading}
        onClick={() => setOpen((v) => !v)}
        className={`p-1.5 rounded-full transition-colors disabled:opacity-50 ${
          theme === "light"
            ? "text-gray-500 hover:bg-gray-100"
            : "text-gray-400 hover:bg-white/10"
        }`}
        aria-label="Post options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className={`absolute right-0 z-50 mt-1 w-56 rounded-lg border shadow-xl overflow-hidden ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-slate-800 border-slate-700"
        }`}>
          <div className="p-1">
            {/* Report Post */}
            <button
              disabled={loading}
              onClick={handleReport}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
                theme === "light"
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-gray-300 hover:bg-slate-700"
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>Report post</span>
            </button>

            {/* Block User */}
            {!isCurrentUser && (
              <button
                disabled={loading}
                onClick={handleBlock}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-slate-700"
                }`}
              >
                <Ban className="w-4 h-4" />
                <span>Block {authorName}</span>
              </button>
            )}

            {/* Admin Actions */}
            {canModerate && (
              <>
                <div className={`my-1 border-t ${
                  theme === "light" ? "border-gray-200" : "border-slate-700"
                }`} />
                
                {/* Hide Post */}
                <button
                  disabled={loading}
                  onClick={handleHidePost}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
                    theme === "light"
                      ? "text-orange-700 hover:bg-orange-50"
                      : "text-orange-400 hover:bg-orange-900/20"
                  }`}
                >
                  <EyeOff className="w-4 h-4" />
                  <span>Hide post</span>
                </button>

                {/* 1-Week Ban */}
                {!isCurrentUser && (
                  <>
                    <button
                      disabled={loading}
                      onClick={() => handleBan("ONE_WEEK")}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
                        theme === "light"
                          ? "text-amber-700 hover:bg-amber-50"
                          : "text-amber-400 hover:bg-amber-900/20"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>1-week ban</span>
                    </button>

                    {/* Permanent Ban */}
                    <button
                      disabled={loading}
                      onClick={() => handleBan("PERMANENT")}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
                        theme === "light"
                          ? "text-red-700 hover:bg-red-50"
                          : "text-red-400 hover:bg-red-900/20"
                      }`}
                    >
                      <UserX className="w-4 h-4" />
                      <span>Permanent ban</span>
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Status Message */}
          {message && (
            <div className={`px-3 py-2 text-xs border-t ${
              theme === "light"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-green-900/20 text-green-400 border-green-900"
            }`}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

