// /engine/matchEngine.ts
// Complete, label-only match engine for all West × East sign pairs.

export type WestSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type EastAnimal =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export type Label =
  | "Soulmate Connection"
  | "Good Connection"
  | "Neutral Connection"
  | "Challenging Connection"
  | "Difficult Connection";

export interface PersonSign {
  west: WestSign;
  east: EastAnimal;
}

export interface MatchResult {
  label: Label;
  color: string;
  magneticOpposite: boolean;
  notes: string[];
  blurb: string;
}

const WEST_ELEMENTS: Record<WestSign, "Fire" | "Earth" | "Air" | "Water"> = {
  Aries: "Fire",
  Leo: "Fire",
  Sagittarius: "Fire",
  Taurus: "Earth",
  Virgo: "Earth",
  Capricorn: "Earth",
  Gemini: "Air",
  Libra: "Air",
  Aquarius: "Air",
  Cancer: "Water",
  Scorpio: "Water",
  Pisces: "Water",
};

const OPPOSITES: Record<WestSign, WestSign> = {
  Aries: "Libra",
  Taurus: "Scorpio",
  Gemini: "Sagittarius",
  Cancer: "Capricorn",
  Leo: "Aquarius",
  Virgo: "Pisces",
  Libra: "Aries",
  Scorpio: "Taurus",
  Sagittarius: "Gemini",
  Capricorn: "Cancer",
  Aquarius: "Leo",
  Pisces: "Virgo",
};

function westSupport(a: WestSign, b: WestSign) {
  const reasons: string[] = [];
  const elemA = WEST_ELEMENTS[a];
  const elemB = WEST_ELEMENTS[b];
  const sameSign = a === b;
  const opposite = OPPOSITES[a] === b;

  const sameElement = elemA === elemB;
  const compatible =
    (elemA === "Air" && elemB === "Fire") ||
    (elemA === "Fire" && elemB === "Air") ||
    (elemA === "Earth" && elemB === "Water") ||
    (elemA === "Water" && elemB === "Earth");
  const clash =
    (elemA === "Air" && (elemB === "Earth" || elemB === "Water")) ||
    (elemA === "Fire" && (elemB === "Earth" || elemB === "Water")) ||
    (elemA === "Earth" && (elemB === "Air" || elemB === "Fire")) ||
    (elemA === "Water" && (elemB === "Air" || elemB === "Fire"));

  let score = 0;
  if (sameElement) { score += 1; reasons.push(`Same element (${elemA})`); }
  if (compatible) { score += 1; reasons.push(`Compatible elements (${elemA}↔${elemB})`); }
  if (sameSign) { reasons.push("Same sign"); }
  if (opposite) { reasons.push("Opposite signs (magnetic)"); }
  if (clash && !sameElement && !compatible) { score -= 1; reasons.push("Elemental clash"); }

  return { score, reasons, magnetic: opposite };
}

const TRINES: EastAnimal[][] = [
  ["Rat", "Dragon", "Monkey"],
  ["Ox", "Snake", "Rooster"],
  ["Tiger", "Horse", "Dog"],
  ["Rabbit", "Goat", "Pig"],
];

const SIX_HARMONIES: [EastAnimal, EastAnimal][] = [
  ["Rat", "Ox"], ["Tiger", "Pig"], ["Rabbit", "Dog"],
  ["Dragon", "Rooster"], ["Snake", "Monkey"], ["Horse", "Goat"],
];

const SIX_CONFLICTS: [EastAnimal, EastAnimal][] = [
  ["Rat", "Horse"], ["Ox", "Goat"], ["Tiger", "Monkey"],
  ["Rabbit", "Rooster"], ["Dragon", "Dog"], ["Snake", "Pig"],
];

const SIX_DAMAGES: [EastAnimal, EastAnimal][] = [
  ["Rat", "Goat"], ["Ox", "Horse"], ["Tiger", "Snake"],
  ["Rabbit", "Dragon"], ["Monkey", "Pig"], ["Rooster", "Dog"],
];

