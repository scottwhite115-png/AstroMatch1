// src/lib/energyRatings.ts

export type MatchTier =
  | "Soulmate Match"
  | "Twin Flame Match"
  | "Harmonious Match"
  | "Neutral Match"
  | "Opposites Attract"
  | "Difficult Match";

export type ChinesePattern =
  | "san_he"
  | "liu_he"
  | "same_trine"
  | "same_animal"
  | "cross_trine"
  | "liu_chong"
  | "liu_hai"
  | "xing"
  | "po"
  | "none";

export type WestAspect =
  | "trine"
  | "sextile"
  | "square"
  | "opposition"
  | "quincunx"
  | "none";

export type WestElementRelation =
  | "same"
  | "compatible"
  | "semi_compatible"
  | "clash"
  | "neutral";

export type WuXingRelation =
  | "supportive"
  | "same"
  | "draining"
  | "clash"
  | "neutral";

export interface EnergyRatings {
  chemistry: number; // 1.0–5.0 in 0.5 steps
  harmony: number;
  stability: number;
  spark: number;
}

export interface EnergyContext {
  tier: MatchTier;
  chinesePattern: ChinesePattern;
  westAspect: WestAspect;
  westElementRelation: WestElementRelation;
  wuXingRelation: WuXingRelation;
  sameSunSign: boolean; // e.g. Aquarius × Aquarius
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function quantizeHalf(v: number, min = 1, max = 5): number {
  const clamped = clamp(v, min, max);
  return Math.round(clamped * 2) / 2;
}

/**
 * 1) Base by tier (Soulmate / Twin / Harmonious / Neutral / Opposites / Difficult)
 * These are the "default vibe" for each label before patterns & aspects.
 */
function baseFromTier(tier: MatchTier): EnergyRatings {
  switch (tier) {
    case "Soulmate Match":
      // Best overall blend: high glue, high warmth, some spark
      return { chemistry: 4.3, harmony: 4.8, stability: 4.6, spark: 3.6 };
    case "Twin Flame Match":
      // Big connection but more voltage, a bit less stable than Soulmate
      return { chemistry: 4.3, harmony: 4.1, stability: 3.6, spark: 4.1 };
    case "Harmonious Match":
      // Solid, workable, good for long-term if people are mature
      return { chemistry: 3.8, harmony: 4.0, stability: 4.0, spark: 3.0 };
    case "Neutral Match":
      // Fine, not bad, not special – chart is shrugging
      return { chemistry: 3.0, harmony: 3.0, stability: 3.0, spark: 2.8 };
    case "Opposites Attract":
      // Placeholder for opposites; refined further below for Liu Chong
      return { chemistry: 3.0, harmony: 2.3, stability: 1.8, spark: 4.1 };
    case "Difficult Match":
    default:
      // Hard mode – either growth-heavy or just draining
      return { chemistry: 2.3, harmony: 2.0, stability: 2.0, spark: 2.3 };
  }
}

/**
 * 2) Adjust for Chinese pattern specifics (San He, Liu He, Liu Chong, etc.)
 * This shapes the base *before* we let West side tweak it.
 */
function tweakForChinesePattern(
  base: EnergyRatings,
  ctx: EnergyContext
): EnergyRatings {
  let { chemistry, harmony, stability, spark } = base;
  const { chinesePattern, tier, sameSunSign } = ctx;

  switch (chinesePattern) {
    case "san_he":
    case "same_trine":
      // Same tribe / San He: strong glue, good stability, moderate spark
      chemistry += 0.4;
      harmony += 0.5;
      stability += 0.4;
      spark += 0.1;
      break;

    case "liu_he":
      // Secret friends: soft support, very stable, not wildly sparky
      chemistry += 0.2;
      harmony += 0.6;
      stability += 0.6;
      spark -= 0.1;
      break;

    case "same_animal":
      // Intense mirror, can be obsessive
      chemistry += 0.6;
      harmony -= 0.5;
      stability -= 0.4;
      spark += 0.5;
      break;

    case "liu_chong":
      // Opposites: THIS is your magnetic opposite guardrail
      // Start with middling chem, low harmony/stability, high spark
      chemistry = 3.0;
      harmony = 2.0;
      stability = 1.5;
      spark = 4.3;

      // Soulmate/Twin label should not override that basic shape
      if (tier === "Soulmate Match" || tier === "Twin Flame Match") {
        chemistry -= 0.3;
        harmony -= 0.4;
        stability -= 0.4;
      }

      // Same Sun sign + Liu Chong (e.g. Aqua Monkey × Aqua Tiger): extra unstable
      if (sameSunSign) {
        chemistry -= 0.3; // no "this feels perfect"
        stability -= 0.3; // harder to keep steady
      }

      // Final Liu Chong caps (we quantize later, just enforce ranges here):
      chemistry = clamp(chemistry, 2.5, 3.5);
      harmony = clamp(harmony, 1.5, 2.5);
      stability = clamp(stability, 1.0, 2.0);
      // Spark will be 4.0–4.5 after West tweaks
      break;

    case "liu_hai":
    case "xing":
    case "po":
      // Damage patterns: tension & lessons, not much ease
      chemistry -= 0.2;
      harmony -= 0.6;
      stability -= 0.6;
      spark += 0.3;
      break;

    case "cross_trine":
    case "none":
    default:
      // Leave base mostly alone
      break;
  }

  return { chemistry, harmony, stability, spark };
}

/**
 * 3) West aspect, West elements, and Wu Xing nudge the pattern
 */
function tweakForWestAndElements(
  ratings: EnergyRatings,
  ctx: EnergyContext
): EnergyRatings {
  let { chemistry, harmony, stability, spark } = ratings;
  const { westAspect, westElementRelation, wuXingRelation, chinesePattern } =
    ctx;

  // West aspect
  switch (westAspect) {
    case "trine":
      chemistry += 0.4;
      harmony += 0.5;
      stability += 0.4;
      spark += 0.2;
      break;
    case "sextile":
      chemistry += 0.3;
      harmony += 0.4;
      stability += 0.3;
      spark += 0.1;
      break;
    case "opposition":
      chemistry += 0.2;
      spark += 0.4;
      harmony -= 0.3;
      stability -= 0.3;
      break;
    case "square":
      spark += 0.3;
      harmony -= 0.4;
      stability -= 0.4;
      break;
    case "quincunx":
      // Odd angle: curious but awkward
      chemistry += 0.1;
      spark += 0.1;
      harmony -= 0.3;
      stability -= 0.3;
      break;
    case "none":
    default:
      break;
  }

  // West element relation
  switch (westElementRelation) {
    case "same":
      harmony += 0.3;
      stability += 0.3;
      break;
    case "compatible":
      harmony += 0.2;
      break;
    case "semi_compatible":
      harmony += 0.1;
      stability += 0.1;
      break;
    case "clash":
      harmony -= 0.4;
      stability -= 0.4;
      break;
    case "neutral":
    default:
      break;
  }

  // Wu Xing (year elements)
  if (wuXingRelation === "supportive" || wuXingRelation === "same") {
    harmony += 0.2;
    stability += 0.2;
  } else if (wuXingRelation === "draining" || wuXingRelation === "clash") {
    stability -= 0.3;
    harmony -= 0.1;
  }

  // Ensure Liu Chong guardrails still hold after tweaks
  if (chinesePattern === "liu_chong") {
    chemistry = clamp(chemistry, 2.5, 3.5);
    harmony = clamp(harmony, 1.5, 2.5);
    stability = clamp(stability, 1.0, 2.0);
    // Spark: 4.0–4.5 only
    const sparkMin = 4.0;
    const sparkMax = 4.5;
    spark = clamp(spark, sparkMin, sparkMax);
  }

  return { chemistry, harmony, stability, spark };
}

/**
 * 4) Tier-specific caps – keep each label in its own "vibe band"
 */
function applyTierBounds(
  ratings: EnergyRatings,
  ctx: EnergyContext
): EnergyRatings {
  let { chemistry, harmony, stability, spark } = ratings;
  const { tier, chinesePattern } = ctx;

  switch (tier) {
    case "Soulmate Match": {
      chemistry = clamp(chemistry, 3.8, 4.8);
      harmony = clamp(harmony, 4.3, 5.0);
      stability = clamp(stability, 4.0, 5.0);
      spark = clamp(spark, 3.0, 4.2);
      break;
    }
    case "Twin Flame Match": {
      chemistry = clamp(chemistry, 3.8, 4.8);
      harmony = clamp(harmony, 3.5, 4.7);
      stability = clamp(stability, 3.2, 4.2);
      spark = clamp(spark, 3.5, 4.5);
      break;
    }
    case "Harmonious Match": {
      chemistry = clamp(chemistry, 3.3, 4.2);
      harmony = clamp(harmony, 3.3, 4.7);
      stability = clamp(stability, 3.3, 4.7);
      spark = clamp(spark, 2.3, 3.7);
      break;
    }
    case "Neutral Match": {
      chemistry = clamp(chemistry, 2.5, 3.5);
      harmony = clamp(harmony, 2.5, 3.5);
      stability = clamp(stability, 2.5, 3.5);
      spark = clamp(spark, 2.0, 3.5);
      break;
    }
    case "Opposites Attract": {
      if (chinesePattern !== "liu_chong") {
        // Pure West oppositions without Liu Chong
        chemistry = clamp(chemistry, 2.8, 3.8);
        harmony = clamp(harmony, 2.0, 3.2);
        stability = clamp(stability, 2.0, 3.2);
        spark = clamp(spark, 3.5, 4.3);
      }
      // Liu Chong was already clamped above
      break;
    }
    case "Difficult Match":
    default: {
      chemistry = clamp(chemistry, 1.5, 3.0);
      harmony = clamp(harmony, 1.0, 3.0);
      stability = clamp(stability, 1.0, 3.0);
      spark = clamp(spark, 1.5, 3.5);
      break;
    }
  }

  return { chemistry, harmony, stability, spark };
}

/**
 * PUBLIC: getEnergyRatings(ctx)
 * Returns 4 half-star values (1.0–5.0 in 0.5 steps)
 */
export function getEnergyRatings(ctx: EnergyContext): EnergyRatings {
  const base = baseFromTier(ctx.tier);
  const withChinese = tweakForChinesePattern(base, ctx);
  const withWest = tweakForWestAndElements(withChinese, ctx);
  const bounded = applyTierBounds(withWest, ctx);

  return {
    chemistry: quantizeHalf(bounded.chemistry),
    harmony: quantizeHalf(bounded.harmony),
    stability: quantizeHalf(bounded.stability),
    spark: quantizeHalf(bounded.spark),
  };
}
