import { type NextRequest, NextResponse } from "next/server"
import { getProkeralaToken } from "@/lib/prokerala-auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { day, month, year, hour, minute, latitude, longitude } = body

    if (!day || !month || !year || !hour || !minute || !latitude || !longitude) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const accessToken = await getProkeralaToken()

    const datetime = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+00:00`
    
    const params = new URLSearchParams({
      ayanamsa: "1",
      coordinates: `${latitude},${longitude}`,
      datetime: datetime,
    })
    
    const apiUrl = `https://api.prokerala.com/v2/astrology/birth-details?${params.toString()}`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
        console.error("Birth Details API Error:", errorData)
      } catch (e) {
        const text = await response.text()
        console.error("Birth Details API Error (text):", text)
        return NextResponse.json(
          { error: `Failed to fetch Birth Details: ${response.status} ${response.statusText}` },
          { status: response.status },
        )
      }
      return NextResponse.json(
        { error: errorData.message || errorData.errors?.[0]?.detail || "Failed to fetch Birth Details from Prokerala" },
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
    console.error("Error in birth-details API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

