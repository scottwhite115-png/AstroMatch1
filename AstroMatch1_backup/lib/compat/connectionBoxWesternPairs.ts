// connectionBoxWesternPairs.ts
// Short, modern Western zodiac compatibility blurbs for connection box

export type WestSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type WestPairKey = `${WestSign}-${WestSign}`;

export type ConnectionBoxWestBlurb = {
  shortLabel: string;    // e.g. "Logic and feeling"
  description: string;   // short West line
};

export const CONNECTION_BOX_WEST: Record<WestPairKey, ConnectionBoxWestBlurb> = {
  "Aries-Aries": {
    shortLabel: "Very direct pairing",
    description: "Very direct pairing with strong drive. Energetic, competitive, and quick to act.",
  },
  "Aries-Taurus": {
    shortLabel: "Action meets patience",
    description: "Action meets patience. Determined, physical, and focused on getting concrete results.",
  },
  "Aries-Gemini": {
    shortLabel: "Fast-moving and changeable",
    description: "Fast-moving and changeable. Curious, impulsive, and full of ideas and side tracks.",
  },
  "Aries-Cancer": {
    shortLabel: "Fire meets feeling",
    description: "Fire meets feeling. Protective, reactive, and sensitive to tone and emotional safety.",
  },
  "Aries-Leo": {
    shortLabel: "Big, expressive energy",
    description: "Big, expressive energy. Confident, bold, and drawn to fun and visibility.",
  },
  "Aries-Virgo": {
    shortLabel: "Impulse meets analysis",
    description: "Impulse meets analysis. Practical, busy, and focused on fixing problems and moving things forward.",
  },
  "Aries-Libra": {
    shortLabel: "Self-focus meets focus on the other",
    description: "Self-focus meets focus on the other. Social, reactive, and concerned with fairness and honesty.",
  },
  "Aries-Scorpio": {
    shortLabel: "Strong-willed on both sides",
    description: "Strong-willed on both sides. Intense, passionate, and not inclined to back down easily.",
  },
  "Aries-Sagittarius": {
    shortLabel: "Restless and adventurous",
    description: "Restless and adventurous. Straightforward, enthusiastic, and drawn to movement and new experiences.",
  },
  "Aries-Capricorn": {
    shortLabel: "Drive meets discipline",
    description: "Drive meets discipline. Ambitious, serious, and focused on long-term goals and achievement.",
  },
  "Aries-Aquarius": {
    shortLabel: "Action joins vision",
    description: "Action joins vision. Independent, unconventional, and interested in change and new directions.",
  },
  "Aries-Pisces": {
    shortLabel: "Fire and water mix sensitively",
    description: "Fire and water mix in a sensitive way. Brave, impressionable, and responsive to emotion and inspiration.",
  },
  "Taurus-Taurus": {
    shortLabel: "Slow, consistent connection",
    description: "Slow, consistent connection. Patient, loyal, and focused on comfort and security.",
  },
  "Gemini-Taurus": {
    shortLabel: "Earth meets air",
    description: "Earth meets air. Practical, curious, and focused on both information and tangible results.",
  },
  "Cancer-Taurus": {
    shortLabel: "Nurturing and protective",
    description: "Nurturing and protective. Warm, home-oriented, and concerned with safety and continuity.",
  },
  "Leo-Taurus": {
    shortLabel: "Pride and presence",
    description: "Pride and presence on both sides. Steady, expressive, and responsive to loyalty and respect.",
  },
  "Taurus-Virgo": {
    shortLabel: "Grounded, detail-aware pairing",
    description: "Grounded, detail-aware pairing. Practical, reliable, and good at building routines that work.",
  },
  "Libra-Taurus": {
    shortLabel: "Comfort meets aesthetics",
    description: "Comfort meets aesthetics. Charming, social, and drawn to beauty, ease, and pleasant environments.",
  },
  "Scorpio-Taurus": {
    shortLabel: "Intensity under calm surfaces",
    description: "Intensity under calm surfaces. Deep, private, and strong on commitment and control.",
  },
  "Sagittarius-Taurus": {
    shortLabel: "Stability meets exploration",
    description: "Stability meets exploration. Honest, physical, and sometimes pulled between routine and change.",
  },
  "Capricorn-Taurus": {
    shortLabel: "Very grounded pairing",
    description: "Very grounded pairing. Responsible, persistent, and focused on long-term plans and structure.",
  },
  "Aquarius-Taurus": {
    shortLabel: "Fixed Earth meets fixed Air",
    description: "Fixed Earth meets fixed Air. Independent, stubborn, and slow to change course once decided.",
  },
  "Pisces-Taurus": {
    shortLabel: "Practical care meets emotional depth",
    description: "Practical care meets emotional depth. Gentle, consistent, and responsive to mood and reassurance.",
  },
  "Gemini-Gemini": {
    shortLabel: "Mind-focused pairing",
    description: "Mind-focused pairing. Verbal, adaptable, and easily distracted by options and possibilities.",
  },
  "Cancer-Gemini": {
    shortLabel: "Thought meets feeling",
    description: "Thought meets feeling. Sensitive, responsive, and influenced by communication style and tone.",
  },
  "Gemini-Leo": {
    shortLabel: "Bright, social energy",
    description: "Bright, social energy. Playful, expressive, and attracted to attention and creativity.",
  },
  "Gemini-Virgo": {
    shortLabel: "Both ruled by Mercury",
    description: "Both ruled by Mercury. Analytical, busy, and focused on details, facts, and daily tasks.",
  },
  "Gemini-Libra": {
    shortLabel: "Air meets air",
    description: "Air meets air. Social, mentally active, and drawn to conversation, ideas, and connection.",
  },
  "Gemini-Scorpio": {
    shortLabel: "Light curiosity meets depth",
    description: "Light curiosity meets depth. Intense, probing, and attentive to motives and subtext.",
  },
  "Gemini-Sagittarius": {
    shortLabel: "Opposite signs, shared love of learning",
    description: "Opposite signs with a shared love of learning. Restless, open-minded, and drawn to exploration.",
  },
  "Capricorn-Gemini": {
    shortLabel: "Thought meets structure",
    description: "Thought meets structure. Practical, strategic, and focused on planning and execution.",
  },
  "Aquarius-Gemini": {
    shortLabel: "Very mental and idea-driven",
    description: "Very mental and idea-driven. Communicative, inventive, and oriented toward the future.",
  },
  "Gemini-Pisces": {
    shortLabel: "Mind meets imagination",
    description: "Mind meets imagination. Subtle, changeable, and influenced by mood, story, and inspiration.",
  },
  "Cancer-Cancer": {
    shortLabel: "Strong emotional current",
    description: "Strong emotional current. Nurturing, intuitive, and easily affected by atmosphere and trust.",
  },
  "Cancer-Leo": {
    shortLabel: "Care meets pride",
    description: "Care meets pride. Warm, generous, and responsive to attention, loyalty, and appreciation.",
  },
  "Cancer-Virgo": {
    shortLabel: "Supportive and practical",
    description: "Supportive and practical. Helpful, attentive, and focused on care, health, and everyday needs.",
  },
  "Cancer-Libra": {
    shortLabel: "Relational focus is strong",
    description: "Relational focus is strong. Sensitive, diplomatic, and concerned with harmony and fairness.",
  },
  "Cancer-Scorpio": {
    shortLabel: "Deep water pairing",
    description: "Deep water pairing. Intense, private, and tuned to emotional truth and loyalty.",
  },
  "Cancer-Sagittarius": {
    shortLabel: "Feeling meets freedom",
    description: "Feeling meets freedom. Honest, reactive, and balancing security with space and exploration.",
  },
  "Cancer-Capricorn": {
    shortLabel: "Opposite signs",
    description: "Opposite signs. Emotional depth meets structure and duty; serious, committed, and long-term focused.",
  },
  "Aquarius-Cancer": {
    shortLabel: "Emotion meets detachment",
    description: "Emotion meets detachment. Caring, thoughtful, and influenced by how space and closeness are balanced.",
  },
  "Cancer-Pisces": {
    shortLabel: "Water meets water",
    description: "Water meets water. Gentle, intuitive, and responsive to emotional nuance and unspoken signals.",
  },
  "Leo-Leo": {
    shortLabel: "Strong presence on both sides",
    description: "Strong presence on both sides. Dramatic, proud, and highly aware of image and appreciation.",
  },
  "Leo-Virgo": {
    shortLabel: "Expression meets refinement",
    description: "Expression meets refinement. Helpful, organised, and interested in improvement and presentation.",
  },
  "Leo-Libra": {
    shortLabel: "Charm and style are central",
    description: "Charm and style are central. Romantic, social, and focused on aesthetics, balance, and connection.",
  },
  "Leo-Scorpio": {
    shortLabel: "Pride meets intensity",
    description: "Pride meets intensity. Magnetic, private, and concerned with loyalty, power, and trust.",
  },
  "Leo-Sagittarius": {
    shortLabel: "Big-hearted fire pairing",
    description: "Big-hearted fire pairing. Adventurous, optimistic, and drawn to movement, growth, and experience.",
  },
  "Capricorn-Leo": {
    shortLabel: "Status and structure matter",
    description: "Status and structure matter. Ambitious, serious, and focused on achievement and reputation.",
  },
  "Aquarius-Leo": {
    shortLabel: "Opposite signs with strong individuality",
    description: "Opposite signs with strong individuality. Independent, noticeable, and oriented toward ideals and authenticity.",
  },
  "Leo-Pisces": {
    shortLabel: "Fire meets sensitivity",
    description: "Fire meets sensitivity. Creative, emotional, and responsive to inspiration, fantasy, and mood.",
  },
  "Virgo-Virgo": {
    shortLabel: "Very detail-focused",
    description: "Very detail-focused. Precise, careful, and concerned with health, work, and daily structure.",
  },
  "Libra-Virgo": {
    shortLabel: "Practical meets social",
    description: "Practical meets social. Polite, thoughtful, and concerned with fairness, organisation, and tone.",
  },
  "Scorpio-Virgo": {
    shortLabel: "Depth meets analysis",
    description: "Depth meets analysis. Private, intense, and focused on accuracy, motives, and long-term outcomes.",
  },
  "Sagittarius-Virgo": {
    shortLabel: "Order meets openness",
    description: "Order meets openness. Honest, thoughtful, and balancing planning with freedom and exploration.",
  },
  "Capricorn-Virgo": {
    shortLabel: "Strong earth pairing",
    description: "Strong earth pairing. Responsible, hardworking, and serious about goals and commitments.",
  },
  "Aquarius-Virgo": {
    shortLabel: "Analysis meets innovation",
    description: "Analysis meets innovation. Logical, future-focused, and interested in systems and ideas that work better.",
  },
  "Pisces-Virgo": {
    shortLabel: "Opposite signs",
    description: "Opposite signs. Practical detail meets feeling and imagination; sensitive, changeable, and responsive to balance between order and flow.",
  },
  "Libra-Libra": {
    shortLabel: "Strong relational focus",
    description: "Strong relational focus. Polite, cooperative, and concerned with balance, mutuality, and atmosphere.",
  },
  "Libra-Scorpio": {
    shortLabel: "Soft surface with depth underneath",
    description: "Soft surface with depth underneath. Intense, private, and alert to power, attraction, and boundaries.",
  },
  "Libra-Sagittarius": {
    shortLabel: "Light but principled",
    description: "Light but principled. Honest, outgoing, and interested in ideas, ethics, and experiences.",
  },
  "Capricorn-Libra": {
    shortLabel: "Charm meets structure",
    description: "Charm meets structure. Controlled, composed, and focused on responsibility, image, and long-term plans.",
  },
  "Aquarius-Libra": {
    shortLabel: "Social and idealistic",
    description: "Social and idealistic. Friendly, conceptual, and oriented toward people, networks, and shared ideals.",
  },
  "Libra-Pisces": {
    shortLabel: "Relational and sensitive",
    description: "Relational and sensitive. Gentle, artistic, and responsive to mood, empathy, and subtle signals.",
  },
  "Scorpio-Scorpio": {
    shortLabel: "Very focused, very intense",
    description: "Very focused, very intense. Private, loyal, and unlikely to do anything halfway.",
  },
  "Sagittarius-Scorpio": {
    shortLabel: "Passion meets blunt honesty",
    description: "Passion meets blunt honesty. Candid, searching, and drawn to big questions and experiences.",
  },
  "Capricorn-Scorpio": {
    shortLabel: "Strong, disciplined pairing",
    description: "Strong, disciplined pairing. Controlled, determined, and focused on goals, survival, and structure.",
  },
  "Aquarius-Scorpio": {
    shortLabel: "Intensity meets distance",
    description: "Intensity meets distance. Independent, complex, and engaged with power, ideals, and truth.",
  },
  "Pisces-Scorpio": {
    shortLabel: "Deep emotional current",
    description: "Deep emotional current. Compassionate, private, and tuned in to unspoken feelings.",
  },
  "Sagittarius-Sagittarius": {
    shortLabel: "Very free-spirited pairing",
    description: "Very free-spirited pairing. Optimistic, restless, and drawn to movement, learning, and independence.",
  },
  "Capricorn-Sagittarius": {
    shortLabel: "Vision meets structure",
    description: "Vision meets structure. Serious, goal-focused, and concerned with purpose, work, and results.",
  },
  "Aquarius-Sagittarius": {
    shortLabel: "Independent and future-focused",
    description: "Independent and future-focused. Idealistic, open-minded, and interested in change, ideas, and freedom.",
  },
  "Pisces-Sagittarius": {
    shortLabel: "Fire and water with a dreamy edge",
    description: "Fire and water with a dreamy edge. Imaginative, searching, and influenced by belief, story, and feeling.",
  },
  "Capricorn-Capricorn": {
    shortLabel: "Very serious pairing",
    description: "Very serious pairing. Responsible, structured, and strongly focused on duty and achievement.",
  },
  "Aquarius-Capricorn": {
    shortLabel: "Earth meets air in a future-oriented way",
    description: "Earth meets air in a future-oriented way. Independent, strategic, and focused on systems, work, and change.",
  },
  "Capricorn-Pisces": {
    shortLabel: "Practicality meets sensitivity",
    description: "Practicality meets sensitivity. Quiet, thoughtful, and concerned with security, purpose, and emotional undercurrents.",
  },
  "Aquarius-Aquarius": {
    shortLabel: "Strong emphasis on independence and ideals",
    description: "Strong emphasis on independence and ideals. Detached, thoughtful, and oriented toward causes, concepts, and personal space.",
  },
  "Aquarius-Pisces": {
    shortLabel: "Logic meets feeling",
    description: "Logic meets feeling. Subtle, imaginative, and concerned with meaning, morality, and emotional impact.",
  },
  "Pisces-Pisces": {
    shortLabel: "Very porous pairing",
    description: "Very porous pairing. Soft, empathic, and easily influenced by environment and emotional climate.",
  },
};

export function getConnectionBoxWest(
  a: WestSign,
  b: WestSign
): ConnectionBoxWestBlurb | null {
  const [x, y] = [a, b].sort() as [WestSign, WestSign];
  const key = `${x}-${y}` as WestPairKey;
  return CONNECTION_BOX_WEST[key] ?? null;
}

