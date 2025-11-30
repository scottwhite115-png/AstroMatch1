import { ChinesePatternId } from "./chineseConnectionOverview";

// Example shape – adjust to match your real match engine output
export type ChinesePatternFlags = {
  sanHe?: boolean;
  liuHe?: boolean;
  crossTrine?: boolean;
  oppositeAnimals?: boolean;
  liuChong?: boolean;
  liuHai?: boolean;
  xing?: boolean;
  po?: boolean;
};

export function deriveChinesePatternId(flags: ChinesePatternFlags): ChinesePatternId {
  const {
    sanHe,
    liuHe,
    crossTrine,
    oppositeAnimals,
    liuChong,
    liuHai,
    xing,
    po,
  } = flags;

  // 1) Strong, positive patterns first
  if (sanHe) return "san_he";
  if (liuHe) return "liu_he";

  // 2) Strong negative / mixed patterns
  if (liuChong && xing) return "opposition_punishment";
  if (liuChong) return "liu_chong";
  if (liuHai) return "liu_hai";
  if (xing) return "xing";
  if (po) return "po";

  // 3) Lively / opposite but not "damaged"
  if (oppositeAnimals) return "opposite_animals";
  if (crossTrine) return "cross_trine";

  // 4) Default
  return "neutral";
}

// Helper function to convert from ChinesePatternResult to ChinesePatternFlags
import type { ChinesePattern } from "./chinesePatterns";

export interface ChinesePatternResult {
  primary: ChinesePattern;
  all: ChinesePattern[];
}

export function patternResultToFlags(
  result: ChinesePatternResult,
  animalA?: string,
  animalB?: string
): ChinesePatternFlags {
  const { primary, all } = result;
  
  // Check if animals are in same trine (for cross_trine detection)
  const areSameTrine = (a: string, b: string): boolean => {
    const trines: Record<string, string> = {
      rat: "visionaries",
      dragon: "visionaries",
      monkey: "visionaries",
      ox: "strategists",
      snake: "strategists",
      rooster: "strategists",
      tiger: "adventurers",
      horse: "adventurers",
      dog: "adventurers",
      rabbit: "artists",
      goat: "artists",
      pig: "artists",
    };
    return trines[a.toLowerCase()] === trines[b.toLowerCase()];
  };

  const isCrossTrine = animalA && animalB 
    ? (primary === "san_he" || primary === "liu_he") && !areSameTrine(animalA, animalB)
    : false;

  return {
    sanHe: primary === "san_he" || primary === "same_animal" || primary === "same_trine",
    liuHe: primary === "liu_he",
    crossTrine: isCrossTrine,
    oppositeAnimals: primary === "liu_chong" && !all.includes("xing"),
    liuChong: all.includes("liu_chong"),
    liuHai: all.includes("liu_hai"),
    xing: all.includes("xing"),
    po: all.includes("po"),
  };
}

