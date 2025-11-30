// Run with:  npx ts-node scripts/generate-compat-json.ts
import { scoreMatch, type Person } from "../lib/engine.js";
import { buildReadableBlurb } from "../lib/buildReadableBlurb.js";
import { buildCompatSummary } from "../lib/buildCompatSummary.js";
import * as fs from "fs";
import * as path from "path";

const WEST = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'] as const;
const EAST = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'] as const;
type West = typeof WEST[number]; type East = typeof EAST[number];
type Combo = `${West}-${East}`;

function combos(): Combo[] {
  const out: Combo[] = [];
  for (const w of WEST) for (const e of EAST) out.push(`${w}-${e}` as Combo);
  return out;
}

function parseCombo(c: Combo): Person {
  const [west, east] = c.split("-") as [West, East];
  return { west, east } as Person;
}

// Data shape to store
type CompatEntry = {
  score: number;
  tier: 'Exceptional Match'|'Highly Compatible'|'Balanced Compatibility'|'Challenging Match';
  blurb: string[];
  summary: {
    coreVibe: number; chemistry: number; communication: number;
    lifestyle: number; longTerm: number; growth: number;
  };
};

function tierFor(score:number): CompatEntry['tier'] {
  if (score >= 90) return 'Exceptional Match';
  if (score >= 80) return 'Highly Compatible';
  if (score >= 70) return 'Balanced Compatibility';
  return 'Challenging Match';
}

(async function main(){
  const all = combos();
  const result: Record<string, CompatEntry> = {};

  for (const A of all) {
    for (const B of all) {
      const a = parseCombo(A);
      const b = parseCombo(B);

      const r = scoreMatch(a, b, { context: 'romantic_opposite' });
      const blurb = buildReadableBlurb(a, b, r);
      const summary = buildCompatSummary(a, b, r);
      const key = `${A}__${B}`;

      result[key] = { score: r.score, tier: tierFor(r.score), blurb, summary };
    }
  }

  const outDir = path.resolve(process.cwd(), "generated");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "compat_20k.json"), JSON.stringify(result, null, 2), "utf8");
  console.log("Wrote generated/compat_20k.json");
})();


