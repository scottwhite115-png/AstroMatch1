// buildBlurb.ts - Generate human-readable compatibility descriptions

import type { Element, East } from "@/lib/eastWestHelpers";

function elementHeadline(a: Element, b: Element) {
  const map: Record<string, string> = {
    "Air-Air": "Air + Air — fast ideas & easy flow.",
    "Fire-Fire": "Fire + Fire — passion meets drive.",
    "Water-Water": "Water + Water — deep feelings & empathy.",
    "Earth-Earth": "Earth + Earth — stability & reliability.",
    "Air-Fire": "Air + Fire — ideas feed passion.",
    "Water-Earth": "Water + Earth — emotions find stability.",
    "Fire-Earth": "Fire + Earth — energy that needs pacing.",
    "Air-Earth": "Air + Earth — head meets hands; align timing.",
    "Air-Water": "Air + Water — mind & heart; be gentle.",
    "Fire-Water": "Fire + Water — steamy but volatile.",
  };
  return map[`${a}-${b}`] || "Different styles that can fit well.";
}

function eastRelation(a: East, b: East) {
  const trines = [
    ["Rat", "Dragon", "Monkey"],
    ["Ox", "Snake", "Rooster"],
    ["Tiger", "Horse", "Dog"],
    ["Rabbit", "Goat", "Pig"],
  ];
  const sf: Record<East, East> = {
    Rat: "Ox", Ox: "Rat", Tiger: "Pig", Pig: "Tiger",
    Rabbit: "Dog", Dog: "Rabbit", Dragon: "Rooster", Rooster: "Dragon",
    Snake: "Monkey", Monkey: "Snake", Horse: "Goat", Goat: "Horse"
  };

  const same = a === b;
  const inTrine = trines.some(t => t.includes(a) && t.includes(b));
  const secret = sf[a] === b;
  const clash = new Set(["Rat-Horse", "Ox-Goat", "Tiger-Monkey", "Rabbit-Rooster", "Dragon-Dog", "Snake-Pig"]);
  const isClash = clash.has(`${a}-${b}`) || clash.has(`${b}-${a}`);

  if (same) return "Same Animal — like meets like.";
  if (inTrine) return "Trine Allies — kindred spirits.";
  if (secret) return "Six Harmoniess — quiet affinity.";
  if (isClash) return "Classic Clash — strong pull, needs care.";
  return "Workable Mix — balance brings the best out.";
}

export function buildBlurb({
  tier, elementA, elementB, eastA, eastB, eastNote, tip, score,
}: {
  tier: string;
  elementA: Element; 
  elementB: Element;
  eastA: East; 
  eastB: East;
  eastNote: string;   // 1 short nuance line (your paraphrase)
  tip: string;        // 1 practical relationship tip
  score: number;
}) {
  const headline = elementHeadline(elementA, elementB);
  const relation = eastRelation(eastA, eastB);
  return [
    `Compatibility: ${tier} | ${headline} (${relation})`,
    eastNote,
    tip,
    `Overall Match: ${score} %`,
  ];
}


