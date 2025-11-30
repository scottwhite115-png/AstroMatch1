// nuanceEngine.ts — Chinese-pair nuance for all 12×12 animal combos.
// Copyright-safe: encodes public-domain patterns (trines/clashes/etc)
// + small original overrides and phrasing. Works for every pair.

// Types
export type East =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export type Tone = "great" | "good" | "mixed" | "hard";
export type Polarity = "opposite_sex" | "same_sex" | "unspecified";

export interface NuanceResult {
  chem: number;   // ±15 typical range
  long: number;   // ±12 typical range
  tone: Tone;     // qualitative summary
  notes: string[]; // 2 short, human-readable bullets
}

// --- Canonical structures ---
export const TRINES: East[][] = [
  ["Rat","Dragon","Monkey"],
  ["Ox","Snake","Rooster"],
  ["Tiger","Horse","Dog"],
  ["Rabbit","Goat","Pig"],
];

export const SECRET_FRIEND: Record<East, East> = {
  Rat: "Ox", Ox: "Rat", Tiger: "Pig", Pig: "Tiger",
  Rabbit: "Dog", Dog: "Rabbit", Dragon: "Rooster", Rooster: "Dragon",
  Snake: "Monkey", Monkey: "Snake", Horse: "Goat", Goat: "Horse",
};

// six classic clash pairs (both directions)
const CLASH = new Set([
  "Rat-Horse","Horse-Rat",
  "Ox-Goat","Goat-Ox",
  "Tiger-Monkey","Monkey-Tiger",
  "Rabbit-Rooster","Rooster-Rabbit",
  "Dragon-Dog","Dog-Dragon",
  "Snake-Pig","Pig-Snake",
]);

// adjacency on the 12-year cycle (each has two neighbors)
const CYCLE: East[] = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
function areAdjacent(a: East, b: East) {
  const i = CYCLE.indexOf(a), j = CYCLE.indexOf(b);
  if (i < 0 || j < 0) return false;
  const left = (i + 11) % 12, right = (i + 1) % 12;
  return j === left || j === right;
}

// helpers
const sameTrine = (a: East, b: East) => TRINES.some(t => t.includes(a) && t.includes(b));
const secretFriends = (a: East, b: East) => SECRET_FRIEND[a] === b;

// --- Base rule set (covers ALL 144 pairs) ---
function baseNuance(a: East, b: East): { chem: number; long: number; tone: Tone; tags: string[] } {
  if (a === b) return { chem: +6, long: +4, tone: "good", tags: ["same_animal"] };
  if (sameTrine(a,b)) return { chem: +10, long: +8, tone: "great", tags: ["trine"] };
  if (secretFriends(a,b)) return { chem: +8, long: +7, tone: "good", tags: ["secret_friend"] };
  if (CLASH.has(`${a}-${b}`)) return { chem: +2, long: -10, tone: "hard", tags: ["clash"] };
  if (areAdjacent(a,b)) return { chem: +4, long: +1, tone: "mixed", tags: ["adjacent"] };
  return { chem: +3, long: +3, tone: "good", tags: ["neutral"] }; // workable neutral
}

// --- Targeted overrides (kept small, original, and practical) ---
// These add flavor where lived experience frequently diverges from "just the chart".
type OverrideKey = `${East}-${East}`;
type Override = (ctx: {a:East,b:East,polarity:Polarity}) => Partial<NuanceResult> & { tag?: string };

