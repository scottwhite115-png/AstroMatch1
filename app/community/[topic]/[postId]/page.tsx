import { notFound } from "next/navigation"
import { Suspense } from "react"
import { COMMUNITY_TOPICS } from "../../topics"
import { ThreadPageClient } from "./_components/ThreadPageClient"
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { getAllBlockedRelationships } from "@/lib/utils/block-helpers"

type PageProps = {
  params: Promise<{
    topic: string
    postId: string
  }>
}

export default async function ThreadPage({ params }: PageProps) {
  const { topic, postId } = await params

  // Dynamic import to handle Prisma client generation errors gracefully
  let prismaClient: any;
  try {
    prismaClient = await import('@/lib/prisma').then(m => m.default || m.prisma);
  } catch (error) {
    console.error('[ThreadPage] Prisma client not available:', error);
    return (
      <div className="mt-4 rounded-xl border border-amber-800 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-400">
          Database client not initialized. Please run: npx prisma generate
        </p>
        <p className="mt-2 text-xs text-amber-300">
          Error: {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
    );
  }

  // Get current user for moderation
  const currentProfile = await getCurrentProfileWithRole()
  const canModerate = currentProfile?.role === "ADMIN" || currentProfile?.role === "OWNER"

  // Get blocked relationships
  let blockedUserIds: string[] = []
  if (currentProfile) {
    const { all } = await getAllBlockedRelationships(currentProfile.id)
    blockedUserIds = all
  }

  // Validate topic
  const topicData = COMMUNITY_TOPICS.find((t) => t.id === topic)
  if (!topicData) {
    return notFound()
  }

  // Filter hidden posts for non-staff
  const whereClause: any = { id: postId }
  if (!canModerate) {
    whereClause.isHidden = false
  }

  // Build comments where clause (exclude blocked users)
  const commentsWhere: any = {
    parentId: null, // Top-level comments only
  }
  if (blockedUserIds.length > 0) {
    commentsWhere.authorId = {
      notIn: blockedUserIds
    }
  }

  // Build replies where clause (exclude blocked users)
  const repliesWhere: any = {}
  if (blockedUserIds.length > 0) {
    repliesWhere.authorId = {
      notIn: blockedUserIds
    }
  }

  // Fetch post with comments
  // Simplified query - fetch comments separately to avoid relation issues
  let post;
  try {
    post = await prismaClient.post.findUnique({
    where: whereClause,
    select: {
      id: true,
      title: true,
      content: true,
      topic: true,
      type: true,
      isHidden: true,
      createdAt: true,
      likeCount: true,
      upvoteCount: true,
      downvoteCount: true,
      commentCount: true,
      author: {
        select: {
          id: true,
          display_name: true,
          western_sign: true,
          chinese_sign: true,
          photo_url: true,
        },
      },
      comments: {
        where: commentsWhere,
        select: {
          id: true,
          content: true,
          createdAt: true,
          likeCount: true,
          upvoteCount: true,
          downvoteCount: true,
          parentId: true,
          author: {
            select: {
              id: true,
              display_name: true,
              western_sign: true,
              chinese_sign: true,
              photo_url: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    })
    
    // Fetch replies separately for each comment if they exist
    // Temporarily disabled to debug - will re-enable once basic query works
    if (post && post.comments && post.comments.length > 0) {
      try {
        const commentIds = post.comments.map((c: any) => c.id);
        const allReplies = await prismaClient.comment.findMany({
          where: {
            parentId: { in: commentIds },
            ...(blockedUserIds.length > 0 ? { authorId: { notIn: blockedUserIds } } : {}),
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            likeCount: true,
            upvoteCount: true,
            downvoteCount: true,
            parentId: true,
            author: {
              select: {
                id: true,
                display_name: true,
                western_sign: true,
                chinese_sign: true,
                photo_url: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        });
        
        // Attach replies to their parent comments
        const repliesByParent = new Map<string, any[]>();
        allReplies.forEach((reply: any) => {
          if (reply.parentId) {
            const existing = repliesByParent.get(reply.parentId) || [];
            existing.push(reply);
            repliesByParent.set(reply.parentId, existing);
          }
        });
        
        // Attach replies to comments (type assertion needed)
        (post as any).comments = post.comments.map((comment: any) => ({
          ...comment,
          replies: repliesByParent.get(comment.id) || [],
        }));
      } catch (replyError: any) {
        console.error("[ThreadPage] Error fetching replies:", replyError);
        // Continue without replies if there's an error
        (post as any).comments = post.comments.map((comment: any) => ({
          ...comment,
          replies: [],
        }));
      }
    }
  } catch (error: any) {
    console.error("[ThreadPage] Error fetching post:", error);
    console.error("[ThreadPage] Error details:", {
      code: error.code,
      message: error.message,
      meta: error.meta,
      postId,
      topic,
    });
    // Return a more helpful error message
    return (
      <div className="mt-4 rounded-xl border border-rose-800 bg-rose-950/20 p-4">
        <p className="text-sm text-rose-400">
          Error loading post: {error.message || "Unknown error"}
        </p>
        <p className="mt-2 text-xs text-rose-300">
          Code: {error.code || "N/A"} | Meta: {JSON.stringify(error.meta || {})}
        </p>
      </div>
    );
  }

  if (!post) {
    return notFound()
  }

  // Ensure post has required structure
  if (!post.author) {
    console.error("[ThreadPage] Post missing author:", post);
    return (
      <div className="mt-4 rounded-xl border border-rose-800 bg-rose-950/20 p-4">
        <p className="text-sm text-rose-400">Error: Post data is incomplete</p>
      </div>
    );
  }

  // Format data for client
  const formattedPost = {
    id: post.id,
    title: post.title || "",
    content: post.content || "",
    topic: post.topic || topic,
    type: post.type || "STORY",
    isHidden: post.isHidden || false,
    createdAt: post.createdAt ? post.createdAt.toISOString() : new Date().toISOString(),
    likeCount: post.likeCount || 0,
    commentCount: post.commentCount || 0,
    author: {
      id: post.author.id,
      displayName: post.author.display_name || "Anonymous",
      eastWestCode: (post.author.western_sign && post.author.chinese_sign
        ? `${post.author.western_sign} ${post.author.chinese_sign}`.trim()
        : ""),
      westSign: post.author.western_sign || "",
      chineseSign: post.author.chinese_sign || "",
      photoUrl: post.author.photo_url || null,
    },
    comments: (post.comments || []).map((comment: any) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      likeCount: comment.likeCount,
      upvoteCount: comment.upvoteCount || 0,
      downvoteCount: comment.downvoteCount || 0,
      author: {
        id: comment.author.id,
        displayName: comment.author.display_name || "Anonymous",
        eastWestCode: (comment.author.western_sign && comment.author.chinese_sign
          ? `${comment.author.western_sign} ${comment.author.chinese_sign}`.trim()
          : ""),
        westSign: comment.author.western_sign || "",
        chineseSign: comment.author.chinese_sign || "",
        photoUrl: comment.author.photo_url,
      },
      replies: (comment.replies || []).map((reply: any) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        likeCount: reply.likeCount,
        upvoteCount: reply.upvoteCount || 0,
        downvoteCount: reply.downvoteCount || 0,
        parentId: reply.parentId,
        author: {
          id: reply.author.id,
          displayName: reply.author.display_name || "Anonymous",
          eastWestCode: (reply.author.western_sign && reply.author.chinese_sign
            ? `${reply.author.western_sign} ${reply.author.chinese_sign}`.trim()
            : ""),
          westSign: reply.author.western_sign || "",
          chineseSign: reply.author.chinese_sign || "",
          photoUrl: reply.author.photo_url,
        },
      })),
    })),
  }

  return (
    <Suspense fallback={
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-400">Loading post...</p>
      </div>
    }>
      <ThreadPageClient 
        post={formattedPost} 
        topicData={topicData}
        currentUserId={currentProfile?.id || null}
        canModerate={canModerate}
      />
    </Suspense>
  )
}
