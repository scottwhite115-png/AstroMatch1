import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

/**
 * Check and auto-unban users whose suspension period has ended
 * This should be called periodically (e.g., via cron job or on API requests)
 */
export async function checkAndAutoUnbanUsers() {
  try {
    const now = new Date().toISOString()

    // Find suspended users whose suspension has ended
    const { data: expiredSuspensions, error: findError } = await supabase
      .from("profiles")
      .select("id, display_name, suspensionEndsAt")
      .eq("status", "SUSPENDED")
      .lte("suspensionEndsAt", now)

    if (findError) {
      console.error("Error finding expired suspensions:", findError)
      return { success: false, error: findError }
    }

    if (!expiredSuspensions || expiredSuspensions.length === 0) {
      return { success: true, unbannedCount: 0 }
    }

    // Update their status to ACTIVE
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        status: "ACTIVE",
        suspensionEndsAt: null
      })
      .eq("status", "SUSPENDED")
      .lte("suspensionEndsAt", now)

    if (updateError) {
      console.error("Error auto-unbanning users:", updateError)
      return { success: false, error: updateError }
    }

    console.log(`Auto-unbanned ${expiredSuspensions.length} users:`, 
      expiredSuspensions.map(u => u.display_name || u.id))

    return { 
      success: true, 
      unbannedCount: expiredSuspensions.length,
      unbannedUsers: expiredSuspensions
    }
  } catch (error) {
    console.error("checkAndAutoUnbanUsers error:", error)
    return { success: false, error }
  }
}

/**
 * Check if a user is currently suspended or banned
 */
export async function checkUserAccess(userId: string) {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("status, suspensionEndsAt")
      .eq("id", userId)
      .single()

    if (error || !profile) {
      return { canAccess: false, reason: "Profile not found" }
    }

    if (profile.status === "BANNED") {
      return { canAccess: false, reason: "Account is permanently banned" }
    }

    if (profile.status === "SUSPENDED") {
      const now = new Date()
      const suspensionEndsAt = profile.suspensionEndsAt ? new Date(profile.suspensionEndsAt) : null

      // Check if suspension has expired
      if (suspensionEndsAt && suspensionEndsAt <= now) {
        // Auto-unban this user
        await supabase
          .from("profiles")
          .update({ 
            status: "ACTIVE",
            suspensionEndsAt: null
          })
          .eq("id", userId)

        return { canAccess: true, reason: "Suspension expired, account reactivated" }
      }

      return { 
        canAccess: false, 
        reason: `Account suspended until ${suspensionEndsAt?.toLocaleDateString()}` 
      }
    }

    return { canAccess: true, reason: "Active" }
  } catch (error) {
    console.error("checkUserAccess error:", error)
    return { canAccess: false, reason: "Error checking access" }
  }
}

