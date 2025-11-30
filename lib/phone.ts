import { supabase } from "./supabaseClient";

export async function sendPhoneOtp(phoneE164: string) {
  return supabase.auth.signInWithOtp({ phone: phoneE164 });
}

export async function verifyPhoneOtp(phoneE164: string, token: string) {
  return supabase.auth.verifyOtp({ phone: phoneE164, token, type: "sms" });
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 1 (US country code), format as US number
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // If it's 10 digits, assume US number without country code
  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // Otherwise, return with + prefix if it doesn't have one
  if (digits.length > 0 && !phone.startsWith('+')) {
    return `+${digits}`;
  }
  
  return phone;
}

export function parsePhoneToE164(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 1 and is 11 digits, it's already E164 format
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // If it's 10 digits, assume US number and add country code
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // If it doesn't start with +, add it
  if (digits.length > 0 && !phone.startsWith('+')) {
    return `+${digits}`;
  }
  
  return phone.startsWith('+') ? phone : `+${digits}`;
}

export function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Must be 10-15 digits (international format)
  if (digits.length < 10 || digits.length > 15) {
    return false;
  }
  
  // Basic validation - just check it has reasonable length
  return digits.length >= 10;
}
