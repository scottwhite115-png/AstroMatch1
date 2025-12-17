import { supabase } from "./supabaseClient";

export async function sendPhoneOtp(phoneE164: string) {
  return supabase.auth.signInWithOtp({ phone: phoneE164 });
}

export async function verifyPhoneOtp(phoneE164: string, token: string) {
  return supabase.auth.verifyOtp({ phone: phoneE164, token, type: "sms" });
}
