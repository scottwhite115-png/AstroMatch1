import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { user_id, age_min, age_max } = await req.json();

    // Basic server-side validation
    const min = Math.max(18, Number(age_min ?? 18));
    const max = Math.min(99, Number(age_max ?? 99));
    if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    if (min > max) return NextResponse.json({ error: "age_min cannot exceed age_max" }, { status: 400 });

    const { error } = await supabase
      .from("preferences")
      .upsert({ user_id, age_min: min, age_max: max, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, age_min: min, age_max: max });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
