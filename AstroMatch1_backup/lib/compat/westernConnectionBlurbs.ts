// westernConnectionBlurbs.ts
// Western zodiac connection blurbs for the connection box
// Key format: "UserA-UserB" with blurb written from UserA's perspective

export type WestSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

// We key by "A-B" so the blurb can be written with User A first.
export type WestPairKey = `${WestSign}-${WestSign}`;

export const WESTERN_CONNECTION_BLURBS: Record<WestPairKey, string> = {
  // ARIES AS A ▼
  "Aries-Aries":
    "Very direct pairing with strong drive. Energetic, competitive, and quick to act.",
  "Aries-Taurus":
    "Action meets patience. Determined, physical, and focused on getting concrete results.",
  "Aries-Gemini":
    "Fast-moving and changeable. Curious, impulsive, and full of ideas and side tracks.",
  "Aries-Cancer":
    "Fire meets feeling. Protective, reactive, and sensitive to tone and emotional safety.",
  "Aries-Leo":
    "Big, expressive energy. Confident, bold, and drawn to fun and visibility.",
  "Aries-Virgo":
    "Impulse meets analysis. Practical, busy, and focused on fixing problems and moving things forward.",
  "Aries-Libra":
    "Self-focus meets focus on the other. Social, reactive, and concerned with fairness and honesty.",
  "Aries-Scorpio":
    "Strong-willed on both sides. Intense, passionate, and not inclined to back down easily.",
  "Aries-Sagittarius":
    "Restless and adventurous. Straightforward, enthusiastic, and drawn to movement and new experiences.",
  "Aries-Capricorn":
    "Drive meets discipline. Ambitious, serious, and focused on long-term goals and achievement.",
  "Aries-Aquarius":
    "Action joins vision. Independent, unconventional, and interested in change and new directions.",
  "Aries-Pisces":
    "Fire and water mix in a sensitive way. Brave, impressionable, and responsive to emotion and inspiration.",

  // TAURUS AS A ▼
  "Taurus-Aries":
    "Steadiness meets speed. Determined, physical, and sometimes stubborn about pace and change.",
  "Taurus-Taurus":
    "Slow, consistent connection. Patient, loyal, and focused on comfort and security.",
  "Taurus-Gemini":
    "Earth meets air. Practical, curious, and focused on both information and tangible results.",
  "Taurus-Cancer":
    "Nurturing and protective. Warm, home-oriented, and concerned with safety and continuity.",
  "Taurus-Leo":
    "Pride and presence on both sides. Steady, expressive, and responsive to loyalty and respect.",
  "Taurus-Virgo":
    "Grounded, detail-aware pairing. Practical, reliable, and good at building routines that work.",
  "Taurus-Libra":
    "Comfort meets aesthetics. Charming, social, and drawn to beauty, ease, and pleasant environments.",
  "Taurus-Scorpio":
    "Intensity under calm surfaces. Deep, private, and strong on commitment and control.",
  "Taurus-Sagittarius":
    "Stability meets exploration. Honest, physical, and sometimes pulled between routine and change.",
  "Taurus-Capricorn":
    "Very grounded pairing. Responsible, persistent, and focused on long-term plans and structure.",
  "Taurus-Aquarius":
    "Fixed Earth meets fixed Air. Independent, stubborn, and slow to change course once decided.",
  "Taurus-Pisces":
    "Practical care meets emotional depth. Gentle, consistent, and responsive to mood and reassurance.",

  // GEMINI AS A ▼
  "Gemini-Aries":
    "Quick, lively connection. Curious, impulsive, and drawn to new topics and experiences.",
  "Gemini-Taurus":
    "Ideas meet stability. Practical, talkative, and able to combine planning with follow-through.",
  "Gemini-Gemini":
    "Mind-focused pairing. Verbal, adaptable, and easily distracted by options and possibilities.",
  "Gemini-Cancer":
    "Thought meets feeling. Sensitive, responsive, and influenced by communication style and tone.",
  "Gemini-Leo":
    "Bright, social energy. Playful, expressive, and attracted to attention and creativity.",
  "Gemini-Virgo":
    "Both ruled by Mercury. Analytical, busy, and focused on details, facts, and daily tasks.",
  "Gemini-Libra":
    "Air meets air. Social, mentally active, and drawn to conversation, ideas, and connection.",
  "Gemini-Scorpio":
    "Light curiosity meets depth. Intense, probing, and attentive to motives and subtext.",
  "Gemini-Sagittarius":
    "Opposite signs with a shared love of learning. Restless, open-minded, and drawn to exploration.",
  "Gemini-Capricorn":
    "Thought meets structure. Practical, strategic, and focused on planning and execution.",
  "Gemini-Aquarius":
    "Very mental and idea-driven. Communicative, inventive, and oriented toward the future.",
  "Gemini-Pisces":
    "Mind meets imagination. Subtle, changeable, and influenced by mood, story, and inspiration.",

  // CANCER AS A ▼
  "Cancer-Aries":
    "Feeling meets direct action. Protective, reactive, and sensitive to conflict and tone.",
  "Cancer-Taurus":
    "Comfort-focused and steady. Caring, loyal, and oriented toward home, security, and routine.",
  "Cancer-Gemini":
    "Emotion meets thought. Responsive, changeable, and influenced by conversation and reassurance.",
  "Cancer-Cancer":
    "Strong emotional current. Nurturing, intuitive, and easily affected by atmosphere and trust.",
  "Cancer-Leo":
    "Care meets pride. Warm, generous, and responsive to attention, loyalty, and appreciation.",
  "Cancer-Virgo":
    "Supportive and practical. Helpful, attentive, and focused on care, health, and everyday needs.",
  "Cancer-Libra":
    "Relational focus is strong. Sensitive, diplomatic, and concerned with harmony and fairness.",
  "Cancer-Scorpio":
    "Deep water pairing. Intense, private, and tuned to emotional truth and loyalty.",
  "Cancer-Sagittarius":
    "Feeling meets freedom. Honest, reactive, and balancing security with space and exploration.",
  "Cancer-Capricorn":
    "Opposite signs. Emotional depth meets structure and duty; serious, committed, and long-term focused.",
  "Cancer-Aquarius":
    "Emotion meets detachment. Caring, thoughtful, and influenced by how space and closeness are balanced.",
  "Cancer-Pisces":
    "Water meets water. Gentle, intuitive, and responsive to emotional nuance and unspoken signals.",

  // LEO AS A ▼
  "Leo-Aries":
    "Fire meets fire. Bold, energetic, and drawn to action, recognition, and enthusiasm.",
  "Leo-Taurus":
    "Pride meets steadiness. Loyal, expressive, and focused on loyalty, comfort, and respect.",
  "Leo-Gemini":
    "Social and bright. Playful, creative, and drawn to fun, humour, and variety.",
  "Leo-Cancer":
    "Warm and protective. Generous, emotional, and sensitive to attention and care.",
  "Leo-Leo":
    "Strong presence on both sides. Dramatic, proud, and highly aware of image and appreciation.",
  "Leo-Virgo":
    "Expression meets refinement. Helpful, organised, and interested in improvement and presentation.",
  "Leo-Libra":
    "Charm and style are central. Romantic, social, and focused on aesthetics, balance, and connection.",
  "Leo-Scorpio":
    "Pride meets intensity. Magnetic, private, and concerned with loyalty, power, and trust.",
  "Leo-Sagittarius":
    "Big-hearted fire pairing. Adventurous, optimistic, and drawn to movement, growth, and experience.",
  "Leo-Capricorn":
    "Status and structure matter. Ambitious, serious, and focused on achievement and reputation.",
  "Leo-Aquarius":
    "Opposite signs with strong individuality. Independent, noticeable, and oriented toward ideals and authenticity.",
  "Leo-Pisces":
    "Fire meets sensitivity. Creative, emotional, and responsive to inspiration, fantasy, and mood.",

  // VIRGO AS A ▼
  "Virgo-Aries":
    "Action meets analysis. Busy, practical, and focused on solving problems and refining systems.",
  "Virgo-Taurus":
    "Earth meets earth. Reliable, detail-aware, and good at managing daily life and responsibilities.",
  "Virgo-Gemini":
    "Both are mentally active. Analytical, adaptable, and focused on information, tasks, and details.",
  "Virgo-Cancer":
    "Practical care meets emotional care. Supportive, attentive, and tuned to needs and small signals.",
  "Virgo-Leo":
    "Refinement meets expression. Helpful, organised, and interested in improvement and presentation.",
  "Virgo-Virgo":
    "Very detail-focused. Precise, careful, and concerned with health, work, and daily structure.",
  "Virgo-Libra":
    "Practical meets social. Polite, thoughtful, and concerned with fairness, organisation, and tone.",
  "Virgo-Scorpio":
    "Depth meets analysis. Private, intense, and focused on accuracy, motives, and long-term outcomes.",
  "Virgo-Sagittarius":
    "Order meets openness. Honest, thoughtful, and balancing planning with freedom and exploration.",
  "Virgo-Capricorn":
    "Strong earth pairing. Responsible, hardworking, and serious about goals and commitments.",
  "Virgo-Aquarius":
    "Analysis meets innovation. Logical, future-focused, and interested in systems and ideas that work better.",
  "Virgo-Pisces":
    "Opposite signs. Practical detail meets feeling and imagination; sensitive, changeable, and responsive to balance between order and flow.",

  // LIBRA AS A ▼
  "Libra-Aries":
    "Self-focus meets focus on the other. Active, social, and concerned with fairness and honesty.",
  "Libra-Taurus":
    "Comfort and aesthetics align. Pleasant, steady, and drawn to beauty, ease, and shared pleasures.",
  "Libra-Gemini":
    "Air meets air. Communicative, social, and interested in people, conversation, and ideas.",
  "Libra-Cancer":
    "Harmony meets emotion. Gentle, diplomatic, and focused on security and relationship balance.",
  "Libra-Leo":
    "Charm meets showmanship. Romantic, expressive, and attentive to style, love, and attention.",
  "Libra-Virgo":
    "Social meets practical. Considerate, orderly, and focused on doing things fairly and properly.",
  "Libra-Libra":
    "Strong relational focus. Polite, cooperative, and concerned with balance, mutuality, and atmosphere.",
  "Libra-Scorpio":
    "Soft surface with depth underneath. Intense, private, and alert to power, attraction, and boundaries.",
  "Libra-Sagittarius":
    "Light but principled. Honest, outgoing, and interested in ideas, ethics, and experiences.",
  "Libra-Capricorn":
    "Charm meets structure. Controlled, composed, and focused on responsibility, image, and long-term plans.",
  "Libra-Aquarius":
    "Social and idealistic. Friendly, conceptual, and oriented toward people, networks, and shared ideals.",
  "Libra-Pisces":
    "Relational and sensitive. Gentle, artistic, and responsive to mood, empathy, and subtle signals.",

  // SCORPIO AS A ▼
  "Scorpio-Aries":
    "Intensity meets directness. Passionate, reactive, and strong-willed when it matters.",
  "Scorpio-Taurus":
    "Fixed water meets fixed earth. Deep, steady, and focused on loyalty, resources, and control.",
  "Scorpio-Gemini":
    "Depth meets curiosity. Probing, analytical, and aware of what lies beneath words.",
  "Scorpio-Cancer":
    "Water meets water. Deep, intuitive, and highly responsive to emotional truth and trust.",
  "Scorpio-Leo":
    "Intensity meets pride. Charismatic, private, and focused on loyalty, respect, and power dynamics.",
  "Scorpio-Virgo":
    "Analysis goes deep here. Serious, precise, and concerned with accuracy, health, and long-term outcomes.",
  "Scorpio-Libra":
    "Charm on the surface, depth below. Magnetic, strategic, and alert to attraction and boundaries.",
  "Scorpio-Scorpio":
    "Very focused, very intense. Private, loyal, and unlikely to do anything halfway.",
  "Scorpio-Sagittarius":
    "Passion meets blunt honesty. Candid, searching, and drawn to big questions and experiences.",
  "Scorpio-Capricorn":
    "Strong, disciplined pairing. Controlled, determined, and focused on goals, survival, and structure.",
  "Scorpio-Aquarius":
    "Intensity meets distance. Independent, complex, and engaged with power, ideals, and truth.",
  "Scorpio-Pisces":
    "Deep emotional current. Compassionate, private, and tuned in to unspoken feelings.",

  // SAGITTARIUS AS A ▼
  "Sagittarius-Aries":
    "Fire meets fire. Energetic, straightforward, and drawn to action, honesty, and adventure.",
  "Sagittarius-Taurus":
    "Freedom meets stability. Honest, physical, and balancing comfort with exploration and growth.",
  "Sagittarius-Gemini":
    "Opposite signs with a shared love of learning. Restless, curious, and drawn to ideas, stories, and travel.",
  "Sagittarius-Cancer":
    "Directness meets sensitivity. Warm, reactive, and influenced by honesty, safety, and emotional tone.",
  "Sagittarius-Leo":
    "Open and enthusiastic. Big-hearted, playful, and drawn to fun, creativity, and self-expression.",
  "Sagittarius-Virgo":
    "Expansion meets detail. Honest, thoughtful, and trying to combine big views with practical steps.",
  "Sagittarius-Libra":
    "Social and open. Friendly, idealistic, and interested in people, justice, and shared experiences.",
  "Sagittarius-Scorpio":
    "Fire meets depth. Intense, direct, and pulled toward truth, meaning, and strong experiences.",
  "Sagittarius-Sagittarius":
    "Very free-spirited pairing. Optimistic, restless, and drawn to movement, learning, and independence.",
  "Sagittarius-Capricorn":
    "Vision meets structure. Serious, goal-focused, and concerned with purpose, work, and results.",
  "Sagittarius-Aquarius":
    "Independent and future-focused. Idealistic, open-minded, and interested in change, ideas, and freedom.",
  "Sagittarius-Pisces":
    "Fire and water with a dreamy edge. Imaginative, searching, and influenced by belief, story, and feeling.",

  // CAPRICORN AS A ▼
  "Capricorn-Aries":
    "Initiative meets endurance. Ambitious, serious, and focused on goals and real-world outcomes.",
  "Capricorn-Taurus":
    "Strong earth pairing. Practical, persistent, and concerned with security and long-term plans.",
  "Capricorn-Gemini":
    "Structure meets flexibility. Strategic, thoughtful, and focused on using information effectively.",
  "Capricorn-Cancer":
    "Opposite signs. Duty and structure meet care and emotion; committed, serious, and long-range.",
  "Capricorn-Leo":
    "Status and presence matter. Proud, responsible, and focused on reputation, achievement, and loyalty.",
  "Capricorn-Virgo":
    "Grounded and efficient. Organised, hardworking, and serious about responsibilities and standards.",
  "Capricorn-Libra":
    "Control meets diplomacy. Composed, measured, and focused on fairness, image, and balance.",
  "Capricorn-Scorpio":
    "Disciplined and intense. Reserved, determined, and focused on power, survival, and strategy.",
  "Capricorn-Sagittarius":
    "Vision meets realism. Honest, philosophical, and concerned with purpose, work, and direction.",
  "Capricorn-Capricorn":
    "Very serious pairing. Responsible, structured, and strongly focused on duty and achievement.",
  "Capricorn-Aquarius":
    "Earth meets air in a future-oriented way. Independent, strategic, and focused on systems, work, and change.",
  "Capricorn-Pisces":
    "Practicality meets sensitivity. Quiet, thoughtful, and concerned with security, purpose, and emotional undercurrents.",

  // AQUARIUS AS A ▼
  "Aquarius-Aries":
    "Action joins vision. Independent, direct, and oriented toward change and new approaches.",
  "Aquarius-Taurus":
    "Fixed Air meets fixed Earth. Stubborn, thoughtful, and slow to change views or direction.",
  "Aquarius-Gemini":
    "Air meets air. Communicative, curious, and mentally lively together.",
  "Aquarius-Cancer":
    "Head meets heart. Caring, principled, and sensitive to how feelings and logic are balanced.",
  "Aquarius-Leo":
    "Opposite signs with strong individuality. Noticeable, expressive, and focused on authenticity and self-respect.",
  "Aquarius-Virgo":
    "Ideas meet refinement. Analytical, future-focused, and interested in systems that work better.",
  "Aquarius-Libra":
    "Social and idealistic. Friendly, conceptual, and engaged with people, networks, and fairness.",
  "Aquarius-Scorpio":
    "Intensity meets detachment. Complex, private, and concerned with truth, power, and integrity.",
  "Aquarius-Sagittarius":
    "Open and forward-looking. Honest, independent, and drawn to ideas, freedom, and exploration.",
  "Aquarius-Capricorn":
    "Vision meets structure. Strategic, composed, and focused on plans, work, and long-term change.",
  "Aquarius-Aquarius":
    "Strong emphasis on independence and ideals. Detached, thoughtful, and oriented toward causes, concepts, and personal space.",
  "Aquarius-Pisces":
    "Logic meets feeling. Subtle, imaginative, and concerned with meaning, morality, and emotional impact.",

  // PISCES AS A ▼
  "Pisces-Aries":
    "Sensitivity meets directness. Emotional, reactive, and influenced by inspiration and tone.",
  "Pisces-Taurus":
    "Water meets earth. Gentle, steady, and focused on comfort, care, and stability.",
  "Pisces-Gemini":
    "Feeling meets thought. Changeable, impressionable, and influenced by stories, ideas, and conversation.",
  "Pisces-Cancer":
    "Water with water. Deeply intuitive, caring, and responsive to emotional atmosphere.",
  "Pisces-Leo":
    "Dreamy meets expressive. Creative, romantic, and sensitive to recognition and affection.",
  "Pisces-Virgo":
    "Opposite signs. Imagination meets detail; gentle, practical, and influenced by balance between order and flow.",
  "Pisces-Libra":
    "Relationship-focused and sensitive. Kind, artistic, and tuned to mood, beauty, and connection.",
  "Pisces-Scorpio":
    "Depth with depth. Intense, private, and strongly moved by trust, honesty, and emotional truth.",
  "Pisces-Sagittarius":
    "Belief and imagination combine. Idealistic, searching, and drawn to meaning, story, and possibility.",
  "Pisces-Capricorn":
    "Feeling meets structure. Quiet, careful, and focused on security, purpose, and emotional responsibility.",
  "Pisces-Aquarius":
    "Emotion meets principle. Subtle, reflective, and concerned with compassion, ethics, and vision.",
  "Pisces-Pisces":
    "Very porous pairing. Soft, empathic, and easily influenced by environment and emotional climate.",
} as const;

/**
 * Get the Western connection blurb for a given pair,
 * always written with userA's sign first.
 */
export function getWesternConnectionBlurb(
  signA: WestSign,
  signB: WestSign
): string | null {
  const key = `${signA}-${signB}` as WestPairKey;
  return WESTERN_CONNECTION_BLURBS[key] ?? null;
}

