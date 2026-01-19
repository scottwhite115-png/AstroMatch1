'use server';

import { prisma } from '@/lib/prisma';
import { TAROT_DECK } from '@/lib/tarot/deck';
import { createClient } from '@/lib/supabase/server';

function dateKeyToday() {
  return new Date().toISOString().slice(0, 10);
}

function pickCard() {
  const card = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
  const reversed = Math.random() < 0.25;
  return {
    ...card,
    orientation: reversed ? 'reversed' : 'upright',
    meaningShort: reversed ? card.meaningRev : card.meaningUp,
  };
}

export async function getOrCreateDailyTarotDraw() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id ?? null;

  const dateKey = dateKeyToday();

  const existing = await prisma.tarotDraw.findFirst({
    where: { userId: userId ?? undefined, dateKey, spread: 'single' },
    orderBy: { createdAt: 'desc' },
  });

  if (existing) return existing;

  const card = pickCard();

  return prisma.tarotDraw.create({
    data: {
      userId: userId ?? undefined,
      dateKey,
      spread: 'single',
      cardsJson: JSON.stringify([card]),
    },
  });
}

