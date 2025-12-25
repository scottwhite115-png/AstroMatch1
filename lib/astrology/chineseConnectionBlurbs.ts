// lib/astrology/chineseConnectionBlurbs.ts

export type ChineseAnimal =
  | "Rat"
  | "Ox"
  | "Tiger"
  | "Rabbit"
  | "Dragon"
  | "Snake"
  | "Horse"
  | "Goat"
  | "Monkey"
  | "Rooster"
  | "Dog"
  | "Pig";

const ZODIAC_ORDER: ChineseAnimal[] = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
];

// Turn (a,b) into a canonical key so that Rat–Ox and Ox–Rat
// always map to the same entry ("Rat-Ox").
function makeChineseKey(a: ChineseAnimal, b: ChineseAnimal): string {
  if (a === b) return `${a}-${b}`;
  const ia = ZODIAC_ORDER.indexOf(a);
  const ib = ZODIAC_ORDER.indexOf(b);
  return ia <= ib ? `${a}-${b}` : `${b}-${a}`;
}

// 78 blurbs (unordered pairs). Keys are always A-B where
// A comes before or equals B in ZODIAC_ORDER.
export const chineseConnectionBlurbs: Record<string, string> = {
  // ---- Rat row ----
  "Rat-Rat":
    "Same Sign 同生肖: two quick, alert Rats; sharp minds and busy lives, good at scheming and problem-solving together.",
  "Rat-Ox":
    "Liu He 六合 \"Six Harmoniess\": Rat brings ideas, Ox brings endurance; a quietly strong, practical partnership.",
  "Rat-Tiger":
    "Curious Rat with bold Tiger; fast, changeable energy that thrives on shared risks and projects.",
  "Rat-Rabbit":
    "Rat's sharpness meets Rabbit's softness; social, subtle connection that needs gentleness with words.",
  "Rat-Dragon":
    "San He 三合 \"Visionaries\": big plans and big drive; naturally ambitious together.",
  "Rat-Snake":
    "Strategising pair; Rat spots opportunities, Snake reads motives, good for long games and planning.",
  "Rat-Horse":
    "Liu Chong 六冲: strong pull plus friction, as restless Horse can stretch Rat's nerves and pace.",
  "Rat-Goat":
    "Liu Hai 六害: delicate Goat can feel poked by Rat's bluntness; small hurts and misunderstandings need care.",
  "Rat-Monkey":
    "San He 三合 \"Visionaries\": witty, inventive, always in motion mentally and socially.",
  "Rat-Rooster":
    "Outspoken Rooster meets clever Rat; lively debates when you respect each other's style.",
  "Rat-Dog":
    "Loyal Dog grounds quick Rat; practical support plus shared alertness to people and situations.",
  "Rat-Pig":
    "Gentle Pig softens busy Rat; cosy, sociable bond if Rat slows down enough to enjoy it.",

  // ---- Ox row ----
  "Ox-Ox":
    "Same Sign 同生肖: two Oxen together; slow, steady, reliable, with a patient bond built on duty and routine.",
  "Ox-Tiger":
    "Grounded Ox meets daring Tiger; stability meets impulse, strong team energy when aligned.",
  "Ox-Rabbit":
    "Ox provides backbone for sensitive Rabbit; quiet, protective connection with simple comforts.",
  "Ox-Dragon":
    "Solid Ox with high-flying Dragon; practical follow-through meets vision and pride.",
  "Ox-Snake":
    "San He 三合 \"Strategists\": calm, calculating, and good at planning and enduring together.",
  "Ox-Horse":
    "Liu Hai 六害: Ox's slow, steady pace can feel heavy to Horse; differences in freedom vs routine easily surface.",
  "Ox-Goat":
    "Liu Chong 六冲: opposite styles, patient vs changeable; can feel like push–pull over priorities and comfort.",
  "Ox-Monkey":
    "Reserved Ox with playful Monkey; earthy realism meets quick wit, humorous but sometimes mismatched.",
  "Ox-Rooster":
    "San He 三合 \"Strategists\": hardworking, precise, and focused on tangible results.",
  "Ox-Dog":
    "Dog's loyalty plus Ox's perseverance; dependable bond with a strong sense of duty and protection.",
  "Ox-Pig":
    "Ox keeps things organised while Pig brings warmth and enjoyment; home-friendly, materially comfortable.",

  // ---- Tiger row ----
  "Tiger-Tiger":
    "Same Sign 同生肖: two Tigers; bold, proud, restless, exciting but intense, needing mutual respect and freedom.",
  "Tiger-Rabbit":
    "Tiger leads, Rabbit smooths; brave moves with a gentle touch when balanced.",
  "Tiger-Dragon":
    "Charismatic pairing; Dragon's drama and Tiger's courage create a loud, noticeable presence.",
  "Tiger-Snake":
    "Liu Hai 六害: Tiger wants open action, Snake prefers subtle moves; tension often centres on trust and pacing.",
  "Tiger-Horse":
    "San He 三合 \"Adventurers\": high energy, big adventures, strong shared enthusiasm.",
  "Tiger-Goat":
    "Tiger's assertiveness with Goat's sensitivity; can be protective or overwhelming depending on tone.",
  "Tiger-Monkey":
    "Liu Chong 六冲: clever Monkey and daring Tiger; sparks fly, but egos can clash quickly.",
  "Tiger-Rooster":
    "Rooster's sharp eye and Tiger's boldness; strong opinions on both sides and vivid debates.",
  "Tiger-Dog":
    "San He 三合 \"Adventurers\": loyal, brave, team-oriented, good for shared missions.",
  "Tiger-Pig":
    "Liu He 六合 \"Six Harmoniess\": Tiger's fire and Pig's kindness support each other in a warm, generous match.",

  // ---- Rabbit row ----
  "Rabbit-Rabbit":
    "Same Sign 同生肖: two Rabbits; gentle, social, and sensitive, with a soft atmosphere valuing kindness and aesthetics.",
  "Rabbit-Dragon":
    "Liu Hai 六害: Dragon's force and Rabbit's delicacy can rub; inspiring yet easily imbalanced if pressure runs high.",
  "Rabbit-Snake":
    "Refined, observant pair; Rabbit reads moods, Snake reads motives, both preferring subtle moves.",
  "Rabbit-Horse":
    "Rabbit's tact with Horse's spontaneity; light, social energy when both stay considerate.",
  "Rabbit-Goat":
    "San He 三合 \"Artists\": creative, caring, and home-loving, with strong focus on comfort and beauty.",
  "Rabbit-Monkey":
    "Quiet Rabbit with lively Monkey; playful teasing that needs sensitivity to emotional limits.",
  "Rabbit-Rooster":
    "Liu Chong 六冲: Rabbit likes peace, Rooster likes clarity; sharp criticism can sting if not softened.",
  "Rabbit-Dog":
    "Liu He 六合 \"Six Harmoniess\": Dog protects, Rabbit soothes, forming a kind, companionable bond.",
  "Rabbit-Pig":
    "San He 三合 \"Artists\": easygoing, affectionate, and fond of shared pleasures and comfort.",

  // ---- Dragon row ----
  "Dragon-Dragon":
    "Same Sign 同生肖: two Dragons; proud, dramatic, and driven, with strong charisma and occasional competition.",
  "Dragon-Snake":
    "Magnetic and strategic; Dragon acts, Snake calculates, powerful when trust is solid.",
  "Dragon-Horse":
    "Showy Dragon with free-spirited Horse; adventurous and expressive, rarely dull.",
  "Dragon-Goat":
    "Dragon's ambition with Goat's sensitivity; big plans tempered by feeling and taste.",
  "Dragon-Monkey":
    "San He 三合 \"Visionaries\": inventive, high-energy, full of big projects and ideas.",
  "Dragon-Rooster":
    "Liu He 六合 \"Six Harmoniess\": Dragon shines, Rooster refines, forming a proud, organised alliance.",
  "Dragon-Dog":
    "Liu Chong 六冲: Dragon's autonomy versus Dog's watchful loyalty; clashes often centre on control and principles.",
  "Dragon-Pig":
    "Dragon drives, Pig supports; dynamic between activity and pleasure, often generous and expansive.",

  // ---- Snake row ----
  "Snake-Snake":
    "Same Sign 同生肖: two Snakes; private, observant, and strategic, with an intense inner world and strong intuition.",
  "Snake-Horse":
    "Thoughtful Snake with spontaneous Horse; clear contrast between patience and impulsiveness.",
  "Snake-Goat":
    "Snake's subtlety plus Goat's empathy; quiet, artistic, and emotionally tuned connection.",
  "Snake-Monkey":
    "Liu He 六合 \"Six Harmoniess\": cerebral, witty, and agile, with strong mental and social synergy.",
  "Snake-Rooster":
    "San He 三合 \"Strategists\": precise, analytical, and image-conscious, good for long-term plans.",
  "Snake-Dog":
    "Calm Snake with watchful Dog; mutually protective, cautious but loyal once committed.",
  "Snake-Pig":
    "Liu Chong 六冲: inward-looking Snake versus open, indulgent Pig; very different life rhythms and priorities.",

  // ---- Horse row ----
  "Horse-Horse":
    "Same Sign 同生肖: two Horses; restless, sociable, freedom-loving, lots of movement needing shared direction.",
  "Horse-Goat":
    "Liu He 六合 \"Six Harmoniess\": Horse brings momentum, Goat brings care, forming a warm, supportive flow.",
  "Horse-Monkey":
    "Lively Monkey and adventurous Horse; quick, humorous, and always on the go.",
  "Horse-Rooster":
    "Horse's spontaneity with Rooster's precision; swinging between fun and structure.",
  "Horse-Dog":
    "San He 三合 \"Adventurers\": loyal, active, and often outdoorsy, with a strong drive to do things together.",
  "Horse-Pig":
    "Liu Hai 六害: Horse pushes for experience, Pig leans into comfort; pace and priorities need careful balance.",

  // ---- Goat row ----
  "Goat-Goat":
    "Same Sign 同生肖: two Goats; gentle, artistic, sometimes worried, with deep emotional understanding and shared taste.",
  "Goat-Monkey":
    "Sensitive Goat with playful Monkey; social, slightly chaotic, best when reassurance is present.",
  "Goat-Rooster":
    "Goat's softness meets Rooster's sharpness; constructive when feedback stays kind.",
  "Goat-Dog":
    "Goat's empathy plus Dog's loyalty; caring, protective, and home-oriented.",
  "Goat-Pig":
    "San He 三合 \"Artists\": nurturing, indulgent, and emotionally rich connection.",

  // ---- Monkey row ----
  "Monkey-Monkey":
    "Same Sign 同生肖: two Monkeys; witty, curious, and playful, with constant chatter and mental stimulation.",
  "Monkey-Rooster":
    "Monkey's improvisation with Rooster's planning; good for projects if egos are balanced.",
  "Monkey-Dog":
    "Monkey stirs ideas, Dog tests them; smart, slightly sceptical teamwork.",
  "Monkey-Pig":
    "Liu Hai 六害: talkative Monkey and relaxed Pig; different priorities can lead to misunderstandings if not named.",

  // ---- Rooster row ----
  "Rooster-Rooster":
    "Same Sign 同生肖: two Roosters; organised, outspoken, and proud, with strong opinions and a sharp edge.",
  "Rooster-Dog":
    "Liu Hai 六害: Dog's protectiveness and Rooster's exactness; tensions over criticism versus loyalty.",
  "Rooster-Pig":
    "Hard-working Rooster with easygoing Pig; mix of diligence and enjoyment when neither feels judged.",

  // ---- Dog row ----
  "Dog-Dog":
    "Same Sign 同生肖: two Dogs; loyal, principled, and watchful, with deep commitment and a strong sense of right and wrong.",
  "Dog-Pig":
    "Dog guards, Pig relaxes; cosy, mutually supportive pairing when space and comfort are respected.",

  // ---- Pig row ----
  "Pig-Pig":
    "Same Sign 同生肖: two Pigs; kind, indulgent, and affectionate, sharing love of comfort, food, and downtime.",
};

// Public helper: use this everywhere in the app.
export function getChineseConnectionBlurb(
  a: ChineseAnimal,
  b: ChineseAnimal
): string | undefined {
  const key = makeChineseKey(a, b);
  return chineseConnectionBlurbs[key];
}

