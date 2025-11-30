"use client"

import { useTheme } from "@/contexts/ThemeContext"

type WesternSign = 
  | "Aries" | "Taurus" | "Gemini" | "Cancer" 
  | "Leo" | "Virgo" | "Libra" | "Scorpio" 
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces"

interface CompatibilityRow {
  pattern: string
  partnerSigns: string
  strength: string // Star rating
  notes: string // Descriptive notes for each pattern
}

// Calculate aspect between two signs
function calculateAspect(signA: WesternSign, signB: WesternSign): string {
  if (signA === signB) return "same_sign"
  
  const signs: WesternSign[] = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ]
  
  const indexA = signs.indexOf(signA)
  const indexB = signs.indexOf(signB)
  const diff = Math.abs(indexA - indexB)
  const distance = Math.min(diff, 12 - diff)
  
  // Same element (trine)
  const elements: Record<WesternSign, string> = {
    Aries: "fire", Leo: "fire", Sagittarius: "fire",
    Taurus: "earth", Virgo: "earth", Capricorn: "earth",
    Gemini: "air", Libra: "air", Aquarius: "air",
    Cancer: "water", Scorpio: "water", Pisces: "water"
  }
  
  // Same sign
  if (signA === signB) return "same_sign"
  
  // Trine (same element, 120 degrees apart)
  if (elements[signA] === elements[signB]) {
    const fireSigns: WesternSign[] = ["Aries", "Leo", "Sagittarius"]
    const earthSigns: WesternSign[] = ["Taurus", "Virgo", "Capricorn"]
    const airSigns: WesternSign[] = ["Gemini", "Libra", "Aquarius"]
    const waterSigns: WesternSign[] = ["Cancer", "Scorpio", "Pisces"]
    
    if ((fireSigns.includes(signA) && fireSigns.includes(signB)) ||
        (earthSigns.includes(signA) && earthSigns.includes(signB)) ||
        (airSigns.includes(signA) && airSigns.includes(signB)) ||
        (waterSigns.includes(signA) && waterSigns.includes(signB))) {
      return "trine"
    }
  }
  
  // Opposition (180 degrees, 6 signs apart)
  if (distance === 6) return "opposition"
  
  // Sextile (60 degrees, 2 signs apart)
  if (distance === 2 || distance === 10) return "sextile"
  
  // Square (90 degrees, 3 signs apart)
  if (distance === 3 || distance === 9) return "square"
  
  // Quincunx (150 degrees, 5 signs apart)
  if (distance === 5 || distance === 7) return "quincunx"
  
  return "other"
}

// Get all signs in same element (trine)
function getTrineSigns(sign: WesternSign): WesternSign[] {
  const trines: Record<WesternSign, WesternSign[]> = {
    Aries: ["Leo", "Sagittarius"],
    Leo: ["Aries", "Sagittarius"],
    Sagittarius: ["Aries", "Leo"],
    Taurus: ["Virgo", "Capricorn"],
    Virgo: ["Taurus", "Capricorn"],
    Capricorn: ["Taurus", "Virgo"],
    Gemini: ["Libra", "Aquarius"],
    Libra: ["Gemini", "Aquarius"],
    Aquarius: ["Gemini", "Libra"],
    Cancer: ["Scorpio", "Pisces"],
    Scorpio: ["Cancer", "Pisces"],
    Pisces: ["Cancer", "Scorpio"]
  }
  return trines[sign] || []
}

// Get opposite sign
function getOppositeSign(sign: WesternSign): WesternSign {
  const opposites: Record<WesternSign, WesternSign> = {
    Aries: "Libra",
    Libra: "Aries",
    Taurus: "Scorpio",
    Scorpio: "Taurus",
    Gemini: "Sagittarius",
    Sagittarius: "Gemini",
    Cancer: "Capricorn",
    Capricorn: "Cancer",
    Leo: "Aquarius",
    Aquarius: "Leo",
    Virgo: "Pisces",
    Pisces: "Virgo"
  }
  return opposites[sign] || sign
}

