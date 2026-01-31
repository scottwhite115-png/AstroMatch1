/**
 * Delete user account - required for Apple App Store (Guideline 5.1.1)
 * Permanently deletes user from Supabase Auth and cascades to profiles, matches, etc.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const serverSupabase = await createClient();
    const {
      data: { user },
    } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json(
        { error: "Account deletion is temporarily unavailable. Please contact support." },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const adminSupabase = createServiceClient(supabaseUrl, serviceKey);

    // Delete user from auth (cascades to profiles via FK, and we clean related data)
    const { error: authError } = await adminSupabase.auth.admin.deleteUser(user.id);

    if (authError) {
      console.error("[account/delete] Auth delete error:", authError);
      return NextResponse.json(
        { error: authError.message || "Failed to delete account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[account/delete] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error deleting account" },
      { status: 500 }
    );
  }
}
