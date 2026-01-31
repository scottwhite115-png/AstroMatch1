/**
 * Backroom API - Fetch all reported accounts
 * Only accessible to scottwhite115@gmail.com
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const BACKROOM_EMAIL = "scottwhite115@gmail.com";

export async function GET(req: NextRequest) {
  try {
    const serverSupabase = await createClient();
    const {
      data: { user },
    } = await serverSupabase.auth.getUser();

    if (!user?.email || user.email.toLowerCase() !== BACKROOM_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
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

    // Fetch all reports with reporter and reported user profiles
    const { data: reports, error } = await adminSupabase
      .from("reports")
      .select(`
        id,
        reporter_id,
        reported_user_id,
        reason,
        status,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[backroom/reports] Error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch reports" },
        { status: 500 }
      );
    }

    // Group reports by reported_user_id and fetch profile info
    const reportCountByUser: Record<
      string,
      { count: number; reports: typeof reports; userId: string }
    > = {};

    for (const r of reports || []) {
      const id = r.reported_user_id;
      if (!reportCountByUser[id]) {
        reportCountByUser[id] = { count: 0, reports: [], userId: id };
      }
      reportCountByUser[id].count++;
      reportCountByUser[id].reports.push(r);
    }

    // Fetch profiles for reported users
    const userIds = Object.keys(reportCountByUser);
    const { data: profiles } = await adminSupabase
      .from("profiles")
      .select("id, display_name, status, suspensionEndsAt")
      .in("id", userIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    const reportedAccounts = userIds.map((userId) => {
      const { count, reports: userReports } = reportCountByUser[userId];
      const profile = profileMap.get(userId);
      let banStatus = "None";
      const endsAt = profile?.suspensionEndsAt || profile?.suspension_ends_at;
      if (profile?.status === "BANNED") banStatus = "Permanent (email banned)";
      else if (profile?.status === "SUSPENDED")
        banStatus = `1-month ban until ${endsAt ? new Date(endsAt).toLocaleDateString() : "N/A"}`;

      return {
        userId,
        displayName: profile?.display_name || "Unknown",
        reportCount: count,
        banStatus,
        status: profile?.status || "ACTIVE",
        action: count >= 4 ? "Permanent ban" : count >= 3 ? "1-month ban" : count >= 2 ? "Warning (1 more = 1-month ban)" : "No action yet",
        suspensionEndsAt: profile?.suspensionEndsAt || profile?.suspension_ends_at || null,
        reports: userReports.map((r) => ({
          id: r.id,
          reason: r.reason,
          createdAt: r.created_at,
        })),
      };
    });

    // Sort by report count descending
    reportedAccounts.sort((a, b) => b.reportCount - a.reportCount);

    return NextResponse.json({ reportedAccounts });
  } catch (err) {
    console.error("[backroom/reports] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