// Get sextile signs (Fire-Air or Earth-Water)
function getSextileSigns(sign: WesternSign): { signs: WesternSign[], label: string } {
  const sextiles: Record<WesternSign, { signs: WesternSign[], elementPair: string }> = {
    Aries: { signs: ["Gemini", "Aquarius"], elementPair: "Fire–Air" },
    Leo: { signs: ["Gemini", "Libra"], elementPair: "Fire–Air" },
    Sagittarius: { signs: ["Libra", "Aquarius"], elementPair: "Fire–Air" },
    Taurus: { signs: ["Cancer", "Pisces"], elementPair: "Earth–Water" },
    Virgo: { signs: ["Cancer", "Scorpio"], elementPair: "Earth–Water" },
    Capricorn: { signs: ["Scorpio", "Pisces"], elementPair: "Earth–Water" },
    Gemini: { signs: ["Aries", "Leo"], elementPair: "Air–Fire" },
    Libra: { signs: ["Leo", "Sagittarius"], elementPair: "Air–Fire" },
    Aquarius: { signs: ["Aries", "Sagittarius"], elementPair: "Air–Fire" },
    Cancer: { signs: ["Taurus", "Virgo"], elementPair: "Water–Earth" },
    Scorpio: { signs: ["Virgo", "Capricorn"], elementPair: "Water–Earth" },
    Pisces: { signs: ["Taurus", "Virgo"], elementPair: "Water–Earth" }
  }
  const sextileData = sextiles[sign] || { signs: [], elementPair: "" }
  return {
    signs: sextileData.signs,
    label: `${sextileData.elementPair} sextile`
  }
}

// Get square signs and their modality label
function getSquareSigns(sign: WesternSign): { signs: WesternSign[], label: string } {
  const squares: Record<WesternSign, { signs: WesternSign[], modality: "Cardinal" | "Fixed" | "Mutable" }> = {
    Aries: { signs: ["Cancer", "Capricorn"], modality: "Cardinal" },
    Leo: { signs: ["Taurus", "Scorpio"], modality: "Fixed" },
    Sagittarius: { signs: ["Virgo", "Pisces"], modality: "Mutable" },
    Taurus: { signs: ["Leo", "Aquarius"], modality: "Fixed" },
    Virgo: { signs: ["Gemini", "Sagittarius"], modality: "Mutable" },
    Capricorn: { signs: ["Aries", "Libra"], modality: "Cardinal" },
    Gemini: { signs: ["Virgo", "Pisces"], modality: "Mutable" },
    Libra: { signs: ["Cancer", "Capricorn"], modality: "Cardinal" },
    Aquarius: { signs: ["Taurus", "Scorpio"], modality: "Fixed" },
    Cancer: { signs: ["Aries", "Libra"], modality: "Cardinal" },
    Scorpio: { signs: ["Leo", "Aquarius"], modality: "Fixed" },
    Pisces: { signs: ["Sagittarius", "Gemini"], modality: "Mutable" }
  }
  const squareData = squares[sign] || { signs: [], modality: "Cardinal" }
  return {
    signs: squareData.signs,
    label: `${squareData.modality} square (${squareData.modality === "Cardinal" ? "growth tension" : squareData.modality === "Fixed" ? "stubborn friction" : "growth tension"})`
  }
}

// Get quincunx signs
function getQuincunxSigns(sign: WesternSign): WesternSign[] {
  const quincunxes: Record<WesternSign, WesternSign[]> = {
    Aries: ["Virgo", "Scorpio"],
    Leo: ["Capricorn", "Pisces"],
    Sagittarius: ["Cancer", "Capricorn"],
    Taurus: ["Sagittarius", "Libra"],
    Virgo: ["Aries", "Leo"],
    Capricorn: ["Gemini", "Leo"],
    Gemini: ["Scorpio", "Capricorn"],
    Libra: ["Taurus", "Pisces"],
    Aquarius: ["Cancer", "Virgo"],
    Cancer: ["Sagittarius", "Aquarius"],
    Scorpio: ["Gemini", "Sagittarius"],
    Pisces: ["Leo", "Libra"]
  }
  return quincunxes[sign] || []
}

