/**
 * Server-side guard middleware
 * Use in API routes and server components
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GuardResult } from "@/lib/guards";
import { DESIGN_MODE } from "@/lib/design-mode";

/**
 * Check if user is authenticated (server-side)
 */
export async function requireAuthServer(): Promise<GuardResult> {
  if (DESIGN_MODE) return { allowed: true };
  
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, reason: "not_signed_in" };
  }

  return { allowed: true };
}

/**
 * Check if email is verified (server-side)
 */
export async function requireEmailVerifiedServer(): Promise<GuardResult> {
  if (DESIGN_MODE) return { allowed: true };
  
  const authCheck = await requireAuthServer();
  if (!authCheck.allowed) return authCheck;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const emailVerified = !!user!.email_confirmed_at;
  if (!emailVerified) {
    return { allowed: false, reason: "email_unverified" };
  }

  return { allowed: true };
}

/**
 * Check if profile has location (server-side)
 */
export async function requireLocationServer(): Promise<GuardResult> {
  if (DESIGN_MODE) return { allowed: true };
  
  const authCheck = await requireAuthServer();
  if (!authCheck.allowed) return authCheck;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("lat, lon")
    .eq("id", user!.id)
    .single();

  if (!profile || profile.lat === null || profile.lon === null) {
    return { allowed: false, reason: "location_required" };
  }

  return { allowed: true };
}

/**
 * Check if profile has zodiac signs (server-side)
 */
export async function requireZodiacSignsServer(): Promise<GuardResult> {
  if (DESIGN_MODE) return { allowed: true };
  
  const authCheck = await requireAuthServer();
  if (!authCheck.allowed) return authCheck;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("west_east")
    .eq("id", user!.id)
    .single();

  if (!profile || !profile.west_east) {
    return { allowed: false, reason: "zodiac_required" };
  }

  return { allowed: true };
}

/**
 * Check if ready for matching (server-side)
 */
export async function requireMatchReadyServer(): Promise<GuardResult> {
  const emailCheck = await requireEmailVerifiedServer();
  if (!emailCheck.allowed) return emailCheck;

  const locationCheck = await requireLocationServer();
  if (!locationCheck.allowed) return locationCheck;

  const zodiacCheck = await requireZodiacSignsServer();
  if (!zodiacCheck.allowed) return zodiacCheck;

  return { allowed: true };
}

/**
 * Middleware wrapper for API routes
 * Returns NextResponse with error if guard fails
 */
export async function withGuard(
  guardFn: () => Promise<GuardResult>,
  handler: (request: Request) => Promise<NextResponse>
) {
  return async (request: Request) => {
    const result = await guardFn();

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: result.reason || "Access denied",
          missingFields: result.missingFields,
        },
        { status: result.reason === "not_signed_in" ? 401 : 403 }
      );
    }

    return handler(request);
  };
}

/**
 * Helper to get status code from guard result
 */
export function getGuardStatusCode(result: GuardResult): number {
  if (result.allowed) return 200;
  if (result.reason === "not_signed_in") return 401;
  return 403;
}

