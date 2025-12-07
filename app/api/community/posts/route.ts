import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic") ?? undefined;

    const posts = await prisma.post.findMany({
      where: topic ? { topic } : {},
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
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

    if (!title || !content || !topic) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        topic: topic.trim(),
        authorId: user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("[POST /api/community/posts]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

