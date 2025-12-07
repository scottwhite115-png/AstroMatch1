// chinesePatternSystem.ts
// Updated Chinese zodiac pattern system with comprehensive relationship types

export type ChinesePatternType =
  | "san_he"
  | "same_trine"
  | "same_animal"
  | "liu_he"
  | "liu_chong"
  | "liu_hai"
  | "xing"
  | "po"
  | "friendly";

export type ChineseAnimal =
  | "Rat" | "Ox" | "Tiger" | "Rabbit"
  | "Dragon" | "Snake" | "Horse" | "Goat"
  | "Monkey" | "Rooster" | "Dog" | "Pig";

export interface AnimalMeta {
  label_en: string;
  label_zh: string;
}

export const animalMeta: Record<string, AnimalMeta> = {
  rat: { label_en: "Rat", label_zh: "鼠 (Shǔ)" },
  ox: { label_en: "Ox", label_zh: "牛 (Niú)" },
  tiger: { label_en: "Tiger", label_zh: "虎 (Hǔ)" },
  rabbit: { label_en: "Rabbit", label_zh: "兔 (Tù)" },
  dragon: { label_en: "Dragon", label_zh: "龙 (Lóng)" },
  snake: { label_en: "Snake", label_zh: "蛇 (Shé)" },
  horse: { label_en: "Horse", label_zh: "马 (Mǎ)" },
  goat: { label_en: "Goat", label_zh: "羊 (Yáng)" },
  monkey: { label_en: "Monkey", label_zh: "猴 (Hóu)" },
  rooster: { label_en: "Rooster", label_zh: "鸡 (Jī)" },
  dog: { label_en: "Dog", label_zh: "狗 (Gǒu)" },
  pig: { label_en: "Pig", label_zh: "猪 (Zhū)" },
};

// Helper function to get animal metadata
export function getAnimalMeta(animal: ChineseAnimal | string): AnimalMeta {
  const normalized = animal.toLowerCase();
  return animalMeta[normalized] || { label_en: animal, label_zh: animal };
}

export interface PatternDefinition {
  key: string;
  label: string;
  hanzi: string;
  pinyin: string;
  translation: string;
  headlineTag: string;
  tone: "very_supportive" | "supportive" | "conflict" | "harmful" | "punishment" | "break" | "neutral";
  tagline: string;
  blurbHint: string;
  shortDescription?: string; // Keep for backward compatibility
}

export interface ChinesePatternSystem {
  patterns: Record<ChinesePatternType, PatternDefinition>;
  pairs: Record<string, ChinesePatternType>;
  animalMeta: Record<string, AnimalMeta>;
}

