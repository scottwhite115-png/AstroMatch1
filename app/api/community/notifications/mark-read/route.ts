import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { ids } = body as { ids?: string[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new NextResponse("Missing or invalid ids", { status: 400 });
    }

    // Update notifications that belong to the current user
    await prisma.notification.updateMany({
      where: {
        id: { in: ids },
        userId: user.id,
        isRead: false, // Only mark unread ones
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/community/notifications/mark-read]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

