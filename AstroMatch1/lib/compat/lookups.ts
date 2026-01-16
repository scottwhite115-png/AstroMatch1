import type { SunSign, Animal, WesternPairInfo, ChinesePairInfo, PatternMeta, PatternKey } from "./types";
import { getChinesePattern } from "@/lib/chinesePatternSystem";
import { patternDefinitions } from "@/lib/chinesePatternSystem";
import elementsInfo from "./elements.json";

// Animal metadata - simplified to just label_en
export const animalMeta: Record<Animal, { label_en: string }> = {
  rat: { label_en: "Rat" },
  ox: { label_en: "Ox" },
  tiger: { label_en: "Tiger" },
  rabbit: { label_en: "Rabbit" },
  dragon: { label_en: "Dragon" },
  snake: { label_en: "Snake" },
  horse: { label_en: "Horse" },
  goat: { label_en: "Goat" },
  monkey: { label_en: "Monkey" },
  rooster: { label_en: "Rooster" },
  dog: { label_en: "Dog" },
  pig: { label_en: "Pig" },
};

// Sun sign labels
export const sunSignLabel: Record<SunSign, string> = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

// Helper to get element from sun sign
const getElement = (sign: SunSign): string => {
  const elementMap: Record<SunSign, string> = {
    aries: "Fire",
    leo: "Fire",
    sagittarius: "Fire",
    taurus: "Earth",
    virgo: "Earth",
    capricorn: "Earth",
    gemini: "Air",
    libra: "Air",
    aquarius: "Air",
    cancer: "Water",
    scorpio: "Water",
    pisces: "Water",
  };
  return elementMap[sign];
};

// Helper to map relation string to relationKey
const mapRelationToKey = (relation: string): WesternPairInfo["relationKey"] => {
  if (relation === "Same Element") return "same_element";
  if (relation === "Compatible") return "compatible";
  if (relation === "Semi-Compatible") return "semi_compatible";
  if (relation === "Opposing") return "opposites";
  return "mismatch";
};

// Helper to capitalize sign name for display
const capitalizeSignName = (sign: string): string => {
  return sign.charAt(0).toUpperCase() + sign.slice(1);
};

// Helper to generate sign-specific intro text
const generateIntro = (signA: SunSign, signB: SunSign, info: any, elementA: string, elementB: string): string => {
  const signAName = capitalizeSignName(signA);
  const signBName = capitalizeSignName(signB);
  const relation = info.relation;
  
  // Use summary_line as base, but personalize with sign names
  if (info.summary_line) {
    // Replace generic element references with sign names where it makes sense
    let intro = info.summary_line;
    // For compatible Air+Fire pairs, use the example style
    if (relation === "Compatible" && (elementA === "Air" && elementB === "Fire" || elementA === "Fire" && elementB === "Air")) {
      // Use different intro based on which sign is first
      if (elementA === "Air" && elementB === "Fire") {
        return `${signAName} and ${signBName} spark quickly through shared curiosity, humour and a taste for freedom.`;
      } else {
        return `${signAName} and ${signBName} create a lively, spontaneous bond that gets moving almost immediately.`;
      }
    }
    // For opposing/mismatch, use personalized style
    if (relation === "Opposing" || relation === "Mismatch") {
      const leadA = elementA === "Fire" ? "speed and instinct" : elementA === "Water" ? "feeling and protection" : elementA === "Air" ? "ideas and communication" : "stability and practicality";
      const leadB = elementB === "Fire" ? "speed and instinct" : elementB === "Water" ? "feeling and protection" : elementB === "Air" ? "ideas and communication" : "stability and practicality";
      return `${signAName} leads with ${leadA}, while ${signBName} leads with ${leadB}.`;
    }
    // For same element, personalize
    if (relation === "Same Element") {
      return `${signAName} and ${signBName} share the same ${elementA} element, creating natural understanding and shared perspective.`;
    }
    return intro;
  }
  
  // Fallback generation
  if (relation === "Same Element") {
    return `${signAName} and ${signBName} share the same ${elementA} element, creating natural understanding and shared perspective.`;
  } else if (relation === "Compatible") {
    return `${signAName} and ${signBName} spark quickly through shared curiosity, humour and a taste for freedom.`;
  } else if (relation === "Semi-Compatible") {
    return `${signAName} and ${signBName} create a connection that requires patience and understanding to thrive.`;
  } else if (relation === "Opposing") {
    const leadA = elementA === "Fire" ? "speed and instinct" : elementA === "Water" ? "feeling and protection" : elementA === "Air" ? "ideas and communication" : "stability and practicality";
    const leadB = elementB === "Fire" ? "speed and instinct" : elementB === "Water" ? "feeling and protection" : elementB === "Air" ? "ideas and communication" : "stability and practicality";
    return `${signAName} leads with ${leadA}, while ${signBName} leads with ${leadB}.`;
  } else {
    return `${signAName} and ${signBName} have different approaches that can complement or challenge each other.`;
  }
};

