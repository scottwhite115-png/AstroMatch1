import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { isValidTopicId } from "@/app/community/topics";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const sort = searchParams.get("sort") || "latest";

    // Validate topic
    if (!topic) {
      return new NextResponse("Missing topic parameter", { status: 400 });
    }

    if (!isValidTopicId(topic)) {
      return new NextResponse("Invalid topic", { status: 400 });
    }

    // Build where clause
    const where: any = { topic };
    if (cursor) {
      where.id = { lt: cursor }; // Cursor pagination using ID
    }

    // Build orderBy clause
    let orderBy: any;
    if (sort === "top") {
      // Custom sorting by engagement score
      // We'll fetch and sort in memory for now (for simplicity)
      // In production, you might want to use a database function or computed field
      orderBy = { createdAt: "desc" };
    } else {
      // "latest" - default
      orderBy = { createdAt: "desc" };
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy,
      take: limit + 1, // Fetch one extra to determine if there's a next page
      include: {
        author: {
          select: {
            id: true,
            display_name: true,
            western_sign: true,
            chinese_sign: true,
            east_west_code: true,
          },
        },
      },
    });

    // Apply custom sorting if "top"
    let sortedPosts = posts;
    if (sort === "top") {
      sortedPosts = posts.sort((a, b) => {
        const scoreA = a.likeCount + a.commentCount * 2;
        const scoreB = b.likeCount + b.commentCount * 2;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    }

    // Determine next cursor
    const hasMore = sortedPosts.length > limit;
    const postsToReturn = hasMore ? sortedPosts.slice(0, limit) : sortedPosts;
    const nextCursor = hasMore ? postsToReturn[postsToReturn.length - 1].id : null;

    // Format response
    const formattedPosts = postsToReturn.map((post) => ({
      id: post.id,
      topic: post.topic,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      author: {
        id: post.author.id,
        displayName: post.author.display_name || "Anonymous",
        westSign: post.author.western_sign || "",
        chineseSign: post.author.chinese_sign || "",
        eastWestCode: post.author.east_west_code || "",
      },
    }));

    return NextResponse.json({
      posts: formattedPosts,
      nextCursor,
    });
  } catch (err) {
    console.error("[GET /api/community/posts]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, content, topic } = body as {
      title?: string;
      content?: string;
      topic?: string;
    };

    // Validate required fields
    if (!title || !content || !topic) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Validate non-empty
    if (!title.trim() || !content.trim()) {
      return new NextResponse("Title and content cannot be empty", { status: 400 });
    }

    // Validate topic
    if (!isValidTopicId(topic)) {
      return new NextResponse("Invalid topic", { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        topic: topic.trim(),
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            display_name: true,
            western_sign: true,
            chinese_sign: true,
            east_west_code: true,
          },
        },
      },
    });

    // Format response
    const formattedPost = {
      id: post.id,
      topic: post.topic,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      author: {
        id: post.author.id,
        displayName: post.author.display_name || "Anonymous",
        westSign: post.author.western_sign || "",
        chineseSign: post.author.chinese_sign || "",
        eastWestCode: post.author.east_west_code || "",
      },
    };

    return NextResponse.json(formattedPost, { status: 201 });
  } catch (err) {
    console.error("[POST /api/community/posts]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

