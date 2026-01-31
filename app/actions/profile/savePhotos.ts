"use server"

import { createClient } from "@/lib/supabase/server"

export type SaveProfilePhotosResult = { ok: true } | { ok: false; error: string }

/**
 * Server action: save the current user's profile photo URLs (6 slots) to the profiles table.
 * Call from client after upload/delete/reorder so the server session is used and RLS works.
 */
export async function saveProfilePhotosAction(
  photoUrls: (string | null)[]
): Promise<SaveProfilePhotosResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { ok: false, error: "Not authenticated" }
    }

    // Normalize to 6 slots: null -> empty string for DB (preserves slot order)
    const photos: string[] = Array.from({ length: 6 }, (_, i) =>
      photoUrls[i] != null && String(photoUrls[i]).trim() !== ""
        ? String(photoUrls[i]).trim()
        : ""
    )

    const { error } = await supabase
      .from("profiles")
      .update({ photos })
      .eq("id", user.id)

    if (error) {
      console.error("[saveProfilePhotosAction] Update error:", error)
      return { ok: false, error: error.message ?? "Failed to save photos" }
    }

    return { ok: true }
  } catch (err) {
    console.error("[saveProfilePhotosAction] Unexpected error:", err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to save photos",
    }
  }
}