export const patternDefinitions: Record<ChinesePatternType, PatternDefinition> = {
  san_he: {
    key: "san_he",
    label: "San He (三合)",
    hanzi: "三合",
    pinyin: "Sān Hé",
    translation: "Three Harmonies",
    headlineTag: "Three Harmonies Trine",
    tone: "very_supportive",
    tagline: "Classic 'Three Harmonies' trine — strong natural alignment and long-term growth potential.",
    blurbHint: "This is a San He (三合) 'Three Harmonies' connection, where both signs tend to amplify each other's strengths and move in the same general direction. It usually feels easy to cooperate and plan long term together.",
    shortDescription: "Classic 'Three Harmonies' trine – signs that feel naturally aligned, boosting each other's growth and long-term potential.",
  },
  same_trine: {
    key: "same_trine",
    label: "Same Trine (三会)",
    hanzi: "三会",
    pinyin: "Sān Huì",
    translation: "Same Trine Alliance",
    headlineTag: "Same Trine Alliance",
    tone: "supportive",
    tagline: "Same trine rhythm — you instinctively move in similar cycles and can plan ahead easily.",
    blurbHint: "Sharing the same trine (三会) means your instincts, pace, and long-view goals often line up. It's not quite as tight as San He but still offers an easy rhythm and familiar shorthand when life gets busy.",
    shortDescription: "Same trine alignment – familiar rhythm, easy teamwork, similar instincts.",
  },
  same_animal: {
    key: "same_animal",
    label: "Same Animal Match (同生肖)",
    hanzi: "同生肖",
    pinyin: "Tóng Shēngxiào",
    translation: "Same Animal Match",
    headlineTag: "Mirror Match",
    tone: "neutral",
    tagline: "Mirror match — familiar energy with strong recognition of each other's habits.",
    blurbHint: "Same animal pairs feel instantly familiar. You recognise the highs and lows because you run on similar instincts. It's comforting, but it can also mirror your own blind spots unless you consciously keep variety in the dynamic.",
    shortDescription: "Same Chinese sign – deeply familiar, mirror-style connection with double strengths and double habits.",
  },
  liu_he: {
    key: "liu_he",
    label: "Liu He (六合) — Six Harmonies (Modern Secret Friends)",
    hanzi: "六合",
    pinyin: "Liù Hé",
    translation: "Six Harmonies (Modern Secret Friends)",
    headlineTag: "Six Harmonies (Modern Secret Friends)",
    tone: "supportive",
    tagline: "Secret-friend style support — quietly stabilising and protective.",
    blurbHint: "This sits under Liu He (六合), the 'Six Harmonies' pattern — one of the 12 official 'Secret Friend' combinations used in modern Chinese astrology. Traditionally seen as a supportive, stabilising bond where each sign softens the other's edges and helps life feel more manageable.",
    shortDescription: "Modern Secret Friends – one of 12 official Liu He pairs. Quietly supportive, easing tensions and helping each other stabilise and progress.",
  },
  liu_chong: {
    key: "liu_chong",
    label: "Liu Chong (六冲)",
    hanzi: "六冲",
    pinyin: "Liù Chōng",
    translation: "Six Conflicts",
    headlineTag: "Six Conflicts Opposing Pair",
    tone: "conflict",
    tagline: "Opposite pulls — high friction, high growth when handled well.",
    blurbHint: "This is a Liu Chong (六冲) 'Six Conflicts' pairing, which stirs friction, big turning points and strong reactions. Handled consciously, it pushes both people to grow instead of staying stuck.",
    shortDescription: "Opposing signs that stir friction, confrontation and decisive turning points – high growth if handled maturely.",
  },
  liu_hai: {
    key: "liu_hai",
    label: "Liu Hai (六害)",
    hanzi: "六害",
    pinyin: "Liù Hài",
    translation: "Six Harms",
    headlineTag: "Six Harms Sensitive Pair",
    tone: "harmful",
    tagline: "Sensitive, easily drained — needs gentle pacing and clear boundaries.",
    blurbHint: "This falls under Liu Hai (六害), the 'Six Harms' pattern, where misunderstandings or subtle drains can build up if feelings aren't named. With honesty and pacing, it becomes less about harm and more about learning limits.",
    shortDescription: "Subtle draining patterns – misunderstandings, emotional wear-and-tear or feeling undermined if issues aren't addressed.",
  },
  xing: {
    key: "xing",
    label: "Xing (刑)",
    hanzi: "刑",
    pinyin: "Xíng",
    translation: "Punishment",
    headlineTag: "Punishment Tension Pattern",
    tone: "punishment",
    tagline: "Grinding tension that exposes flaws and forces adjustments.",
    blurbHint: "This is part of the Xing (刑) 'punishment' patterns — a kind of grinding tension that exposes differences in style or values. It can feel sharp, but it also surfaces what needs to change if the bond is going to deepen.",
    shortDescription: "Punishment pattern – sharp tension that exposes differences in character and can feel like grinding, corrective pressure.",
  },
  po: {
    key: "po",
    label: "Po (破) — Six Breaks (Classical Variant)",
    hanzi: "破",
    pinyin: "Pò",
    translation: "Six Breaks (Classical Variant)",
    headlineTag: "Six Breaks (Classical Variant)",
    tone: "break",
    tagline: "Break pattern — represents instability, break-ups, disrupted flow.",
    blurbHint: "This carries Po (破), the traditional 'break' pattern — one of the 6 classical Break pairs. It represents instability, break-ups, and disrupted flow. Energy that tends to crack old structures open, showing up as abrupt changes, wake-up calls or resets that push both people to relate in a new way.",
    shortDescription: "Six Breaks (Classical Variant) – traditional break pattern representing instability, break-ups, and disrupted flow in relationships.",
  },
  friendly: {
    key: "friendly",
    label: "Neutral Pattern (No Major Pattern)",
    hanzi: "",
    pinyin: "",
    translation: "Neutral Pattern (No Major Pattern)",
    headlineTag: "Neutral Pattern (No Major Pattern)",
    tone: "neutral",
    tagline: "Neutral Pattern (No Major Pattern) — no heavy karmic pattern either way.",
    blurbHint: "This is a neutral pattern with no major traditional pattern attached. How it feels in practice depends more on maturity, communication and the Western signs than on fate.",
    shortDescription: "Neutral Pattern (No Major Pattern) – no strong karmic pulls either way, can go either direction depending on maturity and context.",
  },
};

