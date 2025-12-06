import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, month, date, hours, minutes, seconds, latitude, longitude, timezone } = body;

    // Validate required fields
    if (!year || !month || !date || hours === undefined || minutes === undefined || !latitude || !longitude || !timezone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🪐 Calling Vedic Planets API with:', {
      year: parseInt(year),
      month: parseInt(month),
      date: parseInt(date),
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: seconds || 0,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timezone: parseFloat(timezone),
    });

    // Get API key from environment variable
    const apiKey = process.env.FREE_ASTROLOGY_API_KEY;
    
    if (!apiKey) {
      console.error('❌ FREE_ASTROLOGY_API_KEY not configured');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    const requestBody = {
      year: parseInt(year),
      month: parseInt(month),
      date: parseInt(date),
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: seconds ? parseInt(seconds) : 0,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timezone: parseFloat(timezone),
      settings: {
        observation_point: 'topocentric',
        ayanamsha: 'lahiri'
      }
    };

    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://json.freeastrologyapi.com/planets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch planets from Free Astrology API', 
          status: response.status,
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Success! Planets data received');
    
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('💥 Vedic Planets API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