// Helper to generate sign-specific dynamics text
const generateDynamics = (signA: SunSign, signB: SunSign, info: any, elementA: string, elementB: string): string => {
  const signAName = capitalizeSignName(signA);
  const signBName = capitalizeSignName(signB);
  const relation = info.relation;
  const expanded = info.expanded;
  
  // Generate personalized dynamics based on relation type
  if (relation === "Compatible") {
    const bringsA = elementA === "Fire" ? "direction and courage" : elementA === "Air" ? "vision and original ideas" : elementA === "Water" ? "emotional depth and intuition" : "stability and reliability";
    const addsB = elementB === "Fire" ? "honesty, enthusiasm and a sense of adventure" : elementB === "Air" ? "wit and flexibility" : elementB === "Water" ? "nurturing and protection" : "practicality and structure";
    
    if (elementA === "Air" && elementB === "Fire") {
      return `${signAName} brings ${bringsA}, while ${signBName} adds ${addsB}. You rarely feel bored together, because the connection thrives on movement and new perspectives.`;
    } else if (elementA === "Fire" && elementB === "Air") {
      return `${signAName} brings ${bringsA}, while ${signBName} keeps things flexible with ${addsB}. You feed each other's appetite for new experiences and independence.`;
    } else {
      return `${signAName} brings ${bringsA}, while ${signBName} adds ${addsB}. ${expanded || "Together you create a dynamic and energizing connection."}`;
    }
  } else if (relation === "Opposing" || relation === "Mismatch") {
    return `The contrast can be warm and passionate, but also emotionally jarring if ${signAName} rushes where ${signBName} needs time. ${signBName} softens ${signAName}, and ${signAName} helps ${signBName} take bolder steps.`;
  } else if (relation === "Same Element") {
    return expanded || `${signAName} and ${signBName} share natural understanding and move in similar rhythms.`;
  } else {
    // Semi-compatible or other
    return expanded || `${signAName} and ${signBName} have complementary qualities that can balance each other well.`;
  }
};

// Helper to generate sign-specific growth text
const generateGrowth = (signA: SunSign, signB: SunSign, info: any, relation: string): string => {
  const signAName = capitalizeSignName(signA);
  const signBName = capitalizeSignName(signB);
  
  // Generate growth advice based on relation type
  if (relation === "Compatible") {
    return `The match deepens when you stay emotionally present, not just mentally stimulated, and give each other space without drifting into avoidance.`;
  } else if (relation === "Opposing" || relation === "Mismatch") {
    return `You grow together by respecting emotional pacing, naming needs clearly and treating reactions as information rather than attacks.`;
  } else if (relation === "Same Element") {
    return `Make room for novelty so comfort stays alive, and remember to pause and feel as much as you think.`;
  } else {
    // Semi-compatible
    return `This connection flourishes when you both slow down enough to listen, follow through on plans and anchor the excitement in real commitment.`;
  }
};

// Build westernPairs lookup table from elements.json
const buildWesternPairs = (): Record<SunSign, Record<SunSign, WesternPairInfo>> => {
  const pairs: Record<SunSign, Record<SunSign, WesternPairInfo>> = {} as Record<SunSign, Record<SunSign, WesternPairInfo>>;
  const signs: SunSign[] = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];

  for (const signA of signs) {
    pairs[signA] = {} as Record<SunSign, WesternPairInfo>;
    for (const signB of signs) {
      const elementA = getElement(signA);
      const elementB = getElement(signB);
      const key = [elementA.toLowerCase(), elementB.toLowerCase()].sort().join("-") as keyof typeof elementsInfo.blurbs;
      const info = elementsInfo.blurbs[key] || elementsInfo.blurbs["air-air"]; // fallback
      
      // Generate sign-specific text
      const intro = generateIntro(signA, signB, info, elementA, elementB);
      const dynamics = generateDynamics(signA, signB, info, elementA, elementB);
      const growth = generateGrowth(signA, signB, info, info.relation);
      
      pairs[signA][signB] = {
        relationKey: mapRelationToKey(info.relation),
        label: info.label,
        elementA,
        elementB,
        intro: intro,
        dynamics: dynamics,
        growth: growth,
      };
    }
  }

  return pairs;
};

