import { supabase } from "./supabaseClient";
import type { Profile } from "./supabaseClient";

// Fetch a single profile by user id
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[getProfile] Error:', error);
    return null;
  }

  return profile as Profile;
}

// Update a profile by user id
export async function updateProfile(
  userId: string,
  data: Partial<Profile>,
): Promise<Profile> {
  const { data: updated, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('[updateProfile] Error:', error);
    throw error;
  }

  return updated as Profile;
}
