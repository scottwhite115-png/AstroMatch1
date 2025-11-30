import { supabase } from "./supabaseClient";

// Sign up with email
export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: { name: displayName || "" },
    },
  });
}

// Sign in with email
export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

// Sign in with OAuth
export async function signInWithProvider(provider: "google" | "facebook" | "apple") {
  return supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
}

// Sign out
export async function signOut() {
  return supabase.auth.signOut();
}

// Get current user
export async function getCurrentUser() {
  return supabase.auth.getUser();
}

// Reset password
export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
}

// Resend confirmation email
export async function resendConfirmation(email: string) {
  return supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
}

// Check if email is verified
export async function requireEmailVerified() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { allowed: false, reason: "not_signed_in" };
  return { allowed: !!user.email_confirmed_at, reason: user.email_confirmed_at ? "" : "email_unverified" };
}
