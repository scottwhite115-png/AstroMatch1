// /lib/zodiacHelpers.ts

export const getWesternSignGlyph = (sign: string): string => {
  const glyphMap: { [key: string]: string } = {
    Aries: "♈",
    Taurus: "♉",
    Gemini: "♊",
    Cancer: "♋",
    Leo: "♌",
    Virgo: "♍",
    Libra: "♎",
    Scorpio: "♏",
    Sagittarius: "♐",
    Capricorn: "♑",
    Aquarius: "♒",
    Pisces: "♓",
  }
  return glyphMap[sign] || ""
}

export const getChineseSignGlyph = (sign: string): string => {
  const glyphMap: { [key: string]: string } = {
    Rat: "🐭",
    Ox: "🐂",
    Tiger: "🐅",
    Rabbit: "🐰",
    Dragon: "🐉",
    Snake: "🐍",
    Horse: "🐎",
    Goat: "🐐",
    Monkey: "🐒",
    Rooster: "🐓",
    Dog: "🐕",
    Pig: "🐷",
  }
  return glyphMap[sign] || ""
}

// Helper to capitalize sign names
export const capitalizeSign = (sign: string): string => {
  return sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase()
}

