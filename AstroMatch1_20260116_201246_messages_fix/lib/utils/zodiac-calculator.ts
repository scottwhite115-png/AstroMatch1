export interface WesternZodiacSign {
  name: string
  symbol: string
  element: string
  dateRange: string
}

export interface ChineseZodiacSign {
  name: string
  element: string
  years: string
}

// Calculate Western Zodiac sign based on month and day using TROPICAL zodiac dates
export function getWesternZodiacSign(month: number, day: number): WesternZodiacSign {
  const zodiacSigns: WesternZodiacSign[] = [
    { name: "Capricorn", symbol: "♑", element: "Earth", dateRange: "Dec 22 - Jan 19" },
    { name: "Aquarius", symbol: "♒", element: "Air", dateRange: "Jan 20 - Feb 18" },
    { name: "Pisces", symbol: "♓", element: "Water", dateRange: "Feb 19 - Mar 20" },
    { name: "Aries", symbol: "♈", element: "Fire", dateRange: "Mar 21 - Apr 19" },
    { name: "Taurus", symbol: "♉", element: "Earth", dateRange: "Apr 20 - May 20" },
    { name: "Gemini", symbol: "♊", element: "Air", dateRange: "May 21 - Jun 20" },
    { name: "Cancer", symbol: "♋", element: "Water", dateRange: "Jun 21 - Jul 22" },
    { name: "Leo", symbol: "♌", element: "Fire", dateRange: "Jul 23 - Aug 22" },
    { name: "Virgo", symbol: "♍", element: "Earth", dateRange: "Aug 23 - Sep 22" },
    { name: "Libra", symbol: "♎", element: "Air", dateRange: "Sep 23 - Oct 22" },
    { name: "Scorpio", symbol: "♏", element: "Water", dateRange: "Oct 23 - Nov 21" },
    { name: "Sagittarius", symbol: "♐", element: "Fire", dateRange: "Nov 22 - Dec 21" },
  ]

  // Tropical zodiac date ranges
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[3] // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[4] // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[5] // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[6] // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[7] // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[8] // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[9] // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[10] // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[11] // Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[0] // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[1] // Aquarius
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return zodiacSigns[2] // Pisces

  return zodiacSigns[0] // Default to Capricorn
}

