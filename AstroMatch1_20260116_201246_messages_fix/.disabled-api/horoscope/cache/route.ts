import { NextResponse } from 'next/server';
import { refreshVedicHoroscopeCache } from '@/app/actions/explore/cacheHoroscopes';

export async function GET(req: Request) {
  // Optional: add a secret header check
  await refreshVedicHoroscopeCache('DAILY');
  await refreshVedicHoroscopeCache('WEEKLY');
  await refreshVedicHoroscopeCache('MONTHLY');
  return NextResponse.json({ ok: true });
}

