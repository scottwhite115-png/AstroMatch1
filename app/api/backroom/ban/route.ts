/**
 * Backroom API - Ban a user (permanent)
 * Only accessible to scottwhite115@gmail.com
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const BACKROOM_EMAIL = "scottwhite115@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const serverSupabase = await createClient();
    const {
      data: { user },
    } = await serverSupabase.auth.getUser();

    if (!user?.email || user.email.toLowerCase() !== BACKROOM_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Server configuration missing" },
        { status: 500 }
      );
    }

    const adminSupabase = createServiceClient(supabaseUrl, serviceKey);

    const { error } = await adminSupabase
      .from("profiles")
      .update({
        status: "BANNED",
        suspensionEndsAt: null,
      })
      .eq("id", userId);

    if (error) {
      console.error("[backroom/ban] Error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to ban user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[backroom/ban] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
