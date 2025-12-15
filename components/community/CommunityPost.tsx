// components/community/CommunityPost.tsx
// Complete example of a post component with admin moderation
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { PostAdminActions } from "@/components/community/PostAdminActions"

interface CommunityPostProps {
  post: {
    id: string
    title: string
    content: string
    topic: string
    type: "STORY" | "QUESTION"
    createdAt: Date
    likeCount: number
    commentCount: number
    isHidden: boolean
    authorId: string
    author: {
      id: string
      display_name: string | null
      east_west_code: string | null
      chinese_sign: string | null
      photo_url: string | null
    }
  }
}

export async function CommunityPost({ post }: CommunityPostProps) {
  const profile = await getCurrentProfileWithRole()
  const canModerate =
    profile && (profile.role === "ADMIN" || profile.role === "OWNER")

  // Hide posts from normal users if marked as hidden
  if (post.isHidden && !canModerate) {
    return null
  }

  // Format date
  const postDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <article className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Hidden badge for moderators */}
      {post.isHidden && canModerate && (
        <div className="mb-3 inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
          Hidden Post (visible to moderators only)
        </div>
      )}

      {/* Header: Author info + Admin Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Author avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {post.author.display_name?.[0]?.toUpperCase() || "?"}
          </div>

          {/* Author info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {post.author.display_name || "Anonymous"}
              </h3>
              {post.author.east_west_code && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                  {post.author.east_west_code}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <span>{postDate}</span>
              <span>•</span>
              <span className="capitalize">{post.topic}</span>
            </div>
          </div>
        </div>

        {/* Admin moderation menu (3-dot) */}
        <PostAdminActions
          postId={post.id}
          authorId={post.authorId}
          authorName={post.author.display_name || "Anonymous"}
          isHidden={post.isHidden}
          canModerate={!!canModerate}
          onActionComplete={() => {
            // In a real app, you might want to use revalidatePath or router.refresh()
            // For now, a simple page reload works
            if (typeof window !== "undefined") {
              window.location.reload()
            }
          }}
        />
      </div>

      {/* Post type badge */}
      <div className="mb-2">
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
            post.type === "STORY"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          }`}
        >
          {post.type === "STORY" ? "📖 Story" : "❓ Question"}
        </span>
      </div>

      {/* Post title */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {post.title}
      </h2>

      {/* Post content */}
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
        {post.content.length > 300
          ? post.content.substring(0, 300) + "..."
          : post.content}
      </p>

      {/* Footer: Like and comment counts */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-slate-700">
        <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          <span>{post.likeCount}</span>
        </button>

        <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>{post.commentCount}</span>
        </button>
      </div>
    </article>
  )
}

