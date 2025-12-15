"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { formatDistanceToNow } from "date-fns"
import type { CommunityTopic } from "../../topics"
import { CommunityPostMenu } from "@/components/community/CommunityPostMenu"

type Author = {
  id: string
  displayName: string
  eastWestCode: string
  westSign: string
  chineseSign: string
  photoUrl: string | null
}

type Reply = {
  id: string
  content: string
  createdAt: string
  likeCount: number
  parentId: string | null
  author: Author
}

type Comment = {
  id: string
  content: string
  createdAt: string
  likeCount: number
  author: Author
  replies: Reply[]
}

type Post = {
  id: string
  title: string
  content: string
  topic: string
  type: string
  isHidden: boolean
  createdAt: string
  likeCount: number
  commentCount: number
  author: Author
  comments: Comment[]
}

type Props = {
  post: Post
  topicData: CommunityTopic
  currentUserId: string | null
  canModerate: boolean
}

export function ThreadPageClient({ post, topicData, currentUserId, canModerate }: Props) {
  const { theme } = useTheme()
  const router = useRouter()
  const [replyContent, setReplyContent] = useState("")
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyContent.trim()) return

    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/community/posts/${post.id}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: replyContent.trim(),
            parentId: replyToCommentId,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to post reply")
        }

        setReplyContent("")
        setReplyToCommentId(null)
        router.refresh()
      } catch (err: any) {
        setError(err.message || "Failed to post reply")
      }
    })
  }

  async function handleLikeComment(commentId: string) {
    try {
      const res = await fetch(`/api/community/comments/${commentId}/like`, {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Failed to like comment")
      }

      router.refresh()
    } catch (err) {
      console.error("Like error:", err)
    }
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Post Card */}
      <article className={`rounded-xl border p-5 ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-slate-900/60 border-slate-700"
      }`}>
        {/* Hidden Badge (for admins) */}
        {post.isHidden && canModerate && (
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
              theme === "light"
                ? "bg-orange-100 text-orange-700"
                : "bg-orange-900/30 text-orange-400"
            }`}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              Hidden Post (visible to staff only)
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Type badge */}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              post.type === "QUESTION"
                ? theme === "light"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-blue-950/50 text-blue-300"
                : theme === "light"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-purple-950/50 text-purple-300"
            }`}>
              {post.type === "QUESTION" ? "Question" : "Story"}
            </span>

            {/* Topic chip */}
            <span className={`text-[10px] font-medium ${
              theme === "light" ? "text-gray-500" : "text-slate-500"
            }`}>
              {topicData.hashtag}
            </span>
          </div>

          {/* 3-Dot Menu */}
          <CommunityPostMenu
            postId={post.id}
            authorId={post.author.id}
            authorName={post.author.displayName}
            canModerate={canModerate}
            isCurrentUser={currentUserId === post.author.id}
            theme={theme}
            onAction={() => router.refresh()}
          />
        </div>

        {/* Title */}
        <h1 className={`text-lg font-bold mb-3 ${
          theme === "light" ? "text-gray-900" : "text-slate-50"
        }`}>
          {post.title}
        </h1>

        {/* Author */}
        <div className={`flex items-center gap-2 mb-4 pb-3 border-b ${
          theme === "light" ? "border-gray-200" : "border-slate-700"
        }`}>
          <span className={`text-xs font-medium ${
            theme === "light" ? "text-gray-700" : "text-slate-300"
          }`}>
            {post.author.displayName}
          </span>
          {post.author.eastWestCode && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              theme === "light"
                ? "bg-gray-100 text-gray-600"
                : "bg-slate-800 text-slate-300"
            }`}>
              {post.author.eastWestCode}
            </span>
          )}
          <span className={`text-[10px] ${
            theme === "light" ? "text-gray-500" : "text-slate-500"
          }`}>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Content */}
        <div className={`text-sm whitespace-pre-wrap ${
          theme === "light" ? "text-gray-800" : "text-slate-200"
        }`}>
          {post.content}
        </div>
      </article>

      {/* Reply Composer */}
      <div className={`rounded-xl border p-4 ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-slate-900/60 border-slate-700"
      }`}>
        <h3 className={`text-sm font-semibold mb-3 ${
          theme === "light" ? "text-gray-900" : "text-slate-50"
        }`}>
          {replyToCommentId ? "Reply to comment" : "Add a reply"}
        </h3>

        <form onSubmit={handleSubmitReply} className="space-y-3">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
            placeholder="Share your thoughts..."
            maxLength={2000}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/70 resize-none ${
              theme === "light"
                ? "border-gray-300 bg-white text-gray-900"
                : "border-slate-700 bg-slate-950/60 text-slate-50"
            }`}
          />

          {error && (
            <p className="text-xs text-rose-400">{error}</p>
          )}

          <div className="flex items-center justify-between">
            {replyToCommentId && (
              <button
                type="button"
                onClick={() => setReplyToCommentId(null)}
                className={`text-xs ${
                  theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel reply
              </button>
            )}
            <div className="flex-1" />
            <button
              type="submit"
              disabled={!replyContent.trim() || isPending}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-colors"
            >
              {isPending ? "Posting..." : "Reply"}
            </button>
          </div>
        </form>
      </div>

      {/* Comments Section */}
      <div className="space-y-3">
        <h3 className={`text-sm font-semibold ${
          theme === "light" ? "text-gray-900" : "text-slate-50"
        }`}>
          {post.commentCount} {post.commentCount === 1 ? "Reply" : "Replies"}
        </h3>

        {post.comments.length === 0 && (
          <p className={`text-xs ${
            theme === "light" ? "text-gray-500" : "text-slate-500"
          }`}>
            No replies yet. Be the first to respond!
          </p>
        )}

        {post.comments.map((comment) => (
          <div key={comment.id}>
            {/* Top-level comment */}
            <div className={`rounded-xl border p-4 ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-slate-900/60 border-slate-700"
            }`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${
                    theme === "light" ? "text-gray-700" : "text-slate-300"
                  }`}>
                    {comment.author.displayName}
                  </span>
                  {comment.author.eastWestCode && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      theme === "light"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-slate-800 text-slate-300"
                    }`}>
                      {comment.author.eastWestCode}
                    </span>
                  )}
                  <span className={`text-[10px] ${
                    theme === "light" ? "text-gray-500" : "text-slate-500"
                  }`}>
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <p className={`text-sm mb-3 ${
                theme === "light" ? "text-gray-800" : "text-slate-200"
              }`}>
                {comment.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`text-[10px] flex items-center gap-1 ${
                    theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {comment.likeCount}
                </button>
                <button
                  onClick={() => setReplyToCommentId(comment.id)}
                  className={`text-[10px] ${
                    theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Reply
                </button>
              </div>
            </div>

            {/* Nested replies */}
            {comment.replies.length > 0 && (
              <div className="ml-6 mt-2 space-y-2">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`rounded-lg border p-3 ${
                      theme === "light"
                        ? "bg-gray-50 border-gray-200"
                        : "bg-slate-950/40 border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${
                          theme === "light" ? "text-gray-700" : "text-slate-300"
                        }`}>
                          {reply.author.displayName}
                        </span>
                        {reply.author.eastWestCode && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            theme === "light"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-slate-800 text-slate-300"
                          }`}>
                            {reply.author.eastWestCode}
                          </span>
                        )}
                        <span className={`text-[10px] ${
                          theme === "light" ? "text-gray-500" : "text-slate-500"
                        }`}>
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <p className={`text-xs ${
                      theme === "light" ? "text-gray-700" : "text-slate-300"
                    }`}>
                      {reply.content}
                    </p>

                    {/* Like button */}
                    <button
                      onClick={() => handleLikeComment(reply.id)}
                      className={`mt-2 text-[10px] flex items-center gap-1 ${
                        theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {reply.likeCount}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


