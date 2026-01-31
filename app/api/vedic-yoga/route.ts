import { type NextRequest, NextResponse } from "next/server"
import { getProkeralaToken } from "@/lib/prokerala-auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { day, month, year, hour, minute, latitude, longitude } = body

    // Validate required fields
    if (!day || !month || !year || !hour || !minute || !latitude || !longitude) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Get OAuth token
    const accessToken = await getProkeralaToken()

    // Format the datetime for Prokerala API
    const datetime = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+00:00`

    const params = new URLSearchParams({
      ayanamsa: "1",
      datetime: datetime,
      coordinates: `${latitude},${longitude}`,
    })

    // Call Prokerala API for Yoga Details
    const response = await fetch(
      `https://api.prokerala.com/v2/astrology/yoga?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
        console.error("Yoga API Error:", errorData)
      } catch (e) {
        const text = await response.text()
        console.error("Yoga API Error (text):", text)
        return NextResponse.json(
          { error: `Failed to fetch Yoga Details: ${response.status} ${response.statusText}` },
          { status: response.status },
        )
      }
      return NextResponse.json(
        { error: errorData.message || errorData.errors?.[0]?.detail || "Failed to fetch Yoga Details from Prokerala" },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error("Error in yoga API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

