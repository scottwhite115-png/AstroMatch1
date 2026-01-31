// /app/api/reverse-geocode/route.ts
import { NextRequest, NextResponse } from 'next/server';

const CACHE = new Map<string, { t: number; payload: any }>();
const TTL_MS = 1000 * 60 * 5; // 5 minutes
const CONTACT_EMAIL = process.env.NOMINATIM_CONTACT_EMAIL || 'you@example.com';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon required' }, { status: 400 });
  }
  
  const key = `${lat},${lon}`;
  const cached = CACHE.get(key);
  if (cached && Date.now() - cached.t < TTL_MS) {
    return NextResponse.json(cached.payload, { status: 200 });
  }

  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('zoom', '12'); // city/suburb scale
  url.searchParams.set('addressdetails', '1');

  const r = await fetch(url.toString(), {
    headers: {
      'User-Agent': `AstroMatch/1.0 (${CONTACT_EMAIL})`,
      'Accept': 'application/json',
    },
  });

  if (!r.ok) {
    return NextResponse.json({ error: 'nominatim failed' }, { status: 502 });
  }
  
  const json = await r.json();

  const addr = json.address || {};
  const cityLike = addr.suburb || addr.city_district || addr.town || addr.city || addr.village || null;
  const region = addr.state || addr.region || null;
  const country = addr.country || null;
  const formatted =
    [cityLike, region, country].filter(Boolean).join(', ') ||
    json.display_name ||
    `${lat},${lon}`;

  const payload = { formatted, city: cityLike, region, country };
  CACHE.set(key, { t: Date.now(), payload });
  
  return NextResponse.json(payload, { status: 200 });
}

