// connectionBlurbMinimal.ts

import type { ChinesePattern } from "@/lib/compat/engine";

// 1) Types (adjust to your actual types if needed)

export type TierLabel =
  | "Soulmate"
  | "Twin Flame"
  | "Excellent"
  | "Good Connection"
  | "Neutral"
  | "Sparky Friends"
  | "Opposites Attract"
  | "Difficult Match";

// Re-export ChinesePattern for convenience
export type { ChinesePattern };

export const ChineseChemistryDescription: Record<ChinesePattern, string[]> = {
  san_he: [
    "Instincts match naturally here. You share a similar pace, making teamwork and day-to-day flow feel easy.",
    "Your core rhythms align, creating a stable, intuitive connection without much effort.",
  ],
  liu_he: [
    "A supportive, complementary pairing. You tend to help each other stay steady when life gets busy.",
    "There's a built-in sense of backing each other up, making practical cooperation smoother.",
  ],
  same_animal: [
    "This pairing runs on active, bright energy. It's exciting and spontaneous, but needs pacing to stay balanced.",
    "There's fast momentum between you — fun, animated, and best when neither of you overruns the other.",
  ],
  same_trine: [
    "Instincts match naturally here. You share a similar pace, making teamwork and day-to-day flow feel easy.",
    "Your core rhythms align, creating a stable, intuitive connection without much effort.",
  ],
  liu_chong: [
    "Clear contrast with a noticeable pull. Respecting each other's style keeps the dynamic productive.",
    "You balance each other through difference; it works when you stay open rather than corrective.",
  ],
  liu_hai: [
    "This mix becomes sensitive under stress. Light contact works better than heavy expectations.",
    "Fault lines show easily here; clarity and space support the connection best.",
  ],
  xing: [
    "This mix becomes sensitive under stress. Light contact works better than heavy expectations.",
    "Fault lines show easily here; clarity and space support the connection best.",
  ],
  po: [
    "This mix becomes sensitive under stress. Light contact works better than heavy expectations.",
    "Fault lines show easily here; clarity and space support the connection best.",
  ],
  neutral: [
    "The flow sits in the middle — neither strong push nor block. What you build depends on consistent effort.",
    "A steady baseline with no major friction. Direction develops through shared intention.",
  ],
};

export type WesternElementCompatibility = "same" | "compatible" | "mixed" | "clashing";

export const WesternChemistryDescription: Record<WesternElementCompatibility, string[]> = {
  same: [
    "You move through life in similar ways. This creates an easy sense of being understood.",
    "Matching temperaments help keep communication smooth and predictable.",
  ],
  compatible: [
    "Your elements feed each other naturally, creating momentum and enthusiasm.",
    "There's an energising effect here — ideas and actions build quickly when aligned.",
  ],
  mixed: [
    "You bring different strengths to the dynamic. Clear roles and pacing keep things smooth.",
    "With clear expectations, your differences balance out and create workable flow.",
  ],
  clashing: [
    "You react very differently to situations; pacing and patience matter to avoid misfires.",
    "Instincts can run in opposite directions, but steady communication keeps misunderstandings low.",
  ],
};

// 2) Blurb library: short, varied, no sign names

