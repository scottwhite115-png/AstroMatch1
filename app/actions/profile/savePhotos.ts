'use server'

/**
 * Server action to persist profile photos to the database.
 * Runs on the server with proper session/cookies so RLS and auth work correctly.
 */

import { createClient } from '@/lib/supabase/server'

/** Normalize to 6 slots; use empty string for empty slots (Postgres TEXT[] friendly) */
function normalizePhotoArray(arr: (string | null | undefined)[]): string[] {
  const out: string[] = []
  for (let i = 0; i < 6; i++) {
    const v = arr[i]
    out.push(typeof v === 'string' && v.length > 0 ? v : '')
  }
  return out
}

export type SavePhotosResult = { ok: true } | { ok: false; error: string }

/**
 * Save profile photos array (6 slots). Empty slots should be '' or null.
 * Returns { ok: true } on success, { ok: false, error } on failure.
 */
export async function saveProfilePhotosAction(
  photos: (string | null)[]
): Promise<SavePhotosResult> {
  try {
    console.log('[Server Action] saveProfilePhotosAction called with:', photos)
    
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.log('[Server Action] Auth error:', authError)
      return { ok: false, error: authError.message }
    }
    if (!user) {
      console.log('[Server Action] No user')
      return { ok: false, error: 'Not authenticated' }
    }

    console.log('[Server Action] User ID:', user.id.substring(0, 8))
    const normalized = normalizePhotoArray(photos)
    console.log('[Server Action] Normalized array:', normalized)
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        photos: normalized,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('id')
      .maybeSingle()

    console.log('[Server Action] Update result - data:', data, 'error:', error)

    if (error) {
      return { ok: false, error: error.message }
    }
    if (!data) {
      return { ok: false, error: 'Profile not found or update did not apply' }
    }

    console.log('[Server Action] Save successful')
    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to save photos'
    console.log('[Server Action] Exception:', message)
    return { ok: false, error: message }
  }
}
