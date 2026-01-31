import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { day, month, year, hour, minute, latitude, longitude } = body

    // Validate required fields
    if (!day || !month || !year || !hour || !minute || !latitude || !longitude) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Prokerala API configuration
    const PROKERALA_API_KEY = process.env.PROKERALA_API_KEY
    const PROKERALA_CLIENT_ID = process.env.PROKERALA_CLIENT_ID

    if (!PROKERALA_API_KEY || !PROKERALA_CLIENT_ID) {
      return NextResponse.json(
        {
          error:
            "Prokerala API credentials not configured. Please add PROKERALA_API_KEY and PROKERALA_CLIENT_ID to your environment variables.",
        },
        { status: 500 },
      )
    }

    // Step 1: Get OAuth token from Prokerala
    console.log("Step 1: Getting OAuth token...")
    const tokenResponse = await fetch("https://api.prokerala.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: PROKERALA_CLIENT_ID,
        client_secret: PROKERALA_API_KEY,
      }),
    })

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text()
      console.error("Token error:", tokenError)
      return NextResponse.json(
        { error: "Failed to authenticate with Prokerala", details: tokenError },
        { status: tokenResponse.status },
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    console.log("✓ Got access token:", accessToken.substring(0, 20) + "...")

    // Step 2: Call Prokerala API with the token
    const datetime = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+00:00`
    
    const params = new URLSearchParams({
      ayanamsa: "1",
      coordinates: `${latitude},${longitude}`,
      datetime: datetime,
    })
    
    const apiUrl = `https://api.prokerala.com/v2/astrology/birth-details?${params.toString()}`
    
    console.log("Step 2: Calling Prokerala API:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })

    console.log("Response status:", response.status)

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
        console.error("Prokerala API Error:", errorData)
      } catch (e) {
        const text = await response.text()
        console.error("Prokerala API Error (text):", text)
        return NextResponse.json(
          { error: `Failed to fetch Vedic chart: ${response.status} ${response.statusText}` },
          { status: response.status },
        )
      }
      return NextResponse.json(
        { error: errorData.message || errorData.error || "Failed to fetch Vedic chart from Prokerala" },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data,
      birthDetails: {
        date: `${day}/${month}/${year}`,
        time: `${hour}:${minute}`,
        location: { latitude, longitude },
      },
    })
  } catch (error) {
    console.error("Error in vedic-chart API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
