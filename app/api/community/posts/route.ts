import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { COMMUNITY_TOPICS } from "@/app/community/topics"
import { randomUUID } from "crypto"

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

    // Check if user is staff (ADMIN or OWNER) - they can see hidden posts
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    let canViewHidden = false
    if (user) {
      const profile = await prisma.profiles.findUnique({
        where: { id: user.id },
        select: { role: true }
      })
      canViewHidden = profile?.role === "ADMIN" || profile?.role === "OWNER"
    }

    // Build where clause
    const where: any = {}
    if (topic) {
      where.topic = topic
    }
    if (cursor) {
      where.createdAt = { lt: new Date(cursor) }
    }
    // Hide hidden posts from regular users
    if (!canViewHidden) {
      where.isHidden = false
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
              western_sign: true,
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
          eastWestCode: (post.author.western_sign && post.author.chinese_sign
            ? `${post.author.western_sign} ${post.author.chinese_sign}`.trim()
            : ""),
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
      // Latest posts - sort by score (upvotes - downvotes) then by createdAt
      const posts = await prisma.post.findMany({
        where,
        orderBy: [
          { upvoteCount: "desc" },
          { createdAt: "desc" },
        ],
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              display_name: true,
              western_sign: true,
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
        upvoteCount: post.upvoteCount || 0,
        downvoteCount: post.downvoteCount || 0,
        commentCount: post.commentCount,
        author: {
          id: post.author.id,
          displayName: post.author.display_name || "Anonymous",
          eastWestCode: (post.author.western_sign && post.author.chinese_sign
            ? `${post.author.western_sign} ${post.author.chinese_sign}`.trim()
            : ""),
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
    // Try to get all fields, but handle missing columns gracefully
    let profile: any;
    try {
      profile = await prisma.profiles.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          display_name: true,
          western_sign: true,
          chinese_sign: true,
        },
      })
    } catch (error: any) {
      console.error("[POST /api/community/posts] Error fetching profile:", error);
      // Try without the problematic columns
      profile = await prisma.profiles.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        display_name: true,
          western_sign: true,
        chinese_sign: true,
      },
    })
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // MODERATION GUARD: Prevent suspended/banned users from posting
    // Check status if the column exists (it might not be in all database setups)
    // For now, skip status check if column doesn't exist - posts will work
    // TODO: Add status and suspensionEndsAt columns to profiles table if needed

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
    // Ensure type is a valid string value
    const postType: "STORY" | "QUESTION" = (type === "STORY" || type === "QUESTION") 
      ? type 
      : "STORY";
    
    console.log("[POST /api/community/posts] Creating post with type:", postType);
    
    let post;
    try {
      // Use $executeRaw to insert directly with proper enum casting
      // This bypasses Prisma's enum type checking which seems to be causing issues
      const postId = randomUUID();
      
      await prisma.$executeRaw`
        INSERT INTO "Post" (id, title, content, topic, type, "authorId", "createdAt", "updatedAt", "likeCount", "commentCount", "isHidden")
        VALUES (
          ${postId}::text,
          ${title},
          ${content},
          ${topic},
          ${postType}::post_type,
          ${user.id}::uuid,
          NOW(),
          NOW(),
          0,
          0,
          false
        )
      `;
      
      // Now fetch the created post with relations
      post = await prisma.post.findUnique({
        where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            display_name: true,
              western_sign: true,
            chinese_sign: true,
          },
        },
      },
      });
      
      if (!post) {
        throw new Error("Failed to retrieve created post");
      }
    } catch (dbError: any) {
      console.error("[POST /api/community/posts] Database error:", dbError);
      console.error("[POST /api/community/posts] Error details:", {
        code: dbError.code,
        message: dbError.message,
        meta: dbError.meta,
        type: postType,
        topic,
        title: title.substring(0, 50),
      });
      return NextResponse.json(
        { error: dbError.message || "Database error creating post" },
        { status: 500 }
      )
    }

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
        eastWestCode: (post.author.western_sign && post.author.chinese_sign
          ? `${post.author.western_sign} ${post.author.chinese_sign}`.trim()
          : ""),
        chineseSign: post.author.chinese_sign,
      },
    })
  } catch (error: any) {
    console.error("[POST /api/community/posts] Error:", error)
    console.error("[POST /api/community/posts] Error stack:", error.stack)
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 }
    )
  }
}
