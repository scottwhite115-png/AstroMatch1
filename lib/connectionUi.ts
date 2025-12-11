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
      // e.g. "Air + Water · Mixed elements – can work with effort"
      return {
        icon: '',
        label: `${pair} · Mixed elements – can work with effort`,
      };

    case 'NEUTRAL':
      // e.g. "Earth + Air · Neutral elements, balanced feel"
      return {
        icon: '',
        label: `${pair} · Neutral elements, balanced feel`,
      };

    case 'CLASH':
    default:
      // e.g. "Air + Earth · Clash elements – attraction and tension"
      return {
        icon: '',
        label: `${pair} · Clash elements – attraction and tension`,
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
        if (sameWesternSign) {
          return 'Deeply compatible match with a natural flow and very similar outlook. It tends to feel more supportive than dramatic, but you\'ll need to stay conscious about emotional closeness, not just ideas and plans.';
        }
        return 'Deeply compatible match with a natural flow. It tends to feel more supportive than dramatic, which makes long-term plans easier to grow into together.';
      }
      if (ease === 'MEDIUM') {
        return 'Strong underlying bond with a few style differences to work around. When you stay curious about each other\'s way of doing things, this can feel both steady and alive.';
      }
      return 'Deep connection with very different ways of thinking and working. Powerful when you agree on a shared goal; draining when you pull in different directions.';

    case 'SUPPORTIVE_ALLY':
      // Blurb C: Secret Friends + lesson overlay (has damage)
      if (hasDamage) {
        return 'Supportive, ally-style connection with lesson energy underneath. You can be very good for each other, but patterns repeat until you talk honestly about what isn\'t working and change how you both respond.';
      }
      
      // Blurb A: Clean Secret Friends with easy elements (EASY, no damage)
      if (ease === 'EASY') {
        return 'Soft, steady ally-style connection with a warm, friend-like tone. You\'re good at quietly backing each other up when life is stressful, not just when things are fun.';
      }
      
      // Blurb B: Secret Friends with mixed elements (MEDIUM, no damage)
      return 'Grounded ally-style match with a few differences in pace and priorities. You\'re still on the same side, but it works best when you spell out what support actually looks like for each of you.';

    case 'OPPOSITES':
      if (ease === 'EASY') {
        return 'Magnetic, opposite-style connection with strong spark. It works best when you enjoy your differences instead of trying to fix each other.';
      }
      if (ease === 'MEDIUM') {
        return 'Magnetic opposites with both spark and friction. You\'ll stretch each other\'s comfort zones, so clear talk about differences keeps things feeling fair.';
      }
      // HARD
      return 'Intense magnetic opposites; attraction and conflict sit close together, so you\'ll need clear boundaries to stop drama outweighing the good stuff.';

    case 'LESSON_REPAIR':
      if (ease === 'EASY') {
        return 'Lesson-heavy connection with real heart underneath. You can grow a lot together if you\'re willing to name problems early and work on them as a team.';
      }
      if (ease === 'MEDIUM') {
        return 'Connection with both pull and pressure. Patterns tend to repeat until you talk honestly about what isn\'t working and make different choices together.';
      }
      return 'Intense, lesson-driven match that can be unforgettable and exhausting. It demands clear boundaries, emotional honesty, and regular reality checks about whether it still feels good for both of you.';

    case 'MIRROR':
      if (ease === 'EASY') {
        return 'Recognisable, mirror-style match where you see a lot of yourself in the other. That makes feeling understood easier, but it also doubles your shared habits.';
      }
      if (ease === 'MEDIUM') {
        return 'Strong familiarity and similar instincts. You often "get" each other quickly, but you can also amplify each other\'s patterns, good and bad.';
      }
      return 'Mirror-clash connection – very similar nature but very different needs. It can feel confronting when you dislike traits in them that you also carry yourself.';

    case 'OPEN_PATTERN':
    default:
      if (ease === 'EASY') {
        return 'Open-ended connection with a light, easy flow. There\'s space to grow into something meaningful if you keep showing up and communicating clearly.';
      }
      if (ease === 'MEDIUM') {
        return 'Balanced match without a fixed script. How this goes depends less on fate and more on the everyday choices you make with each other.';
      }
      return 'Free-form connection with some built-in friction. It can still work well if you\'re both honest about differences and willing to adjust over time.';
  }
}
