// /data/longformBlurbs.ts
// Detailed longform compatibility content for top-tier pairings

export type LongformBlurb = {
  pair_id: string;
  tier: 'soulmate' | 'twin' | 'excellent';
  headline: string;
  body: string;
  east_west_notes: {
    east: { label: string; text: string };
    west: { label: string; text: string };
  };
};

export const LONGFORM_BLURBS: Record<string, LongformBlurb> = {
  // SOULMATE TIER (90-100%) - Only pairs with 90%+ scores
  
  "aquarius_monkey|aquarius_monkey": {
    pair_id: "aquarius_monkey|aquarius_monkey",
    tier: "soulmate",
    headline: "Perfect Harmony",
    body: "You bring out the best in each other. The connection feels effortless yet deeply engaging — a rare balance of friendship, intellect, and emotional support. Both of you value independence but don't weaponize it; you give each other space to grow and ideas to thrive on. Conversation sparks action, plans form quickly, and the bond matures through mutual respect and shared vision.",
    east_west_notes: {
      east: { label: "Monkey × Monkey — Same Sign", text: "Shared rhythm, quick wits, social agility; keep the relationship grounded when curiosity scatters focus." },
      west: { label: "Aquarius × Aquarius — Air × Air", text: "Easy perspective-sharing; nurture emotional presence alongside the mental sync." }
    }
  },

  "aquarius_monkey|gemini_rat": {
    pair_id: "aquarius_monkey|gemini_rat",
    tier: "soulmate",
    headline: "Perfect Harmony",
    body: "Playful minds meet restless ingenuity. Aquarius brings principle and big-picture clarity; Gemini contributes versatility and momentum. Monkey–Rat adds speed and opportunity-scouting. Together you turn bright ideas into timely moves, balancing originality with execution.",
    east_west_notes: {
      east: { label: "Monkey × Rat — Same Trine (Visionaries)", text: "Fast, future-focused, expressive; channel ambition collaboratively, not competitively." },
      west: { label: "Aquarius × Gemini — Air × Air", text: "Endless conversation; set decision windows to avoid analysis loops." }
    }
  },

  "libra_dragon|pisces_dragon": {
    pair_id: "libra_dragon|pisces_dragon",
    tier: "soulmate",
    headline: "Perfect Harmony",
    body: "Two Dragons, one poised, one intuitive. Libra steadies the scales with fairness and aesthetics; Pisces deepens compassion and imaginative depth. You co-create a life that is both beautiful and kind, with Dragon resolve anchoring the dream.",
    east_west_notes: {
      east: { label: "Dragon × Dragon — Same Sign", text: "Shared willpower and standards; soften pride with frequent appreciation." },
      west: { label: "Libra × Pisces — Air × Water (supportive)", text: "Ideas guided by empathy; keep boundaries clear when emotions run high." }
    }
  },

  "capricorn_ox|virgo_snake": {
    pair_id: "capricorn_ox|virgo_snake",
    tier: "soulmate",
    headline: "Perfect Harmony",
    body: "Measured ambition meets strategic insight. Capricorn–Ox delivers integrity and endurance; Virgo–Snake refines, anticipates, and optimizes. The result is quiet excellence: dependable progress, elegant solutions, and trust built through consistent follow-through.",
    east_west_notes: {
      east: { label: "Ox × Snake — Harmonious cadence (Strategists)", text: "Steady tempo, prudent choices; remember to celebrate milestones." },
      west: { label: "Capricorn × Virgo — Earth × Earth", text: "Shared standards and routines; add spontaneity to keep warmth alive." }
    }
  },

  "taurus_rabbit|cancer_sheep": {
    pair_id: "taurus_rabbit|cancer_sheep",
    tier: "soulmate",
    headline: "Perfect Harmony",
    body: "Gentle steadiness meets protective warmth. Taurus–Rabbit creates comfort and loyalty; Cancer–Sheep brings care, artistry, and emotional intelligence. Home becomes a sanctuary and a studio; love grows through tenderness and craft.",
    east_west_notes: {
      east: { label: "Rabbit × Sheep — Same Trine (Artists)", text: "Sensitivity, grace, taste; watch for avoidance of necessary conflict." },
      west: { label: "Taurus × Cancer — Earth × Water (supportive)", text: "Nurture and security align; schedule practical check-ins during emotional tides." }
    }
  },

  "scorpio_dragon|aquarius_monkey": {
    pair_id: "scorpio_dragon|aquarius_monkey",
    tier: "soulmate",
    headline: "Perfect Harmony",
    body: "Depth meets vision. Scorpio–Dragon contributes intensity, conviction, and transformative focus; Aquarius–Monkey offers invention, networks, and timing. You turn missions into movements by blending purpose with reach — power with possibility.",
    east_west_notes: {
      east: { label: "Dragon × Monkey — Same Trine (Visionaries)", text: "Charisma and ingenuity; keep ego in service of the shared aim." },
      west: { label: "Scorpio × Aquarius — Fixed signs (Air/Water tension)", text: "Strong wills; agree on process so persistence doesn't become a standoff." }
    }
  },

  "aries_rat|leo_monkey": {
    pair_id: "aries_rat|leo_monkey",
    tier: "soulmate",
    headline: "Perfect Harmony",
    body: "Initiation meets expression. Aries–Rat spots openings and acts; Leo–Monkey amplifies, connects, and sustains momentum. Together you are courageous and contagious — the spark and the spotlight working as one.",
    east_west_notes: {
      east: { label: "Rat × Monkey — Same Trine (Visionaries)", text: "Quick, opportunistic, inventive; set shared guardrails for risk." },
      west: { label: "Aries × Leo — Fire × Fire", text: "High passion and loyalty; build repair habits for hot moments." }
    }
  },

  "gemini_rat|libra_monkey": {
    pair_id: "gemini_rat|libra_monkey",
    tier: "soulmate",
    headline: "Perfect Harmony",
    body: "Dialogue becomes design. Gemini–Rat ideates and iterates; Libra–Monkey curates, negotiates, and delivers polish. Social intelligence plus timing yields elegant outcomes and a relationship that feels light yet reliable.",
    east_west_notes: {
      east: { label: "Rat × Monkey — Same Trine (Visionaries)", text: "Fast cycle from idea to action; avoid overbooking your lives." },
      west: { label: "Gemini × Libra — Air × Air", text: "Harmony in conversation; decide by deadlines to prevent drift." }
    }
  },

  "pisces_pig|scorpio_snake": {
    pair_id: "pisces_pig|scorpio_snake",
    tier: "soulmate",
    headline: "Perfect Harmony",
    body: "Compassion meets strategy. Pisces–Pig offers generosity and emotional breadth; Scorpio–Snake brings discernment, calm power, and protective focus. You create safety that inspires growth — soft on people, strong on purpose.",
    east_west_notes: {
      east: { label: "Pig × Snake — Complementary pace", text: "Kindness matched with wisdom; name needs openly to avoid silent assumptions." },
      west: { label: "Pisces × Scorpio — Water × Water", text: "Profound empathy; keep perspective by anchoring shared routines." }
    }
  },

  // TWIN FLAME TIER (85-89%)

  "leo_dragon|sagittarius_tiger": {
    pair_id: "leo_dragon|sagittarius_tiger",
    tier: "twin",
    headline: "Magnetic Synergy",
    body: "Two bright fires meeting mid-sky. You amplify each other's confidence and zest for life. There's attraction, laughter, and the shared thrill of pursuit — of goals, adventure, and each other. Temper pride with humility, and your energy becomes creative instead of combustible.",
    east_west_notes: {
      east: { label: "Dragon × Tiger — Cross Trine (Visionary meets Adventurer)", text: "Both dynamic and strong-willed; blend innovation with action to stay aligned." },
      west: { label: "Leo × Sagittarius — Fire × Fire", text: "Shared optimism fuels progress; rest often so inspiration stays fresh." }
    }
  },

};

// Helper to get longform blurb by pair ID
export function getLongformBlurb(pairId: string): LongformBlurb | null {
  return LONGFORM_BLURBS[pairId] || null;
}

// Helper to create pair ID from signs (normalized)
export function createPairId(westA: string, eastA: string, westB: string, eastB: string): string {
  const a = `${westA.toLowerCase()}_${eastA.toLowerCase()}`;
  const b = `${westB.toLowerCase()}_${eastB.toLowerCase()}`;
  // Sort alphabetically for consistent lookups
  return a <= b ? `${a}|${b}` : `${b}|${a}`;
}
