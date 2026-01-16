// Western Zodiac Sign Emojis
export const getWesternSignEmoji = (sign: string): string => {
  const signLower = sign.toLowerCase()
  
  const emojiMap: { [key: string]: string } = {
    'aries': '♈',
    'taurus': '♉',
    'gemini': '♊',
    'cancer': '♋',
    'leo': '♌',
    'virgo': '♍',
    'libra': '♎',
    'scorpio': '♏',
    'sagittarius': '♐',
    'capricorn': '♑',
    'aquarius': '♒',
    'pisces': '♓'
  }
  
  return emojiMap[signLower] || '♈'
}

// Chinese Zodiac Sign Emojis - Matching Astrology Page
export const getChineseSignEmoji = (sign: string): string => {
  const signLower = sign.toLowerCase()
  
  const emojiMap: { [key: string]: string } = {
    'rat': '🐭',
    'ox': '🐂',
    'tiger': '🐅',
    'rabbit': '🐰',
    'dragon': '🐉',
    'snake': '🐍',
    'horse': '🐎',
    'goat': '🐐',
    'monkey': '🐒',
    'rooster': '🐓',
    'dog': '🐕',
    'pig': '🐷'
  }
  
  return emojiMap[signLower] || '🐭'
}
