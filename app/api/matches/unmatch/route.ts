/**
 * Unmatch with a user - deletes the match and likes between two users.
 * Uses service role to bypass RLS (matches table may not have DELETE policy).
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const serverSupabase = await createClient();
    const {
      data: { user: currentUser },
    } = await serverSupabase.auth.getUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { matchId, otherUserId } = body;

    if (!matchId || !otherUserId) {
      return NextResponse.json(
        { error: "Missing matchId or otherUserId" },
        { status: 400 }
      );
    }

    // Verify current user is part of this match
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

    const { data: match } = await adminSupabase
      .from("matches")
      .select("user1_id, user2_id")
      .eq("id", matchId)
      .single();

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    const isPartOfMatch =
      match.user1_id === currentUser.id || match.user2_id === currentUser.id;
    const otherId = match.user1_id === currentUser.id ? match.user2_id : match.user1_id;

    if (!isPartOfMatch) {
      return NextResponse.json({ error: "Not authorized to unmatch" }, { status: 403 });
    }

    if (otherId !== otherUserId) {
      return NextResponse.json({ error: "User ID mismatch" }, { status: 400 });
    }

    // Delete likes between these users
    await adminSupabase
      .from("likes")
      .delete()
      .or(
        `and(liker_id.eq.${currentUser.id},liked_id.eq.${otherUserId}),and(liker_id.eq.${otherUserId},liked_id.eq.${currentUser.id})`
      );

    // Delete the match (cascades to messages)
    const { error } = await adminSupabase
      .from("matches")
      .delete()
      .eq("id", matchId);

    if (error) {
      console.error("[unmatch] Error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to unmatch" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[unmatch] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