// Calculate Chinese Zodiac sign based on birth year, month, and day
export function getChineseZodiacSign(year: number, month: number, day: number): ChineseZodiacSign {
  const animals = [
    { name: "Rat", element: "Water" },
    { name: "Ox", element: "Earth" },
    { name: "Tiger", element: "Wood" },
    { name: "Rabbit", element: "Wood" },
    { name: "Dragon", element: "Earth" },
    { name: "Snake", element: "Fire" },
    { name: "Horse", element: "Fire" },
    { name: "Goat", element: "Earth" },
    { name: "Monkey", element: "Metal" },
    { name: "Rooster", element: "Metal" },
    { name: "Dog", element: "Earth" },
    { name: "Pig", element: "Water" },
  ]

  // Chinese New Year dates for each year (format: [month, day])
  const chineseNewYearDates: { [key: number]: [number, number] } = {
    1924: [2, 5],
    1925: [1, 24],
    1926: [2, 13],
    1927: [2, 2],
    1928: [1, 23],
    1929: [2, 10],
    1930: [1, 30],
    1931: [2, 17],
    1932: [2, 6],
    1933: [1, 26],
    1934: [2, 14],
    1935: [2, 4],
    1936: [1, 24],
    1937: [2, 11],
    1938: [1, 31],
    1939: [2, 19],
    1940: [2, 8],
    1941: [1, 27],
    1942: [2, 15],
    1943: [2, 4],
    1944: [1, 25],
    1945: [2, 13],
    1946: [2, 1],
    1947: [1, 22],
    1948: [2, 10],
    1949: [1, 29],
    1950: [2, 17],
    1951: [2, 6],
    1952: [1, 27],
    1953: [2, 14],
    1954: [2, 3],
    1955: [1, 24],
    1956: [2, 12],
    1957: [1, 31],
    1958: [2, 18],
    1959: [2, 8],
    1960: [1, 28],
    1961: [2, 15],
    1962: [2, 5],
    1963: [1, 25],
    1964: [2, 13],
    1965: [2, 2],
    1966: [1, 21],
    1967: [2, 9],
    1968: [1, 30],
    1969: [2, 17],
    1970: [2, 6],
    1971: [1, 27],
    1972: [2, 15],
    1973: [2, 3],
    1974: [1, 23],
    1975: [2, 11],
    1976: [1, 31],
    1977: [2, 18],
    1978: [2, 7],
    1979: [1, 28],
    1980: [2, 16],
    1981: [2, 5],
    1982: [1, 24],
    1983: [2, 12],
    1984: [2, 2],
    1985: [2, 20],
    1986: [2, 9],
    1987: [1, 29],
    1988: [2, 17],
    1989: [2, 6],
    1990: [1, 27],
    1991: [2, 15],
    1992: [2, 4],
    1993: [1, 23],
    1994: [2, 10],
    1995: [1, 31],
    1996: [2, 19],
    1997: [2, 7],
    1998: [1, 28],
    1999: [2, 16],
    2000: [2, 5],
    2001: [1, 24],
    2002: [2, 12],
    2003: [2, 1],
    2004: [1, 22],
    2005: [2, 9],
    2006: [1, 29],
    2007: [2, 18],
    2008: [2, 7],
    2009: [1, 26],
    2010: [2, 14],
    2011: [2, 3],
    2012: [1, 23],
    2013: [2, 10],
    2014: [1, 31],
    2015: [2, 19],
    2016: [2, 8],
    2017: [1, 28],
    2018: [2, 16],
    2019: [2, 5],
    2020: [1, 25],
    2021: [2, 12],
    2022: [2, 1],
    2023: [1, 22],
    2024: [2, 10],
    2025: [1, 29],
    2026: [2, 17],
    2027: [2, 6],
    2028: [1, 26],
    2029: [2, 13],
    2030: [2, 3],
    2031: [1, 23],
    2032: [2, 11],
  }

  // Determine the actual Chinese zodiac year
  let chineseYear = year
  const cnyDate = chineseNewYearDates[year]

  if (cnyDate) {
    const [cnyMonth, cnyDay] = cnyDate
    // If birth date is before Chinese New Year, use previous year
    if (month < cnyMonth || (month === cnyMonth && day < cnyDay)) {
      chineseYear = year - 1
    }
  }

  // Calculate zodiac animal based on the adjusted year
  const baseYear = 1924
  const index = (chineseYear - baseYear) % 12
  const adjustedIndex = index < 0 ? index + 12 : index

  const animal = animals[adjustedIndex]

  // Calculate recent years for this sign
  const currentYear = new Date().getFullYear()
  const recentYears: number[] = []
  for (let y = chineseYear; y <= currentYear + 12; y += 12) {
    if (y >= 1924 && y <= currentYear + 12) {
      recentYears.push(y)
    }
  }
  // Also add years before birth year
  for (let y = chineseYear - 12; y >= 1924 && recentYears.length < 8; y -= 12) {
    recentYears.unshift(y)
  }

  return {
    name: animal.name,
    element: animal.element,
    years: recentYears.slice(0, 8).join(", "),
  }
}

// Get emoji for Western zodiac sign
export function getWesternSignEmoji(sign: string): string {
  const emojiMap: { [key: string]: string } = {
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
  return emojiMap[sign] || ""
}

// Get emoji for Chinese zodiac sign
export function getChineseSignEmoji(sign: string): string {
  const emojiMap: { [key: string]: string } = {
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
  return emojiMap[sign] || ""
}
