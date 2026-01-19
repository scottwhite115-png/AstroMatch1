import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, month, date, hours, minutes, seconds, latitude, longitude, timezone } = body;

    if (!year || !month || !date || hours === undefined || minutes === undefined || !latitude || !longitude || !timezone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
      }
    };

    const response = await fetch('https://json.freeastrologyapi.com/navamsa-chart-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'API request failed', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
  }
}

