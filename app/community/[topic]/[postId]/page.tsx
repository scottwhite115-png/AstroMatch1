import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { COMMUNITY_TOPICS } from "../../topics"
import { ThreadPageClient } from "./_components/ThreadPageClient"

type PageProps = {
  params: Promise<{
    topic: string
    postId: string
  }>
}

export default async function ThreadPage({ params }: PageProps) {
  const { topic, postId } = await params

  // Validate topic
  const topicData = COMMUNITY_TOPICS.find((t) => t.id === topic)
  if (!topicData) {
    return notFound()
  }

  // Fetch post with comments
  const post = await prisma.post.findUnique({
    where: { id: postId },
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
        where: {
          parentId: null, // Top-level comments only
        },
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
      <ThreadPageClient post={formattedPost} topicData={topicData} />
    </Suspense>
  )
}
