// scripts/generate-nuance-matrix.ts
// Generates a complete pre-computed JSON matrix for all 144 Chinese zodiac pairs
// Run: pnpm ts-node scripts/generate-nuance-matrix.ts

import { computeChineseNuance, type East } from "../lib/nuanceEngine.js";
import fs from "fs";
import path from "path";

const ANIMALS: East[] = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];

type NuanceEntry = {
  chem: number;
  long: number;
  tone: string;
  notes: string[];
};

type NuanceMatrix = Record<string, NuanceEntry>;

function generateMatrix(): NuanceMatrix {
  const matrix: NuanceMatrix = {};
  
  for (const a of ANIMALS) {
    for (const b of ANIMALS) {
      const key = `${a}-${b}`;
      const result = computeChineseNuance(a, b, "unspecified");
      
      matrix[key] = {
        chem: result.chem,
        long: result.long,
        tone: result.tone,
        notes: result.notes
      };
    }
  }
  
  return matrix;
}

// Main execution
(async function main() {
  console.log("Generating Chinese nuance matrix for all 144 pairs...");
  
  const matrix = generateMatrix();
  const entries = Object.keys(matrix).length;
  
  console.log(`✓ Generated ${entries} entries`);
  
  // Write to data directory
  const outDir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  const outPath = path.join(outDir, "chinese_nuance_matrix.json");
  fs.writeFileSync(outPath, JSON.stringify(matrix, null, 2), "utf8");
  
  console.log(`✓ Wrote ${outPath}`);
  console.log(`✓ File size: ${(fs.statSync(outPath).size / 1024).toFixed(2)} KB`);
  
  // Sample entries for verification
  console.log("\nSample entries:");
  console.log("Rat-Monkey:", matrix["Rat-Monkey"]);
  console.log("Dragon-Dog:", matrix["Dragon-Dog"]);
  console.log("Monkey-Tiger:", matrix["Monkey-Tiger"]);
  
  console.log("\n✓ Matrix generation complete!");
})();

