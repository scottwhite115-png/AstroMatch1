// scripts/add-book-profile.ts
// Helper to add new profiles to bookOverrides with proper structure
// Usage: pnpm ts-node scripts/add-book-profile.ts

import type { West, East, BookOverride } from "@/data/newAstrologyOverrides";

/**
 * Template for adding a new profile
 * 
 * After reading the book for a specific sign combination:
 * 1. Fill in the arrays below with your interpretations
 * 2. Copy the output to data/newAstrologyOverrides.ts
 * 
 * Example from book: "Aquarius-Rat"
 * - Favorable: Ox, Dragon, Monkey (with specific Western filters)
 * - Avoid: Horse, Rabbit, Rooster (with specific Western filters)
 */

const PROFILE_TEMPLATE = {
  west: "Aquarius" as West,
  east: "Rat" as East,
  
  favorable: [
    {
      target: "Ox" as East,
      westernSigns: ["Gemini", "Libra", "Sagittarius"] as West[],
      reasoning: "Steady, grounding partner who admires innovation",
      deltas: { chem: +6, long: +4, comm: +2 }
    },
    {
      target: "Dragon" as East,
      westernSigns: ["Gemini", "Libra", "Sagittarius"] as West[],
      reasoning: "Dynamic intellectual partnership with shared vision",
      deltas: { chem: +6, long: +4, comm: +2 }
    },
    {
      target: "Monkey" as East,
      westernSigns: ["Aries", "Libra", "Sagittarius"] as West[],
      reasoning: "Witty, clever connection with playful energy",
      deltas: { chem: +6, long: +4, comm: +2 }
    }
  ],
  
  cautionary: [
    {
      target: "Horse" as East,
      westernSigns: ["Taurus", "Leo", "Scorpio"] as West[],
      reasoning: "Pacing differences create instability",
      deltas: { chem: -6, long: -4, comm: -2 }
    },
    {
      target: "Rabbit" as East,
      westernSigns: ["Leo"] as West[],
      reasoning: "Style clash between detached innovation and emotional needs",
      deltas: { chem: -6, long: -4 }
    },
    {
      target: "Rooster" as East,
      westernSigns: ["Scorpio"] as West[],
      reasoning: "Critical perfectionism vs independent thinking",
      deltas: { chem: -6, long: -4, comm: -2 }
    }
  ]
};

function generateBookOverrideCode(template: typeof PROFILE_TEMPLATE): string {
  const favorable = template.favorable.map(f => 
    `    { targetAnimal: "${f.target}", westFilter: [${f.westernSigns.map(w => `"${w}"`).join(",")}], delta: { chem:${f.deltas.chem}, long:${f.deltas.long}${f.deltas.comm ? `, comm:${f.deltas.comm}` : ''} }, note: "${f.reasoning}" }`
  );
  
  const cautionary = template.cautionary.map(c =>
    `    { targetAnimal: "${c.target}", westFilter: [${c.westernSigns.map(w => `"${w}"`).join(",")}], delta: { chem:${c.deltas.chem}, long:${c.deltas.long}${c.deltas.comm ? `, comm:${c.deltas.comm}` : ''} }, note: "${c.reasoning}" }`
  );

  return `  "${template.west}-${template.east}": [\n${[...favorable, '', ...cautionary].join(',\n')}\n  ],`;
}

console.log("Copy this to data/newAstrologyOverrides.ts:\n");
console.log(generateBookOverrideCode(PROFILE_TEMPLATE));
console.log("\nRemember: This is just a template. Fill in with your own interpretations from the book.");