function inPairList(a: EastAnimal, b: EastAnimal, list: [EastAnimal, EastAnimal][]) {
  return list.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

function sameTrine(a: EastAnimal, b: EastAnimal) {
  return TRINES.some(group => group.includes(a) && group.includes(b));
}

function eastSupport(a: EastAnimal, b: EastAnimal) {
  const reasons: string[] = [];
  if (inPairList(a, b, SIX_CONFLICTS))
    return { score: -999, reasons: ["Six Conflicts (opposite)"], veto: "conflict" as const };
  if (inPairList(a, b, SIX_DAMAGES))
    return { score: -999, reasons: ["Six Damages (worst)"], veto: "damage" as const };
  if (sameTrine(a, b)) { reasons.push("Same Trine"); return { score: 2, reasons }; }
  if (inPairList(a, b, SIX_HARMONIES)) { reasons.push("Six Harmonies (supportive)"); return { score: 1, reasons }; }
  return { score: 0, reasons };
}

const LABELS: Record<Label, string> = {
  "Soulmate Connection": "You move in sync — natural chemistry and shared vision.",
  "Good Connection": "Warm and easy connection with room to grow.",
  "Neutral Connection": "Steady but unremarkable — depends on timing and effort.",
  "Challenging Connection": "Magnetic contrasts with friction — growth comes through patience and respect.",
  "Difficult Connection": "Strong personalities, different rhythms — a learning curve.",
};

const COLORS: Record<Label, string> = {
  "Soulmate Connection": "#FFD700",
  "Good Connection": "#00A86B",
  "Neutral Connection": "#ADD8E6",
  "Challenging Connection": "#F97316",
  "Difficult Connection": "#FF4C4C",
};

const BADGE_BLURB =
  " Electric pull — opposite styles. Great chemistry, but needs maturity and balance.";

export function getMatchLabel(viewer: PersonSign, partner: PersonSign): MatchResult {
  const w = westSupport(viewer.west, partner.west);
  const e = eastSupport(viewer.east, partner.east);

  const sameWest = viewer.west === partner.west;
  const sameTrinePair = sameTrine(viewer.east, partner.east);
  const sameAnimal = viewer.east === partner.east;

  if ((e as any).veto) {
    let label: Label;
    if (sameWest) {
      label = "Neutral Connection";
    } else if ((e as any).veto === "conflict") {
      label = "Difficult Connection";
    } else {
      label = "Difficult Connection";
    }
    return {
      label,
      color: COLORS[label],
      magneticOpposite: w.magnetic,
      notes: [...e.reasons, ...w.reasons],
      blurb: LABELS[label],
    };
  }

  const total = w.score + e.score;
  const reasons = [...e.reasons, ...w.reasons];
  let label: Label;

  if (total >= 3) label = "Soulmate Connection";
  else if (total >= 2) label = "Good Connection";
  else if (total === 1) label = "Neutral Connection";
  else label = "Difficult Connection";

  if (sameWest) {
    label = "Neutral Connection";
  }

  if (sameTrinePair || sameAnimal) {
    label = "Good Connection";
  }

  const baseBlurb = LABELS[label];
  const badgeBlurb = w.magnetic ? BADGE_BLURB : "";
  return {
    label,
    color: COLORS[label],
    magneticOpposite: w.magnetic,
    notes: reasons,
    blurb: baseBlurb + badgeBlurb,
  };
}

export const ALL_WEST: WestSign[] = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

export const ALL_EAST: EastAnimal[] = [
  "Rat","Ox","Tiger","Rabbit","Dragon","Snake",
  "Horse","Goat","Monkey","Rooster","Dog","Pig",
];

export function buildMatrix(viewer: PersonSign) {
  const matrix: Array<{
    west: WestSign;
    east: EastAnimal;
    label: Label;
    color: string;
    magneticOpposite: boolean;
    blurb: string;
  }> = [];

  for (const west of ALL_WEST) {
    for (const east of ALL_EAST) {
      const r = getMatchLabel(viewer, { west, east });
      matrix.push({
        west,
        east,
        label: r.label,
        color: r.color,
        magneticOpposite: r.magneticOpposite,
        blurb: r.blurb,
      });
    }
  }

  return matrix;
}

