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
  | 'TRIPLE_HARMONY'   // San He
  | 'SUPPORTIVE_ALLY'  // Liu He
  | 'OPPOSITES'        // Liu Chong
  | 'LESSON_REPAIR'    // Hai / Xing / Po only
  | 'MIRROR'           // Same sign
  | 'OPEN_PATTERN';    // No big pattern

export type Element = 'Air' | 'Fire' | 'Earth' | 'Water';

// -----------------------------
// Helpers
// -----------------------------

export function hasDamageOverlay(overlays: ChineseOverlayPattern[]): boolean {
  return overlays.some(o => o === 'LIU_HAI' || o === 'XING' || o === 'PO');
}

export function hasSelfPunishment(
  chineseBase: ChineseBasePattern,
  overlays: ChineseOverlayPattern[]
): boolean {
  // self-punishment = same animal + Xing overlay
  return chineseBase === 'SAME_SIGN' && overlays.includes('XING');
}

// Decide archetype from Chinese patterns only
export function deriveArchetype(
  chineseBase: ChineseBasePattern,
  overlays: ChineseOverlayPattern[]
): ConnectionArchetype {
  const hasLiuChong = overlays.includes('LIU_CHONG');
  const hasDamage = hasDamageOverlay(overlays);

  if (hasLiuChong) return 'OPPOSITES';

  switch (chineseBase) {
    case 'SAN_HE':
      return 'TRIPLE_HARMONY';
    case 'LIU_HE':
      return 'SUPPORTIVE_ALLY';
    case 'SAME_SIGN':
      return 'MIRROR';
    case 'NO_PATTERN':
    default:
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
// Optional: only use if you want to cap same-sign scores at 70
export function applySameSignCap(
  score: number,
  chineseBase: ChineseBasePattern
): number {
  if (chineseBase === 'SAME_SIGN') {
    return Math.min(score, 70);
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

  if (hasLiuChong) {
    return 'Magnetic Opposites Match';
  }

  if (chineseBase === 'SAN_HE') {
    return 'Soulmate Match';
  }

  if (chineseBase === 'LIU_HE') {
    return 'Secret Friends Match';
  }

  if (chineseBase === 'SAME_SIGN') {
    return 'Same Sign Match';
  }

  if (archetype === 'LESSON_REPAIR' || hasDamage) {
    return 'Challenging Match';
  }

  return 'Neutral Match';
}

// -----------------------------
// Tagline under the pill (chemistry only)
// -----------------------------

export function getConnectionTagline(
  archetype: ConnectionArchetype,
  chineseBase: ChineseBasePattern,
  overlays: ChineseOverlayPattern[]
): string {
  const hasLiuChong = overlays.includes('LIU_CHONG');
  const hasDamage = hasDamageOverlay(overlays);
  const selfPunish = hasSelfPunishment(chineseBase, overlays);

  // Magnetic Opposites / Six Conflicts
  if (hasLiuChong) {
    return 'Strong, opposite-style spark between very different types – exciting, vivid, and rarely boring.';
  }

  // Soulmate / San He
  if (chineseBase === 'SAN_HE') {
    return 'Two souls moving in perfect rhythm – effortless harmony and shared purpose.';
  }

  // Secret Friends / Six Harmonies
  if (chineseBase === 'LIU_HE') {
    // you said one line is fine even if there are overlays
    return 'Quiet, loyal connection that feels safe to lean on and good in everyday life.';
  }

  // Same Sign (Chinese)
  if (chineseBase === 'SAME_SIGN') {
    if (selfPunish) {
      return 'Familiar mirror where the same scenes repeat until one of you finally changes the script.';
    }
    return 'Mirror-like connection where you recognise your own strengths and blind spots in each other.';
  }

  // Challenging Match (damage, no big harmony pattern)
  if (archetype === 'LESSON_REPAIR' || hasDamage) {
    return 'Lesson-heavy connection where attraction is mixed with extra tests and tension.';
  }

  // Neutral Match (no major Chinese pattern, no damage)
  return 'Open-ended, easygoing connection that mostly becomes what you make of it together.';
}

// Keep the old function name as an alias for backward compatibility
export function getConnectionBlurb(
  archetype: ConnectionArchetype,
  ease: WesternEase,
  opts?: { hasDamage?: boolean; harms?: boolean; selfPunish?: boolean }
): string {
  const hasDamage = opts?.hasDamage ?? false;
  const harms = opts?.harms ?? false;
  const selfPunish = opts?.selfPunish ?? false;

  switch (archetype) {
    // -------------------------------
    // Triple Harmony · San He
    // -------------------------------
    case 'TRIPLE_HARMONY':
      if (ease === 'EASY') {
        return 'Feels like same-tribe chemistry with strong support and a natural "we\'re in this together" vibe.';
      }
      if (ease === 'MEDIUM') {
        return 'Clear "we" energy, even if you take different routes to get to the same place.';
      }
      return 'Big connection and big opinions; works best when you pull in the same direction.';

    // -------------------------------
    // Six Harmonies · Liu He
    // -------------------------------
    case 'SUPPORTIVE_ALLY': {
      if (hasDamage) {
        return 'Supportive at the core, with a bit more edge around certain repeating themes.';
      }

      if (ease === 'EASY') {
        return 'Soft, loyal chemistry where showing up for each other tends to feel natural.';
      }
      if (ease === 'MEDIUM') {
        return 'On the same side overall, just moving at different speeds or focusing on different details.';
      }
      // HARD, no damage
      return 'Supportive at the base, even if one of you sometimes feels a little ahead or behind.';
    }

    // -------------------------------
    // Six Conflicts · Liu Chong
    // -------------------------------
    case 'OPPOSITES':
      if (ease === 'EASY') {
        return 'Opposite-style spark that\'s exciting and high-energy when you\'re both in a good place.';
      }
      if (ease === 'MEDIUM') {
        return 'Strong pull between very different types; great stories, not always a calm ride.';
      }
      // HARD
      return 'Memorable, high-voltage chemistry that can swing quickly between pull and push.';

    // -------------------------------
    // Lesson patterns (Hai / Xing / Po only)
    // -------------------------------
    case 'LESSON_REPAIR':
      if (harms) {
        // Six Harms
        if (ease === 'EASY') {
          return 'Real pull, but feelings can bruise easily if you\'re not gentle with each other.';
        }
        if (ease === 'MEDIUM') {
          return 'Attraction with touchy spots that flare faster than you\'d expect in day-to-day life.';
        }
        return 'Emotional weather changes quickly here, from close to strained in short bursts.';
      } else {
        // Other lesson patterns (Xing / Po)
        if (ease === 'EASY') {
          return 'Attraction with a learning edge that shows you a few things about yourself.';
        }
        if (ease === 'MEDIUM') {
          return 'Pull plus recurring friction that highlights habits you\'re both still working out.';
        }
        return 'Tough mix that often underlines what you will - and won\'t - put up with.';
      }

    // -------------------------------
    // Same-sign (Chinese) · Mirror
    // -------------------------------
    case 'MIRROR':
      if (selfPunish) {
        return 'Familiar mirror that can replay the same scenes until one of you does something different.';
      }
      return 'Mirror-like chemistry where you recognise your own traits and quirks in each other.';

    // -------------------------------
    // Open / Neutral · No big pattern
    // -------------------------------
    case 'OPEN_PATTERN':
    default:
      if (ease === 'EASY') {
        return 'Light, open vibe that can grow into more if you both keep leaning in.';
      }
      if (ease === 'MEDIUM') {
        return 'No strong astrological push either way; it mostly becomes what you make of it.';
      }
      return 'Some friction and not much built-in glue, so it can fade if nobody steers it.';
  }
}

// -----------------------------
// Element line
// -----------------------------

function isSameElement(e1: Element, e2: Element): boolean {
  return e1 === e2;
}

function isSupportivePair(e1: Element, e2: Element): boolean {
  // Air–Fire & Earth–Water are your supportive pairs
  return (
    (e1 === 'Air' && e2 === 'Fire') ||
    (e1 === 'Fire' && e2 === 'Air') ||
    (e1 === 'Earth' && e2 === 'Water') ||
    (e1 === 'Water' && e2 === 'Earth')
  );
}

function isClashPair(e1: Element, e2: Element): boolean {
  // Air–Earth & Fire–Water are your clash pairs
  return (
    (e1 === 'Air' && e2 === 'Earth') ||
    (e1 === 'Earth' && e2 === 'Air') ||
    (e1 === 'Fire' && e2 === 'Water') ||
    (e1 === 'Water' && e2 === 'Fire')
  );
}

export function getElementLine(
  e1: Element,
  e2: Element
): string {
  const pair = `${e1} + ${e2}`;

  if (isSameElement(e1, e2)) {
    return `${pair} · Same element – similar style and easy mutual understanding.`;
  }

  if (isSupportivePair(e1, e2)) {
    return `${pair} · Supportive elements, easy flow.`;
  }

  if (isClashPair(e1, e2)) {
    return `${pair} · Clash elements – attraction with extra tension in timing and style.`;
  }

  // Everything else = mixed / neutral
  return `${pair} · Mixed elements – interesting combination that depends on how you work with your differences.`;
}
