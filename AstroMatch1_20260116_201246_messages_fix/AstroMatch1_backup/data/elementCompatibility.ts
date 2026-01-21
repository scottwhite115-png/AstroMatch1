// data/elementCompatibility.ts

export type ElementPair = 
  | "Fire × Fire"
  | "Earth × Earth"
  | "Air × Air"
  | "Water × Water"
  | "Fire × Air"
  | "Air × Fire"
  | "Earth × Water"
  | "Water × Earth"
  | "Fire × Earth"
  | "Earth × Fire"
  | "Air × Water"
  | "Water × Air"
  | "Fire × Water"
  | "Water × Fire"
  | "Air × Earth"
  | "Earth × Air";

export const elementCompatibilityDescriptions: Record<string, string> = {
  // Same Element
  "Fire × Fire": "Two flames burning bright — passionate, inspiring, and bold. The danger lies only in competing heat.",
  "Earth × Earth": "Grounded and practical. You build together slowly and surely, valuing security and shared purpose.",
  "Air × Air": "A meeting of minds — communicative, curious, and light-hearted. The spark thrives on ideas and freedom.",
  "Water × Water": "Deep emotional flow. You understand each other's moods intuitively — soulful, nurturing, and healing.",
  
  // Compatible
  "Fire × Air": "Air fuels Fire. This match is vibrant, creative, and full of movement — expect fast ideas and shared adventures.",
  "Air × Fire": "Air fuels Fire. This match is vibrant, creative, and full of movement — expect fast ideas and shared adventures.",
  "Earth × Water": "Water nourishes Earth. Stable and tender, this connection brings emotional depth to practical strength.",
  "Water × Earth": "Water nourishes Earth. Stable and tender, this connection brings emotional depth to practical strength.",
  
  // Semi-Compatible
  "Fire × Earth": "Fire's enthusiasm can warm Earth's steadiness, if grounded in respect and timing.",
  "Earth × Fire": "Fire's enthusiasm can warm Earth's steadiness, if grounded in respect and timing.",
  "Air × Water": "Mind meets emotion — fascinating, if communication stays gentle and open.",
  "Water × Air": "Mind meets emotion — fascinating, if communication stays gentle and open.",
  
  // Opposing
  "Fire × Water": "Steam and storm — intense attraction but turbulent emotions. You must respect each other's pace.",
  "Water × Fire": "Steam and storm — intense attraction but turbulent emotions. You must respect each other's pace.",
  "Air × Earth": "Different speeds — one seeks change, the other stability. Growth comes through patience and curiosity.",
  "Earth × Air": "Different speeds — one seeks change, the other stability. Growth comes through patience and curiosity.",
};

export function getElementCompatibilityDescription(element1: string, element2: string): string {
  try {
    if (!element1 || !element2) {
      console.warn('[getElementCompatibilityDescription] Missing elements:', element1, element2);
      return "";
    }
    const key = `${element1} × ${element2}`;
    const description = elementCompatibilityDescriptions[key];
    if (!description) {
      console.warn('[getElementCompatibilityDescription] No description found for:', key);
    }
    return description || "";
  } catch (error) {
    console.error('[getElementCompatibilityDescription] Error:', error instanceof Error ? error.message : String(error), 'for elements:', element1, element2);
    return "";
  }
}

