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
  | 'TRIPLE_HARMONY'   // San He 三合 · same tribe
  | 'SUPPORTIVE_ALLY'  // Liu He 六合 · Six Harmonies
  | 'OPPOSITES'        // Liu Chong 六冲 · Six Conflicts / opposites
  | 'LESSON_REPAIR'    // Hai / Xing / Po without San He / Liu He / Same sign
  | 'MIRROR'           // Same-sign archetype (Chinese same animal)
  | 'OPEN_PATTERN';    // No big Chinese pattern

export type WesternEase = 'EASY' | 'MEDIUM' | 'HARD';

export interface Chip {
  icon: string;
  label: string;
}

// ------------------------------------
// Helpers
// ------------------------------------

export function hasDamageOverlay(
  overlays: ChineseOverlayPattern[]
): boolean {
  return overlays.some(o => o === 'LIU_HAI' || o === 'XING' || o === 'PO');
}

export function hasLiuHai(overlays: ChineseOverlayPattern[]): boolean {
  return overlays.includes('LIU_HAI');
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

  // 1) Six Conflicts (Liu Chong) → Opposites archetype
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
      // 3) Lesson archetype only when no San He / Liu He / Same sign
      return hasDamage ? 'LESSON_REPAIR' : 'OPEN_PATTERN';
  }
}

