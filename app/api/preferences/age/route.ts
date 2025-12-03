import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { user_id, age_min, age_max } = await req.json();

    // Basic server-side validation
    const min = Math.max(18, Number(age_min ?? 18));
    const max = Math.min(99, Number(age_max ?? 99));
    if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    if (min > max) return NextResponse.json({ error: "age_min cannot exceed age_max" }, { status: 400 });

    await prisma.preferences.upsert({
      where: { user_id },
      update: { age_min: min, age_max: max, updated_at: new Date() },
      create: { user_id, age_min: min, age_max: max, updated_at: new Date() },
    });

    return NextResponse.json({ ok: true, age_min: min, age_max: max });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
