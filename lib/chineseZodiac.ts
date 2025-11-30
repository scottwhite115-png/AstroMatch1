// lib/chineseZodiac.ts

export type ChineseAnimal =
  | "Rat"
  | "Ox"
  | "Tiger"
  | "Rabbit"
  | "Dragon"
  | "Snake"
  | "Horse"
  | "Goat"
  | "Monkey"
  | "Rooster"
  | "Dog"
  | "Pig";

export type ChineseElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

// Simplified characters for animals
export const CHINESE_ANIMAL_CHAR: Record<ChineseAnimal, string> = {
  Rat: "鼠",
  Ox: "牛",
  Tiger: "虎",
  Rabbit: "兔",
  Dragon: "龙",
  Snake: "蛇",
  Horse: "马",
  Goat: "羊",
  Monkey: "猴",
  Rooster: "鸡",
  Dog: "狗",
  Pig: "猪",
};

// Simplified characters for elements
export const CHINESE_ELEMENT_CHAR: Record<ChineseElement, string> = {
  Wood: "木",
  Fire: "火",
  Earth: "土",
  Metal: "金",
  Water: "水",
};

// 12-year animal cycle (Rat as start)
// NOTE: This uses the Gregorian year only. For perfect accuracy you'd
// adjust around Chinese New Year, but this is fine for v1.
const ANIMALS_IN_ORDER: ChineseAnimal[] = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
];

export function getChineseAnimalFromYear(year: number): ChineseAnimal {
  const index = ((year - 4) % 12 + 12) % 12;
  return ANIMALS_IN_ORDER[index];
}

// Heavenly stem → element (10-year cycle)
export function getChineseElementFromYear(year: number): ChineseElement {
  // 0–1: Wood, 2–3: Fire, 4–5: Earth, 6–7: Metal, 8–9: Water
  const stemIndex = ((year - 4) % 10 + 10) % 10;
  const elementIndex = Math.floor(stemIndex / 2);

  switch (elementIndex) {
    case 0:
      return "Wood";
    case 1:
      return "Fire";
    case 2:
      return "Earth";
    case 3:
      return "Metal";
    case 4:
    default:
      return "Water";
  }
}

export function getChineseZodiacFromDate(date: Date): {
  animal: ChineseAnimal;
  element: ChineseElement;
} {
  const year = date.getFullYear();
  return {
    animal: getChineseAnimalFromYear(year),
    element: getChineseElementFromYear(year),
  };
}
