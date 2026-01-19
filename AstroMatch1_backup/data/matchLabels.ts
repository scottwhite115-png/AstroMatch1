// data/matchLabels.ts

// Match labels shown in the pill at the top of the connection box
export type MatchLabel =
  | "SOULMATE"
  | "TWIN_FLAME"
  | "HARMONIOUS"
  | "OPPOSITES_ATTRACT"
  | "NEUTRAL"
  | "DIFFICULT";

export type ChinesePattern =
  | "san_he"      // 三合
  | "liu_he"      // 六合
  | "liu_chong"   // 六冲
  | "liu_hai"     // 六害
  | "xing"        // 刑
  | "po"          // 破
  | "cross_trine"
  | "none";

export type WestAspect =
  | "same"
  | "opposite"
  | "trine_like"
  | "square_like"
  | "other";

export type ElementPair =
  | "same"
  | "compatible"      // Fire–Air, Water–Earth
  | "semi_compatible" // Fire–Earth, Air–Water, etc.
  | "clash";          // Fire–Water, Air–Earth, etc.

export type WuXingRelation =
  | "same"
  | "supportive"       // generating cycle
  | "neutral"
  | "controlling_soft" // mild control
  | "controlling_harsh";

export interface MatchContext {
  // identities
  westA: string;
  westB: string;
  animalA: string;
  animalB: string;

  // pattern flags (you already have this in your matrix JSON)
  chinesePattern: ChinesePattern;
  sameChineseTrine: boolean;
  isChineseOpposites: boolean;
  isLivelyPair: boolean;

  sameAnimal: boolean;
  sameSunSign: boolean;

  westAspect: WestAspect;
  elementPair: ElementPair;
  wuxingRelation: WuXingRelation;
}

// Helper function to clamp scores between 0-100
function clampScore(x: number): number {
  return Math.max(0, Math.min(100, x));
}

/**
 * Calculate SPARK score - measures excitement, chemistry, and dynamic energy
 * Higher spark = more electric, volatile, and intense connection
 */
export function calculateSpark(ctx: MatchContext): number {
  let s = 50;

  // Western aspect voltage
  switch (ctx.westAspect) {
    case "opposite":
      s += 20;
      break;
    case "square_like":
      s += 10;
      break;
    case "trine_like":
      s += 6;
      break;
    case "same":
      s += 4;
      break;
  }

  // Western elements: lively combos
  if (ctx.elementPair === "same") {
    s += 10; // Same element = strong resonance
  } else if (ctx.elementPair === "compatible") {
    s += 6; // Fire–Air, Water–Earth
  } else if (ctx.elementPair === "semi_compatible") {
    s += 3;
  }

  // Chinese "excitement"
  if (ctx.isLivelyPair) s += 10;
  if (ctx.isChineseOpposites) s += 10;

  // Chinese conflict patterns add volatility
  if (ctx.chinesePattern === "liu_chong") s += 12;
  if (ctx.chinesePattern === "xing") s += 10;
  if (ctx.chinesePattern === "liu_hai") s += 6;
  if (ctx.chinesePattern === "po") s += 4;

  return clampScore(s);
}

/**
 * Calculate HARMONY score - measures stability, ease, and natural compatibility
 * Higher harmony = more peaceful, stable, and effortless connection
 */
export function calculateHarmony(ctx: MatchContext): number {
  let h = 50;

  // Chinese harmony (heavy)
  if (ctx.chinesePattern === "san_he") h += 22;
  if (ctx.chinesePattern === "liu_he") h += 18;
  if (ctx.chinesePattern === "cross_trine") h += 8;

  // Chinese conflict (strong penalties)
  if (ctx.chinesePattern === "liu_chong") h -= 20;
  if (ctx.chinesePattern === "xing") h -= 16;
  if (ctx.chinesePattern === "liu_hai") h -= 14;
  if (ctx.chinesePattern === "po") h -= 10;

  // Western element harmony
  if (ctx.elementPair === "same") h += 12;
  else if (ctx.elementPair === "compatible") h += 8;
  else if (ctx.elementPair === "semi_compatible") h += 4;
  else if (ctx.elementPair === "clash") h -= 8;

  // Western aspects: oppositions/squares less stable
  if (ctx.westAspect === "opposite") h -= 6;
  else if (ctx.westAspect === "square_like") h -= 8;
  else if (ctx.westAspect === "trine_like") h += 4;
  else if (ctx.westAspect === "same") h += 2;

  // Wu Xing overlay (year elements)
  switch (ctx.wuxingRelation) {
    case "same":
      h += 6;
      break;
    case "supportive":
      h += 8;
      break;
    case "controlling_soft":
      h -= 4;
      break;
    case "controlling_harsh":
      h -= 8;
      break;
  }

  return clampScore(h);
}

