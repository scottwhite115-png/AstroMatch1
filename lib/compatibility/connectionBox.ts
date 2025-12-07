// lib/compatibility/connectionBox.ts

import { getChinesePattern } from "@/lib/chinesePatternSystem";
import { capitalizeSign } from "@/lib/zodiacHelpers";
import type { West, East } from "@/engine/astromatch-engine";
import { evaluateMatch } from "@/engine/astromatch-engine";
import { getWesternSignElement } from "@/lib/matchEngine";
import type { WesternElement } from "@/lib/matchEngine";

export type MatchInput = {
  westSign: string;
  chineseSign: string;
};

export type MatchResult = {
  score: number;
  label: string; // e.g. "San He", "Clash Pair", etc.
  chinesePattern: "SAN_HE" | "LIU_HE" | "NEUTRAL" | "SAME_SIGN" | "SAME_SIGN_XING" | "LIU_CHONG" | "LIU_HAI" | "PO";
  chinesePatternLine: string; // from chinesePatternLine map
  westernLine: string;        // e.g. "Aquarius × Leo — bold and unconventional"
  connectionSummary: string;  // short relationship insight line
};

// Map Chinese pattern types to uppercase format
const patternTypeToUppercase: Record<string, MatchResult["chinesePattern"]> = {
  san_he: "SAN_HE",
  same_trine: "SAN_HE", // Same trine maps to SAN_HE
  same_animal: "SAME_SIGN",
  liu_he: "LIU_HE",
  liu_chong: "LIU_CHONG",
  liu_hai: "LIU_HAI",
  xing: "SAME_SIGN_XING",
  po: "PO",
  friendly: "NEUTRAL",
};

// Get element relation description
function getElementRelationDescription(elementA: WesternElement, elementB: WesternElement): string {
  if (elementA === elementB) {
    return "same element";
  }
  
  const compatiblePairs: [WesternElement, WesternElement][] = [
    ["fire", "air"],
    ["air", "fire"],
    ["earth", "water"],
    ["water", "earth"],
  ];
  
  const isCompatible = compatiblePairs.some(
    ([a, b]) => (a === elementA && b === elementB) || (a === elementB && b === elementA)
  );
  
  if (isCompatible) {
    return "compatible elements";
  }
  
  const semiCompatiblePairs: [WesternElement, WesternElement][] = [
    ["fire", "earth"],
    ["earth", "fire"],
    ["air", "water"],
    ["water", "air"],
  ];
  
  const isSemiCompatible = semiCompatiblePairs.some(
    ([a, b]) => (a === elementA && b === elementB) || (a === elementB && b === elementA)
  );
  
  if (isSemiCompatible) {
    return "semi-compatible";
  }
  
  return "opposing elements";
}

// Generate Chinese pattern line
function getChinesePatternLine(
  patternType: string,
  animalA: string,
  animalB: string
): string {
  const animalACap = capitalizeSign(animalA);
  const animalBCap = capitalizeSign(animalB);
  
  const patternLabels: Record<string, string> = {
    san_he: "San He (三合) \"Three Harmonies\"",
    same_trine: "Same Trine (三会)",
    same_animal: "Same Animal",
    liu_he: "Liu He (六合) \"Secret Friends\"",
    liu_chong: "Liu Chong (六冲) \"Six Conflicts\"",
    liu_hai: "Liu Hai (六害) \"Six Harms\"",
    xing: "Xing (刑) \"Punishment\"",
    po: "Po (破) \"Break\"",
    friendly: "Neutral Pattern",
  };
  
  const label = patternLabels[patternType] || "Neutral Pattern";
  return `${animalACap} × ${animalBCap} — ${label}`;
}

// Generate connection summary
function getConnectionSummary(
  score: number,
  chinesePattern: MatchResult["chinesePattern"],
  westElementA: WesternElement,
  westElementB: WesternElement
): string {
  const elementRelation = getElementRelationDescription(westElementA, westElementB);
  
  if (score >= 85) {
    return "Exceptional compatibility with strong natural alignment";
  } else if (score >= 70) {
    return "Strong connection with good potential for growth";
  } else if (score >= 55) {
    return "Moderate compatibility with room for understanding";
  } else if (score >= 40) {
    return "Challenging but potentially transformative connection";
  } else {
    return "Complex dynamic requiring patience and communication";
  }
}

export function calculateConnection(a: MatchInput, b: MatchInput): MatchResult {
  // Normalize inputs
  const westA = capitalizeSign(a.westSign) as West;
  const eastA = capitalizeSign(a.chineseSign) as East;
  const westB = capitalizeSign(b.westSign) as West;
  const eastB = capitalizeSign(b.chineseSign) as East;
  
  // Get Chinese pattern
  const chinesePatternType = getChinesePattern(
    eastA.toLowerCase(),
    eastB.toLowerCase()
  );
  
  // Map to uppercase format
  const chinesePattern = patternTypeToUppercase[chinesePatternType] || "NEUTRAL";
  
  // Calculate match score using existing engine
  const matchResult = evaluateMatch(westA, eastA, westB, eastB);
  const score = matchResult.score;
  
  // Get label from tier or pattern
  const tierLabels: Record<string, string> = {
    Soulmate: "Soulmate Match",
    "Twin Flame": "Twin Flame Match",
    Excellent: "Excellent Match",
    Favourable: "Favourable Match",
    Neutral: "Neutral Match",
    "Magnetic Opposites": "Magnetic Opposites",
    Difficult: "Difficult Match",
  };
  const label = tierLabels[matchResult.tier] || chinesePatternType;
  
  // Generate Chinese pattern line
  const chinesePatternLine = getChinesePatternLine(
    chinesePatternType,
    eastA,
    eastB
  );
  
  // Generate Western line
  const westElementA = getWesternSignElement(westA.toLowerCase() as any);
  const westElementB = getWesternSignElement(westB.toLowerCase() as any);
  const elementRelation = getElementRelationDescription(westElementA, westElementB);
  const westernLine = `${westA} × ${westB} — ${elementRelation}`;
  
  // Generate connection summary
  const connectionSummary = getConnectionSummary(
    score,
    chinesePattern,
    westElementA,
    westElementB
  );
  
  return {
    score,
    label,
    chinesePattern,
    chinesePatternLine,
    westernLine,
    connectionSummary,
  };
}

