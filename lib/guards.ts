import { supabase } from "./supabaseClient";
import { getProfile } from "./profiles";
import { DESIGN_MODE } from "./design-mode";

export type GuardResult = {
  allowed: boolean;
  reason?: string;
  missingFields?: string[];
};

// Check if user is signed in
export async function requireAuth() {
  if (DESIGN_MODE) return { allowed: true };
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { allowed: false, reason: "not_signed_in" };
  return { allowed: true };
}

// Check if email is verified
export async function requireEmailVerified() {
  if (DESIGN_MODE) return { allowed: true };
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { allowed: false, reason: "not_signed_in" };
  if (!user.email_confirmed_at) return { allowed: false, reason: "email_unverified" };
  return { allowed: true };
}

// Check if location is set
export async function requireLocation() {
  if (DESIGN_MODE) return { allowed: true };
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { allowed: false, reason: "not_signed_in" };

  const profile = await getProfile(user.id);

  if (!profile || !profile.lat || !profile.lon) {
    return { allowed: false, reason: "location_required" };
  }
  return { allowed: true };
}

// Check if zodiac signs are set
export async function requireZodiac() {
  if (DESIGN_MODE) return { allowed: true };
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { allowed: false, reason: "not_signed_in" };

  const profile = await getProfile(user.id);

  if (!profile || !profile.west_east) {
    return { allowed: false, reason: "zodiac_required" };
  }
  return { allowed: true };
}

// Check if onboarding is complete
export async function requireOnboardingComplete() {
  if (DESIGN_MODE) return { allowed: true };
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { allowed: false, reason: "not_signed_in" };

  const profile = await getProfile(user.id);

  if (!profile || profile.onboarding_needed) {
    return { allowed: false, reason: "onboarding_required" };
  }
  return { allowed: true };
}

// Check if ready for matching (email + location + zodiac)
export async function requireMatchReady() {
  const emailCheck = await requireEmailVerified();
  if (!emailCheck.allowed) return emailCheck;

  const onboardingCheck = await requireOnboardingComplete();
  if (!onboardingCheck.allowed) return onboardingCheck;

  const locationCheck = await requireLocation();
  if (!locationCheck.allowed) return locationCheck;

  const zodiacCheck = await requireZodiac();
  if (!zodiacCheck.allowed) return zodiacCheck;

  return { allowed: true };
}

// Get error message for guard reason
export function getGuardMessage(reason: string): string {
  const messages: Record<string, string> = {
    not_signed_in: "Please sign in to continue",
    email_unverified: "Please verify your email address",
    onboarding_required: "Please complete your profile",
    location_required: "Please enable location services",
    zodiac_required: "Please add your zodiac signs",
  };
  return messages[reason] || "Access denied";
}

// Get redirect path for guard reason
export function getGuardRedirect(reason: string): string {
  const redirects: Record<string, string> = {
    not_signed_in: "/login",
    email_unverified: "/auth/verify-email",
    onboarding_required: "/profile-builder",
    location_required: "/auth/enable-location",
    zodiac_required: "/profile-builder",
  };
  return redirects[reason] || "/";
}
