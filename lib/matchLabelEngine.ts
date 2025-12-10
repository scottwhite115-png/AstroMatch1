// matchLabelEngine.ts

import { taglines } from './matchTaglines';

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
        subLabel: taglines.lessonHard
      };
    }

    // Damage + some Western support
    return {
      primaryLabel: 'Challenging Match',
      subLabel: taglines.lessonSoftened
    };
  }

  // CASE 2: Opposites (Liu Chong)
  if (archetype === 'OPPOSITES' && hasLiuChong) {
    if (westernEase === 'HARD') {
      return {
        primaryLabel: 'Challenging Match',
        subLabel: taglines.volatileOpposites
      };
    }

    return {
      primaryLabel: 'Magnetic Opposites',
      subLabel: taglines.magneticOpposites
    };
  }

  // CASE 3: Triple Harmony (San He)
  if (archetype === 'TRIPLE_HARMONY' && !hasDamage) {
    // Easiest, top-band San He → Soulmate
    if (westernEase === 'EASY' && scoreBand === 'TOP') {
      return {
        primaryLabel: 'Soulmate Match',
        subLabel: taglines.soulmate
      };
    }

    // Very good San He, but not quite top-tier → Strong Harmony
    if (westernEase !== 'HARD' && (scoreBand === 'HIGH' || scoreBand === 'MID')) {
      return {
        primaryLabel: 'Strong Harmony Match',
        subLabel: taglines.strongHarmony
      };
    }

    // San He + element clash → deep but intense (could use Twin Flame tagline)
    if (westernEase === 'HARD') {
      return {
        primaryLabel: 'Challenging Match',
        subLabel: taglines.twinFlame
      };
    }
  }

  // CASE 4: Supportive Ally (Liu He)
  if (archetype === 'SUPPORTIVE_ALLY' && !hasDamage) {
    if (westernEase === 'EASY' && (scoreBand === 'TOP' || scoreBand === 'HIGH')) {
      // Let really sweet Liu He behave like a top-tier "Secret Friends"
      return {
        primaryLabel: 'Secret Friends Match',
        subLabel: taglines.quietAlly
      };
    }

    if (westernEase === 'MEDIUM') {
      return {
        primaryLabel: 'Secret Friends Match',
        subLabel: taglines.steadyAlly
      };
    }

    // Liu He + clash, but no damage overlay - use softSteadyFriend as fallback
    if (westernEase === 'HARD') {
      return {
        primaryLabel: 'Secret Friends Match',
        subLabel: taglines.softSteadyFriend
      };
    }
  }

  // CASE 5: Mirror (Same sign)
  if (archetype === 'MIRROR') {
    if (westernEase === 'EASY' && (scoreBand === 'HIGH' || scoreBand === 'TOP')) {
      return {
        primaryLabel: 'Mirror Match',
        subLabel: taglines.mirrorStrong
      };
    }

    if (westernEase === 'HARD') {
      return {
        primaryLabel: 'Challenging Match',
        subLabel: taglines.mirrorClash
      };
    }

    // Middle-lane same sign
    return {
      primaryLabel: 'Neutral Match',
      subLabel: taglines.mirrorMid
    };
  }

  // CASE 6: Open pattern (no major Chinese pattern)
  if (archetype === 'OPEN_PATTERN') {
    if (westernEase === 'EASY') {
      return {
        primaryLabel: 'Neutral Match',
        subLabel: taglines.neutralEasy
      };
    }

    if (westernEase === 'MEDIUM') {
      return {
        primaryLabel: 'Neutral Match',
        subLabel: taglines.neutralWorkable
      };
    }

    // OPEN + HARD
    return {
      primaryLabel: 'Challenging Match',
      subLabel: taglines.neutralMixedSignals
    };
  }

  // Fallback (should be rare)
  return {
    primaryLabel: 'Neutral Match',
    subLabel: taglines.fallbackBalanced
  };
}
