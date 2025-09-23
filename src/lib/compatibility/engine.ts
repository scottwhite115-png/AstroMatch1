// --- Zodiac Helpers ---
export function getWesternSign(date: Date): string {
  const d = date.getDate();
  const m = date.getMonth() + 1;

  if ((m===3 && d>=21) || (m===4 && d<=19)) return "Aries";
  if ((m===4 && d>=20) || (m===5 && d<=20)) return "Taurus";
  if ((m===5 && d>=21) || (m===6 && d<=20)) return "Gemini";
  if ((m===6 && d>=21) || (m===7 && d<=22)) return "Cancer";
  if ((m===7 && d>=23) || (m===8 && d<=22)) return "Leo";
  if ((m===8 && d>=23) || (m===9 && d<=22)) return "Virgo";
  if ((m===9 && d>=23) || (m===10 && d<=22)) return "Libra";
  if ((m===10 && d>=23) || (m===11 && d<=21)) return "Scorpio";
  if ((m===11 && d>=22) || (m===12 && d<=21)) return "Sagittarius";
  if ((m===12 && d>=22) || (m===1 && d<=19)) return "Capricorn";
  if ((m===1 && d>=20) || (m===2 && d<=18)) return "Aquarius";
  return "Pisces";
}

export function getChineseAnimal(year: number): string {
  const animals = [
    "Rat","Ox","Tiger","Rabbit","Dragon","Snake",
    "Horse","Goat","Monkey","Rooster","Dog","Pig"
  ];
  const idx = (year - 1900) % 12; // 1900 was Rat
  return animals[(idx + 12) % 12];
}

export function getEastWestCombo(date: Date): string {
  return `${getWesternSign(date)}-${getChineseAnimal(date.getFullYear())}`;
}

// --- Compatibility Engine ---
import matrix from "./matrix.json"; 
// matrix.json will be { "Aquarius-Dragon": { "Leo-Rat": 87, ... }, ... }

export function getCompatibility(a: Date, b: Date): number {
  const comboA = getEastWestCombo(a);
  const comboB = getEastWestCombo(b);

  const row = (matrix as any)[comboA] || {};
  const score = row[comboB];

  return typeof score === "number" ? score : 50; // fallback if missing
}

export function rankMatches(viewer: Date, others: { id: string; birthdate: Date }[]) {
  return others
    .map(o => ({
      id: o.id,
      compatibility: getCompatibility(viewer, o.birthdate),
    }))
    .sort((a, b) => b.compatibility - a.compatibility);
}
