// chineseAnimalPairDescriptions.ts
// Animal-specific Chinese connection descriptions for connection box

export type AnimalPairKey = string; // Format: "Rat-Ox", "Monkey-Tiger", etc.

/**
 * Animal-specific descriptions for Chinese zodiac pairs
 * These are displayed in the "Chinese connection" section of the connection box
 */
export const ANIMAL_PAIR_DESCRIPTIONS: Record<AnimalPairKey, string> = {
  // Rat combinations
  "Rat-Rat": "two quick, alert Rats; sharp minds and busy lives, good at scheming and problem-solving together.",
  "Rat-Ox": "Rat brings ideas, Ox brings endurance; a quietly strong, practical partnership.",
  "Rat-Tiger": "Curious Rat with bold Tiger; fast, changeable energy that thrives on shared risks and projects.",
  "Rat-Rabbit": "Rat's sharpness meets Rabbit's softness; social, subtle connection that needs gentleness with words.",
  "Rat-Dragon": "big plans and big drive; naturally ambitious together.",
  "Rat-Snake": "Strategising pair; Rat spots opportunities, Snake reads motives, good for long games and planning.",
  "Rat-Horse": "strong pull plus friction, as restless Horse can stretch Rat's nerves and pace.",
  "Rat-Goat": "delicate Goat can feel poked by Rat's bluntness; small hurts and misunderstandings need care.",
  "Rat-Monkey": "witty, inventive, always in motion mentally and socially.",
  "Rat-Rooster": "Outspoken Rooster meets clever Rat; lively debates when you respect each other's style.",
  "Rat-Dog": "Loyal Dog grounds quick Rat; practical support plus shared alertness to people and situations.",
  "Rat-Pig": "Gentle Pig softens busy Rat; cosy, sociable bond if Rat slows down enough to enjoy it.",

  // Ox combinations
  "Ox-Ox": "two Oxen together; slow, steady, reliable, with a patient bond built on duty and routine.",
  "Ox-Tiger": "Grounded Ox meets daring Tiger; stability meets impulse, strong team energy when aligned.",
  "Ox-Rabbit": "Ox provides backbone for sensitive Rabbit; quiet, protective connection with simple comforts.",
  "Ox-Dragon": "Solid Ox with high-flying Dragon; practical follow-through meets vision and pride.",
  "Ox-Snake": "calm, calculating, and good at planning and enduring together.",
  "Ox-Horse": "Ox's slow, steady pace can feel heavy to Horse; differences in freedom vs routine easily surface.",
  "Ox-Goat": "opposite styles, patient vs changeable; can feel like push–pull over priorities and comfort.",
  "Ox-Monkey": "Reserved Ox with playful Monkey; earthy realism meets quick wit, humorous but sometimes mismatched.",
  "Ox-Rooster": "hardworking, precise, and focused on tangible results.",
  "Ox-Dog": "Dog's loyalty plus Ox's perseverance; dependable bond with a strong sense of duty and protection.",
  "Ox-Pig": "Ox keeps things organised while Pig brings warmth and enjoyment; home-friendly, materially comfortable.",

  // Tiger combinations
  "Tiger-Tiger": "two Tigers; bold, proud, restless, exciting but intense, needing mutual respect and freedom.",
  "Tiger-Rabbit": "Tiger leads, Rabbit smooths; brave moves with a gentle touch when balanced.",
  "Tiger-Dragon": "Charismatic pairing; Dragon's drama and Tiger's courage create a loud, noticeable presence.",
  "Tiger-Snake": "Tiger wants open action, Snake prefers subtle moves; tension often centres on trust and pacing.",
  "Tiger-Horse": "high energy, big adventures, strong shared enthusiasm.",
  "Tiger-Goat": "Tiger's assertiveness with Goat's sensitivity; can be protective or overwhelming depending on tone.",
  "Tiger-Monkey": "clever Monkey and daring Tiger; sparks fly, but egos can clash quickly.",
  "Tiger-Rooster": "Rooster's sharp eye and Tiger's boldness; strong opinions on both sides and vivid debates.",
  "Tiger-Dog": "loyal, brave, team-oriented, good for shared missions.",
  "Tiger-Pig": "Tiger's fire and Pig's kindness support each other in a warm, generous match.",

  // Rabbit combinations
  "Rabbit-Rabbit": "two Rabbits; gentle, social, and sensitive, with a soft atmosphere valuing kindness and aesthetics.",
  "Rabbit-Dragon": "Dragon's force and Rabbit's delicacy can rub; inspiring yet easily imbalanced if pressure runs high.",
  "Rabbit-Snake": "Refined, observant pair; Rabbit reads moods, Snake reads motives, both preferring subtle moves.",
  "Rabbit-Horse": "Rabbit's tact with Horse's spontaneity; light, social energy when both stay considerate.",
  "Rabbit-Goat": "creative, caring, and home-loving, with strong focus on comfort and beauty.",
  "Rabbit-Monkey": "Quiet Rabbit with lively Monkey; playful teasing that needs sensitivity to emotional limits.",
  "Rabbit-Rooster": "Rabbit likes peace, Rooster likes clarity; sharp criticism can sting if not softened.",
  "Rabbit-Dog": "Dog protects, Rabbit soothes, forming a kind, companionable bond.",
  "Rabbit-Pig": "easygoing, affectionate, and fond of shared pleasures and comfort.",

  // Dragon combinations
  "Dragon-Dragon": "two Dragons; proud, dramatic, and driven, with strong charisma and occasional competition.",
  "Dragon-Snake": "Magnetic and strategic; Dragon acts, Snake calculates, powerful when trust is solid.",
  "Dragon-Horse": "Showy Dragon with free-spirited Horse; adventurous and expressive, rarely dull.",
  "Dragon-Goat": "Dragon's ambition with Goat's sensitivity; big plans tempered by feeling and taste.",
  "Dragon-Monkey": "inventive, high-energy, full of big projects and ideas.",
  "Dragon-Rooster": "Dragon shines, Rooster refines, forming a proud, organised alliance.",
  "Dragon-Dog": "Dragon's autonomy versus Dog's watchful loyalty; clashes often centre on control and principles.",
  "Dragon-Pig": "Dragon drives, Pig supports; dynamic between activity and pleasure, often generous and expansive.",

  // Snake combinations
  "Snake-Snake": "two Snakes; private, observant, and strategic, with an intense inner world and strong intuition.",
  "Snake-Horse": "Thoughtful Snake with spontaneous Horse; clear contrast between patience and impulsiveness.",
  "Snake-Goat": "Snake's subtlety plus Goat's empathy; quiet, artistic, and emotionally tuned connection.",
  "Snake-Monkey": "cerebral, witty, and agile, with strong mental and social synergy.",
  "Snake-Rooster": "precise, analytical, and image-conscious, good for long-term plans.",
  "Snake-Dog": "Calm Snake with watchful Dog; mutually protective, cautious but loyal once committed.",
  "Snake-Pig": "inward-looking Snake versus open, indulgent Pig; very different life rhythms and priorities.",

  // Horse combinations
  "Horse-Horse": "two Horses; restless, sociable, freedom-loving, lots of movement needing shared direction.",
  "Horse-Goat": "Horse brings momentum, Goat brings care, forming a warm, supportive flow.",
  "Horse-Monkey": "Lively Monkey and adventurous Horse; quick, humorous, and always on the go.",
  "Horse-Rooster": "Horse's spontaneity with Rooster's precision; swinging between fun and structure.",
  "Horse-Dog": "loyal, active, and often outdoorsy, with a strong drive to do things together.",
  "Horse-Pig": "Horse pushes for experience, Pig leans into comfort; pace and priorities need careful balance.",

  // Goat combinations
  "Goat-Goat": "two Goats; gentle, artistic, sometimes worried, with deep emotional understanding and shared taste.",
  "Goat-Monkey": "Sensitive Goat with playful Monkey; social, slightly chaotic, best when reassurance is present.",
  "Goat-Rooster": "Goat's softness meets Rooster's sharpness; constructive when feedback stays kind.",
  "Goat-Dog": "Goat's empathy plus Dog's loyalty; caring, protective, and home-oriented.",
  "Goat-Pig": "nurturing, indulgent, and emotionally rich connection.",

  // Monkey combinations
  "Monkey-Monkey": "two Monkeys; witty, curious, and playful, with constant chatter and mental stimulation.",
  "Monkey-Rooster": "Monkey's improvisation with Rooster's planning; good for projects if egos are balanced.",
  "Monkey-Dog": "Monkey stirs ideas, Dog tests them; smart, slightly sceptical teamwork.",
  "Monkey-Pig": "talkative Monkey and relaxed Pig; different priorities can lead to misunderstandings if not named.",

  // Rooster combinations
  "Rooster-Rooster": "two Roosters; organised, outspoken, and proud, with strong opinions and a sharp edge.",
  "Rooster-Dog": "Dog's protectiveness and Rooster's exactness; tensions over criticism versus loyalty.",
  "Rooster-Pig": "Hard-working Rooster with easygoing Pig; mix of diligence and enjoyment when neither feels judged.",

  // Dog combinations
  "Dog-Dog": "two Dogs; loyal, principled, and watchful, with deep commitment and a strong sense of right and wrong.",
  "Dog-Pig": "Dog guards, Pig relaxes; cosy, mutually supportive pairing when space and comfort are respected.",

  // Pig combinations
  "Pig-Pig": "two Pigs; kind, indulgent, and affectionate, sharing love of comfort, food, and downtime.",
};

/**
 * Get animal-specific description for a pair
 * Handles both orderings (e.g., "Rat-Ox" and "Ox-Rat")
 */
export function getAnimalPairDescription(animalA: string, animalB: string): string | null {
  // Normalize animal names (capitalize first letter)
  const normalizeAnimal = (animal: string) => 
    animal.charAt(0).toUpperCase() + animal.slice(1).toLowerCase();
  
  const normA = normalizeAnimal(animalA);
  const normB = normalizeAnimal(animalB);
  
  // Try both orderings
  const key1 = `${normA}-${normB}`;
  const key2 = `${normB}-${normA}`;
  
  console.log('[getAnimalPairDescription]', {
    original: `${animalA} × ${animalB}`,
    normalized: `${normA} × ${normB}`,
    key1,
    key2,
    found: ANIMAL_PAIR_DESCRIPTIONS[key1] || ANIMAL_PAIR_DESCRIPTIONS[key2] || 'NOT FOUND'
  });
  
  return ANIMAL_PAIR_DESCRIPTIONS[key1] || ANIMAL_PAIR_DESCRIPTIONS[key2] || null;
}

