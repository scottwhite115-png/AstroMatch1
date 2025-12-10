// matchLabelEngine.ts

// ----------------------
// 1. Basic enums / types
// ----------------------

export type ChineseBasePattern =
  | 'SAN_HE'      // 三合 - Triple Harmony
  | 'LIU_HE'      // 六合 - Secret Friends
  | 'SAME_SIGN'   // 同生肖
  | 'NO_PATTERN'; // 无显著格局

export type ChineseOverlayPattern =
  | 'LIU_CHONG'   // 六冲 – Conflicts / Opposites
  | 'LIU_HAI'     // 六害 – Harms
  | 'XING'        // 刑 – Punishment
  | 'PO';         // 破 – Break

// How your Western logic classifies element interaction
export type WesternElementRelation =
  | 'SAME'
  | 'COMPATIBLE'
  | 'SEMI_COMPATIBLE'
  | 'NEUTRAL'
  | 'CLASH';

// Internal "ease" category based on Western relation
type WesternEase = 'EASY' | 'MEDIUM' | 'HARD';

// Score bands – adjust thresholds to match your engine
type ScoreBand = 'TOP' | 'HIGH' | 'MID' | 'LOW';

// Internal archetype: what kind of connection this is at a deep level
type ConnectionArchetype =
  | 'TRIPLE_HARMONY'    // San He
  | 'SUPPORTIVE_ALLY'   // Liu He
  | 'MIRROR'            // Same sign
  | 'OPEN_PATTERN'      // No major Chinese pattern
  | 'OPPOSITES'         // Liu Chong
  | 'LESSON_REPAIR';    // Liu Hai / Xing / Po

export type PrimaryMatchLabel =
  | 'Soulmate Match'
  | 'Twin Flame Match'
  | 'Secret Friends Match'
  | 'Magnetic Opposites'
  | 'Challenging Match'
  | 'Neutral Match'
  | 'Strong Harmony Match'
  | 'Mirror Match';

export interface MatchLabelResult {
  primaryLabel: PrimaryMatchLabel;
  subLabel: string; // one-line explanation shown under the pill
}

// Helper input type for the engine
export interface MatchContext {
  chineseBase: ChineseBasePattern;
  chineseOverlays: ChineseOverlayPattern[]; // can be empty
  westernRelation: WesternElementRelation;
  score: number; // 0–100
}

// ----------------------------
// 2. Helper classification
// ----------------------------

function getWesternEase(relation: WesternElementRelation): WesternEase {
  switch (relation) {
    case 'SAME':
    case 'COMPATIBLE':
      return 'EASY';
    case 'SEMI_COMPATIBLE':
    case 'NEUTRAL':
      return 'MEDIUM';
    case 'CLASH':
    default:
      return 'HARD';
  }
}

function getScoreBand(score: number): ScoreBand {
  if (score >= 90) return 'TOP';
  if (score >= 80) return 'HIGH';
  if (score >= 65) return 'MID';
  return 'LOW';
}

function hasOverlay(overlays: ChineseOverlayPattern[], pattern: ChineseOverlayPattern): boolean {
  return overlays.includes(pattern);
}

function hasAnyDamageOverlay(overlays: ChineseOverlayPattern[]): boolean {
  return overlays.some(o => o === 'LIU_HAI' || o === 'XING' || o === 'PO');
}

function getConnectionArchetype(
  chineseBase: ChineseBasePattern,
  overlays: ChineseOverlayPattern[]
): ConnectionArchetype {
  const hasLiuChong = hasOverlay(overlays, 'LIU_CHONG');
  const hasDamage = hasAnyDamageOverlay(overlays);

  // Damage overlays have highest priority
  if (hasDamage) {
    return 'LESSON_REPAIR';
  }

  // Then Liu Chong (Opposites)
  if (hasLiuChong) {
    return 'OPPOSITES';
  }

  // Then base pattern
  switch (chineseBase) {
    case 'SAN_HE':
      return 'TRIPLE_HARMONY';
    case 'LIU_HE':
      return 'SUPPORTIVE_ALLY';
    case 'SAME_SIGN':
      return 'MIRROR';
    case 'NO_PATTERN':
    default:
      return 'OPEN_PATTERN';
  }
}

// -----------------------------------
// 3. Main: derive primary + sub label
// -----------------------------------