const OV: Record<OverrideKey, Override> = {
  // Elite ally pairs inside trines
  "Rat-Monkey": () => ({ chem: +4, long: +2, tag: "elite_rat_monkey" }),
  "Monkey-Rat": () => ({ chem: +4, long: +2, tag: "elite_rat_monkey" }),
  "Dragon-Monkey": () => ({ chem: +4, long: +2, tag: "elite_dragon_monkey" }),
  "Monkey-Dragon": () => ({ chem: +4, long: +2, tag: "elite_dragon_monkey" }),
  "Dog-Tiger": () => ({ chem: +3, long: +4, tag: "steadfast_tiger_dog" }),
  "Tiger-Dog": () => ({ chem: +3, long: +4, tag: "steadfast_tiger_dog" }),
  "Rabbit-Goat": () => ({ chem: +3, long: +5, tag: "tender_rabbit_goat" }),
  "Goat-Rabbit": () => ({ chem: +3, long: +5, tag: "tender_rabbit_goat" }),
  "Pig-Goat": () => ({ chem: +3, long: +5, tag: "nurture_pig_goat" }),
  "Goat-Pig": () => ({ chem: +3, long: +5, tag: "nurture_pig_goat" }),
  "Snake-Rooster": () => ({ chem: +3, long: +4, tag: "admire_snake_rooster" }),
  "Rooster-Snake": () => ({ chem: +3, long: +4, tag: "admire_snake_rooster" }),
  "Ox-Snake": () => ({ chem: +3, long: +4, tag: "deep_ox_snake" }),
  "Snake-Ox": () => ({ chem: +3, long: +4, tag: "deep_ox_snake" }),
  "Horse-Goat": () => ({ chem: +4, long: +4, tag: "easy_horse_goat" }),
  "Goat-Horse": () => ({ chem: +4, long: +4, tag: "easy_horse_goat" }),

  // Classic hard pairs (keep it honest but usable)
  "Dragon-Dog": () => ({ chem: 0, long: -4, tag: "ideals_clash_dragon_dog" }),
  "Dog-Dragon": () => ({ chem: 0, long: -4, tag: "ideals_clash_dragon_dog" }),
  "Snake-Pig":  () => ({ chem: -2, long: -3, tag: "values_gap_snake_pig" }),
  "Pig-Snake":  () => ({ chem: -2, long: -3, tag: "values_gap_snake_pig" }),
  "Rat-Horse":  () => ({ chem: +1, long: -4, tag: "tempo_gap_rat_horse" }),
  "Horse-Rat":  () => ({ chem: +1, long: -4, tag: "tempo_gap_rat_horse" }),
  "Ox-Goat":    () => ({ chem: +1, long: -4, tag: "standards_gap_ox_goat" }),
  "Goat-Ox":    () => ({ chem: +1, long: -4, tag: "standards_gap_ox_goat" }),
  "Rabbit-Rooster": () => ({ chem: +1, long: -4, tag: "style_gap_rabbit_rooster" }),
  "Rooster-Rabbit": () => ({ chem: +1, long: -4, tag: "style_gap_rabbit_rooster" }),

  // Your requested polarity nuance:
  // Monkey × Tiger — same-sex rivalry vs opposite-sex spark/short-term.
  "Monkey-Tiger": ({polarity}) => polarity === "same_sex"
      ? ({ chem: -8, long: 0, tag: "monkey_tiger_rivalry" })
      : ({ chem: +10, long: -6, tag: "monkey_tiger_spicy" }),
  "Tiger-Monkey": ({polarity}) => polarity === "same_sex"
      ? ({ chem: -8, long: 0, tag: "monkey_tiger_rivalry" })
      : ({ chem: +10, long: -6, tag: "monkey_tiger_spicy" }),
};