// Sign-specific compatibility data
const compatibilityData: Record<WesternSign, CompatibilityRow[]> = {
  Aries: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Aries",
      strength: "⭐⭐⭐",
      notes: "Passionate and exciting, but two hot heads; great chemistry, needs impulse control for long-term."
    },
    {
      pattern: "Fire trine (same element)",
      partnerSigns: "Leo, Sagittarius",
      strength: "⭐⭐⭐⭐⭐",
      notes: "Best all-round matches: shared fire, enthusiasm and drive; great for big lives together."
    },
    {
      pattern: "Fire–Air sextile",
      partnerSigns: "Gemini, Aquarius",
      strength: "⭐⭐⭐⭐",
      notes: "Energetic and mentally stimulating; Aries acts, Air thinks. Fun and future-focused, can be restless."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Libra",
      strength: "⭐⭐⭐⭐",
      notes: "Me vs we. Strong attraction and lessons in partnership; great if both grow up."
    },
    {
      pattern: "Cardinal square (power clashes)",
      partnerSigns: "Cancer, Capricorn",
      strength: "⭐⭐",
      notes: "Strong will on all sides; easily turns into struggle over control, direction, or priorities."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Virgo, Scorpio",
      strength: "⭐⭐",
      notes: "Very different pacing and emotional style; can work but often feels like constant tweaking."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Taurus, Pisces",
      strength: "⭐⭐⭐",
      notes: "Can balance Aries if there's maturity; Taurus stabilises, Pisces softens, but neither is \"easy mode\"."
    }
  ],
  Taurus: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Taurus",
      strength: "⭐⭐⭐",
      notes: "Stable, sensual, loyal. Can become stubborn and resistant to change; great if goals align."
    },
    {
      pattern: "Earth trine (same element)",
      partnerSigns: "Virgo, Capricorn",
      strength: "⭐⭐⭐⭐⭐",
      notes: "Best fits: practical, loyal, future-building. Feels safe and grounded with shared values."
    },
    {
      pattern: "Earth–Water sextile",
      partnerSigns: "Cancer, Pisces",
      strength: "⭐⭐⭐⭐",
      notes: "Emotional support + stability. Water brings feeling, Taurus brings security; very sweet for love."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Scorpio",
      strength: "⭐⭐⭐⭐",
      notes: "Intense and magnetic; strong sexual + emotional pull. Deep but can be possessive or dramatic."
    },
    {
      pattern: "Fixed square (value clashes)",
      partnerSigns: "Leo, Aquarius",
      strength: "⭐⭐",
      notes: "Pride vs security, freedom vs stability; attractive but often frustrating over lifestyle and priorities."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Libra, Sagittarius",
      strength: "⭐⭐",
      notes: "Different tempo and desires; Taurus may feel under-prioritised, other feels restricted."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Aries, Gemini",
      strength: "⭐⭐⭐",
      notes: "Can be fun, but very different; works best if both appreciate what the other brings."
    }
  ],
  Gemini: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Gemini",
      strength: "⭐⭐⭐",
      notes: "Playful, talkative, curious. Great for fun; needs emotional depth from elsewhere in the chart."
    },
    {
      pattern: "Air trine (same element)",
      partnerSigns: "Libra, Aquarius",
      strength: "⭐⭐⭐⭐⭐",
      notes: "Top matches: mental rapport, freedom and friendship. Great for modern, flexible relationships."
    },
    {
      pattern: "Air–Fire sextile",
      partnerSigns: "Aries, Leo",
      strength: "⭐⭐⭐⭐",
      notes: "High energy and creativity; lots of flirting and fun. Needs some grounding for long-term."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Sagittarius",
      strength: "⭐⭐⭐⭐",
      notes: "Big-picture axis; travel, ideas, growth. Can be amazing if both respect each other's freedom."
    },
    {
      pattern: "Mutable square (scattered friction)",
      partnerSigns: "Virgo, Pisces",
      strength: "⭐⭐",
      notes: "Confusing or inconsistent; very different ways of processing life and feelings."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Scorpio, Capricorn",
      strength: "⭐⭐",
      notes: "Gemini's lightness vs their depth/seriousness; can feel mismatched in priorities."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Taurus, Cancer",
      strength: "⭐⭐⭐",
      notes: "Sweet at times but different speeds; better with strong supporting factors."
    }
  ],
  Cancer: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Cancer",
      strength: "⭐⭐⭐",
      notes: "Very nurturing and emotional; can become over-sensitive or stuck in comfort zones."
    },
    {
      pattern: "Water trine (same element)",
      partnerSigns: "Scorpio, Pisces",
      strength: "⭐⭐⭐⭐⭐",
      notes: "Deep, emotionally rich bonds; strong intuition and soul-level connection, great for long-term."
    },
    {
      pattern: "Water–Earth sextile",
      partnerSigns: "Taurus, Virgo",
      strength: "⭐⭐⭐⭐",
      notes: "Warm, stable and practical. Earth signs give structure; Cancer brings heart and care."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Capricorn",
      strength: "⭐⭐⭐⭐",
      notes: "Home vs career axis; can build a powerful life if feelings and responsibilities are balanced."
    },
    {
      pattern: "Cardinal square (mood clashes)",
      partnerSigns: "Aries, Libra",
      strength: "⭐⭐",
      notes: "Emotional needs vs action or social focus; frequent misunderstandings unless both are patient."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Aquarius, Sagittarius",
      strength: "⭐⭐",
      notes: "Very different emotional languages; Cancer can feel unsafe, other feels held back."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Gemini, Leo",
      strength: "⭐⭐⭐",
      notes: "Can be loving but inconsistent; works best when both consciously support each other's needs."
    }
  ],
  Leo: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Leo",
      strength: "⭐⭐⭐",
      notes: "Big personalities, romance and drama. Great when mutual respect exists; ego clashes otherwise."
    },
    {
      pattern: "Fire trine (same element)",
      partnerSigns: "Aries, Sagittarius",
      strength: "⭐⭐⭐⭐⭐",
      notes: "Passionate, adventurous, lively. Strong attraction and shared enthusiasm for life."
    },
    {
      pattern: "Fire–Air sextile",
      partnerSigns: "Gemini, Libra",
      strength: "⭐⭐⭐⭐",
      notes: "Charming, social, fun. Air feeds Leo's fire and attention needs; good for romance and play."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Aquarius",
      strength: "⭐⭐⭐⭐",
      notes: "Heart vs mind axis; strong fated feeling. Can make iconic couples if they respect differences."
    },
    {
      pattern: "Fixed square (pride clashes)",
      partnerSigns: "Taurus, Scorpio",
      strength: "⭐⭐",
      notes: "Intense but stubborn; power struggles over loyalty, desires and control."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Capricorn, Pisces",
      strength: "⭐⭐",
      notes: "Different motivations; Leo seeks recognition, other seeks security or transcendence."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Cancer, Virgo",
      strength: "⭐⭐⭐",
      notes: "Warm but uneven; requires effort to balance Leo's drama with partner's style."
    }
  ],
  Virgo: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Virgo",
      strength: "⭐⭐⭐",
      notes: "Loyal, practical, service-oriented. Can become critical or overly focused on problems."
    },
    {
      pattern: "Earth trine (same element)",
      partnerSigns: "Taurus, Capricorn",
      strength: "⭐⭐⭐⭐⭐",
      notes: "Excellent for building a stable life; shared values around work, health, and consistency."
    },
    {
      pattern: "Earth–Water sextile",
      partnerSigns: "Cancer, Scorpio",
      strength: "⭐⭐⭐⭐",
      notes: "Emotional depth + practicality. Water brings feeling, Virgo organises and supports."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Pisces",
      strength: "⭐⭐⭐⭐",
      notes: "Logic vs faith; can be deeply healing and romantic, or confusing if boundaries are weak."
    },
    {
      pattern: "Mutable square (mental friction)",
      partnerSigns: "Gemini, Sagittarius",
      strength: "⭐⭐",
      notes: "Very different views on order vs freedom; can feel like constant adjustment and critique."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Aries, Aquarius",
      strength: "⭐⭐",
      notes: "Different pacing and priorities; one wants structure, the other innovation or action."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Leo, Libra",
      strength: "⭐⭐⭐",
      notes: "Some shared interests, but misaligned expectations; works with conscious effort."
    }
  ],
  Libra: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Libra",
      strength: "⭐⭐⭐",
      notes: "Very relationship-oriented; charming and social. Can avoid conflict or people-please too much."
    },
    {
      pattern: "Air trine (same element)",
      partnerSigns: "Gemini, Aquarius",
      strength: "⭐⭐⭐⭐⭐",
      notes: "Top matches: shared communication, ideas, and social style. Great for modern partnerships."
    },
    {
      pattern: "Air–Fire sextile",
      partnerSigns: "Leo, Sagittarius",
      strength: "⭐⭐⭐⭐",
      notes: "Fun, romantic, energising; Fire brings passion, Libra adds charm and cooperation."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Aries",
      strength: "⭐⭐⭐⭐",
      notes: "Self vs partnership axis; electric but needs balance. Strong attraction, can be long-term if equal."
    },
    {
      pattern: "Cardinal square (tension around decisions)",
      partnerSigns: "Cancer, Capricorn",
      strength: "⭐⭐",
      notes: "Different approaches to security and responsibility; can feel like pulling in different directions."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Taurus, Pisces",
      strength: "⭐⭐",
      notes: "Values may align partially, but emotional style and decisiveness often mismatch."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Virgo, Scorpio",
      strength: "⭐⭐⭐",
      notes: "Interesting but layered; may learn a lot, works best with emotional honesty."
    }
  ],
  Scorpio: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Scorpio",
      strength: "⭐⭐⭐",
      notes: "Extremely intense; deep obsession and loyalty, but can be heavy and combustible."
    },
    {
      pattern: "Water trine (same element)",
      partnerSigns: "Cancer, Pisces",
      strength: "⭐⭐⭐⭐⭐",
      notes: "Very deep emotional + spiritual bonds; great for soulmates if both heal their shadows."
    },
    {
      pattern: "Water–Earth sextile",
      partnerSigns: "Virgo, Capricorn",
      strength: "⭐⭐⭐⭐",
      notes: "Strong for long-term: stability plus depth. Earth supports Scorpio's ambitions and security needs."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Taurus",
      strength: "⭐⭐⭐⭐",
      notes: "Desire vs stability axis; highly sensual and bonding, but power/control themes are big."
    },
    {
      pattern: "Fixed square (intense friction)",
      partnerSigns: "Leo, Aquarius",
      strength: "⭐⭐",
      notes: "Strong chemistry, but ego vs depth and freedom vs intensity can clash hard."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Aries, Gemini",
      strength: "⭐⭐",
      notes: "Different style of passion; Scorpio wants depth, the other wants speed or variety."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Libra, Sagittarius",
      strength: "⭐⭐⭐",
      notes: "Interesting growth, but requires mutual respect and space to avoid explosions."
    }
  ],
  Sagittarius: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Sagittarius",
      strength: "⭐⭐⭐",
      notes: "Adventurous, optimistic, restless; great fun, but commitment must be conscious."
    },
    {
      pattern: "Fire trine (same element)",
      partnerSigns: "Aries, Leo",
      strength: "⭐⭐⭐⭐⭐",
      notes: "High passion, fun and bold life plans. Excellent for big adventures and shared projects."
    },
    {
      pattern: "Fire–Air sextile",
      partnerSigns: "Libra, Aquarius",
      strength: "⭐⭐⭐⭐",
      notes: "Smart, social and future-oriented; lots of ideas, travel, and open-minded connection."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Gemini",
      strength: "⭐⭐⭐⭐",
      notes: "Local vs global, detail vs vision; exciting partnerships with mutual freedom and honesty."
    },
    {
      pattern: "Mutable square (inconsistent friction)",
      partnerSigns: "Virgo, Pisces",
      strength: "⭐⭐",
      notes: "Can be directionless or messy; conflicting approaches to responsibility and truth."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Cancer, Taurus",
      strength: "⭐⭐",
      notes: "Security vs freedom tension; can feel like one always wants more change than the other."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Scorpio, Capricorn",
      strength: "⭐⭐⭐",
      notes: "Stabilising but sometimes restrictive; works if Sagittarius values the grounding."
    }
  ],
  Capricorn: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Capricorn",
      strength: "⭐⭐⭐",
      notes: "Serious, loyal, hardworking. Can become all duty, no play, unless both prioritise joy."
    },
    {
      pattern: "Earth trine (same element)",
      partnerSigns: "Taurus, Virgo",
      strength: "⭐⭐⭐⭐⭐",
      notes: "Best for building a life: shared practicality, respect, and long-term focus."
    },
    {
      pattern: "Earth–Water sextile",
      partnerSigns: "Scorpio, Pisces",
      strength: "⭐⭐⭐⭐",
      notes: "Emotional depth + ambition or structure; good for long-term if both respect each other's style."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Cancer",
      strength: "⭐⭐⭐⭐",
      notes: "Home vs career axis; classic long-term pairing if work–family balance is honoured."
    },
    {
      pattern: "Cardinal square (control friction)",
      partnerSigns: "Aries, Libra",
      strength: "⭐⭐",
      notes: "Clashes over pace, risk and fairness; requires maturity and compromise."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Leo, Gemini",
      strength: "⭐⭐",
      notes: "Different aims; Capricorn may see them as frivolous, they see Capricorn as heavy."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Sagittarius, Aquarius",
      strength: "⭐⭐⭐",
      notes: "Can balance each other if values align; freedom vs responsibility themes strong."
    }
  ],
  Aquarius: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Aquarius",
      strength: "⭐⭐⭐",
      notes: "Huge mental rapport and shared values, but can lack warmth or emotional glue without other chart support."
    },
    {
      pattern: "Air trine (same element)",
      partnerSigns: "Gemini, Libra",
      strength: "⭐⭐⭐⭐⭐",
      notes: "Easiest overall: same Air element, strong friendship + romance; great for modern, flexible relationships."
    },
    {
      pattern: "Air–Fire sextile",
      partnerSigns: "Aries, Sagittarius",
      strength: "⭐⭐⭐⭐",
      notes: "Lively, adventurous and future-focused. Great spark and mutual inspiration."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Leo",
      strength: "⭐⭐⭐⭐",
      notes: "Big attraction and growth; iconic when egos and freedom are handled well."
    },
    {
      pattern: "Fixed square (stubborn friction)",
      partnerSigns: "Taurus, Scorpio",
      strength: "⭐⭐",
      notes: "Strong attraction, but clashing needs around depth, freedom and security."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Cancer, Virgo",
      strength: "⭐⭐",
      notes: "Emotions vs logic and different life priorities; often feels mismatched without extra support."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Capricorn, Pisces",
      strength: "⭐⭐⭐",
      notes: "Can work if other chart factors help; Capricorn grounds, Pisces softens, but not \"easy mode\"."
    }
  ],
  Pisces: [
    {
      pattern: "Same sign (strong mirror)",
      partnerSigns: "Pisces",
      strength: "⭐⭐⭐",
      notes: "Very sensitive and dreamy; romantic but can be chaotic or avoidant without grounding."
    },
    {
      pattern: "Water trine (same element)",
      partnerSigns: "Cancer, Scorpio",
      strength: "⭐⭐⭐⭐⭐",
      notes: "Deep emotional and spiritual connection; often feels fated or soulmate-like."
    },
    {
      pattern: "Water–Earth sextile",
      partnerSigns: "Taurus, Capricorn",
      strength: "⭐⭐⭐⭐",
      notes: "Earth provides structure and safety, Pisces brings heart and imagination; strong for home/family."
    },
    {
      pattern: "Opposite sign (polarity spark)",
      partnerSigns: "Virgo",
      strength: "⭐⭐⭐⭐",
      notes: "Service and sacrifice axis; can be healing and supportive, but needs boundaries and clarity."
    },
    {
      pattern: "Mutable square (diffuse friction)",
      partnerSigns: "Gemini, Sagittarius",
      strength: "⭐⭐",
      notes: "Different truths and needs; inspiring but unreliable unless there's strong commitment elsewhere."
    },
    {
      pattern: "Quincunx (awkward adjustment)",
      partnerSigns: "Leo, Libra",
      strength: "⭐⭐",
      notes: "Pisces' sensitivity vs their focus on image or social harmony; misunderstandings likely."
    },
    {
      pattern: "Semi-sextile / mixed",
      partnerSigns: "Aquarius, Aries",
      strength: "⭐⭐⭐",
      notes: "Can be stimulating but uneven; works best when spiritual/emotional goals are shared."
    }
  ]
}

