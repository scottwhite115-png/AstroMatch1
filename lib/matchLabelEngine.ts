// matchLabelEngine.ts

// -----------------------------
// Types
// -----------------------------

export type ChineseBasePattern = 'SAN_HE' | 'LIU_HE' | 'SAME_SIGN' | 'NO_PATTERN';

export type ChineseOverlayPattern = 'LIU_CHONG' | 'LIU_HAI' | 'XING' | 'PO';

export type WesternEase = 'EASY' | 'MEDIUM' | 'HARD';

export type WesternElementRelation =
  | 'SAME'
  | 'COMPATIBLE'
  | 'SEMI_COMPATIBLE'
  | 'NEUTRAL'
  | 'CLASH';

export type ConnectionArchetype =
  | 'TRIPLE_HARMONY'   // San He 三合 · same tribe
  | 'SUPPORTIVE_ALLY'  // Liu He 六合 · Six Harmonies / Secret Friends
  | 'OPPOSITES'        // Liu Chong 六冲 · Six Conflicts / Magnetic opposites
  | 'LESSON_REPAIR'    // Hai / Xing / Po without San He, Liu He, Same sign
  | 'MIRROR'           // Same-sign archetype (West or Chinese)
  | 'OPEN_PATTERN';    // No big Chinese pattern

// -----------------------------
// Helpers
// -----------------------------

export function hasDamageOverlay(overlays: ChineseOverlayPattern[]): boolean {
  return overlays.some(o => o === 'LIU_HAI' || o === 'XING' || o === 'PO');
}

// Decide archetype from Chinese patterns only
export function deriveArchetype(
  chineseBase: ChineseBasePattern,
  overlays: ChineseOverlayPattern[]
): ConnectionArchetype {
  const hasLiuChong = overlays.includes('LIU_CHONG');
  const hasDamage = hasDamageOverlay(overlays);

  // 1) Six Conflicts (Liu Chong) always reads as Opposites archetype
  if (hasLiuChong) return 'OPPOSITES';

  // 2) Respect base pattern first
  switch (chineseBase) {
    case 'SAN_HE':
      return 'TRIPLE_HARMONY';
    case 'LIU_HE':
      return 'SUPPORTIVE_ALLY';
    case 'SAME_SIGN':
      return 'MIRROR';
    case 'NO_PATTERN':
    default:
      // 3) Only pure lesson archetype when there is no San He / Liu He / Same sign
      return hasDamage ? 'LESSON_REPAIR' : 'OPEN_PATTERN';
  }
}

// Derive Western ease from element relation
export function deriveWesternEase(relation: WesternElementRelation): WesternEase {
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

// Same-sign (Chinese) must never show above 68%
export function applySameSignCap(
  score: number,
  chineseBase: ChineseBasePattern
): number {
  if (chineseBase === 'SAME_SIGN') {
    return Math.min(score, 68);
  }
  return score;
}

// -----------------------------
// Pill label logic
// -----------------------------

export function getMatchLabel(
  archetype: ConnectionArchetype,
  chineseBase: ChineseBasePattern,
  overlays: ChineseOverlayPattern[],
  finalScore: number
): string {
  const hasLiuChong = overlays.includes('LIU_CHONG');
  const hasDamage = hasDamageOverlay(overlays);

  // 1) Six Conflicts (Liu Chong)
  if (hasLiuChong) {
    return 'Six Conflicts';
  }

  // 2) Six Harmonies (Liu He)
  if (chineseBase === 'LIU_HE') {
    return 'Six Harmonies';
  }

  // 3) Triple Harmony (San He)
  if (chineseBase === 'SAN_HE') {
    return 'Triple Harmony';
  }

  // 4) Same Sign
  if (chineseBase === 'SAME_SIGN') {
    return 'Same Sign Match';
  }

  // 5) Damage-only / lesson-heavy cases
  if (archetype === 'LESSON_REPAIR' || hasDamage) {
    return 'Challenging Match';
  }

  // 6) Everything else
  return 'Neutral Match';
}

// -----------------------------
// Connection blurb logic
// -----------------------------

export function getConnectionBlurb(
  archetype: ConnectionArchetype,
  ease: WesternEase,
  opts?: { hasDamage?: boolean }
): string {
  const hasDamage = opts?.hasDamage ?? false;

  switch (archetype) {
    // San He · Triple Harmony – same tribe
    case 'TRIPLE_HARMONY':
      if (ease === 'EASY') {
        return 'Same-tribe match with easy flow; more supportive than dramatic and good for building a life together.';
      }
      if (ease === 'MEDIUM') {
        return 'Strong same-tribe bond with style differences that works when you stay curious about each other\'s ways.';
      }
      // HARD
      return 'Deep same-tribe connection with real friction; powerful when you share goals, draining when you keep pulling apart.';

    // Liu He · Six Harmonies – Supportive Ally / Secret Friends
    case 'SUPPORTIVE_ALLY': {
      if (hasDamage) {
        return 'Supportive ally bond with lessons underneath; things improve when you name stuck patterns and change how you both respond.';
      }

      if (ease === 'EASY') {
        return 'Soft, steady ally bond with a warm, friend-like tone; you quietly back each other up when life is stressful.';
      }
      if (ease === 'MEDIUM') {
        return 'Grounded ally match with different pace or priorities; it smooths out when you say what support actually looks like for you.';
      }
      // HARD, no damage
      return 'Ally bond with friction around needs and timing; it works when you\'re upfront about limits instead of expecting mind-reading.';
    }

    // Liu Chong · Six Conflicts – Magnetic Opposites
    case 'OPPOSITES':
      if (ease === 'EASY') {
        return 'Magnetic opposite-style match with strong spark; it thrives when you enjoy your differences instead of trying to fix each other.';
      }
      if (ease === 'MEDIUM') {
        return 'Magnetic opposites with both spark and friction; you stretch each other, so clear talk keeps things feeling fair.';
      }
      // HARD
      return 'Intense magnetic opposites where attraction and conflict sit close together; good boundaries keep drama in check.';

    // Hai / Xing / Po without San He / Liu He / Same sign – Lesson/Repair
    case 'LESSON_REPAIR':
      if (ease === 'EASY') {
        return 'Lesson-heavy connection with genuine care; you grow if you name problems early and work on them together.';
      }
      if (ease === 'MEDIUM') {
        return 'Connection with both pull and pressure; the same issues return until you decide to handle them differently.';
      }
      // HARD
      return 'Intense, lesson-driven match; memorable but tiring without firm boundaries, honesty, and regular check-ins.';

    // Same-sign archetype (West or Chinese, depending how you use it)
    case 'MIRROR':
      if (ease === 'EASY') {
        return 'Mirror-style match where you see a lot of yourself; feeling understood is easy, but your habits get doubled.';
      }
      if (ease === 'MEDIUM') {
        return 'Strong familiarity and similar instincts; you "get" each other quickly but also amplify each other\'s patterns.';
      }
      // HARD
      return 'Mirror-clash match—very similar nature but different needs; it stings when what annoys you in them lives in you too.';

    // No big Chinese pattern – Open path
    case 'OPEN_PATTERN':
    default:
      if (ease === 'EASY') {
        return 'Open-ended connection with light, easy flow that can deepen if you keep showing up and communicating.';
      }
      if (ease === 'MEDIUM') {
        return 'Balanced match with no fixed script; everyday choices matter more than any built-in pattern.';
      }
      // HARD
      return 'Free-form connection with some friction; it works when you\'re honest about differences and willing to adjust.';
  }
}