/**
 * Neutral Chinese matches:
 * - No San He (三合) trine
 * - No Liu He (六合) secret friend
 * - No Liu Chong (六冲) conflict
 * - No Liu Hai (六害) harm
 * - No Xiang Xing (刑) punishment group
 * - No Po (破) break pair
 *
 * Same-animal (rat–rat, ox–ox, etc.) is NOT listed here,
 * so you can handle same-sign bonuses separately.
 */
export const NEUTRAL_CHINESE_MATCHES: Record<string, string[]> = {
  rat:    ['pig', 'tiger', 'dog', 'snake', 'rooster'],
  ox:     ['monkey', 'dog', 'rabbit', 'tiger', 'dragon', 'pig'],
  tiger:  ['rabbit', 'dragon', 'rooster', 'rat', 'goat', 'ox'],
  rabbit: ['tiger', 'monkey', 'ox', 'horse', 'snake'],
  dragon: ['tiger', 'snake', 'horse', 'goat', 'pig', 'ox'],
  snake:  ['horse', 'dragon', 'goat', 'dog', 'rabbit', 'rat'],
  horse:  ['snake', 'rabbit', 'dragon', 'rooster', 'pig', 'monkey'],
  goat:   ['snake', 'dragon', 'monkey', 'rooster', 'dog', 'tiger'],
  monkey: ['dog', 'ox', 'goat', 'rabbit', 'rooster', 'horse'],
  rooster:['horse', 'goat', 'pig', 'tiger', 'monkey', 'rat'],
  dog:    ['monkey', 'pig', 'rat', 'ox', 'snake', 'goat'],
  pig:    ['rat', 'rooster', 'dog', 'dragon', 'horse', 'ox'],
};

// Helper function to capitalize first letter (for consistency)
function capitalizeAnimal(animal: string): string {
  return animal.charAt(0).toUpperCase() + animal.slice(1).toLowerCase();
}

// Helper function to create normalized key for Chinese sign pairs
export function getChinesePairKey(a: ChineseAnimal | string, b: ChineseAnimal | string): string {
  // Normalize to capitalized format
  const animalA = capitalizeAnimal(a);
  const animalB = capitalizeAnimal(b);
  
  const animals: ChineseAnimal[] = [
    "Rat", "Ox", "Tiger", "Rabbit",
    "Dragon", "Snake", "Horse", "Goat",
    "Monkey", "Rooster", "Dog", "Pig"
  ];
  const indexA = animals.indexOf(animalA as ChineseAnimal);
  const indexB = animals.indexOf(animalB as ChineseAnimal);
  return indexA <= indexB ? `${animalA}-${animalB}` : `${animalB}-${animalA}`;
}

// Pattern-based data structure from the JSON
// Each animal has arrays of other animals for each pattern type
type PatternBasedData = Record<string, Partial<Record<ChinesePatternType, string[]>>>;

const patternBasedData: PatternBasedData = {
  rat: {
    san_he: ["dragon", "monkey"],
    liu_he: ["ox"],
    liu_chong: ["horse"],
    liu_hai: ["goat"],
    xing: [],
    po: ["rabbit"],
    friendly: [], // Will be filled with remaining animals
  },
  ox: {
    san_he: ["snake", "rooster"],
    liu_he: ["rat"],
    liu_chong: ["goat"],
    liu_hai: ["horse"],
    xing: [],
    po: ["dragon"],
    friendly: [],
  },
  tiger: {
    san_he: ["horse", "dog"],
    liu_he: ["pig"],
    liu_chong: ["monkey"],
    liu_hai: ["snake"],
    xing: [],
    po: [],
    friendly: [],
  },
  rabbit: {
    san_he: ["goat", "pig"],
    liu_he: ["dog"],
    liu_chong: ["rooster"],
    liu_hai: ["dragon"],
    xing: [],
    po: ["rat"],
    friendly: [],
  },
  dragon: {
    san_he: ["rat", "monkey"],
    liu_he: ["rooster"],
    liu_chong: ["dog"],
    liu_hai: ["rabbit"],
    xing: ["dragon"],
    po: ["ox"],
    friendly: [],
  },
  snake: {
    san_he: ["ox", "rooster"],
    liu_he: ["monkey"],
    liu_chong: ["pig"],
    liu_hai: ["tiger"],
    xing: [],
    po: [],
    friendly: [],
  },
  horse: {
    san_he: ["tiger", "dog"],
    liu_he: ["goat"],
    liu_chong: ["rat"],
    liu_hai: ["ox", "pig"],
    xing: ["horse"],
    po: [],
    friendly: [],
  },
  goat: {
    san_he: ["rabbit", "pig"],
    liu_he: ["horse"],
    liu_chong: ["ox"],
    liu_hai: ["rat", "dog"],
    xing: [],
    po: [],
    friendly: [],
  },
  monkey: {
    san_he: ["rat", "dragon", "rooster"],
    liu_he: ["snake"],
    liu_chong: ["tiger"],
    liu_hai: ["pig"], // Monkey × Pig is Liu Hai (Six Harms)
    xing: ["tiger"],
    po: [],
    friendly: [],
  },
  rooster: {
    san_he: ["ox", "snake", "monkey"],
    liu_he: ["dragon"],
    liu_chong: ["rabbit"],
    liu_hai: ["dog"],
    xing: ["rooster"],
    po: [],
    friendly: [],
  },
  dog: {
    san_he: ["tiger", "horse"],
    liu_he: ["rabbit"],
    liu_chong: ["dragon"],
    liu_hai: ["rooster", "goat"],
    xing: [],
    po: [],
    friendly: [],
  },
  pig: {
    san_he: ["rabbit", "goat"],
    liu_he: ["tiger"],
    liu_chong: ["snake"],
    liu_hai: ["monkey", "horse"],
    xing: ["pig"],
    po: [],
    friendly: [],
  },
};

