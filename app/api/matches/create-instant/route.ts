/**
 * Create an "instant" match between two users when the receiver allows instant messages.
 * Used when someone wants to message another user without a mutual like first.
 * Uses RPC create_instant_match (SECURITY DEFINER) to bypass RLS - works without service role key.
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
    const otherUserId = body?.otherUserId;
    if (!otherUserId || typeof otherUserId !== "string") {
      return NextResponse.json({ error: "Missing otherUserId" }, { status: 400 });
    }

    // Don't create match with self
    if (otherUserId === currentUser.id) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
    }

    const isBackroomAdmin = currentUser.email?.toLowerCase() === "scottwhite115@gmail.com";

    // Backroom admin: use service role to bypass receiver's instant message/block settings
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (isBackroomAdmin && serviceKey) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        return NextResponse.json({ error: "Server configuration missing" }, { status: 500 });
      }
      const adminSupabase = createServiceClient(supabaseUrl, serviceKey);

      const [u1, u2] =
        currentUser.id < otherUserId
          ? [currentUser.id, otherUserId]
          : [otherUserId, currentUser.id];

      const { data: existingMatch } = await adminSupabase
        .from("matches")
        .select("id")
        .eq("user1_id", u1)
        .eq("user2_id", u2)
        .eq("is_active", true)
        .maybeSingle();

      if (existingMatch) {
        return NextResponse.json({ matchId: existingMatch.id });
      }

      const { data: newMatch, error } = await adminSupabase
        .from("matches")
        .insert({ user1_id: u1, user2_id: u2, is_active: true })
        .select("id")
        .single();

      if (error) {
        console.error("[create-instant] Admin error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ matchId: newMatch.id });
    }

    // Regular users: use RPC (SECURITY DEFINER bypasses RLS - no service key needed)
    const { data: matchId, error } = await serverSupabase.rpc("create_instant_match", {
      other_user_id: otherUserId,
    });

    if (error) {
      console.error("[create-instant] RPC error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create match" },
        { status: 500 }
      );
    }

    if (!matchId) {
      return NextResponse.json({ error: "Failed to create match" }, { status: 500 });
    }

    return NextResponse.json({ matchId });
  } catch (err) {
    console.error("[create-instant] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