export function getMatchLabel(context: MatchContext): MatchLabelResult {
  const { chineseBase, chineseOverlays, westernRelation, score } = context;

  const archetype = getConnectionArchetype(chineseBase, chineseOverlays);
  const westernEase = getWesternEase(westernRelation);
  const scoreBand = getScoreBand(score);

  const hasLiuChong = hasOverlay(chineseOverlays, 'LIU_CHONG');
  const hasDamage = hasAnyDamageOverlay(chineseOverlays);

  // CASE 1: Heavy lesson / damage patterns first
  if (archetype === 'LESSON_REPAIR') {
    if (westernEase === 'HARD') {
      return {
        primaryLabel: 'Challenging Match',
        subLabel: 'High-friction lesson match – memorable and intense, but demanding clear boundaries and maturity.'
      };
    }

    // Damage + some Western support
    return {
      primaryLabel: 'Challenging Match',
      subLabel: 'Lesson match – growth through tests and snags, softened somewhat by your elemental blend.'
    };
  }

  // CASE 2: Opposites (Liu Chong)
  if (archetype === 'OPPOSITES' && hasLiuChong) {
    if (westernEase === 'HARD') {
      return {
        primaryLabel: 'Challenging Match',
        subLabel: 'Volatile opposites match – high spark and high friction, not the easiest path to stability.'
      };
    }

    return {
      primaryLabel: 'Magnetic Opposites',
      subLabel: 'Magnetic opposites – strong pull, big differences, and low autopilot. This pairing thrives on conscious effort.'
    };
  }

  // CASE 3: Triple Harmony (San He)
  if (archetype === 'TRIPLE_HARMONY' && !hasDamage) {
    // Easiest, top-band San He → Soulmate
    if (westernEase === 'EASY' && scoreBand === 'TOP') {
      return {
        primaryLabel: 'Soulmate Match',
        subLabel: 'Triple Harmony Match – strong alignment with easy flow and long-term potential.'
      };
    }

    // Very good San He, but not quite top-tier → Strong Harmony
    if (westernEase !== 'HARD' && (scoreBand === 'HIGH' || scoreBand === 'MID')) {
      return {
        primaryLabel: 'Strong Harmony Match',
        subLabel: 'Triple Harmony connection – solid core compatibility with supportive, natural chemistry.'
      };
    }

    // San He + element clash → deep but intense
    if (westernEase === 'HARD') {
      return {
        primaryLabel: 'Challenging Match',
        subLabel: 'Deep but intense match – strong San He bond with elemental friction that can be powerful if you can handle the tension.'
      };
    }
  }

  // CASE 4: Supportive Ally (Liu He)
  if (archetype === 'SUPPORTIVE_ALLY' && !hasDamage) {
    if (westernEase === 'EASY' && (scoreBand === 'TOP' || scoreBand === 'HIGH')) {
      // Let really sweet Liu He behave like a top-tier "Secret Friends"
      return {
        primaryLabel: 'Secret Friends Match',
        subLabel: "Quiet ally match – reliable support, loyalty, and a natural sense of having each other's back."
      };
    }

    if (westernEase === 'MEDIUM') {
      return {
        primaryLabel: 'Secret Friends Match',
        subLabel: 'Steady ally match – dependable support that grows over time, even if your styles differ at first.'
      };
    }

    // Liu He + clash, but no damage overlay
    if (westernEase === 'HARD') {
      return {
        primaryLabel: 'Challenging Match',
        subLabel: 'Hidden-tension ally match – underlying loyalty, but different needs rub until you find better communication.'
      };
    }
  }

  // CASE 5: Mirror (Same sign)
  if (archetype === 'MIRROR') {
    if (westernEase === 'EASY' && (scoreBand === 'HIGH' || scoreBand === 'TOP')) {
      return {
        primaryLabel: 'Mirror Match',
        subLabel: 'Same sign mirror – strong familiarity, shared instincts, and shared blind spots. Feels very recognisable.'
      };
    }

    if (westernEase === 'HARD') {
      return {
        primaryLabel: 'Challenging Match',
        subLabel: "Mirror clash – very similar nature but very different needs; intense recognition that isn't always easy."
      };
    }

    // Middle-lane same sign
    return {
      primaryLabel: 'Neutral Match',
      subLabel: 'Same sign mirror – similar instincts and values, with outcomes depending heavily on maturity and timing.'
    };
  }

  // CASE 6: Open pattern (no major Chinese pattern)
  if (archetype === 'OPEN_PATTERN') {
    if (westernEase === 'EASY') {
      return {
        primaryLabel: 'Neutral Match',
        subLabel: 'Easygoing match – no strong classical pattern, but the elements create a smooth, natural flow.'
      };
    }

    if (westernEase === 'MEDIUM') {
      return {
        primaryLabel: 'Neutral Match',
        subLabel: 'Workable match – open-ended connection that grows through shared effort and communication.'
      };
    }

    // OPEN + HARD
    return {
      primaryLabel: 'Challenging Match',
      subLabel: 'Mixed-signals match – no strong classical bond, with attraction and friction trading places over time.'
    };
  }

  // Fallback (should be rare)
  return {
    primaryLabel: 'Neutral Match',
    subLabel: 'Balanced connection without a dominant harmony or conflict pattern.'
  };
}
