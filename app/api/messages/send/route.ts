/**
 * Send a message - uses send_message RPC (SECURITY DEFINER) to bypass RLS
 * Works without service role key. Block/receiver checks done in RPC.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { fetchUserProfile } from "@/lib/supabase/profileQueries";
import { getChinesePatternCode } from "@/lib/matchEngineHelpers";

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
    const { matchId, receiverId, content, messageType = "text", messageSource = "connections" } = body;

    if (!matchId || !receiverId || !content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing matchId, receiverId, or content" },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();
    if (!trimmedContent || trimmedContent.length > 5000) {
      return NextResponse.json(
        { error: "Invalid message content" },
        { status: 400 }
      );
    }

    const senderId = currentUser.id;
    const isBackroomAdmin = currentUser.email?.toLowerCase() === "scottwhite115@gmail.com";

    // Backroom admin with service key: bypass block/receiver checks, insert directly
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (isBackroomAdmin && serviceKey) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        return NextResponse.json({ error: "Server configuration missing" }, { status: 500 });
      }
      const adminSupabase = createServiceClient(supabaseUrl, serviceKey);

      const { data: message, error } = await adminSupabase
        .from("messages")
        .insert({
          match_id: matchId,
          sender_id: senderId,
          receiver_id: receiverId,
          content: trimmedContent,
          message_type: messageType === "gif" || messageType === "emoji" || messageType === "image" ? messageType : "text",
        })
        .select()
        .single();

      if (error) {
        console.error("[messages/send] Admin error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, message });
    }

    // Regular users: check receiver profile (San He / Liu He restriction)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (adminKey && supabaseUrl) {
      const adminSupabase = createServiceClient(supabaseUrl, adminKey);
      const { data: receiverProfile } = await adminSupabase
        .from("profiles")
        .select("allow_instant_messages_connections, allow_instant_messages_discover, only_sanhe_liuhe_messages, chinese_sign")
        .eq("id", receiverId)
        .single();

      if (receiverProfile) {
        const allowInstantMessages =
          messageSource === "connections"
            ? (receiverProfile.allow_instant_messages_connections ?? true)
            : (receiverProfile.allow_instant_messages_discover ?? true);

        if (!allowInstantMessages) {
          const { data: match } = await adminSupabase
            .from("matches")
            .select("id, is_active")
            .eq("id", matchId)
            .single();

          if (!match || !match.is_active) {
            return NextResponse.json(
              { error: "This user requires a mutual match before messaging. Please swipe right on their profile first." },
              { status: 403 }
            );
          }
        }

        if (receiverProfile.only_sanhe_liuhe_messages) {
          const senderProfile = await fetchUserProfile(senderId);
          if (
            senderProfile &&
            receiverProfile.chinese_sign &&
            senderProfile.chinese_sign
          ) {
            const pattern = getChinesePatternCode(
              senderProfile.chinese_sign,
              receiverProfile.chinese_sign
            );
            if (pattern !== "SAN_HE" && pattern !== "LIU_HE") {
              return NextResponse.json(
                { error: "This user only accepts messages from San He (Triple Harmony) or Liu He (Six Harmonies) matches." },
                { status: 403 }
              );
            }
          }
        }
      }
    }

    // Use RPC (SECURITY DEFINER bypasses RLS - works without service key)
    const msgType = messageType === "gif" || messageType === "emoji" || messageType === "image" ? messageType : "text";
    const { data: messageJson, error } = await serverSupabase.rpc("send_message", {
      p_match_id: matchId,
      p_receiver_id: receiverId,
      p_content: trimmedContent,
      p_message_type: msgType,
    });

    if (error) {
      console.error("[messages/send] RPC error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send message" },
        { status: 500 }
      );
    }

    if (!messageJson) {
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    const message = typeof messageJson === "object" ? messageJson : JSON.parse(messageJson);
    return NextResponse.json({ success: true, message });
  } catch (err) {
    console.error("[messages/send] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