/**
 * Calculate the final match score from spark and harmony
 * Weighted 60% harmony (stability) and 40% spark (excitement)
 */
export function calculateFinalScore(spark: number, harmony: number): number {
  const raw = 0.6 * harmony + 0.4 * spark;
  return clampScore(Math.round(raw));
}

/**
 * Helper: Check if Chinese pattern indicates heavy conflict
 */
function hasHeavyConflict(pattern: ChinesePattern): boolean {
  return (
    pattern === "liu_chong" ||
    pattern === "liu_hai" ||
    pattern === "xing" ||
    pattern === "po"
  );
}

/**
 * Helper: Check if animals are in the same trine
 */
function isSameTrine(ctx: MatchContext): boolean {
  return ctx.sameChineseTrine; // you already compute this from the animal
}

/**
 * Pick the appropriate match label based on context and scores
 * Uses hierarchical logic to classify the relationship type
 */
export function pickMatchLabel(
  ctx: MatchContext,
  spark: number,
  harmony: number,
  finalScore: number
): MatchLabel {
  const heavyConflict = hasHeavyConflict(ctx.chinesePattern);

  // 1) Difficult Match – real damage patterns + low harmony
  if (harmony <= 45 && heavyConflict) {
    return "DIFFICULT";
  }

  // 2) Opposites Attract – high spark / Chinese opposites / unstable
  if (
    ctx.isChineseOpposites ||
    (spark >= 75 && harmony <= 60)
  ) {
    return "OPPOSITES_ATTRACT";
  }

  const sameTrine = isSameTrine(ctx);

  // Debug logging for SOULMATE check
  if (sameTrine && !ctx.sameAnimal && !ctx.sameSunSign && ctx.elementPair === "same") {
    console.log(`[SOULMATE CHECK] ${ctx.westA}-${ctx.animalA} × ${ctx.westB}-${ctx.animalB}`);
    console.log(`  sameTrine: ${sameTrine}, sameAnimal: ${ctx.sameAnimal}, sameSunSign: ${ctx.sameSunSign}`);
    console.log(`  elementPair: ${ctx.elementPair}, harmony: ${harmony}, spark: ${spark}`);
    console.log(`  Meets criteria? harmony=${harmony}>=82 (${harmony >= 82}), spark=${spark}>=65 (${spark >= 65})`);
  }

  // 3) Soulmate Match – same trine + same element, no same sign/animal, very high harmony
  if (
    sameTrine &&
    !ctx.sameAnimal &&
    !ctx.sameSunSign &&
    ctx.elementPair === "same" &&
    harmony >= 82 &&
    spark >= 65
  ) {
    console.log(`  ✅ SOULMATE ASSIGNED!`);
    return "SOULMATE";
  }

  // 4) Twin Flame Match – same trine + compatible element, no same sign/animal, high spark
  if (
    sameTrine &&
    !ctx.sameAnimal &&
    !ctx.sameSunSign &&
    ctx.elementPair === "compatible" &&
    harmony >= 75 &&
    spark >= 70
  ) {
    return "TWIN_FLAME";
  }

  // 5) Harmonious Match – genuinely good overall, no heavy conflict
  if (finalScore >= 70 && harmony >= 65 && !heavyConflict) {
    return "HARMONIOUS";
  }

  // 6) Neutral Match – middle band without huge patterns
  if (finalScore >= 50 && finalScore <= 69 && !heavyConflict) {
    return "NEUTRAL";
  }

  // 7) Everything else → Difficult (low score and/or conflict)
  return "DIFFICULT";
}

