// /app/api/longform/[pairId]/route.ts
import { NextResponse } from 'next/server';
import { LONGFORM_BLURBS } from '@/data/longformBlurbs';

export const revalidate = 60; // ISR-style freshness

// Cache headers:
// - max-age=60: Browser cache for 60s
// - s-maxage=300: CDN/edge cache for 5min
// - stale-while-revalidate=600: Serve stale while fetching fresh (10min)
const CACHE_HEADERS = 'public, max-age=60, s-maxage=300, stale-while-revalidate=600';
const ERROR_CACHE_HEADERS = 'public, max-age=60, s-maxage=60, stale-while-revalidate=300';

export async function GET(
  _: Request,
  { params }: { params: { pairId: string } }
) {
  const { pairId } = params;
  
  // Lookup direct
  let data = LONGFORM_BLURBS[pairId];
  
  // Try reversed if not found
  if (!data) {
    const [a, b] = pairId.split('|');
    if (a && b) {
      const reversed = `${b}|${a}`;
      data = LONGFORM_BLURBS[reversed];
    }
  }
  
  if (!data) {
    return NextResponse.json(
      { error: 'Not found' }, 
      { 
        status: 404,
        headers: { 'Cache-Control': ERROR_CACHE_HEADERS }
      }
    );
  }
  
  return NextResponse.json(data, {
    headers: { 'Cache-Control': CACHE_HEADERS }
  });
}

