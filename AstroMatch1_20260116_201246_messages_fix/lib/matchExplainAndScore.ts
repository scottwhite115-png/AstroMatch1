// /lib/matchExplainAndScore.ts
// Enhanced match scoring with semi-compatibility, same-sign bonuses, Suzanne White nuances, and score overrides

import { getScoreOverride, createOverridePairId } from '@/data/scoreOverrides';
import { getLongformBlurb, createPairId } from '@/data/longformBlurbs';
import { engineConfig, isChineseOpposite as checkChineseOpposite, getChineseOppositeOverride } from './matchEngine.config';
import { engineData, getKey, type ChineseRel } from './chineseRelationships';
import { classifyMatch } from './matchCategory';

// ---------- Chinese Trines ----------
const TRINE: Record<string, { group: "Visionaries" | "Strategists" | "Adventurers" | "Artists"; title: string; summary: string }> = {
  Rat:     { group: "Visionaries",  title: "Rat–Dragon–Monkey",    summary: "Clever, expressive, and future-focused." },
  Dragon:  { group: "Visionaries",  title: "Rat–Dragon–Monkey",    summary: "Clever, expressive, and future-focused." },
  Monkey:  { group: "Visionaries",  title: "Rat–Dragon–Monkey",    summary: "Clever, expressive, and future-focused." },

  Ox:      { group: "Strategists",  title: "Ox–Snake–Rooster",     summary: "Disciplined, loyal, and analytical." },
  Snake:   { group: "Strategists",  title: "Ox–Snake–Rooster",     summary: "Disciplined, loyal, and analytical." },
  Rooster: { group: "Strategists",  title: "Ox–Snake–Rooster",     summary: "Disciplined, loyal, and analytical." },

  Tiger:   { group: "Adventurers",  title: "Tiger–Horse–Dog",      summary: "Bold, free-spirited, and action-oriented." },
  Horse:   { group: "Adventurers",  title: "Tiger–Horse–Dog",      summary: "Bold, free-spirited, and action-oriented." },
  Dog:     { group: "Adventurers",  title: "Tiger–Horse–Dog",      summary: "Bold, free-spirited, and action-oriented." },

  Rabbit:  { group: "Artists",      title: "Rabbit–Goat–Pig",      summary: "Gentle, kind, and emotionally aware." },
  Goat:    { group: "Artists",      title: "Rabbit–Goat–Pig",      summary: "Gentle, kind, and emotionally aware." },
  Pig:     { group: "Artists",      title: "Rabbit–Goat–Pig",      summary: "Gentle, kind, and emotionally aware." },
};

// ---------- Western Elements ----------
type Elem = "Fire" | "Earth" | "Air" | "Water";
const ELEM: Record<string, Elem> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};

// Compatible element pairs (symmetric)
const ELEM_COMPAT: Record<Elem, Elem[]> = {
  Fire: ["Air"],   // Fire ↔ Air
  Air: ["Fire"],
  Earth: ["Water"],// Earth ↔ Water
  Water: ["Earth"],
};

// Semi-compatible (Suzanne White nuance): Air–Water, Fire–Earth (bidirectional)
const ELEM_SEMI: Record<Elem, Elem[]> = {
  Fire: ["Earth"], 
  Earth: ["Fire"], 
  Air: ["Water"], 
  Water: ["Air"],
};

// ---------- Band Ranges & Seeded Western Scoring ----------
type Bands = "High" | "Moderate" | "Challenging";

const BAND_RANGES = {
  High:       { min: 80, max: 95, midpoint: 88 },
  Moderate:   { min: 65, max: 79, midpoint: 72 },
  Challenging:{ min: 45, max: 64, midpoint: 55 }
} as const;

type PairKey = `${string}|${string}`;

const toKey = (a: string, b: string): PairKey => {
  const [x, y] = [a.trim(), b.trim()];
  return (x.localeCompare(y) <= 0 ? `${x}|${y}` : `${y}|${x}`) as PairKey;
};

