import { prisma } from "@/lib/prisma"
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
  const post = await prisma.post.findUnique({
    where: whereClause,
    include: {
      author: {
        select: {
          id: true,
          display_name: true,
          western_sign: true,
          chinese_sign: true,
          east_west_code: true,
          photo_url: true,
        },
      },
      comments: {
        where: commentsWhere,
        include: {
          author: {
            select: {
              id: true,
              display_name: true,
              western_sign: true,
              chinese_sign: true,
              east_west_code: true,
              photo_url: true,
            },
          },
          replies: {
            where: repliesWhere,
            include: {
              author: {
                select: {
                  id: true,
                  display_name: true,
                  western_sign: true,
                  chinese_sign: true,
                  east_west_code: true,
                  photo_url: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!post) {
    return notFound()
  }

  // Format data for client
  const formattedPost = {
    id: post.id,
    title: post.title,
    content: post.content,
    topic: post.topic,
    type: post.type,
    isHidden: post.isHidden,
    createdAt: post.createdAt.toISOString(),
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    author: {
      id: post.author.id,
      displayName: post.author.display_name || "Anonymous",
      eastWestCode: post.author.east_west_code || "",
      westSign: post.author.western_sign || "",
      chineseSign: post.author.chinese_sign || "",
      photoUrl: post.author.photo_url,
    },
    comments: post.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      likeCount: comment.likeCount,
      author: {
        id: comment.author.id,
        displayName: comment.author.display_name || "Anonymous",
        eastWestCode: comment.author.east_west_code || "",
        westSign: comment.author.western_sign || "",
        chineseSign: comment.author.chinese_sign || "",
        photoUrl: comment.author.photo_url,
      },
      replies: comment.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        likeCount: reply.likeCount,
        parentId: reply.parentId,
        author: {
          id: reply.author.id,
          displayName: reply.author.display_name || "Anonymous",
          eastWestCode: reply.author.east_west_code || "",
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
