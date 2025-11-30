import { supabase } from "./supabaseClient";
import type { Profile } from "./supabaseClient";

// Get profile by user ID
export async function getProfile(userId: string) {
  return supabase.from("profiles").select("*").eq("id", userId).single();
}

// Update profile
export async function updateProfile(userId: string, updates: Partial<Profile>) {
  return supabase.from("profiles").update(updates).eq("id", userId).select().single();
}

// Update location
export async function updateLocation(userId: string, lat: number, lon: number) {
  return updateProfile(userId, { lat, lon });
}

// Update zodiac signs
export async function updateZodiac(userId: string, westEast: string) {
  return updateProfile(userId, { west_east: westEast });
}

// Update display name
export async function updateDisplayName(userId: string, displayName: string) {
  return updateProfile(userId, { display_name: displayName });
}

// Update photo URL
export async function updatePhoto(userId: string, photoUrl: string) {
  return updateProfile(userId, { photo_url: photoUrl });
}

// Check if profile is complete
export function isProfileComplete(profile: Profile): boolean {
  return !!(profile.display_name && profile.west_east && profile.lat && profile.lon && profile.photo_url);
}

// Check if onboarding is needed
export async function checkOnboardingNeeded(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return true;

  const { data } = await supabase
    .from("profiles")
    .select("onboarding_needed")
    .eq("id", user.id)
    .single();

  return data?.onboarding_needed ?? true;
}
