/**
 * API endpoint for compatibility lookup
 * Returns detailed compatibility data for two zodiac combinations
 */

import { NextResponse } from "next/server";
import { getCompatibility } from "@/lib/match-matrix-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userSign = searchParams.get("user");
    const partnerSign = searchParams.get("partner");

    if (!userSign || !partnerSign) {
      return NextResponse.json(
        { error: "Missing user or partner sign" },
        { status: 400 }
      );
    }

    // Validate format (should be like "Aries-Rat")
    const signPattern = /^[A-Z][a-z]+-[A-Z][a-z]+$/;
    if (!signPattern.test(userSign) || !signPattern.test(partnerSign)) {
      return NextResponse.json(
        { error: "Invalid sign format. Expected format: 'Aries-Rat'" },
        { status: 400 }
      );
    }

    // Get compatibility data
    const compatibility = await getCompatibility(userSign, partnerSign);

    return NextResponse.json(compatibility);
  } catch (error) {
    console.error("Error in compatibility API:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch compatibility data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

