// Helper to get Chinese pattern display name with symbols
export function getChinesePatternLabel(pattern?: string): string {
  if (!pattern) return "Neutral";
  
  const patternUpper = pattern.toUpperCase();
  
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return "San He 三合 · Triple Harmony";
  }
  
  if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET ALLIES') || patternUpper.includes('SECRET FRIENDS')) {
    return "Liu He 六合 · Six Harmoniess";
  }
  
  if (patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME ANIMAL') || patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME SIGN')) {
    return "Same Animal";
  }
  
  if (patternUpper.includes('LIU_CHONG') || patternUpper.includes('SIX CONFLICTS')) {
    return "Liu Chong 六冲 · Six Conflicts";
  }
  
  if (patternUpper.includes('LIU_HAI') || patternUpper.includes('SIX HARMS')) {
    return "Liu Hai 六害 · Six Harms";
  }
  
  if (patternUpper.includes('XING') || patternUpper.includes('PUNISHMENT')) {
    return "Xing 刑 · Punishment";
  }
  
  if (patternUpper.includes('PO') || patternUpper.includes('BREAK')) {
    return "Po 破 · Break";
  }
  
  if (patternUpper.includes('NO_PATTERN') || patternUpper.includes('NO MAJOR') || patternUpper.includes('NEUTRAL')) {
    return "Neutral";
  }
  
  return "Neutral";
}

// Helper to get color based on pattern
export function getPatternColor(pattern?: string): "green" | "pink" | "gold" | "blue" | "red" {
  if (!pattern) return "blue";
  
  const patternUpper = pattern.toUpperCase();
  
  // San He - Gold
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return "gold";
  }
  
  // Liu He - Pink
  if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET ALLIES') || patternUpper.includes('SECRET FRIENDS')) {
    return "pink";
  }
  
  // Same Animal - Green
  if (patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME ANIMAL') || patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME SIGN')) {
    return "green";
  }
  
  // Conflicts/Harms/Punishment/Break - Red
  if (patternUpper.includes('LIU_CHONG') || patternUpper.includes('SIX CONFLICTS') ||
      patternUpper.includes('LIU_HAI') || patternUpper.includes('SIX HARMS') ||
      patternUpper.includes('XING') || patternUpper.includes('PUNISHMENT') ||
      patternUpper.includes('PO') || patternUpper.includes('BREAK')) {
    return "red";
  }
  
  // Neutral - Blue
  return "blue";
}

// Helper to get pattern description/tagline
export function getPatternDescription(pattern?: string): string {
  if (!pattern) return "Neutral pattern in Chinese astrology";
  
  const patternUpper = pattern.toUpperCase();
  
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return "A harmonious trine connection — supportive and naturally aligned.";
  }
  
  if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET ALLIES') || patternUpper.includes('SECRET FRIENDS')) {
    return "Secret allies — a special bond of mutual understanding and support.";
  }
  
  if (patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME ANIMAL') || patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME SIGN')) {
    return "Same Chinese animal — shared strengths and challenges.";
  }
  
  if (patternUpper.includes('LIU_CHONG') || patternUpper.includes('SIX CONFLICTS')) {
    return "Direct opposites — magnetic but challenging, requires compromise.";
  }
  
  if (patternUpper.includes('LIU_HAI') || patternUpper.includes('SIX HARMS')) {
    return "Six harms — subtle friction that needs awareness and care.";
  }
  
  if (patternUpper.includes('XING') || patternUpper.includes('PUNISHMENT')) {
    return "Punishment aspect — intense lessons and growth through challenge.";
  }
  
  if (patternUpper.includes('PO') || patternUpper.includes('BREAK')) {
    return "Break aspect — destabilizing energy that tests the connection.";
  }
  
  return "Neutral pattern in Chinese astrology; no strong harmony or conflict.";
}