// 30 consensus pairs → band label
const SEED_30: Record<PairKey, Bands> = {
  [toKey("Aries","Libra")]: "High",
  [toKey("Aries","Capricorn")]: "Challenging",
  [toKey("Aries","Leo")]: "High",

  [toKey("Taurus","Cancer")]: "High",
  [toKey("Taurus","Virgo")]: "Moderate",
  [toKey("Taurus","Scorpio")]: "High",

  [toKey("Gemini","Sagittarius")]: "High",
  [toKey("Gemini","Pisces")]: "Challenging",
  [toKey("Gemini","Libra")]: "High",

  [toKey("Cancer","Scorpio")]: "High",
  [toKey("Cancer","Capricorn")]: "Moderate",
  [toKey("Cancer","Taurus")]: "High",

  [toKey("Leo","Aquarius")]: "Moderate",
  [toKey("Leo","Aries")]: "High",
  [toKey("Leo","Scorpio")]: "Challenging",

  [toKey("Virgo","Pisces")]: "Moderate",
  [toKey("Virgo","Sagittarius")]: "Challenging",
  [toKey("Virgo","Taurus")]: "Moderate",

  [toKey("Libra","Pisces")]: "Moderate",
  [toKey("Libra","Gemini")]: "High",
  [toKey("Libra","Aries")]: "High",

  [toKey("Scorpio","Taurus")]: "High",
  [toKey("Scorpio","Leo")]: "Challenging",
  [toKey("Scorpio","Cancer")]: "High",

  [toKey("Sagittarius","Virgo")]: "Challenging",
  [toKey("Sagittarius","Gemini")]: "High",
  [toKey("Sagittarius","Leo")]: "High",

  [toKey("Capricorn","Cancer")]: "Moderate",
  [toKey("Capricorn","Aries")]: "Challenging",
  [toKey("Capricorn","Virgo")]: "High",

  [toKey("Aquarius","Leo")]: "Moderate",
  [toKey("Aquarius","Gemini")]: "High",
  [toKey("Aquarius","Taurus")]: "Challenging",

  [toKey("Pisces","Virgo")]: "Moderate",
  [toKey("Pisces","Libra")]: "Moderate",
  [toKey("Pisces","Scorpio")]: "High"
};

const bandToScore = (b: Bands) => BAND_RANGES[b].midpoint;

/**
 * Returns a Western base score (0–100) compatible with your engine.
 * If the pair is in the 30-seed table → returns mapped midpoint (88/72/55).
 * Otherwise → falls back to your current (legacy) Western scoring.
 */
export function getWesternBaseScoreSeeded(
  westA: string,
  westB: string,
  legacyWesternScore: (a: string, b: string) => number
): number {
  const k = toKey(westA, westB);
  const band = SEED_30[k];
  return band ? bandToScore(band) : legacyWesternScore(westA, westB);
}

// ---------- Rank Bands ----------
type RankKey = "soulmate" | "twin_flame" | "excellent" | "good" | "learning" | "challenging" | "incompatible";
const RANKS: Array<{
  key: RankKey;
  label: string;            // e.g., "Good"
  connectionLabel: string;  // e.g., "Cosmic Companions"
  min: number; max: number;
  emoji: string; colorRgb: string;
}> = [
  { key: "soulmate",     label: "Soulmate connection",     connectionLabel: "Destined Union",    min: 95, max: 100, emoji: "⭐", colorRgb: "rgb(212, 175, 55)" },
  { key: "twin_flame",   label: "Twin Flame connection",   connectionLabel: "Magnetic Synergy",  min: 85, max: 94,  emoji: "🔥", colorRgb: "rgb(249, 115, 22)" },
  { key: "excellent",    label: "Excellent connection",    connectionLabel: "Kindred Spirits",   min: 70, max: 84,  emoji: "💖", colorRgb: "rgb(236, 72, 153)" },
  { key: "good",         label: "Good connection",         connectionLabel: "Cosmic Companions", min: 55, max: 69,  emoji: "🌙", colorRgb: "rgb(168, 85, 247)" },
  { key: "learning",     label: "Learning connection",     connectionLabel: "Karmic Teachers",   min: 40, max: 54,  emoji: "🧭", colorRgb: "rgb(59, 130, 246)" },
  { key: "challenging",  label: "Challenging connection",  connectionLabel: "Opposite Orbits",   min: 25, max: 39,  emoji: "⚡", colorRgb: "rgb(239, 68, 68)" },
  { key: "incompatible", label: "Incompatible connection", connectionLabel: "Crossed Paths",     min: 0,  max: 24,  emoji: "💔", colorRgb: "rgb(107, 114, 128)" },
];

