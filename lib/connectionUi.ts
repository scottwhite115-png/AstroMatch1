// lib/connectionUi.ts

export type ChineseBasePattern = 'SAN_HE' | 'LIU_HE' | 'SAME_SIGN' | 'NO_PATTERN';
export type ChineseOverlayPattern = 'LIU_CHONG' | 'LIU_HAI' | 'XING' | 'PO';
export type WesternElementRelation =
  | 'SAME'
  | 'COMPATIBLE'
  | 'SEMI_COMPATIBLE'
  | 'NEUTRAL'
  | 'CLASH';

export type ConnectionArchetype =
  | 'TRIPLE_HARMONY'
  | 'SUPPORTIVE_ALLY'
  | 'MIRROR'
  | 'OPEN_PATTERN'
  | 'OPPOSITES'
  | 'LESSON_REPAIR';

export type WesternEase = 'EASY' | 'MEDIUM' | 'HARD';

export interface Chip {
  icon: string;
  label: string;
}

export function deriveArchetype(
  chineseBase: ChineseBasePattern,
  overlays: ChineseOverlayPattern[]
): ConnectionArchetype {
  const hasLiuChong = overlays.includes('LIU_CHONG');
  const hasDamage = overlays.some(o => o === 'LIU_HAI' || o === 'XING' || o === 'PO');

  // 1) Opposites take priority if present
  if (hasLiuChong) {
    return 'OPPOSITES';
  }

  // 2) Liu He base pattern - prioritize this even with damage overlays
  // Liu He + damage should still be SUPPORTIVE_ALLY (not LESSON_REPAIR)
  if (chineseBase === 'LIU_HE') {
    return 'SUPPORTIVE_ALLY';
  }

  // 3) Then pure damage patterns (but not Liu He base)
  if (hasDamage) {
    return 'LESSON_REPAIR';
  }

  // 4) Then other base patterns
  switch (chineseBase) {
    case 'SAN_HE':
      return 'TRIPLE_HARMONY';
    case 'SAME_SIGN':
      return 'MIRROR';
    case 'NO_PATTERN':
    default:
      return 'OPEN_PATTERN';
  }
}

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

export function getChineseBaseChip(chineseBase: ChineseBasePattern): Chip {
  switch (chineseBase) {
    case 'SAN_HE':
      return { icon: '🌟', label: 'San He 三合 · Triple Harmony' };
    case 'LIU_HE':
      return { icon: '💫', label: 'Liu He 六合 · Secret Friends' };
    case 'SAME_SIGN':
      return { icon: '🪞', label: 'Same Sign' };
    case 'NO_PATTERN':
    default:
      return { icon: '', label: '中 · No strong pattern' };
  }
}

export function getChineseOverlayChip(
  overlays: ChineseOverlayPattern[]
): Chip | null {
  const hasDamage = overlays.some(o => o === 'LIU_HAI' || o === 'XING' || o === 'PO');
  const hasLiuChong = overlays.includes('LIU_CHONG');

  if (hasLiuChong && !hasDamage) {
    return { icon: '⚠️', label: '六冲 · Opposites' };
  }

  if (hasDamage) {
    return { icon: '🔥', label: '刑/害/破 · Lesson pattern' };
  }

  return null;
}

export function getChineseOverlayChips(
  overlays: ChineseOverlayPattern[]
): Chip[] {
  const chips: Chip[] = [];

  const hasLiuChong = overlays.includes('LIU_CHONG');
  const hasXing = overlays.includes('XING');
  const hasHai = overlays.includes('LIU_HAI');
  const hasPo = overlays.includes('PO');

  // Liu Chong – always show explicitly
  if (hasLiuChong) {
    chips.push({
      icon: '⚠️',
      label: 'Magnetic opposites pattern',
    });
  }

  // Damage patterns – one chip, strongest first
  if (hasXing) {
    chips.push({
      icon: '🔥',
      label: 'Punishment pattern',
    });
  } else if (hasHai) {
    chips.push({
      icon: '🔥',
      label: 'Harm pattern',
    });
  } else if (hasPo) {
    chips.push({
      icon: '🔥',
      label: 'Break pattern',
    });
  }

  return chips;
}

type ElementName = 'Air' | 'Fire' | 'Earth' | 'Water';

