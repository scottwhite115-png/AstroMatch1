// Helper function to generate compatibility table data for Chinese zodiac animals
export interface CompatibilityTableRow {
  pattern: string;
  partners: string[];
  strength: string;
}

// Hardcoded compatibility tables for each animal
const COMPATIBILITY_TABLES: Record<string, CompatibilityTableRow[]> = {
  rat: [
    { pattern: "San He (三合)", partners: ["Dragon", "Monkey"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Ox"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Dragon", "Monkey"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Tiger", "Snake", "Dog", "Pig"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Goat"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Horse"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Rabbit"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Rooster"], strength: "⭐ (Break)" },
  ],
  ox: [
    { pattern: "San He (三合)", partners: ["Snake", "Rooster"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Rat"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Snake", "Rooster"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Tiger", "Rabbit", "Monkey", "Pig"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Horse"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Goat"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Dog", "Goat"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Dragon"], strength: "⭐ (Break)" },
  ],
  tiger: [
    { pattern: "San He (三合)", partners: ["Horse", "Dog"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Pig"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Horse", "Dog"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Rat", "Ox", "Rabbit", "Dragon", "Goat", "Rooster"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Snake"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Monkey"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Monkey", "Snake"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Pig"], strength: "⭐ (Break)" },
  ],
  rabbit: [
    { pattern: "San He (三合)", partners: ["Goat", "Pig"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Dog"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Goat", "Pig"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Ox", "Tiger", "Snake", "Monkey"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Dragon"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Rooster"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Rat"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Horse"], strength: "⭐ (Break)" },
  ],
  dragon: [
    { pattern: "San He (三合)", partners: ["Rat", "Monkey"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Rooster"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Rat", "Monkey"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Tiger", "Snake", "Horse", "Goat", "Pig"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Rabbit"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Dog"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Dragon (Self-punish)"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Ox"], strength: "⭐ (Break)" },
  ],
  snake: [
    { pattern: "San He (三合)", partners: ["Ox", "Rooster"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Monkey"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Ox", "Rooster"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Rat", "Rabbit", "Dragon", "Horse", "Goat", "Dog"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Tiger"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Pig"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Tiger", "Monkey"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Monkey"], strength: "⭐ (Break)" },
  ],
  horse: [
    { pattern: "San He (三合)", partners: ["Tiger", "Dog"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Goat"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Tiger", "Dog"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Dragon", "Snake", "Monkey", "Rooster", "Pig"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Ox"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Rat"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Horse (Self-punish)"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Rabbit"], strength: "⭐ (Break)" },
  ],
  goat: [
    { pattern: "San He (三合)", partners: ["Rabbit", "Pig"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Horse"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Rabbit", "Pig"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Tiger", "Dragon", "Snake", "Monkey", "Rooster"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Rat"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Ox"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Ox", "Dog"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Dog"], strength: "⭐ (Break)" },
  ],
  monkey: [
    { pattern: "San He (三合)", partners: ["Rat", "Dragon"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Snake"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Rat", "Dragon"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Ox", "Rabbit", "Horse", "Goat", "Rooster", "Dog"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Pig"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Tiger"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Tiger", "Snake"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Snake"], strength: "⭐ (Break)" },
  ],
  rooster: [
    { pattern: "San He (三合)", partners: ["Ox", "Snake"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Dragon"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Ox", "Snake"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Tiger", "Horse", "Goat", "Monkey", "Pig"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Dog"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Rabbit"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Rooster (Self-punish)"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Rat"], strength: "⭐ (Break)" },
  ],
  dog: [
    { pattern: "San He (三合)", partners: ["Tiger", "Horse"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Rabbit"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Tiger", "Horse"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Rat", "Ox", "Snake", "Monkey", "Pig"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Rooster"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Dragon"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Goat", "Ox"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Goat"], strength: "⭐ (Break)" },
  ],
  pig: [
    { pattern: "San He (三合)", partners: ["Rabbit", "Goat"], strength: "⭐⭐⭐⭐⭐ (Peak)" },
    { pattern: "Liu He (六合)", partners: ["Tiger"], strength: "⭐⭐⭐⭐" },
    { pattern: "Same Trine (三会)", partners: ["Rabbit", "Goat"], strength: "⭐⭐⭐⭐" },
    { pattern: "Neutral", partners: ["Rat", "Ox", "Dragon", "Horse", "Rooster", "Dog"], strength: "⭐⭐" },
    { pattern: "Liu Hai (六害)", partners: ["Monkey"], strength: "⭐ (Harm)" },
    { pattern: "Liu Chong (六冲)", partners: ["Snake"], strength: "⭐ (Opposition)" },
    { pattern: "Xing (刑)", partners: ["Pig (Self-punish)"], strength: "⭐ (Punishment)" },
    { pattern: "Po (破)", partners: ["Tiger"], strength: "⭐ (Break)" },
  ],
};

export function getCompatibilityTable(animal: string): CompatibilityTableRow[] {
  const animalLower = animal.toLowerCase();
  return COMPATIBILITY_TABLES[animalLower] || [];
}

