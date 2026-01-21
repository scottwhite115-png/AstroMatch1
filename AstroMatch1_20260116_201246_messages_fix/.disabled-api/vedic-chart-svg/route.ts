import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, month, date, hours, minutes, seconds, latitude, longitude, timezone, language = 'en' } = body;

    // Validate required fields
    if (!year || !month || !date || hours === undefined || minutes === undefined || !latitude || !longitude || !timezone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔮 Calling Vedic Chart SVG API with:', {
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

    // Use the provided API key
    const apiKey = '3v0LWZFfX74HJilJlVDiQauWeEYfUSR89sOn2KrE';

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
      config: {
        observation_point: 'topocentric',
        ayanamsha: 'lahiri'
      },
      language: language
    };

    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://json.freeastrologyapi.com/horoscope-chart-svg-code', {
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
          error: 'Failed to fetch chart from Free Astrology API', 
          status: response.status,
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Success! Chart SVG data received:', JSON.stringify(data).substring(0, 300));
    
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('💥 Vedic Chart SVG API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

