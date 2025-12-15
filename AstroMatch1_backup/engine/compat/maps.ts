export type WestSign =
  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export type EastAnimal =
  | "rat" | "ox" | "tiger" | "rabbit" | "dragon" | "snake"
  | "horse" | "goat" | "monkey" | "rooster" | "dog" | "pig";

export const WEST_ELEMENT: Record<WestSign, "fire" | "earth" | "air" | "water"> = {
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water",
};

export const TRINE: Record<EastAnimal, "visionaries" | "strategists" | "adventurers" | "artists"> = {
  rat: "visionaries", dragon: "visionaries", monkey: "visionaries",
  ox: "strategists", snake: "strategists", rooster: "strategists",
  tiger: "adventurers", horse: "adventurers", dog: "adventurers",
  rabbit: "artists", goat: "artists", pig: "artists",
};

export const EAST_OPPOSITE: Record<EastAnimal, EastAnimal> = {
  rat: "horse", ox: "goat", tiger: "monkey", rabbit: "rooster",
  dragon: "dog", snake: "pig", horse: "rat", goat: "ox",
  monkey: "tiger", rooster: "rabbit", dog: "dragon", pig: "snake",
};

export const CN_BEST: Record<EastAnimal, EastAnimal[]> = {
  rat: ["dragon", "monkey"], ox: ["snake", "rooster"], tiger: ["horse", "dog"], rabbit: ["goat", "pig"],
  dragon: ["rat", "monkey"], snake: ["rooster", "ox"], horse: ["tiger", "dog"], goat: ["rabbit", "pig"],
  monkey: ["rat", "dragon"], rooster: ["ox", "snake"], dog: ["tiger", "horse"], pig: ["rabbit", "goat"],
};

export const CN_GOOD: Record<EastAnimal, EastAnimal[]> = {
  rat: ["ox"], ox: ["rat"], tiger: ["pig"], rabbit: ["dog"], dragon: ["rooster"], snake: ["monkey"],
  horse: ["goat"], goat: ["horse"], monkey: ["snake"], rooster: ["dragon"], dog: ["rabbit"], pig: ["tiger"],
};

export const CN_WORST: Record<EastAnimal, EastAnimal> = {
  rat: "goat", ox: "horse", tiger: "snake", rabbit: "dragon",
  dragon: "rabbit", snake: "tiger", horse: "ox", goat: "rat",
  monkey: "pig", rooster: "dog", dog: "rooster", pig: "monkey",
};