function rankFor(score: number) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  return RANKS.find(r => s >= r.min && s <= r.max)!;
}

// ---------- Enhanced Auto-Generation Functions ----------

/**
 * Generate rich, multi-sentence Eastern (Chinese) rationale
 */
function generateEastRationale(
  aEast: string,
  bEast: string,
  sameTrine: boolean,
  sameEastSign: boolean,
  trineGroup: string
): string {
  if (sameEastSign) {
    // Same sign combinations - very specific
    const signTraits: Record<string, string[]> = {
      Rat: ["quick-witted and opportunistic", "natural problem-solvers", "ambitious and resourceful"],
      Ox: ["patient and methodical", "reliable and determined", "strong-willed and practical"],
      Tiger: ["bold and adventurous", "passionate and independent", "fearless and energetic"],
      Rabbit: ["gentle and diplomatic", "intuitive and sensitive", "artistic and peace-loving"],
      Dragon: ["powerful and charismatic", "confident and ambitious", "creative and visionary"],
      Snake: ["wise and mysterious", "intuitive and analytical", "deep-thinking and elegant"],
      Horse: ["free-spirited and energetic", "independent and adventurous", "optimistic and social"],
      Goat: ["artistic and gentle", "creative and empathetic", "peaceful and nurturing"],
      Monkey: ["playful and clever", "adaptable and inventive", "curious and quick-witted"],
      Rooster: ["organized and detail-oriented", "confident and observant", "practical and efficient"],
      Dog: ["loyal and honest", "protective and reliable", "faithful and caring"],
      Pig: ["generous and easygoing", "sincere and optimistic", "kind-hearted and tolerant"],
    };
    
    const traits = signTraits[aEast] || ["compatible", "harmonious", "well-matched"];
    return `You share the same ${aEast} energy, creating an instant understanding of each other's ${traits[0]} nature. Your ${traits[1]} qualities align perfectly, making communication effortless and natural.`;
  } else if (sameTrine) {
    // Same trine combinations
    const groupDescriptions: Record<string, { first: string; second: string }> = {
      Visionaries: {
        first: "Both of you think in terms of possibilities and future potential, always looking ahead with clever minds and expressive ideas.",
        second: "Your shared vision and quick adaptability mean you can pivot together, turning ambitious plans into reality with natural coordination."
      },
      Strategists: {
        first: "You both value discipline and careful planning, approaching life with analytical minds and loyal hearts.",
        second: "Your methodical approach and shared standards create a stable foundation where trust builds quickly and goals align naturally."
      },
      Adventurers: {
        first: "You're both action-oriented and bold, valuing freedom and independence while pursuing exciting experiences together.",
        second: "Your energetic spirits and adventurous hearts mean you'll inspire each other to take risks and explore new horizons as a team."
      },
      Artists: {
        first: "You share a gentle, emotionally aware approach to life, valuing beauty, kindness, and meaningful connections.",
        second: "Your sensitive natures and creative spirits create a nurturing environment where both of you can express yourselves authentically and feel truly understood."
      }
    };
    
    const desc = groupDescriptions[trineGroup] || groupDescriptions.Visionaries;
    // Return just the first sentence for 2-line format
    return desc.first;
  } else {
    // Cross-trine combinations
    const aGroup = TRINE[aEast].group;
    const bGroup = TRINE[bEast].group;
    
    return `Your different life rhythms create a complementary dynamic where ${aEast}'s ${aGroup.toLowerCase()} energy balances ${bEast}'s ${bGroup.toLowerCase()} approach. While your paces may differ, curiosity and mutual respect bridge the gap beautifully.`;
  }
}

/**
 * Generate rich, multi-sentence Western (Element) rationale
 */