const BLURBS: Record<TierLabel, Record<ChinesePattern, string[]>> = {
  Soulmate: {
    same_trine: [
      "You share the same instinctive rhythm and elemental nature, creating an unusually smooth and intuitive bond. Things fall into place quickly without needing to force understanding. This connection feels natural, steady, and deeply aligned at its core.",
    ],
    six_harmony: [
      "You share the same instinctive rhythm and elemental nature, creating an unusually smooth and intuitive bond. Things fall into place quickly without needing to force understanding. This connection feels natural, steady, and deeply aligned at its core.",
    ],
    lively_pair: [
      "You share the same instinctive rhythm and elemental nature, creating an unusually smooth and intuitive bond. Things fall into place quickly without needing to force understanding. This connection feels natural, steady, and deeply aligned at its core.",
    ],
    opposites: [
      "You share the same instinctive rhythm and elemental nature, creating an unusually smooth and intuitive bond. Things fall into place quickly without needing to force understanding. This connection feels natural, steady, and deeply aligned at its core.",
    ],
    damage: [
      "You share the same instinctive rhythm and elemental nature, creating an unusually smooth and intuitive bond. Things fall into place quickly without needing to force understanding. This connection feels natural, steady, and deeply aligned at its core.",
    ],
    neutral: [
      "You share the same instinctive rhythm and elemental nature, creating an unusually smooth and intuitive bond. Things fall into place quickly without needing to force understanding. This connection feels natural, steady, and deeply aligned at its core.",
    ],
  },

  "Twin Flame": {
    same_trine: [
      "The energy between you is strong, catalytic, and fast-moving. You amplify each other's potential and challenge each other to grow in ways few other matches can. When both of you stay honest and grounded, the connection becomes powerful and transformative.",
    ],
    six_harmony: [
      "The energy between you is strong, catalytic, and fast-moving. You amplify each other's potential and challenge each other to grow in ways few other matches can. When both of you stay honest and grounded, the connection becomes powerful and transformative.",
    ],
    lively_pair: [
      "The energy between you is strong, catalytic, and fast-moving. You amplify each other's potential and challenge each other to grow in ways few other matches can. When both of you stay honest and grounded, the connection becomes powerful and transformative.",
    ],
    opposites: [
      "The energy between you is strong, catalytic, and fast-moving. You amplify each other's potential and challenge each other to grow in ways few other matches can. When both of you stay honest and grounded, the connection becomes powerful and transformative.",
    ],
    damage: [
      "The energy between you is strong, catalytic, and fast-moving. You amplify each other's potential and challenge each other to grow in ways few other matches can. When both of you stay honest and grounded, the connection becomes powerful and transformative.",
    ],
    neutral: [
      "The energy between you is strong, catalytic, and fast-moving. You amplify each other's potential and challenge each other to grow in ways few other matches can. When both of you stay honest and grounded, the connection becomes powerful and transformative.",
    ],
  },

  Excellent: {
    same_trine: [
      "There's clear harmony in how you move, think, and respond to each other. Even when your styles differ, your underlying compatibility keeps things flowing in a steady, balanced direction. With simple effort and openness, this pairing becomes reliably strong and fulfilling.",
    ],
    six_harmony: [
      "There's clear harmony in how you move, think, and respond to each other. Even when your styles differ, your underlying compatibility keeps things flowing in a steady, balanced direction. With simple effort and openness, this pairing becomes reliably strong and fulfilling.",
    ],
    lively_pair: [
      "There's clear harmony in how you move, think, and respond to each other. Even when your styles differ, your underlying compatibility keeps things flowing in a steady, balanced direction. With simple effort and openness, this pairing becomes reliably strong and fulfilling.",
    ],
    opposites: [
      "There's clear harmony in how you move, think, and respond to each other. Even when your styles differ, your underlying compatibility keeps things flowing in a steady, balanced direction. With simple effort and openness, this pairing becomes reliably strong and fulfilling.",
    ],
    damage: [
      "There's clear harmony in how you move, think, and respond to each other. Even when your styles differ, your underlying compatibility keeps things flowing in a steady, balanced direction. With simple effort and openness, this pairing becomes reliably strong and fulfilling.",
    ],
    neutral: [
      "There's clear harmony in how you move, think, and respond to each other. Even when your styles differ, your underlying compatibility keeps things flowing in a steady, balanced direction. With simple effort and openness, this pairing becomes reliably strong and fulfilling.",
    ],
  },

  "Good Connection": {
    same_trine: [
      "You understand each other's basic pace; small tweaks keep it smooth. Similar instincts make life easier, and you usually read each other correctly.",
      "Similar instincts make day-to-day life easier. You read each other correctly without much explanation, creating a natural flow.",
      "You read each other correctly without much explanation. The similar instincts create an easy baseline, and small efforts go a long way.",
    ],
    six_harmony: [
      "Quiet supportive thread that grows when you rely on it. You handle small challenges better together than alone, making this feel solid in practice.",
      "You handle small challenges better together than alone. The supportive thread is available when you need it and grows stronger with use.",
      "You bring enough support to make this feel solid. The supportive thread runs quietly but reliably, and practical cooperation makes life easier.",
    ],
    lively_pair: [
      "Lively, workable energy flows between you. The connection thrives on movement and excitement, but benefits from intentional breaks and honest talks about pace to stay balanced.",
      "Fun when it's light; routine helps when life gets heavier. Plenty of spark exists, and it settles best when neither of you rushes decisions.",
      "Plenty of spark and energy flow between you. It thrives on movement but needs intentional breaks and honest communication to stay healthy.",
    ],
    opposites: [
      "You see things differently; listening turns that into a strength. Differences are obvious early, but respect keeps things on track.",
      "Differences are obvious early, but respect and open communication keep things on track. You complement each other when you don't compete to be right.",
      "You complement each other when you don't compete to be right. The different perspectives become a strength when you stay open and curious.",
    ],
    damage: [
      "Mostly fine but gets tricky under strain; keep expectations realistic. It works well in good times, but stress can highlight your weak spots quickly.",
      "It works well overall, but stress can highlight your weak spots. You can make this work with conscious pacing and clear communication.",
      "You can make this work with conscious pacing and mutual care. The connection is mostly fine but benefits from early attention to issues.",
    ],
    neutral: [
      "Pleasant, functional match where depth comes from shared activities. Easy enough to maintain; what you build depends on effort and intention.",
      "Easy enough to maintain; what you build depends on effort and intention. The pleasant match responds well to shared activities and quality time.",
      "Light, workable energy flows between you; it's what you do with it that counts. The pleasant match improves with shared activities and mutual effort.",
    ],
  },

  Neutral: {
    same_trine: [
      "The connection sits in a middle ground — not automatically easy, not inherently challenging. It develops through shared intention rather than strong astrological patterns. With steady communication and mutual curiosity, this match can take shape in a direction you both choose.",
    ],
    six_harmony: [
      "The connection sits in a middle ground — not automatically easy, not inherently challenging. It develops through shared intention rather than strong astrological patterns. With steady communication and mutual curiosity, this match can take shape in a direction you both choose.",
    ],
    lively_pair: [
      "The connection sits in a middle ground — not automatically easy, not inherently challenging. It develops through shared intention rather than strong astrological patterns. With steady communication and mutual curiosity, this match can take shape in a direction you both choose.",
    ],
    opposites: [
      "The connection sits in a middle ground — not automatically easy, not inherently challenging. It develops through shared intention rather than strong astrological patterns. With steady communication and mutual curiosity, this match can take shape in a direction you both choose.",
    ],
    damage: [
      "The connection sits in a middle ground — not automatically easy, not inherently challenging. It develops through shared intention rather than strong astrological patterns. With steady communication and mutual curiosity, this match can take shape in a direction you both choose.",
    ],
    neutral: [
      "The connection sits in a middle ground — not automatically easy, not inherently challenging. It develops through shared intention rather than strong astrological patterns. With steady communication and mutual curiosity, this match can take shape in a direction you both choose.",
    ],
  },

  "Sparky Friends": {
    same_trine: [
      "You bring out each other's lighter, more social side, making this connection easy to enjoy. The chemistry is warm and workable, especially when both of you stay flexible with pace and expectations. This match often grows best through shared experiences and small, consistent efforts.",
    ],
    six_harmony: [
      "You bring out each other's lighter, more social side, making this connection easy to enjoy. The chemistry is warm and workable, especially when both of you stay flexible with pace and expectations. This match often grows best through shared experiences and small, consistent efforts.",
    ],
    lively_pair: [
      "You bring out each other's lighter, more social side, making this connection easy to enjoy. The chemistry is warm and workable, especially when both of you stay flexible with pace and expectations. This match often grows best through shared experiences and small, consistent efforts.",
    ],
    opposites: [
      "You bring out each other's lighter, more social side, making this connection easy to enjoy. The chemistry is warm and workable, especially when both of you stay flexible with pace and expectations. This match often grows best through shared experiences and small, consistent efforts.",
    ],
    damage: [
      "You bring out each other's lighter, more social side, making this connection easy to enjoy. The chemistry is warm and workable, especially when both of you stay flexible with pace and expectations. This match often grows best through shared experiences and small, consistent efforts.",
    ],
    neutral: [
      "You bring out each other's lighter, more social side, making this connection easy to enjoy. The chemistry is warm and workable, especially when both of you stay flexible with pace and expectations. This match often grows best through shared experiences and small, consistent efforts.",
    ],
  },

  "Opposites Attract": {
    same_trine: [
      "There's a strong pull here, driven by contrast rather than similarity. The chemistry can be exciting and memorable, but it requires patience and awareness to avoid clashing too hard. When both of you respect each other's differences, the spark becomes a real source of growth.",
    ],
    six_harmony: [
      "There's a strong pull here, driven by contrast rather than similarity. The chemistry can be exciting and memorable, but it requires patience and awareness to avoid clashing too hard. When both of you respect each other's differences, the spark becomes a real source of growth.",
    ],
    lively_pair: [
      "There's a strong pull here, driven by contrast rather than similarity. The chemistry can be exciting and memorable, but it requires patience and awareness to avoid clashing too hard. When both of you respect each other's differences, the spark becomes a real source of growth.",
    ],
    opposites: [
      "There's a strong pull here, driven by contrast rather than similarity. The chemistry can be exciting and memorable, but it requires patience and awareness to avoid clashing too hard. When both of you respect each other's differences, the spark becomes a real source of growth.",
    ],
    damage: [
      "There's a strong pull here, driven by contrast rather than similarity. The chemistry can be exciting and memorable, but it requires patience and awareness to avoid clashing too hard. When both of you respect each other's differences, the spark becomes a real source of growth.",
    ],
    neutral: [
      "There's a strong pull here, driven by contrast rather than similarity. The chemistry can be exciting and memorable, but it requires patience and awareness to avoid clashing too hard. When both of you respect each other's differences, the spark becomes a real source of growth.",
    ],
  },

  "Difficult Match": {
    same_trine: [
      "Your natural rhythms move in conflicting directions, which can lead to tension if unaddressed. This pairing often exposes sensitive spots, making honest communication and clear boundaries essential. Keeping expectations realistic helps prevent emotional drain or misunderstandings.",
    ],
    six_harmony: [
      "Your natural rhythms move in conflicting directions, which can lead to tension if unaddressed. This pairing often exposes sensitive spots, making honest communication and clear boundaries essential. Keeping expectations realistic helps prevent emotional drain or misunderstandings.",
    ],
    lively_pair: [
      "Your natural rhythms move in conflicting directions, which can lead to tension if unaddressed. This pairing often exposes sensitive spots, making honest communication and clear boundaries essential. Keeping expectations realistic helps prevent emotional drain or misunderstandings.",
    ],
    opposites: [
      "Your natural rhythms move in conflicting directions, which can lead to tension if unaddressed. This pairing often exposes sensitive spots, making honest communication and clear boundaries essential. Keeping expectations realistic helps prevent emotional drain or misunderstandings.",
    ],
    damage: [
      "Your natural rhythms move in conflicting directions, which can lead to tension if unaddressed. This pairing often exposes sensitive spots, making honest communication and clear boundaries essential. Keeping expectations realistic helps prevent emotional drain or misunderstandings.",
    ],
    neutral: [
      "Your natural rhythms move in conflicting directions, which can lead to tension if unaddressed. This pairing often exposes sensitive spots, making honest communication and clear boundaries essential. Keeping expectations realistic helps prevent emotional drain or misunderstandings.",
    ],
  },
};

// 3) Tiny hash to pick a blurb deterministically

function hashKey(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// 4) Main function you call from the connection box

export function buildConnectionBlurbMinimal(opts: {
  tierLabel: TierLabel;
  chinesePattern: ChinesePattern;
  baseKey: string; // e.g. "Aquarius-Monkey|Sagittarius-Rabbit"
}): string {
  const { tierLabel, chinesePattern, baseKey } = opts;

  const tierSet = BLURBS[tierLabel];
  if (!tierSet) return "";

  const patternSet = tierSet[chinesePattern] || tierSet["neutral"];
  const arr = patternSet && patternSet.length ? patternSet : tierSet["neutral"];

  if (!arr || !arr.length) return "";

  const idx = hashKey(baseKey + tierLabel + chinesePattern) % arr.length;
  return arr[idx];
}

