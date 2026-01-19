import { NextRequest, NextResponse } from "next/server"
import { checkAndAutoUnbanUsers } from "@/lib/utils/moderation"

/**
 * Cron endpoint to automatically unban users whose suspension has ended
 * This should be called periodically (e.g., every hour) via a cron service
 * 
 * For Vercel: Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/auto-unban",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */
export async function GET(req: NextRequest) {
  try {
    // Verify this is coming from a cron job (optional: add auth header check)
    const authHeader = req.headers.get("authorization")
    
    // In production, you should verify this request is coming from your cron service
    // For Vercel Cron, you can check the authorization header
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const result = await checkAndAutoUnbanUsers()

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: `Auto-unbanned ${result.unbannedCount} users`,
        count: result.unbannedCount
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Auto-unban cron error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Server error" 
    }, { status: 500 })
  }
}

