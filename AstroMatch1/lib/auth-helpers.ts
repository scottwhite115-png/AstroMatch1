// lib/auth-helpers.ts
// Complete auth helper with auto-promotion and auto-unban
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ownerEmail = process.env.ASTROMATCH_OWNER_EMAIL;

export type Role = "USER" | "ADMIN" | "OWNER";
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED";

// Safe Prisma accessor
async function getPrisma() {
  try {
    const prismaModule = await import("@/lib/prisma");
    return prismaModule.default || prismaModule.prisma;
  } catch (error) {
    console.warn('[auth-helpers] Prisma not available');
    return null;
  }
}

/**
 * Normalize account status - auto-unban if suspension expired
 */
async function normalizeAccountStatus(profile: any) {
  if (
    profile.status === "SUSPENDED" &&
    profile.suspensionEndsAt &&
    new Date(profile.suspensionEndsAt) <= new Date()
  ) {
    const prisma = await getPrisma();
    if (prisma) {
      try {
        profile = await prisma.profiles.update({
          where: { id: profile.id },
          data: {
            status: "ACTIVE",
            suspensionEndsAt: null,
          },
        });
      } catch (error) {
        console.warn('[normalizeAccountStatus] Update failed:', error);
      }
    }
  }
  return profile;
}

/**
 * Get current profile with role-based logic and auto-promotion
 * - Auto-promotes owner based on env email
 * - Ensures ADMIN/OWNER have isStaff flag
 * - Auto-unbans expired suspensions
 */
export async function getCurrentProfileWithRole() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const prisma = await getPrisma();
  if (!prisma) {
    console.warn('[getCurrentProfileWithRole] Prisma not available, returning null');
    return null;
  }

  try {
    // Find profile by Supabase auth user ID - only select columns that definitely exist
    let profile = await prisma.profiles.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        display_name: true,
      },
    });

    if (!profile) {
      // Create profile if doesn't exist - only set columns that definitely exist
      profile = await prisma.profiles.create({
        data: {
          id: user.id,
          email: user.email ?? null,
          display_name: user.email?.split('@')[0] ?? null,
        },
        select: {
          id: true,
          email: true,
          display_name: true,
        },
      });
    }
    
    // Add default role/status values since they might not be in the database
    const profileWithDefaults = {
      ...profile,
      role: "USER" as Role,
      status: "ACTIVE" as AccountStatus,
      isStaff: false,
      showStaffBadge: true,
      suspensionEndsAt: null,
    };

    // Auto-promote OWNER based on env email
    if (
      ownerEmail &&
      user.email &&
      user.email.toLowerCase() === ownerEmail.toLowerCase()
    ) {
      profileWithDefaults.role = "OWNER";
      profileWithDefaults.isStaff = true;
    }

    return profileWithDefaults;
  } catch (error) {
    console.warn('[getCurrentProfileWithRole] Database query failed:', error);
    return null;
  }
}

/**
 * Require authenticated user with staff role (ADMIN or OWNER)
 * Redirects to home if not authorized
 */
export async function requireStaff() {
  const profile = await getCurrentProfileWithRole();
  
  if (!profile) {
    redirect("/auth/login");
  }
  
  if (profile.role !== "ADMIN" && profile.role !== "OWNER") {
    redirect("/");
  }
  
  // Check if account is banned/suspended
  if (profile.status === "BANNED") {
    redirect("/account/banned");
  }
  
  if (profile.status === "SUSPENDED") {
    redirect("/account/suspended");
  }
  
  return profile;
}

/**
 * Require authenticated user with OWNER role
 * Redirects to home if not authorized
 */
export async function requireOwner() {
  const profile = await getCurrentProfileWithRole();
  
  if (!profile) {
    redirect("/auth/login");
  }
  
  if (profile.role !== "OWNER") {
    redirect("/");
  }
  
  return profile;
}

/**
 * Check if current user can access the app
 * Returns status and reason
 */
export async function checkUserAccess() {
  const profile = await getCurrentProfileWithRole();
  
  if (!profile) {
    return { canAccess: false, reason: "Not authenticated" };
  }
  
  if (profile.status === "BANNED") {
    return { canAccess: false, reason: "Account is permanently banned" };
  }
  
  if (profile.status === "SUSPENDED") {
    const suspensionEndsAt = profile.suspensionEndsAt 
      ? new Date(profile.suspensionEndsAt) 
      : null;
    
    if (suspensionEndsAt && suspensionEndsAt > new Date()) {
      return { 
        canAccess: false, 
        reason: `Account suspended until ${suspensionEndsAt.toLocaleDateString()}` 
      };
    }
    
    // Auto-unban if expired (shouldn't reach here due to normalizeAccountStatus)
    return { canAccess: true, reason: "Suspension expired, account reactivated" };
  }
  
  return { canAccess: true, reason: "Active" };
}

/**
 * Get current user's role
 */
export async function getCurrentUserRole(): Promise<Role | null> {
  const profile = await getCurrentProfileWithRole();
  return profile?.role ?? null;
}

/**
 * Check if current user is staff (ADMIN or OWNER)
 */
export async function isStaff(): Promise<boolean> {
  const profile = await getCurrentProfileWithRole();
  return profile?.role === "ADMIN" || profile?.role === "OWNER";
}

/**
 * Check if current user is owner
 */
export async function isOwner(): Promise<boolean> {
  const profile = await getCurrentProfileWithRole();
  return profile?.role === "OWNER";
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentProfileWithRole();
  return profile?.role === "ADMIN";
}