function generateWestRationale(
  aWest: string,
  bWest: string,
  aEl: Elem,
  bEl: Elem,
  sameWestSign: boolean,
  compatType: "same" | "compatible" | "semi" | "conflicting"
): string {
  if (sameWestSign) {
    // Same sign combinations
    const signDescriptions: Record<string, string[]> = {
      Aries: ["passionate and action-oriented", "Your bold, independent spirits create an exciting partnership where initiative and energy flow naturally.", "Together, you'll inspire each other to pursue goals with unwavering determination and mutual support."],
      Taurus: ["grounded and sensual", "Your practical, steady approach to life creates a stable foundation built on shared values and reliable routines.", "You both appreciate the finer things in life and will build a comfortable, secure partnership together."],
      Gemini: ["intellectual and adaptable", "Your quick minds and curious spirits mean conversation never stops, and you'll always find new topics to explore together.", "Your shared love of variety and learning keeps the relationship fresh and intellectually stimulating."],
      Cancer: ["nurturing and intuitive", "Your emotional depth and caring nature create a safe, supportive environment where both of you can express feelings freely.", "You'll build a warm, home-centered life together, valuing family and emotional security above all."],
      Leo: ["confident and generous", "Your charismatic personalities and creative spirits mean you'll inspire and admire each other's passion for life.", "Together, you create a vibrant partnership where mutual respect and shared enthusiasm fuel your connection."],
      Virgo: ["analytical and detail-oriented", "Your practical minds and perfectionist tendencies create an organized, efficient partnership where you'll help each other improve.", "You both value quality over quantity, building a relationship based on trust, reliability, and thoughtful gestures."],
      Libra: ["balanced and diplomatic", "Your love of harmony and beauty means you'll create an aesthetically pleasing life together, valuing fairness and partnership.", "You both seek peace and cooperation, building a relationship where compromise and mutual respect come naturally."],
      Scorpio: ["intense and transformative", "Your deep emotional connection and passionate natures create a powerful bond built on trust and mutual understanding.", "You'll explore life's mysteries together, building an unbreakable partnership where honesty and loyalty are paramount."],
      Sagittarius: ["optimistic and adventurous", "Your free spirits and philosophical minds mean you'll explore the world together, both physically and intellectually.", "You both value freedom and growth, creating a relationship where adventure and learning never stop."],
      Capricorn: ["ambitious and disciplined", "Your practical, goal-oriented approach to life creates a strong foundation where both of you can achieve long-term success together.", "You share a commitment to building something lasting, valuing stability and hard work in equal measure."],
      Aquarius: ["innovative and independent", "Your forward-thinking minds and unique perspectives mean you'll inspire each other's creativity and support each other's individuality.", "You both value freedom and intellectual connection, building a relationship based on mutual respect and shared vision for the future."],
      Pisces: ["intuitive and empathetic", "Your sensitive, artistic natures create a deeply emotional connection where you understand each other on a soul level.", "You'll create a dreamy, compassionate partnership where both of you can express your creativity and emotions freely."],
    };
    
    const desc = signDescriptions[aWest] || signDescriptions.Aquarius;
    // Return just one sentence for 2-line format
    return desc[1];
  } else if (compatType === "same") {
    // Same element combinations
    const elementDescriptions: Record<Elem, string[]> = {
      Fire: [
        "You both operate with passion, energy, and enthusiasm, creating a dynamic partnership where sparks fly constantly.",
        "Your shared fiery nature means you'll inspire each other's ambitions and share exciting adventures together, though you'll need to balance intensity with moments of rest."
      ],
      Earth: [
        "You both value stability, practicality, and reliability, building a solid foundation based on shared goals and mutual respect.",
        "Your grounded approach to life creates a comfortable, secure partnership where you can count on each other for support and consistency."
      ],
      Air: [
        "You both think in terms of ideas, communication, and intellectual connection, creating a relationship built on mental stimulation and shared curiosity.",
        "Your airy natures mean conversation flows effortlessly and you'll always find new topics to explore together, though you'll benefit from grounding your plans in action."
      ],
      Water: [
        "You both operate through emotions, intuition, and deep feeling, creating an empathetic connection where you understand each other's needs instinctively.",
        "Your watery nature means you'll create an emotionally rich, nurturing partnership where both of you feel safe to express vulnerability and depth."
      ]
    };
    
    const desc = elementDescriptions[aEl];
    // Return just the first sentence for 2-line format
    return desc[0];
  } else if (compatType === "compatible") {
    // Compatible element combinations (Fire-Air, Earth-Water)
    const compatiblePairs: Record<string, string[]> = {
      "Fire-Air": [
        "Fire and Air create a vibrant, energetic partnership where passion meets intellect.",
        "Your complementary energies mean you'll inspire each other's ideas while fueling each other's enthusiasm, creating a dynamic and exciting connection."
      ],
      "Air-Fire": [
        "Air and Fire combine to create a lively, stimulating partnership where ideas ignite passion.",
        "Your complementary elements mean you'll spark each other's creativity and support each other's ambitions, building a relationship full of energy and intellectual growth."
      ],
      "Earth-Water": [
        "Earth and Water blend beautifully, creating a stable yet emotionally rich partnership.",
        "Your complementary natures mean you'll provide each other with both security and emotional depth, building a relationship that's both grounded and nurturing."
      ],
      "Water-Earth": [
        "Water and Earth combine to create a nurturing, supportive partnership where emotions find stability.",
        "Your complementary elements mean you'll balance each other's needs for both emotional expression and practical support, creating a harmonious and secure connection."
      ]
    };
    
    const key = `${aEl}-${bEl}`;
    const desc = compatiblePairs[key] || compatiblePairs["Fire-Air"];
    // Return just the first sentence for 2-line format
    return desc[0];
  } else if (compatType === "semi") {
    // Semi-compatible combinations (Air-Water, Fire-Earth)
    const semiPairs: Record<string, string[]> = {
      "Air-Water": [
        "Air and Water create an interesting dynamic where intellect meets emotion, requiring patience and understanding.",
        "Your different approaches to life mean you'll learn from each other, but you'll need to communicate openly to bridge the gap between thinking and feeling."
      ],
      "Water-Air": [
        "Water and Air combine in a way that requires balance, where emotional depth meets intellectual curiosity.",
        "Your different natures mean you'll complement each other beautifully once you learn to appreciate both logic and intuition, creating a relationship that grows through mutual understanding."
      ],
      "Fire-Earth": [
        "Fire and Earth create a partnership where passion meets practicality, requiring compromise and mutual respect.",
        "Your different energies mean you'll balance each other's extremes, but you'll need patience to appreciate both spontaneity and stability in your relationship."
      ],
      "Earth-Fire": [
        "Earth and Fire combine in a way that requires understanding, where stability meets passion.",
        "Your different approaches mean you'll provide each other with both grounding and inspiration, creating a relationship that benefits from celebrating your unique strengths together."
      ]
    };
    
    const key = `${aEl}-${bEl}`;
    const desc = semiPairs[key] || semiPairs["Air-Water"];
    // Return just the first sentence for 2-line format
    return desc[0];
  } else {
    // Conflicting combinations (Fire-Water, Air-Earth)
    const conflictingPairs: Record<string, string[]> = {
      "Fire-Water": [
        "Fire and Water create a challenging dynamic where passion meets emotion, requiring significant patience and understanding.",
        "Your opposing elements mean you'll experience intense attraction but also significant differences in approach. Growth comes through learning to balance your needs and respecting each other's fundamental nature."
      ],
      "Water-Fire": [
        "Water and Fire combine in a way that requires careful navigation, where emotional depth meets passionate intensity.",
        "Your opposing elements mean you'll need to work harder to find common ground, but the intensity can lead to deep transformation if both partners are willing to understand and adapt."
      ],
      "Air-Earth": [
        "Air and Earth create a partnership where ideas meet practicality, requiring compromise and mutual appreciation.",
        "Your opposing elements mean you'll challenge each other's perspectives, but you can also learn valuable lessons about balancing dreams with reality and theory with action."
      ],
      "Earth-Air": [
        "Earth and Air combine in a way that requires patience, where stability meets change.",
        "Your opposing elements mean you'll need to work to understand each other's priorities, but you can also create a balanced relationship where both security and freedom are valued."
      ]
    };
    
    const key = `${aEl}-${bEl}`;
    const desc = conflictingPairs[key] || conflictingPairs["Fire-Water"];
    // Return just the first sentence for 2-line format
    return desc[0];
  }
}

