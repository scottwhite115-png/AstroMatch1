/**
 * Send report notification email to astromatchchat@gmail.com
 * Called after a report is created - includes reported user's profile name
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "astromatchchat@gmail.com";

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
    const { reportedUserId, reportedUserName, reason } = body;

    if (!reportedUserId) {
      return NextResponse.json(
        { error: "Missing reportedUserId" },
        { status: 400 }
      );
    }

    // Fetch reporter's name
    const { data: reporterProfile } = await serverSupabase
      .from("profiles")
      .select("display_name")
      .eq("id", currentUser.id)
      .single();

    const reporterName = reporterProfile?.display_name || "Unknown";
    const reportedName = reportedUserName || "Unknown";

    const subject = `[AstroChat] User Report: ${reportedName}`;
    const html = `
      <h2>User Report Received</h2>
      <p><strong>Reported user:</strong> ${reportedName} (ID: ${reportedUserId})</p>
      <p><strong>Reported by:</strong> ${reporterName} (ID: ${currentUser.id})</p>
      <p><strong>Reason:</strong> ${reason || "Reported from chat"}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <hr>
      <p>Please review this report in the admin dashboard.</p>
    `;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "AstroChat Reports <onboarding@resend.dev>",
          to: ADMIN_EMAIL,
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("[notify-email] Resend error:", errData);
        return NextResponse.json(
          { error: "Failed to send email", sent: false },
          { status: 500 }
        );
      }
    } else {
      console.warn(
        "[notify-email] RESEND_API_KEY not set. Report logged:",
        { reportedUserId, reportedName, reporterName, reason }
      );
    }

    return NextResponse.json({ success: true, sent: !!apiKey });
  } catch (err) {
    console.error("[notify-email] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