export function SunSignCompatibilityTable({ sign }: { sign: WesternSign }) {
  const { theme } = useTheme()
  
  const rows: CompatibilityRow[] = compatibilityData[sign] || []
  
  return (
    <div className="mt-8">
      <h2 className={`text-xl font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
        Compatibility Summary
      </h2>
      <div className={`overflow-x-auto rounded-lg ${theme === "light" ? "bg-gray-50" : "bg-slate-800/40"}`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${theme === "light" ? "bg-gray-100 border-b border-gray-200" : "bg-slate-700/50 border-b border-slate-600"}`}>
              <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === "light" ? "text-gray-700" : "text-white/90"}`}>
                Pattern
              </th>
              <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === "light" ? "text-gray-700" : "text-white/90"}`}>
                Partner Sign(s)
              </th>
              <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === "light" ? "text-gray-700" : "text-white/90"}`}>
                Stars
              </th>
              <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === "light" ? "text-gray-700" : "text-white/90"}`}>
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr 
                key={index}
                className={`${theme === "light" ? "border-b border-gray-200 hover:bg-gray-100" : "border-b border-slate-700 hover:bg-slate-700/30"}`}
              >
                <td className={`px-4 py-3 text-sm ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
                  {row.pattern}
                </td>
                <td className={`px-4 py-3 text-sm ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
                  {row.partnerSigns}
                </td>
                <td className={`px-4 py-3 text-sm ${theme === "light" ? "text-gray-800" : "text-white/80"}`}>
                  {row.strength}
                </td>
                <td className={`px-4 py-3 text-sm ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
                  {row.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

