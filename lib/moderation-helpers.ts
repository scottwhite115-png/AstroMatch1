// lib/moderation-helpers.ts
// Helper functions for moderation UI
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"

/**
 * Check if the current user can moderate (ADMIN or OWNER)
 * Use this in server components to conditionally show moderation UI
 */
export async function canCurrentUserModerate(): Promise<boolean> {
  const profile = await getCurrentProfileWithRole()
  return profile?.role === "ADMIN" || profile?.role === "OWNER"
}

/**
 * Get current user's role
 */
export async function getCurrentUserRole(): Promise<"USER" | "ADMIN" | "OWNER" | null> {
  const profile = await getCurrentProfileWithRole()
  return profile?.role ?? null
}

/**
 * Check if current user is staff (has staff badge)
 */
export async function isCurrentUserStaff(): Promise<boolean> {
  const profile = await getCurrentProfileWithRole()
  return profile?.isStaff ?? false
}