// ---------- Scoring Weights (expanded with nuances) ----------
const BASE = 50; // neutral baseline
const WEIGHTS = {
  trine: {
    same: +20,   // stronger Chinese harmony (same trine)
    cross: -2,   // slight disconnect for cross-trine (opposed_trine)
    opposite: -10, // base penalty for opposites (will be offset by +6 bonus)
  },
  element: {
    same: +20,        // fully harmonious element connection
    compatible: +10,  // complementary (Fire–Air / Earth–Water)
    semi: 0,          // neutral semi-compatible (Air–Water, Fire–Earth)
    conflicting: -15, // tense (Fire–Water, Air–Earth when not semi)
  },
  synergy: {
    perfect: +10,     // Same Trine + Same Element → extra resonance (caps at 100)
    strong: +5        // Same Trine + Compatible Element → small lift
  },
  sameSign: {
    west: +6,         // bonus for matching Western sign
    east: +4,         // bonus for matching Chinese sign
  },
  nuance: {
    sameTrine_semi: +8,           // same trine softens semi-compat tension
    sameTrine_conflict: +4,       // same trine softens conflict
    crossTrine_semi: +3,          // cross-trine with semi-compat gets small boost
    crossTrine_conflict: -6,      // cross-trine with conflict is harder
  },
};