// Convert pattern-based structure to pairs format
function buildPairsMap(data: PatternBasedData): Record<string, ChinesePatternType> {
  const pairs: Record<string, ChinesePatternType> = {};
  const allAnimals: string[] = ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"];
  
  for (const [animalA, patterns] of Object.entries(data)) {
    // Track which animals have been assigned a pattern
    const assignedAnimals = new Set<string>();
    
    // Process each pattern type (excluding friendly)
    const patternTypes: ChinesePatternType[] = ["san_he", "liu_he", "liu_chong", "liu_hai", "xing", "po"];
    
    for (const patternType of patternTypes) {
      const animalsInPattern = patterns[patternType] || [];
      for (const animalB of animalsInPattern) {
        const key = getChinesePairKey(animalA, animalB);
        pairs[key] = patternType;
        assignedAnimals.add(animalB.toLowerCase());
      }
    }
    
    // Assign "friendly" to neutral pairs based on NEUTRAL_CHINESE_MATCHES
    // Also assign "friendly" to same-animal pairs and remaining pairs
    for (const animalB of allAnimals) {
      if (!assignedAnimals.has(animalB.toLowerCase())) {
        const key = getChinesePairKey(animalA, animalB);
        // Only set if not already set (to avoid overwriting)
        if (!pairs[key]) {
          const animalALower = animalA.toLowerCase();
          const animalBLower = animalB.toLowerCase();
          
          // Check if this is a same-animal pair (handled separately per comment in NEUTRAL_CHINESE_MATCHES)
          if (animalALower === animalBLower) {
            pairs[key] = "friendly";
          }
          // Check if this pair is in NEUTRAL_CHINESE_MATCHES
          else if (NEUTRAL_CHINESE_MATCHES[animalALower]?.includes(animalBLower)) {
            pairs[key] = "friendly";
          }
          // Fallback: assign friendly to remaining pairs (should not happen if NEUTRAL_CHINESE_MATCHES is complete)
          else {
            pairs[key] = "friendly";
          }
        }
      }
    }
  }
  
  return pairs;
}

// Pairs mapping - flat structure for easy lookup
// Format: "AnimalA-AnimalB": "pattern_type"
export const chinesePatternPairs: Record<string, ChinesePatternType> = buildPairsMap(patternBasedData);

// Map new pattern types to legacy pattern names for backward compatibility
export function mapToLegacyPattern(pattern: ChinesePatternType): string {
  const mapping: Record<ChinesePatternType, string> = {
    san_he: "same_trine",
    same_trine: "same_trine",
    same_animal: "same_animal",
    liu_he: "six_harmony",
    liu_chong: "opposites",
    liu_hai: "damage",
    xing: "damage", // Map to closest equivalent
    po: "opposites", // Map to closest equivalent
    friendly: "neutral",
  };
  return mapping[pattern] || "neutral";
}

// Get pattern for a pair of Chinese animals
export function getChinesePattern(
  animalA: ChineseAnimal | string,
  animalB: ChineseAnimal | string
): ChinesePatternType {
  const key = getChinesePairKey(animalA, animalB);
  return chinesePatternPairs[key] || "friendly";
}

