import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get unread notifications first, then recent read ones
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        { isRead: "asc" }, // false first (unread)
        { createdAt: "desc" },
      ],
      take: 20,
    });

    // Enrich with post topic for linking
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        if (notif.postId) {
          const post = await prisma.post.findUnique({
            where: { id: notif.postId },
            select: { topic: true },
          });
          return {
            ...notif,
            postTopic: post?.topic || null,
          };
        }
        return { ...notif, postTopic: null };
      })
    );

    return NextResponse.json(enrichedNotifications);
  } catch (err) {
    console.error("[GET /api/community/notifications]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

