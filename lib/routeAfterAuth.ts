import { supabase } from "@/lib/supabaseClient";
import { getProfile } from "@/lib/profiles";
import { DESIGN_MODE } from "@/lib/design-mode";

export async function routeAfterAuth() {
  if (DESIGN_MODE) return { redirect: "/matches" };
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { redirect: "/login" };

  const profile = await getProfile(user.id);

  if (!profile) return { redirect: "/login" };

  // If incomplete, go to profile builder
  if (profile.onboarding_needed) return { redirect: "/profile-builder" };

  // Otherwise continue to matches
  return { redirect: "/matches" };
}