export const westernPairs: Record<SunSign, Record<SunSign, WesternPairInfo>> = buildWesternPairs();

// Patterns lookup - simplified PatternMeta format
export const patterns: Record<string, PatternMeta> = {
  san_he: {
    key: "san_he",
    label: patternDefinitions.san_he.label,
    translation: patternDefinitions.san_he.translation,
    headlineTag: patternDefinitions.san_he.headlineTag,
    // Extended fields for engine
    blurbHint: patternDefinitions.san_he.blurbHint,
    tone: patternDefinitions.san_he.tone,
  },
  same_animal: {
    key: "same_animal",
    label: "Same Animal Match",
    translation: "同生肖",
    headlineTag: "Mirror Match",
    blurbHint: "Same Chinese sign. Familiar, mirror-style energy; strong but not a classical harmony like San He/Liu He.",
    tone: "neutral",
  },
  liu_he: {
    key: "liu_he",
    label: patternDefinitions.liu_he.label,
    translation: patternDefinitions.liu_he.translation,
    headlineTag: patternDefinitions.liu_he.headlineTag,
    blurbHint: patternDefinitions.liu_he.blurbHint,
    tone: patternDefinitions.liu_he.tone,
  },
  liu_chong: {
    key: "liu_chong",
    label: patternDefinitions.liu_chong.label,
    translation: patternDefinitions.liu_chong.translation,
    headlineTag: patternDefinitions.liu_chong.headlineTag,
    blurbHint: patternDefinitions.liu_chong.blurbHint,
    tone: patternDefinitions.liu_chong.tone,
  },
  liu_hai: {
    key: "liu_hai",
    label: patternDefinitions.liu_hai.label,
    translation: patternDefinitions.liu_hai.translation,
    headlineTag: patternDefinitions.liu_hai.headlineTag,
    blurbHint: patternDefinitions.liu_hai.blurbHint,
    tone: patternDefinitions.liu_hai.tone,
  },
  xing: {
    key: "xing",
    label: patternDefinitions.xing.label,
    translation: patternDefinitions.xing.translation,
    headlineTag: patternDefinitions.xing.headlineTag,
    blurbHint: patternDefinitions.xing.blurbHint,
    tone: patternDefinitions.xing.tone,
  },
  po: {
    key: "po",
    label: patternDefinitions.po.label,
    translation: patternDefinitions.po.translation,
    headlineTag: patternDefinitions.po.headlineTag,
    blurbHint: patternDefinitions.po.blurbHint,
    tone: patternDefinitions.po.tone,
  },
  friendly: {
    key: "friendly",
    label: "Neutral/Friendly",
    translation: "Neutral",
    headlineTag: "Everyday Pairing",
    blurbHint: patternDefinitions.friendly.blurbHint,
    tone: patternDefinitions.friendly.tone,
  },
};

// Build chinesePairs lookup table using the pattern system
const buildChinesePairs = (): Record<Animal, Record<Animal, ChinesePairInfo>> => {
  const pairs: Record<Animal, Record<Animal, ChinesePairInfo>> = {} as Record<Animal, Record<Animal, ChinesePairInfo>>;
  const animals: Animal[] = ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"];

  // Populate all pairs using the pattern detection system
  for (const animalA of animals) {
    pairs[animalA] = {} as Record<Animal, ChinesePairInfo>;
    for (const animalB of animals) {
      // Use getChinesePattern to detect the actual pattern for this pair
      const pattern = getChinesePattern(animalA, animalB);
      pairs[animalA][animalB] = {
        primaryPattern: pattern as PatternKey,
      };
    }
  }

  return pairs;
};

export const chinesePairs: Record<Animal, Record<Animal, ChinesePairInfo>> = buildChinesePairs();

