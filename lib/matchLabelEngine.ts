// matchLabelEngine.ts

// ------------------------------------
// Types
// ------------------------------------

export type ChineseBasePattern = 'SAN_HE' | 'LIU_HE' | 'SAME_SIGN' | 'NO_PATTERN';

export type ChineseOverlayPattern = 'LIU_CHONG' | 'LIU_HAI' | 'XING' | 'PO';

export type ConnectionArchetype =
  | 'TRIPLE_HARMONY'   // San He
  | 'SUPPORTIVE_ALLY'  // Liu He
  | 'OPPOSITES'        // Liu Chong
  | 'LESSON_REPAIR'    // Hai / Xing / Po only
  | 'MIRROR'           // Same sign
  | 'OPEN_PATTERN';    // No big pattern

export type Element = 'Air' | 'Fire' | 'Earth' | 'Water';

// ------------------------------------
// Chinese pattern helpers
// ------------------------------------

export function hasDamageOverlay(
  overlays: ChineseOverlayPattern[]
): boolean {
  return overlays.some(o => o === 'LIU_HAI' || o === 'XING' || o === 'PO');
}

export function hasSelfPunishment(
  chineseBase: ChineseBasePattern,
  overlays: ChineseOverlayPattern[]
): boolean {
  // self-punishment = same animal + Xing overlay
  return chineseBase === 'SAME_SIGN' && overlays.includes('XING');
}

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

// ------------------------------------
// Match pill label
// ------------------------------------

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

// ------------------------------------
// Tagline under the pill (chemistry only)
// ------------------------------------

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
      return 'Same-sign dynamic where similar traits on both sides tend to replay the same themes.';
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

// ------------------------------------
// Element line
// ------------------------------------

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
