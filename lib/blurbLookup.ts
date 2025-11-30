// blurbLookup.ts - Efficient lookup for pre-generated compatibility blurbs

// TEMPORARILY DISABLED - 4.9MB JSON file causes white screen
// import blurbsData from "@/data/astromatch_blurbs_144x144.json"

export interface BlurbEntry {
  key: string;
  score: number;
  blurb: string;
  label?: string; // e.g., "Shared Vision & Electric Energy"
}

/**
 * Convert Western sign and Eastern animal to lowercase underscore format
 * Example: "Aries" + "Rat" => "aries_rat"
 */
function normalize(west: string, east: string): string {
  return `${west.toLowerCase()}_${east.toLowerCase()}`;
}

// Build the map immediately on module load
const blurbMap = new Map<string, BlurbEntry>();

// TEMPORARILY DISABLED - JSON loading
// (blurbsData as BlurbEntry[]).forEach((entry: BlurbEntry) => {
//   blurbMap.set(entry.key, entry);
// });

console.log(`⚠️ Blurbs temporarily disabled - map size: ${blurbMap.size}`);

/**
 * Load and index all 20,736 blurbs (144×144)
 * Only runs once, then cached in memory
 */
async function loadBlurbs(): Promise<Map<string, BlurbEntry>> {
  return blurbMap;
}

/**
 * Look up a pre-generated blurb for any sign combination
 * @param westA - Western sign of person A (e.g., "Aries")
 * @param eastA - Eastern animal of person A (e.g., "Rat")
 * @param westB - Western sign of person B (e.g., "Taurus")
 * @param eastB - Eastern animal of person B (e.g., "Ox")
 * @returns The blurb entry or null if not found
 */
export async function lookupBlurb(
  westA: string,
  eastA: string,
  westB: string,
  eastB: string
): Promise<BlurbEntry | null> {
  const map = await loadBlurbs();
  
  const keyA = normalize(westA, eastA);
  const keyB = normalize(westB, eastB);
  const lookupKey = `${keyA}__${keyB}`;
  
  return map.get(lookupKey) || null;
}

/**
 * Get a blurb synchronously (immediate lookup)
 * Use this in components for instant access
 */
export function getBlurbSync(
  westA: string,
  eastA: string,
  westB: string,
  eastB: string
): BlurbEntry | null {
  const keyA = normalize(westA, eastA);
  const keyB = normalize(westB, eastB);
  const lookupKey = `${keyA}__${keyB}`;
  
  const result = blurbMap.get(lookupKey) || null;
  
  if (!result) {
    console.warn(`⚠️ No blurb found for key: ${lookupKey}`);
  }
  
  return result;
}

/**
 * Preload blurbs in the background (call on app init)
 */
export function preloadBlurbs(): void {
  loadBlurbs().catch(err => {
    console.error('Failed to preload blurbs:', err);
  });
}