// ---------- Main helper ----------
export function explainMatchAndScore(
  aWest: keyof typeof ELEM,
  aEast: keyof typeof TRINE,
  bWest: keyof typeof ELEM,
  bEast: keyof typeof TRINE,
  base: number = BASE
) {
  // ---- Check for score override FIRST ----
  const pairId = createOverridePairId(aWest as string, aEast as string, bWest as string, bEast as string);
  const override = getScoreOverride(pairId);
  
  // ---- Check for longform blurb ----
  const longform = getLongformBlurb(pairId);
  
  // ---- Chinese rationale ----
  const aT = TRINE[aEast], bT = TRINE[bEast];
  const sameTrine = aT.group === bT.group;
  const sameEastSign = aEast === bEast;
  
  // Get Chinese relationship using new data structure
  const chineseKey = getKey(aEast as string, bEast as string);
  const chineseRel: ChineseRel = engineData.chinese_relationships[chineseKey] ?? { type: "neutral", delta: 0 };
  
  // Check if Chinese signs are opposites (magnetic opposites) - for legacy compatibility
  const chineseOppositeRule = engineConfig.rules.chinese_opposites;
  const isChineseOppositePair = chineseOppositeRule?.enabled && 
    checkChineseOpposite(aEast as string, bEast as string, chineseOppositeRule.pairs);

  let east_relation: string;
  let east_summary: string;
  
  // Use longform content if available
  if (longform) {
    east_relation = longform.east_west_notes.east.label;
    east_summary = longform.east_west_notes.east.text;
  } else if (sameEastSign) {
    east_relation = `${aEast} × ${bEast} — Same Sign`;
    east_summary = generateEastRationale(aEast, bEast, sameTrine, sameEastSign, aT.group);
  } else {
    // Use new relationship data structure for tags and blurbs
    const tag = engineData.ui_tags[chineseRel.type] ?? "";
    const blurbSeed = engineData.blurb_templates[chineseRel.type] ?? "";
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Match Engine] Chinese relationship lookup:`, {
        key: chineseKey,
        type: chineseRel.type,
        delta: chineseRel.delta,
        tag,
        aEast,
        bEast
      });
    }
    
    if (tag && chineseRel.type !== "neutral") {
      // Use the tag and blurb from the relationship data
      east_relation = `${aEast} × ${bEast} — ${tag}`;
      east_summary = blurbSeed || generateEastRationale(aEast, bEast, sameTrine, sameEastSign, aT.group);
    } else if (sameTrine) {
      east_relation = `${aEast} × ${bEast} — Same Trine: ${aT.group}`;
      east_summary = generateEastRationale(aEast, bEast, sameTrine, sameEastSign, aT.group);
    } else {
      east_relation = `${aEast} × ${bEast} — Cross-Trine`;
      east_summary = generateEastRationale(aEast, bEast, sameTrine, sameEastSign, aT.group);
    }
  }

  // Calculate trine adjustment using new relationship delta
  // The delta from chineseRel will be applied to the base score
  let trineAdjust: number;
  let chineseRelationshipDelta = 0;
  
  if (chineseRel.type === "opposite") {
    // For opposites, use the delta directly (+6) without applying the -10 penalty
    trineAdjust = 0; // Don't apply the -10 penalty
    chineseRelationshipDelta = chineseRel.delta; // Apply +6 delta directly
  } else if (chineseRel.type === "same_trine") {
    trineAdjust = WEIGHTS.trine.same; // +20 for same trine
    chineseRelationshipDelta = chineseRel.delta; // Additional +12 delta
  } else if (chineseRel.type === "opposed_trine") {
    trineAdjust = WEIGHTS.trine.cross; // -2 for cross-trine
    chineseRelationshipDelta = chineseRel.delta; // Additional delta if specified
  } else {
    // For neutral or unknown relationships, use standard trine logic
    trineAdjust = sameTrine ? WEIGHTS.trine.same : WEIGHTS.trine.cross;
    // No additional delta for neutral relationships
  }

  // ---- Western rationale ----
  const aEl = ELEM[aWest], bEl = ELEM[bWest];
  const sameWestSign = aWest === bWest;

  let west_relation: string;
  let west_summary: string;
  let elemAdjust = 0;
  let compatType: "same" | "compatible" | "semi" | "conflicting";

  // Use longform content if available
  if (longform) {
    west_relation = longform.east_west_notes.west.label;
    west_summary = longform.east_west_notes.west.text;
    // Infer compatType from content
    if (west_relation.includes('Same Element')) compatType = "same";
    else if (west_relation.includes('Compatible')) compatType = "compatible";
    else if (west_relation.includes('supportive')) compatType = "compatible";
    else compatType = "semi";
    elemAdjust = WEIGHTS.element[compatType] || 0;
  } else if (sameWestSign) {
    compatType = "same";
    west_relation = `${aWest} × ${bWest} — Same Element: ${aEl} × ${bEl}`;
    west_summary = generateWestRationale(aWest, bWest, aEl, bEl, sameWestSign, compatType);
    elemAdjust = WEIGHTS.element.same;
  } else if (aEl === bEl) {
    compatType = "same";
    west_relation = `${aWest} × ${bWest} — Same Element: ${aEl} × ${bEl}`;
    west_summary = generateWestRationale(aWest, bWest, aEl, bEl, sameWestSign, compatType);
    elemAdjust = WEIGHTS.element.same;
  } else if (ELEM_COMPAT[aEl].includes(bEl)) {
    compatType = "compatible";
    west_relation = `${aWest} × ${bWest} — Compatible: ${aEl} × ${bEl}`;
    west_summary = generateWestRationale(aWest, bWest, aEl, bEl, sameWestSign, compatType);
    elemAdjust = WEIGHTS.element.compatible;
  } else if (ELEM_SEMI[aEl].includes(bEl)) {
    compatType = "semi";
    west_relation = `${aWest} × ${bWest} — Semi-Compatible: ${aEl} × ${bEl}`;
    west_summary = generateWestRationale(aWest, bWest, aEl, bEl, sameWestSign, compatType);
    elemAdjust = WEIGHTS.element.semi;
  } else {
    compatType = "conflicting";
    west_relation = `${aWest} × ${bWest} — Conflicting: ${aEl} × ${bEl}`;
    west_summary = generateWestRationale(aWest, bWest, aEl, bEl, sameWestSign, compatType);
    elemAdjust = WEIGHTS.element.conflicting;
  }

  // ---- Synergy bonus ----
  let synergy = 0;
  if (sameTrine && compatType === "same") synergy += WEIGHTS.synergy.perfect;
  else if (sameTrine && compatType === "compatible") synergy += WEIGHTS.synergy.strong;

  // ---- Same-sign adjustments ----
  // Apply same Western sign rule from config (marking down same signs)
  const sameWestRule = engineConfig.rules.same_western_sign;
  
  let sameSignBonus = 0;
  // Apply same Western sign PENALTY (marking down) instead of bonus
  if (sameWestSign && sameWestRule?.enabled) {
    let delta = sameWestRule.score_delta_default; // baseline -4
    
    // Check if same Chinese trine
    if (sameTrine) {
      delta = sameWestRule.score_delta_if_same_chinese_trine; // -6
    }
    
    // Check if same Chinese animal
    if (sameEastSign) {
      delta = sameWestRule.score_delta_if_same_chinese_animal; // -9
    }
    
    // Apply penalty (negative delta)
    sameSignBonus += delta; // This will be negative (e.g., -4, -6, or -9)
  } else if (sameWestSign) {
    // Fallback to old behavior if rule is disabled (shouldn't happen, but safety)
    sameSignBonus += WEIGHTS.sameSign.west;
  }
  
  // Keep Chinese sign bonus as is
  if (sameEastSign) sameSignBonus += WEIGHTS.sameSign.east;

  // ---- Suzanne White nuanced element adjustments ----
  let nuanceAdjust = 0;
  if (sameTrine && compatType === "semi") nuanceAdjust = WEIGHTS.nuance.sameTrine_semi;
  else if (sameTrine && compatType === "conflicting") nuanceAdjust = WEIGHTS.nuance.sameTrine_conflict;
  else if (!sameTrine && compatType === "semi") nuanceAdjust = WEIGHTS.nuance.crossTrine_semi;
  else if (!sameTrine && compatType === "conflicting") nuanceAdjust = WEIGHTS.nuance.crossTrine_conflict;

  // ---- Score & rank ----
  // Use override score if available, otherwise calculate
  // Apply Chinese relationship delta to the calculated score
  // Note: chineseRelationshipDelta already accounts for the relationship type (opposite, same_trine, etc.)
  let raw = override ? override.s : (base + trineAdjust + elemAdjust + synergy + sameSignBonus + nuanceAdjust + chineseRelationshipDelta);
  
  // Apply cap for opposite Chinese signs (if applicable)
  if (isChineseOppositePair && chineseOppositeRule?.enabled) {
    const maxCap = chineseOppositeRule.cap_after_spark ?? 95;
    raw = Math.min(raw, maxCap);
  }
  
  // Apply same Western sign penalty and tier caps (even if override exists)
  // The same western sign rule should always apply, regardless of overrides
  if (sameWestSign && sameWestRule?.enabled) {
    // Apply penalty to override score if it exists
    if (override) {
      let delta = sameWestRule.score_delta_default; // baseline -4
      
      // Check if same Chinese trine
      if (sameTrine) {
        delta = sameWestRule.score_delta_if_same_chinese_trine; // -6
      }
      
      // Check if same Chinese animal
      if (sameEastSign) {
        delta = sameWestRule.score_delta_if_same_chinese_animal; // -9
      }
      
      // Apply penalty to override score
      raw = override.s + delta;
    }
    
    // Apply tier caps
    let maxCap = sameWestRule.tier_caps.default_max_score; // 94
    
    // Check if same Chinese trine
    if (sameTrine) {
      maxCap = sameWestRule.tier_caps.if_same_chinese_trine; // 84
    }
    
    // Check if same Chinese animal
    if (sameEastSign) {
      maxCap = sameWestRule.tier_caps.if_same_chinese_animal; // 100
    }
    
    // Cap the score
    raw = Math.min(raw, maxCap);
  }
  
  const score = Math.max(0, Math.min(100, Math.round(raw)));
  const rank = rankFor(score);
  const classification = classifyMatch(aWest, aEast, bWest, bEast);
  const categoryLabel = classification.style.label;
  const categoryEmoji = classification.style.emoji;
  const categoryColor = classification.style.colorRgb;

  return {
    score,
    rankKey: rank.key,
    rankLabel: categoryLabel,
    connectionLabel: longform?.headline || categoryLabel,
    emoji: categoryEmoji,
    colorRgb: categoryColor,

    east_relation,
    east_summary,
    west_relation,
    west_summary,
    
    // Add longform body if available
    longformBody: longform?.body,
    hasOverride: !!override,
    hasLongform: !!longform,

    debug: {
      category: classification.category,
      badges: classification.badges,
      base,
      trineAdjust,
      elemAdjust,
      synergy,
      sameSignBonus,
      nuanceAdjust,
      aEl, 
      bEl,
      aTrineGroup: aT.group,
      bTrineGroup: bT.group,
      sameWestSign,
      sameEastSign,
      compatType,
      overrideUsed: !!override,
      overrideScore: override?.s,
      pairId,
    }
  };
}
