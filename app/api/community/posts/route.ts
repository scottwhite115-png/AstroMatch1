import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { COMMUNITY_TOPICS } from "@/app/community/topics"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const topic = searchParams.get("topic")
    const cursor = searchParams.get("cursor")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50)
    const sort = searchParams.get("sort") || "latest" // "latest" | "top"

    // Validate topic if provided
    if (topic && !COMMUNITY_TOPICS.find((t) => t.id === topic)) {
      return NextResponse.json(
        { error: "Invalid topic" },
        { status: 400 }
      )
    }

    // Build where clause
    const where: any = {}
    if (topic) {
      where.topic = topic
    }
    if (cursor) {
      where.createdAt = { lt: new Date(cursor) }
    }

    // Build orderBy
    let orderBy: any
    if (sort === "top") {
      // Custom ordering by engagement score
      // We'll fetch and sort in-memory for top posts
      const posts = await prisma.post.findMany({
        where,
        take: limit * 2, // Fetch more for scoring
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              display_name: true,
              east_west_code: true,
              chinese_sign: true,
            },
          },
        },
      })

      // Calculate engagement score and sort
      const scored = posts
        .map((post) => ({
          ...post,
          score: post.likeCount + post.commentCount * 2,
        }))
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score
          return b.createdAt.getTime() - a.createdAt.getTime()
        })
        .slice(0, limit)

      const formatted = scored.map((post) => ({
        id: post.id,
        topic: post.topic,
        type: post.type,
        title: post.title,
        snippet: post.content.substring(0, 200) + (post.content.length > 200 ? "..." : ""),
        createdAt: post.createdAt.toISOString(),
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        author: {
          id: post.author.id,
          displayName: post.author.display_name || "Anonymous",
          eastWestCode: post.author.east_west_code,
          chineseSign: post.author.chinese_sign,
        },
      }))

      return NextResponse.json({
        posts: formatted,
        nextCursor: formatted.length === limit 
          ? formatted[formatted.length - 1].createdAt 
          : null,
      })
    } else {
      // Latest posts
      orderBy = { createdAt: "desc" }

      const posts = await prisma.post.findMany({
        where,
        orderBy,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              display_name: true,
              east_west_code: true,
              chinese_sign: true,
            },
          },
        },
      })

      const formatted = posts.map((post) => ({
        id: post.id,
        topic: post.topic,
        type: post.type,
        title: post.title,
        snippet: post.content.substring(0, 200) + (post.content.length > 200 ? "..." : ""),
        createdAt: post.createdAt.toISOString(),
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        author: {
          id: post.author.id,
          displayName: post.author.display_name || "Anonymous",
          eastWestCode: post.author.east_west_code,
          chineseSign: post.author.chinese_sign,
        },
      }))

      return NextResponse.json({
        posts: formatted,
        nextCursor: posts.length === limit 
          ? posts[posts.length - 1].createdAt.toISOString() 
          : null,
      })
    }
  } catch (error) {
    console.error("[GET /api/community/posts] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user profile with moderation status
    const profile = await prisma.profiles.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        display_name: true,
        east_west_code: true,
        chinese_sign: true,
        status: true,
        suspensionEndsAt: true,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // MODERATION GUARD: Prevent suspended/banned users from posting
    if (profile.status === "SUSPENDED") {
      return NextResponse.json(
        {
          error: "Your account is suspended from posting and messaging.",
          suspensionEndsAt: profile.suspensionEndsAt,
        },
        { status: 403 }
      )
    }

    if (profile.status === "BANNED") {
      return NextResponse.json(
        { error: "Your account has been banned." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { topic, type, title, content } = body

    // Validation
    if (!topic || !type || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!COMMUNITY_TOPICS.find((t) => t.id === topic)) {
      return NextResponse.json(
        { error: "Invalid topic" },
        { status: 400 }
      )
    }

    if (type !== "STORY" && type !== "QUESTION") {
      return NextResponse.json(
        { error: "Invalid post type" },
        { status: 400 }
      )
    }

    if (title.length < 3 || title.length > 200) {
      return NextResponse.json(
        { error: "Title must be between 3 and 200 characters" },
        { status: 400 }
      )
    }

    if (content.length < 10 || content.length > 10000) {
      return NextResponse.json(
        { error: "Content must be between 10 and 10000 characters" },
        { status: 400 }
      )
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        topic,
        type,
        title,
        content,
        authorId: user.id,
        // language and countryCode can be added later when profile has them
      },
      include: {
        author: {
          select: {
            id: true,
            display_name: true,
            east_west_code: true,
            chinese_sign: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: post.id,
      topic: post.topic,
      type: post.type,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      author: {
        id: post.author.id,
        displayName: post.author.display_name || "Anonymous",
        eastWestCode: post.author.east_west_code,
        chineseSign: post.author.chinese_sign,
      },
    })
  } catch (error) {
    console.error("[POST /api/community/posts] Error:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}
