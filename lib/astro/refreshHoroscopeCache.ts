'use server';

import { prisma } from '@/lib/prisma';
import { formatISO, format } from 'date-fns';
import { prokeralaVedicProvider } from '@/lib/astro/providers/prokeralaVedic';
import type { Sign } from '@/lib/astro/providers/types';

const SIGNS: Sign[] = [
  'aries','taurus','gemini','cancer','leo','virgo',
  'libra','scorpio','sagittarius','capricorn','aquarius','pisces'
];

function dateKeyFor(period: 'DAILY'|'WEEKLY'|'MONTHLY', date: Date) {
  if (period === 'DAILY') return format(date, 'yyyy-MM-dd');
  if (period === 'WEEKLY') return format(date, "yyyy-'W'II");
  return format(date, 'yyyy-MM');
}

export async function refreshVedicHoroscopeCache(period: 'DAILY'|'WEEKLY'|'MONTHLY') {
  const provider = prokeralaVedicProvider();
  const now = new Date();
  const dateISO = formatISO(now, { representation: 'date' });
  const dateKey = dateKeyFor(period, now);

  for (const sign of SIGNS) {
    const res = await provider.getHoroscope({ period, sign, dateISO });

    await prisma.horoscopeCache.upsert({
      where: {
        system_period_sign_dateKey: {
          system: provider.system,
          period,
          sign,
          dateKey,
        },
      },
      update: {
        title: res.title,
        content: res.content,
        source: res.source,
      },
      create: {
        system: provider.system,
        period,
        sign,
        dateKey,
        title: res.title,
        content: res.content,
        source: res.source,
      },
    });
  }

  return { ok: true, system: provider.system, period, dateKey };
}

