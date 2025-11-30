// connectionBoxChinesePairs.ts
// Short, modern Chinese zodiac compatibility blurbs for connection box

export type ChineseAnimal =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export type ChinesePairKey = `${ChineseAnimal}-${ChineseAnimal}`;

export type ConnectionBoxChineseBlurb = {
  shortLabel: string;    // e.g. "Soft and sharp"
  description: string;   // our short, modern line for the connection box
};

// Use sorted keys (alphabetical) so data is order-agnostic
export const CONNECTION_BOX_CHINESE: Record<ChinesePairKey, ConnectionBoxChineseBlurb> = {
  "Rat-Rat": {
    shortLabel: "Quick and strategic",
    description: "Quick, mentally alert connection with constant discussion and planning. Strategic, curious, and easily absorbed in ideas together.",
  },
  "Ox-Rat": {
    shortLabel: "Ideas meet steadiness",
    description: "Rat brings ideas and movement, while Ox adds patience and stability. Practical, steady, and good at making plans stick.",
  },
  "Rat-Tiger": {
    shortLabel: "Thinking ahead vs. quick action",
    description: "Rat thinks ahead while Tiger moves quickly. Energetic, reactive, and often drawn to taking strong action.",
  },
  "Rabbit-Rat": {
    shortLabel: "Quiet but aware",
    description: "The bond is quiet but aware of details. Thoughtful, cautious, and sensitive to changes in mood.",
  },
  "Dragon-Rat": {
    shortLabel: "Shared push toward progress",
    description: "There is a shared push toward progress. Ambitious, sharp, and interested in results and visible achievement.",
  },
  "Rat-Snake": {
    shortLabel: "Calm surface, active mind",
    description: "Calm surface, active mind. Observant, strategic, and careful about when and how to move.",
  },
  "Horse-Rat": {
    shortLabel: "Lots of activity",
    description: "There is a lot of activity here. Quick, changeable, and often impatient with limits or stagnation.",
  },
  "Goat-Rat": {
    shortLabel: "Practical worry meets emotional depth",
    description: "Practical worry meets emotional depth. Creative, gentle, and responsive to reassurance and tone.",
  },
  "Monkey-Rat": {
    shortLabel: "Quick mental connection",
    description: "Quick mental connection with lots of shared ideas. Witty, playful, and mentally stimulating together.",
  },
  "Rat-Rooster": {
    shortLabel: "Efficiency and detail",
    description: "Efficiency and detail stand out. Organised, critical, and alert to waste or loose ends.",
  },
  "Dog-Rat": {
    shortLabel: "Opportunities vs. risks",
    description: "Rat notices opportunities; Dog notices risks. Serious, loyal, and strongly focused on reliability.",
  },
  "Pig-Rat": {
    shortLabel: "Goodwill meets quick thinking",
    description: "Goodwill meets quick thinking. Warm, generous, and sensitive to tone and intention.",
  },
  "Ox-Ox": {
    shortLabel: "Slow and steady",
    description: "This is a slow, steady pairing that values follow-through over shortcuts. Patient, consistent, and serious about responsibility.",
  },
  "Ox-Tiger": {
    shortLabel: "Change vs. stability",
    description: "Tiger pushes for change; Ox prefers stability. Determined, intense, and sensitive to pressure around control and pace.",
  },
  "Ox-Rabbit": {
    shortLabel: "Steadiness and sensitivity",
    description: "Ox brings steadiness to Rabbit's sensitivity. Calm, careful, and focused on safety and stability.",
  },
  "Dragon-Ox": {
    shortLabel: "Scale and load",
    description: "Dragon sets the scale, Ox carries the load. Determined, enduring, and able to handle big efforts over time.",
  },
  "Ox-Snake": {
    shortLabel: "Slow, considered decisions",
    description: "Both prefer slow, considered decisions. Steady, private, and focused on security and long-term outcomes.",
  },
  "Horse-Ox": {
    shortLabel: "Movement vs. stability",
    description: "Horse wants movement; Ox wants stability. Hardworking, determined, and sometimes tense around pace and direction.",
  },
  "Goat-Ox": {
    shortLabel: "Steady structure holds sensitive emotion",
    description: "Steady structure holds sensitive emotion. Dependable, careful, and easily affected by criticism or pressure.",
  },
  "Monkey-Ox": {
    shortLabel: "Flexibility meets structure",
    description: "Monkey brings flexibility to Ox's structure. Capable, inventive, and sometimes strained around risk and routine.",
  },
  "Ox-Rooster": {
    shortLabel: "Discipline and order",
    description: "This pairing values discipline and order. Hardworking, methodical, and focused on doing things correctly.",
  },
  "Dog-Ox": {
    shortLabel: "Duty and effort",
    description: "Duty and effort go hand in hand. Steady, responsible, and committed to doing what needs to be done.",
  },
  "Ox-Pig": {
    shortLabel: "Steady pace",
    description: "Life tends to move at a steady pace. Quiet, kind, and focused on comfort, security, and routine.",
  },
  "Tiger-Tiger": {
    shortLabel: "High-energy pairing",
    description: "This is a high-energy pairing with strong opinions on both sides. Bold, impulsive, and quick to react when something feels off.",
  },
  "Rabbit-Tiger": {
    shortLabel: "Forceful vs. gentle",
    description: "Tiger is more forceful, Rabbit more gentle. Protective, emotional, and easily affected by how conflict is handled.",
  },
  "Dragon-Tiger": {
    shortLabel: "Presence and drive",
    description: "Both bring presence and drive. Dramatic, ambitious, and attracted to big goals and visible impact.",
  },
  "Snake-Tiger": {
    shortLabel: "Instinct vs. calculation",
    description: "Tiger acts from instinct, Snake from calculation. Quiet tension, strong intuition, and an eye on power and motives.",
  },
  "Horse-Tiger": {
    shortLabel: "Freedom and movement",
    description: "Freedom and movement are central here. Passionate, adventurous, and happiest when life isn't standing still.",
  },
  "Goat-Tiger": {
    shortLabel: "Direct vs. sensitive",
    description: "Tiger is direct, Goat is sensitive. Expressive, emotional, and responsive to reassurance, tone, and support.",
  },
  "Monkey-Tiger": {
    shortLabel: "Lively and unpredictable",
    description: "This pairing is lively and unpredictable. Sharp, competitive, quick to challenge or test each other.",
  },
  "Rooster-Tiger": {
    shortLabel: "Plain speaking vs. detail",
    description: "Tiger speaks plainly; Rooster notices details. Direct, critical, and resistant to feeling directed or controlled.",
  },
  "Dog-Tiger": {
    shortLabel: "Loyalty and principle",
    description: "Shared focus on loyalty and principle. Honest, protective, and strongly reactive to anything that feels unfair.",
  },
  "Pig-Tiger": {
    shortLabel: "Softness and intensity",
    description: "Pig brings softness to Tiger's intensity. Warm, generous, and easily hurt by harsh words or sudden reactions.",
  },
  "Rabbit-Rabbit": {
    shortLabel: "Gentle and inward",
    description: "This pairing is gentle and inward. Sensitive, considerate, easily unsettled by harshness or ongoing tension.",
  },
  "Dragon-Rabbit": {
    shortLabel: "Softness meets force",
    description: "Softness meets force here. Imaginative, impressionable, and aware of status and power differences.",
  },
  "Rabbit-Snake": {
    shortLabel: "Subtle signals",
    description: "Both prefer subtle signals over loud reactions. Quiet, intuitive, and strongly affected by trust and tone.",
  },
  "Horse-Rabbit": {
    shortLabel: "Uneven pace",
    description: "The pace can feel uneven. Kind, nervous, and responsive to speed, change, and consistency.",
  },
  "Goat-Rabbit": {
    shortLabel: "Tender and emotional",
    description: "This is a tender, emotional pairing. Romantic, artistic, and easily bruised by criticism or coldness.",
  },
  "Monkey-Rabbit": {
    shortLabel: "Clever but delicate",
    description: "The mix is clever but delicate. Quick, mentally active, and sensitive to teasing, sharp humour, or sudden shifts.",
  },
  "Rabbit-Rooster": {
    shortLabel: "Neatness and correctness",
    description: "Neatness and correctness stand out. Concerned with details, easily stressed by criticism or pressure.",
  },
  "Dog-Rabbit": {
    shortLabel: "Caring and protective",
    description: "The connection feels caring and protective. Loyal, gentle, and anxious about trust and emotional safety.",
  },
  "Pig-Rabbit": {
    shortLabel: "Gentle and receptive",
    description: "This pairing is gentle and receptive. Caring, sentimental, and easily moved by kindness and connection.",
  },
  "Dragon-Dragon": {
    shortLabel: "Intensity and pride",
    description: "This pairing has a lot of intensity and pride. Confident, commanding, and focused on standing out.",
  },
  "Dragon-Snake": {
    shortLabel: "Drive meets strategy",
    description: "Drive meets strategy here. Controlled, influential, and comfortable operating with long-range plans.",
  },
  "Dragon-Horse": {
    shortLabel: "Energy and ambition",
    description: "Energy and ambition are both high. Active, driven, and inclined to keep moving toward bigger goals.",
  },
  "Dragon-Goat": {
    shortLabel: "Strong presence meets emotional depth",
    description: "Strong presence meets emotional depth. Ambitious, sensitive, and affected by support, recognition, or lack of it.",
  },
  "Dragon-Monkey": {
    shortLabel: "Quick toward action",
    description: "This connection moves quickly toward action. Clever, ambitious, and excited by ideas that can scale.",
  },
  "Dragon-Rooster": {
    shortLabel: "Image and standards",
    description: "Image and standards matter. Organised, proud, focused on doing things in a polished, visible way.",
  },
  "Dog-Dragon": {
    shortLabel: "Principle and ego",
    description: "Principle and ego can clash or combine. Honest, confrontational, reactive to respect, fairness, and loyalty.",
  },
  "Dragon-Pig": {
    shortLabel: "Big heart meets big expectations",
    description: "Big heart meets big expectations. Generous, indulgent, and sensitive to pressure, gratitude, and emotional climate.",
  },
  "Snake-Snake": {
    shortLabel: "Deep thought",
    description: "Thought runs deep here. Private, measured, and unlikely to show emotion quickly or casually.",
  },
  "Horse-Snake": {
    shortLabel: "Faster than preferred",
    description: "Horse moves faster than Snake prefers. Observant, cautious, and sometimes uneasy with constant motion.",
  },
  "Goat-Snake": {
    shortLabel: "Emotion under the surface",
    description: "Emotion runs under the surface. Sensitive, thoughtful, and strongly influenced by atmosphere and trust.",
  },
  "Monkey-Snake": {
    shortLabel: "Several steps ahead",
    description: "This pairing thinks several steps ahead. Clever, analytical, and quick to read situations and people.",
  },
  "Rooster-Snake": {
    shortLabel: "Precision valued",
    description: "Both value precision. Exacting, critical, and focused on getting details and systems right.",
  },
  "Dog-Snake": {
    shortLabel: "Loyalty takes time",
    description: "Loyalty is important but not shown loudly. Serious, reserved, and slow to open or forgive.",
  },
  "Pig-Snake": {
    shortLabel: "Softness meets guardedness",
    description: "Softness meets guardedness. Kind, wary, and deeply affected by honesty, care, and consistency.",
  },
  "Horse-Horse": {
    shortLabel: "Busy and full of shifts",
    description: "Life is busy and full of shifts. Adventurous, spontaneous, and often resistant to long, heavy obligations.",
  },
  "Goat-Horse": {
    shortLabel: "Emotion and movement",
    description: "Emotion and movement mix here. Expressive, intuitive, and affected by support, stability, and freedom.",
  },
  "Horse-Monkey": {
    shortLabel: "Quick and lively",
    description: "This pairing is quick and lively. Playful, energetic, and rarely short of things to do or talk about.",
  },
  "Horse-Rooster": {
    shortLabel: "Tasks and schedules",
    description: "Tasks and schedules stand out. Busy, organised, and sometimes stressed by time, demands, and standards.",
  },
  "Dog-Horse": {
    shortLabel: "Duty and activity",
    description: "Duty and activity combine. Loyal, driven, and serious about pulling their weight and protecting what matters.",
  },
  "Horse-Pig": {
    shortLabel: "Open and friendly",
    description: "The mood is open and friendly. Generous, social, and sometimes stretched between enjoyment and responsibility.",
  },
  "Goat-Goat": {
    shortLabel: "Very tender bond",
    description: "This bond is very tender. Emotional, idealistic, and easily hurt by rough handling or ongoing stress.",
  },
  "Goat-Monkey": {
    shortLabel: "Playfulness meets sensitivity",
    description: "Playfulness meets sensitivity. Sociable, creative, and aware of how humour and timing land.",
  },
  "Goat-Rooster": {
    shortLabel: "Softness meets high standards",
    description: "Softness meets high standards. Caring, anxious, and responsive to feedback, tone, and structure.",
  },
  "Dog-Goat": {
    shortLabel: "Care and protection",
    description: "Care and protection are central. Loyal, supportive, and often worried about security and reassurance.",
  },
  "Goat-Pig": {
    shortLabel: "Comfort and connection",
    description: "This pairing leans into comfort and connection. Loving, indulgent, and easily influenced by atmosphere and stress levels.",
  },
  "Monkey-Monkey": {
    shortLabel: "Very active mind",
    description: "The mind is very active here. Witty, restless, and full of jokes, concepts, and side paths.",
  },
  "Monkey-Rooster": {
    shortLabel: "Improvises vs. corrects",
    description: "Monkey improvises, Rooster corrects. Capable, sharp, and sometimes caught in debates over details.",
  },
  "Dog-Monkey": {
    shortLabel: "Curiosity meets conscience",
    description: "Curiosity meets conscience. Honest, questioning, and focused on what feels fair and workable.",
  },
  "Monkey-Pig": {
    shortLabel: "Light but caring",
    description: "The tone is light but caring. Charming, sociable, and easily influenced by emotional climate.",
  },
  "Rooster-Rooster": {
    shortLabel: "Focus on correctness",
    description: "The focus here is on correctness. Disciplined, critical, and easily frustrated by inconsistency.",
  },
  "Dog-Rooster": {
    shortLabel: "Principle and duty",
    description: "Principle and duty are highlighted. Honest, firm, and serious about what is right and fair.",
  },
  "Pig-Rooster": {
    shortLabel: "Manages vs. supports",
    description: "Rooster manages, Pig supports. Helpful, attentive, and affected by appreciation and emotional warmth.",
  },
  "Dog-Dog": {
    shortLabel: "Loyal, serious pairing",
    description: "This is a loyal, serious pairing. Protective, principled, and sometimes heavy with responsibility.",
  },
  "Dog-Pig": {
    shortLabel: "Guards vs. nurtures",
    description: "Dog guards; Pig softens. Kind, reassuring, and oriented toward emotional and material safety.",
  },
  "Pig-Pig": {
    shortLabel: "Very soft, giving bond",
    description: "This is a very soft, giving bond. Warm, accommodating, and easily drained by conflict or harsh conditions.",
  },
};

export function getConnectionBoxChinese(
  a: ChineseAnimal,
  b: ChineseAnimal
): ConnectionBoxChineseBlurb | null {
  const [x, y] = [a, b].sort() as [ChineseAnimal, ChineseAnimal];
  const key = `${x}-${y}` as ChinesePairKey;
  return CONNECTION_BOX_CHINESE[key] ?? null;
}

