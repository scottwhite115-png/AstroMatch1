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
    Rat: "🐀",
    Ox: "🐂",
    Tiger: "🐅",
    Rabbit: "🐇",
    Dragon: "🐉",
    Snake: "🐍",
    Horse: "🐎",
    Goat: "🐐",
    Monkey: "🐒",
    Rooster: "🐓",
    Dog: "🐕",
    Pig: "🐖",
  }
  return glyphMap[sign] || ""
}

// Helper to capitalize sign names
export const capitalizeSign = (sign: string): string => {
  return sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase()
}

// Get Western zodiac sign from birthdate
export const getWesternSignFromDate = (date: Date): string => {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  
  return "Aries"; // Default
}

// Get Chinese zodiac animal from birthdate
export const getChineseAnimalFromDate = (date: Date): string => {
  const year = date.getFullYear();
  
  // Chinese New Year adjustment - approximate dates
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let adjustedYear = year;
  
  // If before Feb 1st, use previous year for Chinese zodiac
  if (month === 1 || (month === 2 && day < 1)) {
    adjustedYear = year - 1;
  }
  
  const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  // 1924 was Year of the Rat (start of cycle)
  const index = (adjustedYear - 1924) % 12;
  return animals[index < 0 ? index + 12 : index];
}

// Get Wu Xing element from birthdate (based on year)
export const getWuXingElementFromDate = (date: Date): string => {
  const year = date.getFullYear();
  
  // Chinese New Year adjustment
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let adjustedYear = year;
  
  if (month === 1 || (month === 2 && day < 1)) {
    adjustedYear = year - 1;
  }
  
  const lastDigit = adjustedYear % 10;
  
  // Wu Xing cycle based on last digit of year
  if (lastDigit === 0 || lastDigit === 1) return "Metal";
  if (lastDigit === 2 || lastDigit === 3) return "Water";
  if (lastDigit === 4 || lastDigit === 5) return "Wood";
  if (lastDigit === 6 || lastDigit === 7) return "Fire";
  if (lastDigit === 8 || lastDigit === 9) return "Earth";
  
  return "Wood"; // Default
}

