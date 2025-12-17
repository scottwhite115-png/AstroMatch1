// /lib/generateMatches.ts
import { explainMatchAndScore } from "./matchExplainAndScore";

export const WEST_SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;

export const EAST_ANIMALS = [
  "Rat","Ox","Tiger","Rabbit","Dragon","Snake",
  "Horse","Goat","Monkey","Rooster","Dog","Pig",
] as const;

export type West = typeof WEST_SIGNS[number];
export type East = typeof EAST_ANIMALS[number];

export function keyFor(aWest: West, aEast: East, bWest: West, bEast: East) {
  return `${aWest.toLowerCase()}_${aEast.toLowerCase()}__${bWest.toLowerCase()}_${bEast.toLowerCase()}`;
}

/**
 * Generate all 144 matches for a single viewer pair, sorted by score desc.
 * Great for the Matches tab (viewer vs everyone).
 */
export function generateViewerVsAll(viewWest: West, viewEast: East) {
  const rows: Array<{
    id: string;
    aWest: West; aEast: East;
    bWest: West; bEast: East;
    result: ReturnType<typeof explainMatchAndScore>;
  }> = [];

  for (const bWest of WEST_SIGNS) {
    for (const bEast of EAST_ANIMALS) {
      const result = explainMatchAndScore(viewWest, viewEast, bWest, bEast);
      rows.push({
        id: keyFor(viewWest, viewEast, bWest, bEast),
        aWest: viewWest, aEast: viewEast,
        bWest, bEast, result
      });
    }
  }

  rows.sort((x, y) => y.result.score - x.result.score);
  return rows;
}

/**
 * Lazy async generator for the full 144×144 matrix in chunks.
 * Iterate without loading everything in memory.
 */
export async function* streamFullMatrix(chunkSize = 200) {
  const buffer: any[] = [];
  for (const aWest of WEST_SIGNS) {
    for (const aEast of EAST_ANIMALS) {
      for (const bWest of WEST_SIGNS) {
        for (const bEast of EAST_ANIMALS) {
          const result = explainMatchAndScore(aWest, aEast, bWest, bEast);
          buffer.push({
            id: keyFor(aWest, aEast, bWest, bEast),
            aWest, aEast, bWest, bEast, result
          });
          if (buffer.length >= chunkSize) {
            yield buffer.splice(0, buffer.length);
          }
        }
      }
    }
  }
  if (buffer.length) yield buffer.splice(0, buffer.length);
}

