// Script to extract detailed compatibility descriptions from sign guide pages
// This extracts the "Compatibility with Other Signs" sections

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chineseSigns = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
const westernSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

interface CompatibilityEntry {
  heading: string;
  tagline: string;
  description: string;
}

const chineseCompat: Record<string, Record<string, CompatibilityEntry>> = {};
const westernCompat: Record<string, Record<string, CompatibilityEntry>> = {};

// Helper to extract compatibility sections from a file
function extractCompatibility(content: string): Record<string, CompatibilityEntry> {
  const compat: Record<string, CompatibilityEntry> = {};
  
  // Match pattern: <h3>Sign × Sign — Pattern</h3> followed by <p>Tagline</p> and <p>Description</p>
  const regex = /<h3[^>]*>\s*([^—]+)—([^<]+)<\/h3>[\s\S]*?<p[^>]*>\s*([^<]+)<\/p>[\s\S]*?<p[^>]*>\s*([^<]+)<\/p>/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const heading = match[1].trim();
    const pattern = match[2].trim();
    const tagline = match[3].trim();
    const description = match[4].trim();
    
    // Extract the target sign from heading (e.g., "Rat × Ox" -> "ox")
    const parts = heading.split('×').map(p => p.trim().toLowerCase());
    if (parts.length === 2) {
      const targetSign = parts[1].split(' ')[0]; // Remove pattern info
      compat[targetSign] = {
        heading: `${heading}— ${pattern}`,
        tagline,
        description
      };
    }
  }
  
  return compat;
}

// Extract from Chinese zodiac pages
console.log('Extracting Chinese zodiac compatibility...');
for (const sign of chineseSigns) {
  const filePath = path.join(__dirname, `../app/astrology/guide/next/${sign}/page.tsx`);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    chineseCompat[sign] = extractCompatibility(content);
    console.log(`  ${sign}: ${Object.keys(chineseCompat[sign]).length} entries`);
  }
}

// Extract from Western sign pages
console.log('\nExtracting Western sign compatibility...');
for (const sign of westernSigns) {
  const filePath = path.join(__dirname, `../app/astrology/guide/${sign}/page.tsx`);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    westernCompat[sign] = extractCompatibility(content);
    console.log(`  ${sign}: ${Object.keys(westernCompat[sign]).length} entries`);
  }
}

// Generate the output file
const output = `// Auto-generated detailed compatibility descriptions from sign guide pages
// Generated: ${new Date().toISOString()}

export interface DetailedCompatDescription {
  heading: string;
  tagline: string;
  description: string;
}

// Chinese Zodiac Compatibility Descriptions
export const CHINESE_DETAILED_COMPAT: Record<string, Record<string, DetailedCompatDescription>> = ${JSON.stringify(chineseCompat, null, 2)};

// Western Zodiac Compatibility Descriptions  
export const WESTERN_DETAILED_COMPAT: Record<string, Record<string, DetailedCompatDescription>> = ${JSON.stringify(westernCompat, null, 2)};

/**
 * Get detailed Chinese compatibility description
 * @param sign1 - First Chinese zodiac sign (lowercase)
 * @param sign2 - Second Chinese zodiac sign (lowercase)
 * @returns Detailed compatibility description or null if not found
 */
export function getChineseDetailedCompat(
  sign1: string,
  sign2: string
): DetailedCompatDescription | null {
  const s1 = sign1.toLowerCase();
  const s2 = sign2.toLowerCase();
  
  if (CHINESE_DETAILED_COMPAT[s1]?.[s2]) {
    return CHINESE_DETAILED_COMPAT[s1][s2];
  }
  
  // Try reverse order
  if (CHINESE_DETAILED_COMPAT[s2]?.[s1]) {
    return CHINESE_DETAILED_COMPAT[s2][s1];
  }
  
  return null;
}

/**
 * Get detailed Western compatibility description
 * @param sign1 - First sun sign (lowercase)
 * @param sign2 - Second sun sign (lowercase)
 * @returns Detailed compatibility description or null if not found
 */
export function getWesternDetailedCompat(
  sign1: string,
  sign2: string
): DetailedCompatDescription | null {
  const s1 = sign1.toLowerCase();
  const s2 = sign2.toLowerCase();
  
  if (WESTERN_DETAILED_COMPAT[s1]?.[s2]) {
    return WESTERN_DETAILED_COMPAT[s1][s2];
  }
  
  // Try reverse order
  if (WESTERN_DETAILED_COMPAT[s2]?.[s1]) {
    return WESTERN_DETAILED_COMPAT[s2][s1];
  }
  
  return null;
}

/**
 * Get combined detailed compatibility text for connection box
 * @param westernA - First sun sign
 * @param westernB - Second sun sign
 * @param chineseA - First Chinese zodiac sign
 * @param chineseB - Second Chinese zodiac sign
 * @returns Combined compatibility text or null
 */
export function getCombinedDetailedBlurb(
  westernA: string,
  westernB: string,
  chineseA: string,
  chineseB: string
): { chinese: DetailedCompatDescription | null; western: DetailedCompatDescription | null } {
  return {
    chinese: getChineseDetailedCompat(chineseA, chineseB),
    western: getWesternDetailedCompat(westernA, westernB)
  };
}
`;

// Write the output file
const outputPath = path.join(__dirname, '../data/detailedCompatDescriptions.ts');
fs.writeFileSync(outputPath, output);

console.log(`\n✅ Generated: ${outputPath}`);
console.log(`   Chinese entries: ${Object.keys(chineseCompat).length} signs`);
console.log(`   Western entries: ${Object.keys(westernCompat).length} signs`);

