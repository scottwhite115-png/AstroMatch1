"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

const EyeOff = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const Eye = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

interface Post {
  id: string
  title: string
  content: string
  topic: string
  type: "STORY" | "QUESTION"
  isHidden: boolean
  author: {
    id: string
    display_name: string | null
    western_sign: string | null
    chinese_sign: string | null
  }
  createdAt: string
  likeCount: number
  commentCount: number
}

export default function AdminPostsPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showHidden, setShowHidden] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [showHidden])

  async function loadPosts() {
    try {
      const res = await fetch(`/api/admin/posts?showHidden=${showHidden}`)
      const data = await res.json()
      if (data.posts) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error("Failed to load posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleHidePost(postId: string, hide: boolean) {
    if (!confirm(hide ? "Hide this post?" : "Unhide this post?")) return
    
    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/posts/hide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, hide })
      })
      
      if (res.ok) {
        await loadPosts()
        alert(hide ? "Post hidden" : "Post unhidden")
      }
    } catch (error) {
      console.error("Hide/unhide failed:", error)
      alert("Failed to update post")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDeletePost(postId: string) {
    if (!confirm("Permanently delete this post? This cannot be undone.")) return
    
    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/posts/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId })
      })
      
      if (res.ok) {
        await loadPosts()
        alert("Post deleted")
      }
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete post")
    } finally {
      setActionLoading(false)
    }
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
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
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
              Content Moderation
            </h1>
          </div>
          
          <button
            onClick={() => setShowHidden(!showHidden)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              theme === "light"
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-slate-800 text-white/80 hover:bg-slate-700"
            }`}
          >
            {showHidden ? "Hide Hidden Posts" : "Show Hidden Posts"}
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`p-4 rounded-xl border ${
                post.isHidden 
                  ? theme === "light"
                    ? "bg-red-50 border-red-200"
                    : "bg-red-500/10 border-red-500/20"
                  : theme === "light"
                    ? "bg-white border-gray-200"
                    : "bg-slate-800/40 border-indigo-500/20"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {post.title}
                    </h3>
                    {post.isHidden && (
                      <span className="px-2 py-1 text-xs font-bold rounded bg-red-500 text-white">
                        HIDDEN
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      post.type === "QUESTION"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {post.type}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${theme === "light" ? "text-gray-700" : "text-white/70"}`}>
                    {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                  </p>
                  <div className={`text-xs ${theme === "light" ? "text-gray-500" : "text-white/50"}`}>
                    By {post.author.display_name || "Anonymous"} • {new Date(post.createdAt).toLocaleDateString()} • {post.likeCount} likes • {post.commentCount} comments
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleHidePost(post.id, !post.isHidden)}
                    disabled={actionLoading}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      post.isHidden
                        ? theme === "light"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        : theme === "light"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {post.isHidden ? (
                      <>
                        <Eye className="w-4 h-4 inline mr-1" />
                        Unhide
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 inline mr-1" />
                        Hide
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    disabled={actionLoading}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      theme === "light"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className={`text-center py-12 ${theme === "light" ? "text-gray-500" : "text-white/50"}`}>
              No posts found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

