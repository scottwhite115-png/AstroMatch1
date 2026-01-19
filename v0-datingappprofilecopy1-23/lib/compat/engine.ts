import { Element, Gender, Rank, TrineId, UserAstro, ConnectionBox } from "./types";
import trineInfo from "./trine.json";
import elementsInfo from "./elements.json";
import fusion from "./fusion.json";
import { TIER_LABEL, type Tier } from "@/engine/labels";

/** WEST → element */
export const westElement: Record<string, Element> = {
  aries:"fire", leo:"fire", sagittarius:"fire",
  taurus:"earth", virgo:"earth", capricorn:"earth",
  gemini:"air", libra:"air", aquarius:"air",
  cancer:"water", scorpio:"water", pisces:"water"
};

/** EAST → trine id */
export const eastTrine: Record<string, TrineId> = {
  rat:1, dragon:1, monkey:1,
  ox:2, snake:2, rooster:2,
  tiger:3, horse:3, dog:3,
  rabbit:4, goat:4, pig:4
};

/** Natural enemy pairs (sorted key a-b) */
const eastEnemies = new Set([
  "rat-horse","ox-goat","tiger-monkey",
  "rabbit-rooster","dragon-dog","snake-pig"
]);
const isEnemy = (a: string, b: string) => eastEnemies.has([a,b].sort().join("-"));

/** Element relations */
const same = (a: Element, b: Element) => a === b;
const compatible = (a: Element, b: Element) =>
  (a==="fire" && b==="air") || (a==="air" && b==="fire") ||
  (a==="earth" && b==="water") || (a==="water" && b==="earth");
const semi = (a: Element, b: Element) =>
  (a==="fire" && b==="earth") || (a==="earth" && b==="fire") ||
  (a==="air" && b==="water") || (a==="water" && b==="air");

/** Rating to Tier mapping */
const ratingToTier: Record<Rank, Tier> = {
  5: "perfect",
  4: "excellent",
  3: "good",
  2: "fair",
  1: "challenging",
};

/** Core rank logic (East-led, West-flavoured) */
export function getRank(a: UserAstro, b: UserAstro): Rank {
  if (isEnemy(a.east_sign, b.east_sign)) return 1;

  const sameTrine = a.trine === b.trine;
  const eA = a.element, eB = b.element;

  if (sameTrine && (same(eA,eB) || compatible(eA,eB))) return 5;
  if (sameTrine) return 4;

  if (same(eA,eB) || compatible(eA,eB)) return 3;
  if (semi(eA,eB)) return 2;

  return 1;
}

/** ---------------- Formatting helpers ---------------- */
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function labelGender(g?: Gender) {
  if (!g || g === "unspecified") return "";
  if (g === "male") return " (Male)";
  if (g === "female") return " (Female)";
  return " (They)";
}
function eastPair(viewer: UserAstro, other: UserAstro) {
  const L = `${cap(viewer.east_sign)}${labelGender(viewer.gender)}`;
  const R = `${cap(other.east_sign)}${labelGender(other.gender)}`;
  return `${L} × ${R}`;
}
function westPair(viewer: UserAstro, other: UserAstro) {
  return `${cap(viewer.west_sign)} × ${cap(other.west_sign)}`;
}
function trineThemeName(t: TrineId) {
  return (t === 1 ? "Visionaries" : t === 2 ? "Strategists" : t === 3 ? "Adventurers" : "Artists");
}
function elementKey(a: Element, b: Element) {
  return [a, b].sort().join("-") as keyof typeof elementsInfo.blurbs;
}

/** ---------------- Build Connection Box (+ dropdown) ---------------- */
export function buildConnectionBox(viewer: UserAstro, other: UserAstro): ConnectionBox {
  const rating = getRank(viewer, other);
  const tier = ratingToTier[rating];
  const label = TIER_LABEL[tier];
  const fusionLine = fusion[String(rating) as keyof typeof fusion];

  // CHINESE
  const sameTr = viewer.trine === other.trine;
  const enemies = isEnemy(viewer.east_sign, other.east_sign);

  let chineseRelation: "Same Trine" | "Cross-Trine" | "Natural Enemies" =
    enemies ? "Natural Enemies" : (sameTr ? "Same Trine" : "Cross-Trine");

  let theme: string | undefined;
  let ch_summary_line = "";
  let ch_expanded = "";
  let ch_love = "";
  let ch_watch = "";

  if (enemies) {
    theme = undefined;
    ch_summary_line = (trineInfo.enemies.summary_line);
    ch_expanded = (trineInfo.enemies.expanded);
    ch_love = trineInfo.enemies.love;
    ch_watch = trineInfo.enemies.watch;
  } else if (sameTr) {
    const key = String(viewer.trine) as "1" | "2" | "3" | "4";
    theme = trineInfo[key].theme;
    ch_summary_line = trineInfo[key].summary_line;
    ch_expanded = trineInfo[key].expanded;
    ch_love = trineInfo[key].love;
    ch_watch = trineInfo[key].watch;
  } else {
    theme = undefined;
    ch_summary_line = trineInfo.cross.summary_line;
    ch_expanded = trineInfo.cross.expanded;
    ch_love = trineInfo.cross.love;
    ch_watch = trineInfo.cross.watch;
  }

  const chineseHeading = `${eastPair(viewer, other)} — ${chineseRelation}${theme ? `: ${theme}` : ""}`;

  // WESTERN
  const eKey = elementKey(viewer.element, other.element);
  const eInfo = elementsInfo.blurbs[eKey];
  const westernHeading = `${westPair(viewer, other)} — ${eInfo.relation}: ${eInfo.label}`;
  const w_summary_line = eInfo.summary_line;
  const w_expanded = eInfo.expanded;

  const box: ConnectionBox = {
    rating,
    label,
    fusion: fusionLine,
    tier,

    summary: {
      chinese_heading: chineseHeading,
      chinese_line: ch_summary_line,
      western_heading: westernHeading,
      western_line: w_summary_line
    },

    dropdown: {
      chinese: {
        heading: chineseHeading,
        expanded: ch_expanded,
        love_tip: ch_love,
        watch_tip: ch_watch
      },
      western: {
        heading: westernHeading,
        expanded: w_expanded,
        nurture_tip: eInfo.nurture,
        caution_tip: eInfo.caution
      }
    }
  };

  return box;
}

/** Derivers for signup/backfill */
export function deriveElement(west_sign: string): Element {
  return (westElement as any)[west_sign.toLowerCase()];
}
export function deriveTrine(east_sign: string): TrineId {
  return (eastTrine as any)[east_sign.toLowerCase()];
}