export function getWesternChip(
  aElement: ElementName,
  bElement: ElementName,
  relation: WesternElementRelation
): Chip {
  const pair = `${aElement} + ${bElement}`;

  switch (relation) {
    case 'SAME':
      // e.g. "Water + Earth · Same element, easy flow"
      return {
        icon: '',
        label: `${pair} · Same element, easy flow`,
      };

    case 'COMPATIBLE':
      // e.g. "Air + Fire · Supportive elements, easy flow"
      return {
        icon: '',
        label: `${pair} · Supportive elements, easy flow`,
      };

    case 'SEMI_COMPATIBLE':
      // e.g. "Air + Water · Mixed elements – can work with effort –"
      return {
        icon: '',
        label: `${pair} · Mixed elements – can work with effort –`,
      };

    case 'NEUTRAL':
      // e.g. "Earth + Air · Neutral elements, balanced feel"
      return {
        icon: '',
        label: `${pair} · Neutral elements, balanced feel`,
      };

    case 'CLASH':
    default:
      // e.g. "Air + Earth · Clash elements – attraction and tension –"
      return {
        icon: '',
        label: `${pair} · Clash elements – attraction and tension –`,
      };
  }
}

export function getConnectionBlurb(
  archetype: ConnectionArchetype,
  ease: WesternEase,
  sameWesternSign?: boolean,
  hasDamage?: boolean
): string {
  switch (archetype) {
    case 'TRIPLE_HARMONY':
      if (ease === 'EASY') {
        return 'Same-trine match with easy flow; more supportive than dramatic, so building a life together tends to feel simpler.';
      }
      if (ease === 'MEDIUM') {
        return 'Strong same-trine bond with some style differences; it works when you stay curious about each other instead of assuming your way is right.';
      }
      return 'Deep same-trine connection with real friction; powerful when you chase a shared goal, draining when you keep pulling in different directions.';

    case 'SUPPORTIVE_ALLY':
      // Blurb C: Secret Friends + lesson overlay (has damage)
      if (hasDamage) {
        return 'Supportive, friendship connection with lessons underneath; you\'re good for each other, but patterns repeat until you speak up and change how you respond.';
      }
      
      // Blurb A: Clean Secret Friends with easy elements (EASY, no damage)
      if (ease === 'EASY') {
        return 'Soft, steady friendship bond with a warm, friend-like tone; you quietly back each other up when life is stressful.';
      }
      
      // Blurb B: Secret Friends with mixed elements (MEDIUM, no damage)
      if (ease === 'MEDIUM') {
        return 'Grounded friendship match with different pace or priorities; naming what support looks like for each of you keeps it smooth.';
      }
      // HARD (no damage)
      return 'Friendship bond with more friction around needs and timing; it works when you\'re upfront about limits instead of expecting mind-reading.';

    case 'OPPOSITES':
      if (ease === 'EASY') {
        return 'Magnetic opposite-style match with strong spark; it works when you enjoy your differences instead of trying to fix each other.';
      }
      if (ease === 'MEDIUM') {
        return 'Magnetic opposites with both spark and friction; you stretch each other\'s comfort zones, so clear talk about differences keeps things feeling fair.';
      }
      // HARD
      return 'Intense magnetic opposites where attraction and conflict sit close; clear boundaries stop drama from outweighing the good stuff.';

    case 'LESSON_REPAIR':
      if (ease === 'EASY') {
        return 'Lesson-heavy connection with genuine care; you grow together if you name problems early and tackle them as a team.';
      }
      if (ease === 'MEDIUM') {
        return 'Connection with both pull and pressure; similar issues return until you talk honestly and choose to handle them differently.';
      }
      return 'Intense, lesson-driven match; unforgettable but tiring unless you have firm boundaries, honesty, and regular check-ins about how it feels.';

    case 'MIRROR':
      if (ease === 'EASY') {
        return 'Mirror-style match where you see a lot of yourself; feeling understood is easy, but you share the same negative habits.';
      }
      if (ease === 'MEDIUM') {
        return 'Strong familiarity and similar instincts; you \'get\' each other quickly but also amplify each other\'s patterns, good and bad.';
      }
      return 'Mirror-clash connection—very similar nature but different needs; it can sting when traits you dislike in them also belong to you.';

    case 'OPEN_PATTERN':
    default:
      if (ease === 'EASY') {
        return 'Open-ended connection with light, easy flow; it can deepen if you keep showing up and communicating clearly.';
      }
      if (ease === 'MEDIUM') {
        return 'Balanced match with no fixed script; it\'s shaped more by daily choices than by any built-in pattern.';
      }
      return 'Free-form connection with some friction; it works when you\'re honest about differences and willing to adjust over time.';
  }
}
