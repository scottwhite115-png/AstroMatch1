// generateByWestern.ts
import { computeMatch, WestSign, EastAnimal, Combo } from "./lib/match-engine";
import * as fs from "fs";

const WEST: WestSign[] = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const EAST: EastAnimal[] = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];

function allCombos(): Combo[] {
  const out: Combo[] = [];
  for (const w of WEST) for (const e of EAST) out.push(`${w}-${e}` as Combo);
  return out;
}

const all = allCombos();

for (const anchorWest of WEST) {
  const bucket: Record<string, any> = {};
  for (const myAnimal of EAST) {
    const me = `${anchorWest}-${myAnimal}` as Combo;
    bucket[me] = {};
    for (const you of all) {
      const res = computeMatch(me, you);
      bucket[me][you] = res;
    }
  }
  const file = `./out_${anchorWest.toLowerCase()}.json`;
  fs.writeFileSync(file, JSON.stringify(bucket, null, 2), "utf-8");
  console.log(`Wrote ${file}`);
}

