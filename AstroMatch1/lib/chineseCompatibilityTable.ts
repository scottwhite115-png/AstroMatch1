// Helper function to generate compatibility table data for Chinese zodiac animals
export interface CompatibilityTableRow {
  pattern: string;
  partners: string[];
  strength: string;
  color: string; // Match label color
  tierLabel: string; // Match tier for this pattern
}

// Helper function to get pattern color based on match engine labels
function getPatternColor(pattern: string, theme: 'light' | 'dark' = 'dark'): string {
  if (pattern.includes('San He')) {
    // Soulmate/Harmonious - Yellow/Gold
    return theme === 'light' ? 'rgb(202, 138, 4)' : 'rgb(253, 224, 71)'; // yellow-300
  }
  if (pattern.includes('Liu He')) {
    // Excellent Match - Pink
    return theme === 'light' ? 'rgb(219, 39, 119)' : 'rgb(236, 72, 153)'; // pink-500
  }
  if (pattern.includes('Same Trine')) {
    // Favourable Match - Sky blue
    return theme === 'light' ? 'rgb(2, 132, 199)' : 'rgb(56, 189, 248)'; // sky-400
  }
  if (pattern.includes('Neutral')) {
    // Neutral Match - Emerald
    return theme === 'light' ? 'rgb(5, 150, 105)' : 'rgb(52, 211, 153)'; // emerald-400
  }
  if (pattern.includes('Liu Chong')) {
    // Opposites Attract - Purple
    return theme === 'light' ? 'rgb(147, 51, 234)' : 'rgb(192, 132, 252)'; // purple-400
  }
  if (pattern.includes('Liu Hai') || pattern.includes('Xing') || pattern.includes('Po')) {
    // Difficult Match - Slate
    return theme === 'light' ? 'rgb(71, 85, 105)' : 'rgb(203, 213, 225)'; // slate-300
  }
  return theme === 'light' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'; // default
}

// Hardcoded compatibility tables for each animal
const COMPATIBILITY_TABLES: Record<string, CompatibilityTableRow[]> = {
  rat: [
    { pattern: "San He (三合)", partners: ["Dragon", "Monkey"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Ox"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Dragon", "Monkey"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Tiger", "Snake", "Dog", "Pig"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Goat"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Horse"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Rabbit"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Rooster"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
  ox: [
    { pattern: "San He (三合)", partners: ["Snake", "Rooster"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Rat"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Snake", "Rooster"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Tiger", "Rabbit", "Monkey", "Pig"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Horse"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Goat"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Dog", "Goat"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Dragon"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
  tiger: [
    { pattern: "San He (三合)", partners: ["Horse", "Dog"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Pig"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Horse", "Dog"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Rat", "Ox", "Rabbit", "Dragon", "Goat", "Rooster"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Snake"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Monkey"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Monkey", "Snake"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Pig"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
  rabbit: [
    { pattern: "San He (三合)", partners: ["Goat", "Pig"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Dog"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Goat", "Pig"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Ox", "Tiger", "Snake", "Monkey"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Dragon"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Rooster"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Rat"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Horse"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
  dragon: [
    { pattern: "San He (三合)", partners: ["Rat", "Monkey"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Rooster"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Rat", "Monkey"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Tiger", "Snake", "Horse", "Goat", "Pig"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Rabbit"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Dog"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Dragon (Self-punish)"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Ox"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
  snake: [
    { pattern: "San He (三合)", partners: ["Ox", "Rooster"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Monkey"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Ox", "Rooster"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Rat", "Rabbit", "Dragon", "Horse", "Goat", "Dog"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Tiger"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Pig"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Tiger", "Monkey"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Monkey"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
  horse: [
    { pattern: "San He (三合)", partners: ["Tiger", "Dog"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Goat"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Tiger", "Dog"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Dragon", "Snake", "Monkey", "Rooster", "Pig"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Ox"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Rat"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Horse (Self-punish)"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Rabbit"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
  goat: [
    { pattern: "San He (三合)", partners: ["Rabbit", "Pig"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Horse"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Rabbit", "Pig"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Tiger", "Dragon", "Snake", "Monkey", "Rooster"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Rat"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Ox"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Ox", "Dog"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Dog"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
  monkey: [
    { pattern: "San He (三合)", partners: ["Rat", "Dragon"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Snake"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Rat", "Dragon"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Ox", "Rabbit", "Horse", "Goat", "Rooster", "Dog"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Pig"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Tiger"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Tiger", "Snake"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Snake"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
  rooster: [
    { pattern: "San He (三合)", partners: ["Ox", "Snake"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Dragon"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Ox", "Snake"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Tiger", "Horse", "Goat", "Monkey", "Pig"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Dog"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Rabbit"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Rooster (Self-punish)"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Rat"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
  dog: [
    { pattern: "San He (三合)", partners: ["Tiger", "Horse"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Rabbit"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Tiger", "Horse"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Rat", "Ox", "Snake", "Monkey", "Pig"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Rooster"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Dragon"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Goat", "Ox"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Goat"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
  pig: [
    { pattern: "San He (三合)", partners: ["Rabbit", "Goat"], strength: "⭐⭐⭐⭐⭐ (Peak)", color: getPatternColor("San He"), tierLabel: "Soulmate" },
    { pattern: "Liu He (六合)", partners: ["Tiger"], strength: "⭐⭐⭐⭐", color: getPatternColor("Liu He"), tierLabel: "Excellent" },
    { pattern: "Same Trine (三会)", partners: ["Rabbit", "Goat"], strength: "⭐⭐⭐⭐", color: getPatternColor("Same Trine"), tierLabel: "Favourable" },
    { pattern: "Neutral", partners: ["Rat", "Ox", "Dragon", "Horse", "Rooster", "Dog"], strength: "⭐⭐", color: getPatternColor("Neutral"), tierLabel: "Neutral" },
    { pattern: "Liu Hai (六害)", partners: ["Monkey"], strength: "⭐ (Harm)", color: getPatternColor("Liu Hai"), tierLabel: "Difficult" },
    { pattern: "Liu Chong (六冲)", partners: ["Snake"], strength: "⭐ (Opposition)", color: getPatternColor("Liu Chong"), tierLabel: "Opposites" },
    { pattern: "Xing (刑)", partners: ["Pig (Self-punish)"], strength: "⭐ (Punishment)", color: getPatternColor("Xing"), tierLabel: "Difficult" },
    { pattern: "Po (破)", partners: ["Tiger"], strength: "⭐ (Break)", color: getPatternColor("Po"), tierLabel: "Difficult" },
  ],
};

export function getCompatibilityTable(animal: string): CompatibilityTableRow[] {
  const animalLower = animal.toLowerCase();
  return COMPATIBILITY_TABLES[animalLower] || [];
}

