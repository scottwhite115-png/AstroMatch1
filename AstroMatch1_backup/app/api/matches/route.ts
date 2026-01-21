import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  try {
    const { user_id, limit = 50, offset = 0 } = await req.json();
    if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 400 });

    // Call the RPC which applies the viewer's saved age range
    const { data, error } = await supabase.rpc("matches_by_age_range", { viewer: user_id });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Simple pagination on the server side
    const sliced = (data ?? []).slice(Number(offset), Number(offset) + Number(limit));

    return NextResponse.json({
      count: data?.length ?? 0,
      results: sliced
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}