/**
 * Maps raw compatibility score to display score based on match label
 * Ensures scores visually align with match tier expectations
 */
function mapDisplayScore(raw: number, label: MatchLabel): number {
  let s = raw;

  switch (label) {
    case "SOULMATE":
      // Soulmate should *look* rare and elite
      if (s < 88) s = 88;
      break;

    case "TWIN_FLAME":
      // Twin Flame is still top tier, but a touch below Soulmate
      if (s < 82) s = 82;
      break;

    case "HARMONIOUS":
      // Harmonious should never look weak
      if (s < 65) s = 65;
      break;

    case "OPPOSITES_ATTRACT":
      // Even when messy, it feels like a big connection
      if (s < 60) s = 60;
      break;

    case "NEUTRAL":
      // Don't let Neutral creep up into the 70s again
      if (s > 69) s = 69;
      break;

    case "DIFFICULT":
      // Difficult shouldn't look "pretty good"
      if (s > 55) s = 55;
      break;
  }

  return clampScore(Math.round(s));
}

/**
 * Match evaluation result containing all compatibility metrics
 */
export interface MatchResult {
  spark: number;
  harmony: number;
  score: number;
  label: MatchLabel;
  harmoniousSubtag?: HarmoniousSubtag;
}

/**
 * Complete match evaluation - runs the full pipeline and returns all metrics
 * This is your main entry point for compatibility analysis
 */
export function evaluateMatch(ctx: MatchContext): MatchResult {
  const spark = calculateSpark(ctx);
  const harmony = calculateHarmony(ctx);
  const rawScore = calculateFinalScore(spark, harmony);
  const label = pickMatchLabel(ctx, spark, harmony, rawScore);

  const displayScore = mapDisplayScore(rawScore, label);

  // Optional: Harmonious subtags (implementation TBD)
  let harmoniousSubtag: HarmoniousSubtag | undefined = undefined;
  // if (label === "HARMONIOUS") {
  //   harmoniousSubtag = pickHarmoniousSubtag(
  //     ctx.sameChineseTrine,
  //     spark,
  //     harmony,
  //     rawScore
  //   );
  // }

  return {
    spark,
    harmony,
    score: displayScore,   // ← this is what you show in the UI
    label,
    harmoniousSubtag,
  };
}

/**
 * Human-readable text for match labels (for UI display)
 */
export const matchLabelText: Record<MatchLabel, string> = {
  SOULMATE: "SOULMATE",
  TWIN_FLAME: "TWIN FLAME",
  HARMONIOUS: "HARMONIOUS MATCH",
  OPPOSITES_ATTRACT: "OPPOSITES ATTRACT",
  NEUTRAL: "NEUTRAL MATCH",
  DIFFICULT: "DIFFICULT MATCH",
};

export const matchLabelTaglines: Record<MatchLabel, string> = {
  "SOULMATE":
    "Very high natural compatibility with strong long-term potential.",
  "TWIN_FLAME":
    "Intense mutual spark with strong attraction and big growth potential.",
  "HARMONIOUS":
    "High compatibility with shared priorities and a strong base to build on together.",
  "OPPOSITES_ATTRACT":
    "Strong pull between differences that keeps the connection lively and dynamic.",
  "NEUTRAL":
    "Balanced match where personality, timing, and choice make the biggest difference.",
  "DIFFICULT":
    "Lower natural alignment that benefits from extra patience, clarity, and self-awareness.",
};

// Color coding for match labels and percentage scores
export const MATCH_LABEL_COLOR_CLASSES: Record<MatchLabel, string> = {
  "SOULMATE": "text-yellow-300",           // Gold
  "TWIN_FLAME": "text-orange-400",         // AstroMatch orange
  "HARMONIOUS": "text-pink-500",           // Hot pink
  "OPPOSITES_ATTRACT": "text-purple-400",  // Purple
  "NEUTRAL": "text-emerald-400",           // Green
  "DIFFICULT": "text-slate-300",           // Grey
};

