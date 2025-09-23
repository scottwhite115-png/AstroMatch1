// scripts/generate-matrix.ts
import fs from "node:fs";
import path from "node:path";

const WEST = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const EAST = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];

type Matrix = Record<string, Record<string, number>>;
type Overrides = Record<string, Record<string, number>>;
type Categories = Record<"Perfect"|"Excellent"|"Good"|"Mixed"|"Difficult"|"Avoid", number>;

const root = path.join(process.cwd(), "src", "lib", "compatibility");
const seedsDir = path.join(root, "seeds");

const categories: Categories = JSON.parse(fs.readFileSync(path.join(seedsDir, "categories.json"), "utf8"));
const overrides: Overrides = JSON.parse(fs.readFileSync(path.join(seedsDir, "overrides.json"), "utf8"));

function comboLabel(west: string, east: string) {
  return `${west}-${east}`;
}

function allCombos(): string[] {
  const labels: string[] = [];
  for (const w of WEST) for (const e of EAST) labels.push(comboLabel(w, e));
  return labels;
}

// ---- Heuristic fallback (tweak freely) ----
// If no override exists, we derive a reasonable score using 3 signals:
// 1) Western elemental harmony, 2) Chinese triad harmony, 3) sign polarity
const WEST_ELEMENT: Record<string, "Fire"|"Earth"|"Air"|"Water"> = {
  Aries:"Fire", Leo:"Fire", Sagittarius:"Fire",
  Taurus:"Earth", Virgo:"Earth", Capricorn:"Earth",
  Gemini:"Air", Libra:"Air", Aquarius:"Air",
  Cancer:"Water", Scorpio:"Water", Pisces:"Water"
};
const WEST_COMP: Record<"Fire"|"Earth"|"Air"|"Water", ("Fire"|"Earth"|"Air"|"Water")[]> = {
  Fire: ["Fire","Air"], Air: ["Air","Fire"], Earth: ["Earth","Water"], Water: ["Water","Earth"]
};

const CHINESE_TRIADS: Record<"Rat"|"Ox"|"Tiger"|"Rabbit"|"Dragon"|"Snake"|"Horse"|"Goat"|"Monkey"|"Rooster"|"Dog"|"Pig", string> = {
  Rat:"1", Dragon:"1", Monkey:"1",
  Ox:"2", Snake:"2", Rooster:"2",
  Tiger:"3", Horse:"3", Dog:"3",
  Rabbit:"4", Goat:"4", Pig:"4"
};

const CHINESE_CONFLICTS: [string,string][] = [
  ["Rat","Horse"], ["Ox","Goat"], ["Tiger","Monkey"], ["Rabbit","Rooster"],
  ["Dragon","Dog"], ["Snake","Pig"]
];

function baseFromHeuristics(a: string, b: string): number {
  // parse
  const [wA,eA] = a.split("-");
  const [wB,eB] = b.split("-");

  // 1) Western element synergy
  const eWA = WEST_ELEMENT[wA]; const eWB = WEST_ELEMENT[wB];
  let westBonus = 0;
  if (eWA === eWB) westBonus += 8;                // same element
  else if (WEST_COMP[eWA].includes(eWB)) westBonus += 4; // complementary families
  else westBonus -= 4;

  // 2) Chinese trine harmony (same triad strong, conflict weak)
  let eastBonus = 0;
  if (CHINESE_TRIADS[eA as keyof typeof CHINESE_TRIADS] === CHINESE_TRIADS[eB as keyof typeof CHINESE_TRIADS]) eastBonus += 8;
  if (CHINESE_CONFLICTS.some(([x,y]) => (x===eA&&y===eB) || (x===eB&&y===eA))) eastBonus -= 10;

  // 3) Polarity (cardinal/fixed/mutable proxy via West sign index mod 3) – gentle nudge
  const idxA = WEST.indexOf(wA) % 3;
  const idxB = WEST.indexOf(wB) % 3;
  let polarity = (idxA === idxB) ? 3 : 0;

  // Start from a neutral "Mixed" and push/pull by bonuses
  let score = categories.Mixed; // e.g., 65
  score += westBonus + eastBonus + polarity;

  // clamp
  if (score > 97) score = 97;
  if (score < 25) score = 25;
  return Math.round(score);
}

function mergeSymmetric(m: Matrix, a: string, b: string, val: number) {
  m[a] = m[a] || {};
  m[b] = m[b] || {};
  m[a][b] = val;
  m[b][a] = val;
}

function buildMatrix(): Matrix {
  const labels = allCombos();
  const out: Matrix = {};

  // init self-scores (neutral "Good")
  for (const a of labels) {
    out[a] = out[a] || {};
    out[a][a] = categories.Good; // e.g., 75
  }

  // apply overrides with symmetry
  for (const a of Object.keys(overrides)) {
    for (const b of Object.keys(overrides[a])) {
      mergeSymmetric(out, a, b, overrides[a][b]);
    }
  }

  // fill gaps with heuristics
  for (const a of labels) {
    for (const b of labels) {
      if (out[a][b] === undefined) {
        const s = baseFromHeuristics(a, b);
        mergeSymmetric(out, a, b, s);
      }
    }
  }

  return out;
}

const matrix = buildMatrix();
fs.writeFileSync(path.join(root, "matrix.json"), JSON.stringify(matrix, null, 2), "utf8");
console.log("✅ Generated matrix.json with", Object.keys(matrix).length, "rows.");
