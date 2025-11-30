import { supabase } from "@/lib/supabaseClient";
import { DESIGN_MODE } from "@/lib/design-mode";

export async function routeAfterAuth() {
  if (DESIGN_MODE) return { redirect: "/matches" };
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { redirect: "/login" };

  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding_needed")
    .eq("id", user.id)
    .single();

  if (error || !data) return { redirect: "/login" };

  // If incomplete, go to profile builder
  if (data.onboarding_needed) return { redirect: "/profile-builder" };

  // Otherwise continue to matches
  return { redirect: "/matches" };
}