// Build a formatted Chinese relationship line
export function buildChineseLine(animalA: string, animalB: string): string {
  // Normalize animal names to lowercase for lookup
  const aNormalized = animalA.toLowerCase();
  const bNormalized = animalB.toLowerCase();
  
  // Get the pattern key for this pair
  const patternKey = getChinesePattern(aNormalized, bNormalized);
  
  // Get the pattern definition
  const pattern = patternDefinitions[patternKey];
  
  // Get animal labels
  const aLabel = animalMeta[aNormalized]?.label_en || animalA;
  const bLabel = animalMeta[bNormalized]?.label_en || animalB;
  
  // Optional: Get Chinese labels if needed later
  // const aZh = animalMeta[aNormalized]?.label_zh;
  // const bZh = animalMeta[bNormalized]?.label_zh;
  
  // Build the tone description
  const toneDescriptions: Record<string, string> = {
    very_supportive: "Very Supportive Pair",
    supportive: "Supportive Pair",
    conflict: "Challenging Pair",
    harmful: "Difficult Pair",
    punishment: "Tense Pair",
    break: "Transformative Pair",
    neutral: "Neutral Pair",
  };
  
  const toneDesc = toneDescriptions[pattern.tone] || "Pair";
  
  return `${aLabel} × ${bLabel} — ${pattern.label} "${pattern.translation}" ${toneDesc}`;
}

// Build a formatted Chinese heading line with headlineTag and traditional Chinese labels
export function buildChineseHeadingLine(animalA: string, animalB: string): string {
  try {
    // Normalize animal names to lowercase for lookup
    const aNormalized = animalA.toLowerCase();
    const bNormalized = animalB.toLowerCase();
    
    // Get the pattern key for this pair
    const patternKey = getChinesePattern(aNormalized, bNormalized);
    
    // Get the pattern metadata
    const patternMeta = patternDefinitions[patternKey];
    
    // Get animal metadata with Chinese labels
    const aMeta = animalMeta[aNormalized] || { label_en: animalA, label_zh: "" };
    const bMeta = animalMeta[bNormalized] || { label_en: animalB, label_zh: "" };
    
    // Build animal labels with Chinese characters if available
    const aLabel = aMeta.label_zh ? `${aMeta.label_en} ${aMeta.label_zh}` : aMeta.label_en;
    const bLabel = bMeta.label_zh ? `${bMeta.label_en} ${bMeta.label_zh}` : bMeta.label_en;
    
    if (!patternMeta) {
      // Fallback if pattern not found
      return `${aLabel} × ${bLabel}`;
    }
    
    // Build pattern label - the label already includes hanzi in parentheses if available
    // For patterns with traditional Chinese names, the label is already formatted as "Label (Hanzi)"
    // We can optionally add pinyin for clarity
    let patternLabel = patternMeta.label;
    if (patternMeta.hanzi && patternMeta.pinyin && !patternMeta.label.includes(patternMeta.pinyin)) {
      // Add pinyin if not already in label: "Label (Hanzi) Pinyin"
      patternLabel = `${patternMeta.label} ${patternMeta.pinyin}`;
    }
    
    // Return formatted line with Chinese animal names and pattern information
    // Format: "AnimalA (Chinese) × AnimalB (Chinese) — Pattern Label "Translation" HeadlineTag"
    return `${aLabel} × ${bLabel} — ${patternLabel} "${patternMeta.translation}" ${patternMeta.headlineTag}`;
  } catch (error) {
    // Fallback on error
    return `${animalA} × ${animalB}`;
  }
}

// Build a Chinese pattern sentence using the blurbHint
export function buildChinesePatternSentence(animalA: string, animalB: string): string {
  try {
    // Normalize animal names to lowercase for lookup
    const aNormalized = animalA.toLowerCase();
    const bNormalized = animalB.toLowerCase();
    
    // Get the pattern key for this pair
    const patternKey = getChinesePattern(aNormalized, bNormalized);
    
    // Get the pattern metadata
    const patternMeta = patternDefinitions[patternKey];
    
    // Return the blurbHint - can be plugged straight into the blended blurb
    return patternMeta?.blurbHint || "";
  } catch (error) {
    // Fallback on error
    return "";
  }
}

// Export the complete system
export const chinesePatternSystem: ChinesePatternSystem = {
  patterns: patternDefinitions,
  pairs: chinesePatternPairs,
  animalMeta: animalMeta,
};