// Same Chinese sign must never show above 70%
export function applySameSignCap(
  score: number,
  chineseBase: ChineseBasePattern
): number {
  if (chineseBase === 'SAME_SIGN') {
    return Math.min(score, 70);
  }
  return score;
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

// ------------------------------------
// Pill label logic
// ------------------------------------

export function getMatchLabel(
  archetype: ConnectionArchetype,
  chineseBase: ChineseBasePattern,
  overlays: ChineseOverlayPattern[],
  finalScore: number
): string {
  const hasLiuChong = overlays.includes('LIU_CHONG');
  const hasDamage = hasDamageOverlay(overlays);
  const hasLiuHai = overlays.includes('LIU_HAI');
  const hasXing = overlays.includes('XING');
  const hasPo = overlays.includes('PO');

  // Major pattern: Liu Chong → Six Conflicts 六冲
  if (hasLiuChong) {
    return 'Six Conflicts 六冲';
  }

  // Major pattern: San He → Triple Harmony 三合
  if (chineseBase === 'SAN_HE') {
    return 'Triple Harmony 三合';
  }

  // Major pattern: Liu He → Six Harmonies 六合 (e.g. Monkey & Snake)
  if (chineseBase === 'LIU_HE') {
    return 'Six Harmonies 六合';
  }

  // Same sign: show punishment when present (同 刑)
  if (chineseBase === 'SAME_SIGN') {
    if (hasXing) {
      return 'Punishment 同 刑';
    }
    return 'Same Sign 同';
  }

  // Damage-only: Six Harms, Punishment, Breakpoint
  if (archetype === 'LESSON_REPAIR' || hasDamage) {
    if (hasLiuHai) {
      return 'Six Harms 六害';
    }
    if (hasXing) {
      return 'Punishment 刑';
    }
    if (hasPo) {
      return 'Breakpoint 破';
    }
    return 'Challenging';
  }

  return 'Neutral 中';
}

// ------------------------------------
// Connection blurb logic
// ------------------------------------

export function getConnectionBlurb(
  archetype: ConnectionArchetype,
  ease: WesternEase,
  chineseBase: ChineseBasePattern,
  overlays: ChineseOverlayPattern[]
): string {
  const hasDamage = hasDamageOverlay(overlays);
  const selfPunish = hasSelfPunishment(chineseBase, overlays);
  const harms = hasLiuHai(overlays);

  switch (archetype) {
    // --------------------------------
    // San He · Triple Harmony – same tribe
    // --------------------------------
    case 'TRIPLE_HARMONY':
      if (ease === 'EASY') {
        return 'Triple Harmony match; same-tribe connection with rare ease, strong mutual backing, and a natural sense that you can build a lot together over time.';
      }
      if (ease === 'MEDIUM') {
        return 'Triple Harmony bond; you\'re clearly on the same wavelength, and your different styles become an asset when you respect how each of you moves through life.';
      }
      // HARD
      return 'Triple Harmony tie; deep loyalty sits underneath real tension, and it\'s powerful when you point that intensity at shared goals instead of at each other.';

    // --------------------------------
    // Liu He · Six Harmonies – Supportive / secret-friends vibe
    // --------------------------------
    case 'SUPPORTIVE_ALLY': {
      if (hasDamage) {
        // Liu He + Hai/Xing/Po
        return 'Six Harmonies with extra edge; there\'s real support underneath, and the sharper moments can deepen trust when you name them early and adjust together.';
      }

      if (ease === 'EASY') {
        return 'Six Harmonies match; classic secret-friends connection that feels warm, loyal, and makes day-to-day decisions easier to carry as a team.';
      }
      if (ease === 'MEDIUM') {
        return 'Six Harmonies bond; you\'re clearly on the same side, and your different pace or priorities help you cover more ground when you talk about what you each need.';
      }
      // HARD, no damage
      return 'Six Harmonies tie; the goodwill runs deep, and even when rhythms clash you have a solid base to find fair, workable ways of sharing life.';
    }

    // --------------------------------
    // Liu Chong · Six Conflicts – Magnetic opposites vibe
    // --------------------------------
    case 'OPPOSITES':
      if (ease === 'EASY') {
        return 'Six Conflicts match; magnetic opposites with big spark and chemistry when you enjoy the contrast and let each other be yourselves.';
      }
      if (ease === 'MEDIUM') {
        return 'Six Conflicts bond; strong pull between very different styles that works best when you can laugh about clashes, reset quickly, and keep the focus on learning, not winning.';
      }
      // HARD
      return 'Six Conflicts tie; intense, memorable connection that can fast-track growth if you hold clear boundaries and treat each other as teammates, not opponents.';

    // --------------------------------
    // Hai / Xing / Po without San He / Liu He / Same sign – Lesson/Repair
    // --------------------------------
    case 'LESSON_REPAIR':
      if (harms) {
        // Six Harms specific wording
        if (ease === 'EASY') {
          return 'Six Harms match; real pull, but small hurts land hard unless you\'re gentle with each other.';
        }
        if (ease === 'MEDIUM') {
          return 'Six Harms pattern; push–pull tension repeats until you both own your triggers and adjust.';
        }
        // HARD
        return 'Six Harms tie; emotional volume is high and needs firm limits to stay healthy.';
      } else {
        // Generic lesson pattern (Xing/Po only)
        if (ease === 'EASY') {
          return 'Lesson match; there\'s genuine pull, and naming issues early can turn tests into growth.';
        }
        if (ease === 'MEDIUM') {
          return 'Lesson pattern; recurring arguments signal a need to change how you respond, not who you blame.';
        }
        // HARD
        return 'Intense lesson tie; demanding, but it can leave you wiser if you stay honest about your limits.';
      }

    // --------------------------------
    // Same-sign archetype (Chinese same sign)
    // --------------------------------
    case 'MIRROR':
      if (selfPunish) {
        // same sign + Xing = self-punishment
        return 'Same-sign with a self-punishment streak; similar habits repeat until you handle them more gently.';
      }
      // normal same-sign
      return 'Same-sign match; you see yourself in each other, doubling both your strengths and weaker spots.';

    // --------------------------------
    // No big Chinese pattern – Open / Neutral
    // --------------------------------
    case 'OPEN_PATTERN':
    default:
      if (ease === 'EASY') {
        return 'Open match; light, easy flow with room to grow if you both keep showing up.';
      }
      if (ease === 'MEDIUM') {
        return 'Open pattern; no fixed script, so the bond reflects your values and everyday choices.';
      }
      // HARD
      return 'Open match with some friction; without honest tweaks it can quietly drift into frustration.';
  }
}
