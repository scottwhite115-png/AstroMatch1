import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { conversationId } = await req.json();

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    await prisma.conversations.update({
      where: { id: conversationId },
      data: { is_new_match: false },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}