// --- Phrase banks for 2 concise notes (no jargon) ---
const PHRASES = {
  // tags or structural cues → human sentences
  trine: [
    "You fall into an easy, encouraging rhythm.",
    "Instincts align; trust builds quickly.",
  ],
  secret_friend: [
    "There's a quiet, natural affinity.",
    "You steady each other without trying.",
  ],
  clash: [
    "Strong pull, but emotions can flare.",
    "Different instincts — fairness matters.",
  ],
  adjacent: [
    "Neighbors in temperament; curiosity keeps it lively.",
    "Similar pace with just enough contrast.",
  ],
  same_animal: [
    "Like meets like — familiar strengths and blind spots.",
    "Shared style makes bonding quick and honest.",
  ],
  elite_rat_monkey: [
    "Wit and loyalty go hand in hand here.",
    "You bring out each other's brilliance.",
  ],
  elite_dragon_monkey: [
    "Ambition meets agility — a true power pair.",
    "Big vision with clever execution.",
  ],
  steadfast_tiger_dog: [
    "Courage and loyalty reinforce each other.",
    "You protect what you build together.",
  ],
  tender_rabbit_goat: [
    "Gentle support and everyday warmth.",
    "Soft hearts that care deeply.",
  ],
  nurture_pig_goat: [
    "Kindness first; home feels nourishing.",
    "Affection turns into lasting comfort.",
  ],
  admire_snake_rooster: [
    "Competence and elegance win mutual respect.",
    "Precision meets insight — strong teamwork.",
  ],
  deep_ox_snake: [
    "Quiet devotion with strategic calm.",
    "Steady trust grows over time.",
  ],
  easy_horse_goat: [
    "Easygoing joy and shared freedom.",
    "Lightness that still feels safe.",
  ],
  ideals_clash_dragon_dog: [
    "Pride and principle can collide.",
    "Different codes need careful listening.",
  ],
  values_gap_snake_pig: [
    "Privacy vs openness needs care.",
    "Gentleness helps bridge priorities.",
  ],
  tempo_gap_rat_horse: [
    "Different speeds — sync plans early.",
    "Restlessness vs. caution needs balance.",
  ],
  standards_gap_ox_goat: [
    "Practicality meets sensitivity — go steady.",
    "Standards differ; kindness smooths edges.",
  ],
  style_gap_rabbit_rooster: [
    "Softness meets blunt honesty — use tact.",
    "Different styles, same goodwill if gentle.",
  ],
  monkey_tiger_spicy: [
    "Off-the-charts chemistry — keep it playful.",
    "High spark, manage heat with respect.",
  ],
  monkey_tiger_rivalry: [
    "Competitive edge can cut — soften the stance.",
    "Mutual pride needs humor and space.",
  ],
};

// Pick 2 phrases based on tags; fallback to structure cues
function pickNotes(tags: string[]): string[] {
  const out: string[] = [];
  // Prefer specific tags first
  for (const t of tags) {
    const bank = (PHRASES as any)[t];
    if (bank && out.length < 2) out.push(bank[0]);
    if (bank && out.length < 2 && bank[1]) out.push(bank[1]);
    if (out.length >= 2) break;
  }
  // fallback by structural hints
  if (out.length < 2) {
    if (tags.includes("trine")) out.push(...PHRASES.trine.slice(0, 2 - out.length));
    else if (tags.includes("secret_friend")) out.push(...PHRASES.secret_friend.slice(0, 2 - out.length));
    else if (tags.includes("clash")) out.push(...PHRASES.clash.slice(0, 2 - out.length));
    else if (tags.includes("adjacent")) out.push(...PHRASES.adjacent.slice(0, 2 - out.length));
    else if (tags.includes("same_animal")) out.push(...PHRASES.same_animal.slice(0, 2 - out.length));
  }
  // absolute fallback
  while (out.length < 2) out.push("Different strengths that can fit well.", "Care and clarity keep it strong.")[out.length];
  return out.slice(0,2);
}

// --- Public API ---
export function computeChineseNuance(a: East, b: East, polarity: Polarity = "unspecified"): NuanceResult {
  // 1) base
  const base = baseNuance(a, b);
  let chem = base.chem;
  let long = base.long;
  const tags = new Set(base.tags);

  // 2) override (if any)
  const k: OverrideKey = `${a}-${b}`;
  const k2: OverrideKey = `${b}-${a}`;
  const fn = OV[k] || OV[k2];
  if (fn) {
    const o = fn({a,b,polarity});
    if (typeof o.chem === "number") chem += o.chem;
    if (typeof o.long === "number") long += o.long;
    if ((o as any).tag) tags.add((o as any).tag);
  }

  // 3) bound the deltas to reasonable range
  chem = Math.max(-15, Math.min(15, Math.round(chem)));
  long = Math.max(-12, Math.min(12, Math.round(long)));

  // 4) tone heuristic
  const tone: Tone =
    chem >= 10 && long >= 6 ? "great" :
    chem >= 6  && long >= 3 ? "good"  :
    long <= -6 ? "hard"     : "mixed";

  // 5) notes (2 crisp, human lines)
  const notes = pickNotes([...tags]);

  return { chem, long, tone, notes };
}

