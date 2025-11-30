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

export interface ChinesePairText {
  heading: string;
  description: string;
}

type ChinesePairCopy = {
  shortLabel: string;
  descriptionTemplate: string; // uses {{A}} and {{B}} placeholders
};

// Canonical key: order-agnostic (sorted alphabetically)
const CHINESE_PAIR_COPY: Record<string, ChinesePairCopy> = {
  // SAME ANIMAL PAIRS
  "Dog-Dog": {
    shortLabel: "Double watchdog",
    descriptionTemplate:
      "Both are loyal, alert, and concerned with fairness. The connection feels committed and conscientious, though prone to worry and overthinking when life gets uncertain.",
  },
  "Dragon-Dragon": {
    shortLabel: "Double drama",
    descriptionTemplate:
      "Both are proud, charismatic, and drawn to big gestures. The connection feels larger-than-life and intense, with strong leadership energy and a taste for significance.",
  },
  "Goat-Goat": {
    shortLabel: "Double dreamer",
    descriptionTemplate:
      "Both are sensitive, creative, and atmosphere-aware. The connection feels gentle, artistic, and emotionally rich, but needs structure so life doesn't drift.",
  },
  "Horse-Horse": {
    shortLabel: "Double freedom",
    descriptionTemplate:
      "Both are active, restless, and independence-seeking. The connection feels lively and changeable, with a strong need for space, movement, and stimulation.",
  },
  "Monkey-Monkey": {
    shortLabel: "Double trickster",
    descriptionTemplate:
      "Both are quick, playful, and opportunistic. The bond is lively, changeable, and mentally stimulating, with a strong appetite for fun and very little tolerance for boredom.",
  },
  "Ox-Ox": {
    shortLabel: "Double backbone",
    descriptionTemplate:
      "Both are steady, patient, and stubborn. This pairing feels solid and consistent, built for endurance, though slow to change once a path is chosen.",
  },
  "Pig-Pig": {
    shortLabel: "Double heart",
    descriptionTemplate:
      "Both are kind, open, and pleasure-seeking. The connection is affectionate, forgiving, and cozy, with a shared preference for enjoyment over conflict.",
  },
  "Rabbit-Rabbit": {
    shortLabel: "Double softness",
    descriptionTemplate:
      "Both are gentle, peace-seeking, and sensitive to atmosphere. The connection feels quiet, aesthetic, and kind, but needs boundaries so avoidance doesn't replace honesty.",
  },
  "Rat-Rat": {
    shortLabel: "Double strategist",
    descriptionTemplate:
      "Both are quick, alert, and opportunistic. This pairing feels clever and resourceful, with plenty of ideas and schemes, but can get tense if trust or territory feels threatened.",
  },
  "Rooster-Rooster": {
    shortLabel: "Double critic",
    descriptionTemplate:
      "Both are exacting, proud, and detail-focused. The connection can be highly competent and organised, but sensitive to clashes over who is right or more correct.",
  },
  "Snake-Snake": {
    shortLabel: "Double depth",
    descriptionTemplate:
      "Both are observant, intense, and private. The connection feels controlled, strategic, and quietly passionate, with much happening beneath the surface.",
  },
  "Tiger-Tiger": {
    shortLabel: "Double wildfire",
    descriptionTemplate:
      "Both are bold, proud, and impulsive. The connection feels dramatic and high-stakes, with strong leadership energy on both sides and little tolerance for feeling controlled.",
  },

  // DIFFERENT ANIMAL PAIRS (alphabetically sorted)
  "Dog-Dragon": {
    shortLabel: "Ego and ideals",
    descriptionTemplate:
      "{{A}} seeks recognition and impact; {{B}} seeks justice and loyalty. The connection can be intense and principled, but also critical when expectations or values clash.",
  },
  "Dog-Goat": {
    shortLabel: "Sensitive allies",
    descriptionTemplate:
      "{{A}} responds to mood and beauty; {{B}} responds to justice and loyalty. The pairing feels caring and conscientious, tuned into both emotional and moral climates.",
  },
  "Dog-Horse": {
    shortLabel: "Runner and watchdog",
    descriptionTemplate:
      "{{A}} seeks experience and stimulation; {{B}} seeks loyalty and a cause. Together they can be active, principled, and outward-focused, especially with shared goals.",
  },
  "Dog-Monkey": {
    shortLabel: "Player and protector",
    descriptionTemplate:
      "{{A}} brings humour, agility, and curiosity; {{B}} brings loyalty, concern, and a sense of duty. Together they mix lightness with seriousness, and can steady each other when balanced.",
  },
  "Dog-Ox": {
    shortLabel: "Reliability and conscience",
    descriptionTemplate:
      "{{A}} is practical and unwavering; {{B}} is loyal and principle-driven. Together they can form a dependable, duty-bound team with a strong sense of right and wrong.",
  },
  "Dog-Pig": {
    shortLabel: "Protector and peacemaker",
    descriptionTemplate:
      "{{A}} brings loyalty and a strong moral streak; {{B}} brings kindness, tolerance, and warmth. Together they create a gentle, caring bond with room for both conscience and comfort.",
  },
  "Dog-Rabbit": {
    shortLabel: "Gentle protectors",
    descriptionTemplate:
      "{{A}} brings softness and grace; {{B}} brings loyalty and concern for fairness. Together they create a caring, conscientious atmosphere with emotional and moral support.",
  },
  "Dog-Rat": {
    shortLabel: "Realist and idealist",
    descriptionTemplate:
      "{{A}} focuses on survival and strategy; {{B}} focuses on loyalty and principles. Together they can combine practicality with conscience, but may clash when ethics and advantage don't line up neatly.",
  },
  "Dog-Rooster": {
    shortLabel: "Standards and ethics",
    descriptionTemplate:
      "{{A}} enforces rules and quality; {{B}} defends fairness and loyalty. Together they form a principled, outspoken pairing that cares deeply about what should and shouldn't be tolerated.",
  },
  "Dog-Snake": {
    shortLabel: "Guarded and loyal",
    descriptionTemplate:
      "{{A}} trusts slowly and reads motives; {{B}} commits strongly and worries about fairness. Together they may form a protective, cautious bond with a strong moral undercurrent.",
  },
  "Dog-Tiger": {
    shortLabel: "Loyal fighters",
    descriptionTemplate:
      "{{A}} embodies courage and action; {{B}} embodies loyalty and justice. Together they can feel like allies in a cause, united by conviction and a strong sense of what's worth fighting for.",
  },
  "Dragon-Goat": {
    shortLabel: "Show and sensitivity",
    descriptionTemplate:
      "{{A}} brings boldness and spectacle; {{B}} brings artistic feeling and vulnerability. The bond can be glamorous and emotional, with strong highs and tender undercurrents.",
  },
  "Dragon-Horse": {
    shortLabel: "High flame",
    descriptionTemplate:
      "{{A}} wants to shine and lead; {{B}} wants room to run. The pairing feels spirited, dramatic, and forward-moving, especially when both have space to express themselves.",
  },
  "Dragon-Monkey": {
    shortLabel: "Power and wit",
    descriptionTemplate:
      "{{A}} offers confidence and drive; {{B}} offers cleverness and adaptability. This pairing is dynamic and inventive, good at stirring things up and making things happen.",
  },
  "Dragon-Ox": {
    shortLabel: "Humble and grand",
    descriptionTemplate:
      "{{A}} works steadily behind the scenes; {{B}} aims high and shines. This pairing can build impressive results when humility and ambition pull in the same direction.",
  },
  "Dragon-Pig": {
    shortLabel: "Grandeur and generosity",
    descriptionTemplate:
      "{{A}} is ambitious and expressive; {{B}} is warm, easygoing, and generous. The bond can feel expansive, fun, and indulgent, with a strong appetite for experience.",
  },
  "Dragon-Rabbit": {
    shortLabel: "Subtle and grand",
    descriptionTemplate:
      "{{A}} brings tact, taste, and diplomacy; {{B}} brings charisma and bold presence. Together they can be socially effective and charming, blending soft influence with big energy.",
  },
  "Dragon-Rat": {
    shortLabel: "Vision and timing",
    descriptionTemplate:
      "{{A}} brings strategy and timing; {{B}} brings charisma and big presence. Together they can feel like a power duo, good at spotting chances and making an impact.",
  },
  "Dragon-Rooster": {
    shortLabel: "Show and structure",
    descriptionTemplate:
      "{{A}} brings vision and charisma; {{B}} brings organisation and precision. Together they can execute big plans with style and attention to detail.",
  },
  "Dragon-Snake": {
    shortLabel: "Charisma and insight",
    descriptionTemplate:
      "{{A}} radiates confidence and force; {{B}} brings subtlety, observation, and strategy. Together they can be quietly formidable, combining presence with perception.",
  },
  "Dragon-Tiger": {
    shortLabel: "Big personalities",
    descriptionTemplate:
      "{{A}} fights from instinct; {{B}} leads with grandeur and confidence. The bond feels heroic and intense, with both drawn to big moves and big stories.",
  },
  "Goat-Horse": {
    shortLabel: "Motion and mood",
    descriptionTemplate:
      "{{A}} brings energy, adventure, and bluntness; {{B}} brings sensitivity and artistic feeling. Together they mix movement with emotion, and benefit from kindness around differences in resilience.",
  },
  "Goat-Monkey": {
    shortLabel: "Soft and quick",
    descriptionTemplate:
      "{{A}} is lively, witty, and changeable; {{B}} is tender and impressionable. The bond can be charming and social, but easily unsettled by teasing or unpredictability.",
  },
  "Goat-Ox": {
    shortLabel: "Duty and sensitivity",
    descriptionTemplate:
      "{{A}} leans on responsibility and persistence; {{B}} leans on feeling and inspiration. Together they mix practicality with softness, but may disagree on how much is 'too much' effort or emotion.",
  },
  "Goat-Pig": {
    shortLabel: "Gentle bon vivants",
    descriptionTemplate:
      "Both enjoy comfort, kindness, and simple pleasures. The connection is affectionate, cozy, and indulgent, with a focus on emotional and sensory ease.",
  },
  "Goat-Rabbit": {
    shortLabel: "Gentle souls",
    descriptionTemplate:
      "Both value beauty, comfort, and emotional nuance. This pairing feels soft, artistic, and affectionate, though it benefits from practical grounding.",
  },
  "Goat-Rat": {
    shortLabel: "Practical and tender",
    descriptionTemplate:
      "{{A}} looks for advantage and efficiency; {{B}} looks for comfort and emotional tone. Together they can build a cozy, functional life, but differ on how much to push versus how much to soften.",
  },
  "Goat-Rooster": {
    shortLabel: "Art and order",
    descriptionTemplate:
      "{{A}} brings feeling and aesthetics; {{B}} brings structure and standards. Together they can create something refined, but differ on how strict or relaxed life should be.",
  },
  "Goat-Snake": {
    shortLabel: "Insight and feeling",
    descriptionTemplate:
      "{{A}} brings perception and emotional complexity; {{B}} brings softness and creativity. Together they can form a sensitive, intuitive match with a rich inner life.",
  },
  "Goat-Tiger": {
    shortLabel: "Edge and softness",
    descriptionTemplate:
      "{{A}} brings intensity and bravado; {{B}} brings sensitivity and artistic feeling. Together they mix protective fire with vulnerability, and need care around emotional spikes.",
  },
  "Horse-Monkey": {
    shortLabel: "Restless duo",
    descriptionTemplate:
      "{{A}} wants action; {{B}} wants variety and mental play. The bond is quick, playful, and prone to sudden shifts, rarely dull and rarely static.",
  },
  "Horse-Ox": {
    shortLabel: "Plod and gallop",
    descriptionTemplate:
      "{{A}} prefers stable routines; {{B}} prefers movement and change. The connection stretches both toward new rhythms, or highlights the gap between security and spontaneity.",
  },
  "Horse-Pig": {
    shortLabel: "Party and peace",
    descriptionTemplate:
      "{{A}} brings excitement and motion; {{B}} brings warmth and indulgence. The pairing feels sociable and easygoing, drawn to enjoyment and shared comfort.",
  },
  "Horse-Rabbit": {
    shortLabel: "Quiet and restless",
    descriptionTemplate:
      "{{A}} seeks calm and safety; {{B}} seeks space and stimulation. The connection balances gentleness with movement, or highlights the gap between staying in and heading out.",
  },
  "Horse-Rat": {
    shortLabel: "Mind and motion",
    descriptionTemplate:
      "{{A}} plans and recalibrates; {{B}} acts and runs. The pairing feels restless and changeable, mixing speed with strategy, and easily pulled between freedom and security.",
  },
  "Horse-Rooster": {
    shortLabel: "Speed and sharpness",
    descriptionTemplate:
      "{{A}} moves fast; {{B}} notices details and standards. The connection can get a lot done when enthusiasm and precision align, but may clash over pacing and criticism.",
  },
  "Horse-Snake": {
    shortLabel: "Stillness and sprint",
    descriptionTemplate:
      "{{A}} moves carefully and plans; {{B}} moves quickly and acts. The pairing mixes reflection with impulsiveness, and can feel attractive yet hard to synchronise.",
  },
  "Horse-Tiger": {
    shortLabel: "Run hot",
    descriptionTemplate:
      "Both like movement, risk, and freedom. This pairing feels active, impulsive, and spirited, with little interest in living a small or overly controlled life.",
  },
  "Monkey-Ox": {
    shortLabel: "Muscle and mind",
    descriptionTemplate:
      "{{A}} brings stamina and patience; {{B}} brings adaptability and cleverness. The pairing can be resourceful and effective when each trusts the other's style.",
  },
  "Monkey-Pig": {
    shortLabel: "Fun and comfort",
    descriptionTemplate:
      "{{A}} seeks stimulation and novelty; {{B}} seeks enjoyment and ease. The pairing feels sociable and entertaining, with room for both play and relaxation.",
  },
  "Monkey-Rabbit": {
    shortLabel: "Soft and sharp",
    descriptionTemplate:
      "{{A}} is quick and witty; {{B}} is gentle and easily overstimulated. Things feel fun and light, but small digs or mood swings can land harder than expected.",
  },
  "Monkey-Rat": {
    shortLabel: "Double clever",
    descriptionTemplate:
      "Both are quick-thinking, social, and good with opportunities. This pairing is lively, witty, and inventive, with a shared love of movement and mental stimulation.",
  },
  "Monkey-Rooster": {
    shortLabel: "Improviser and perfectionist",
    descriptionTemplate:
      "{{A}} improvises and adapts; {{B}} organises and corrects. The connection can be productive and sharp-witted, but opinionated about who's doing things 'the right way.'",
  },
  "Monkey-Snake": {
    shortLabel: "Chess match",
    descriptionTemplate:
      "{{A}} is subtle and strategic; {{B}} is quick, playful, and opportunistic. The bond feels mentally sharp and sometimes competitive, with both aware of the other's moves.",
  },
  "Monkey-Tiger": {
    shortLabel: "Fire and mischief",
    descriptionTemplate:
      "{{A}} is proud and direct; {{B}} is playful, clever, and unpredictable. The bond feels high-energy and volatile, with strong attraction and equally strong reactions.",
  },
  "Ox-Pig": {
    shortLabel: "Work and warmth",
    descriptionTemplate:
      "{{A}} focuses on tasks and responsibilities; {{B}} focuses on enjoyment and kindness. The bond blends effort and ease, with potential for a simple, comfortable life when both are valued.",
  },
  "Ox-Rabbit": {
    shortLabel: "Quiet support",
    descriptionTemplate:
      "{{A}} brings reliability and endurance; {{B}} brings tact, softness, and social grace. Together they can create a calm, considerate atmosphere with a focus on comfort and duty.",
  },
  "Ox-Rat": {
    shortLabel: "Planner and builder",
    descriptionTemplate:
      "{{A}} brings strategy, charm, and timing; {{B}} brings patience, strength, and follow-through. Together they can turn smart ideas into something solid, as long as neither takes the other for granted.",
  },
  "Ox-Rooster": {
    shortLabel: "Order and effort",
    descriptionTemplate:
      "{{A}} supplies steady work; {{B}} supplies organisation and standards. The connection feels methodical and structured, with a strong focus on reliability and correctness.",
  },
  "Ox-Snake": {
    shortLabel: "Still waters",
    descriptionTemplate:
      "{{A}} is solid and straightforward; {{B}} is subtle and observant. The bond can feel composed, serious, and discreet, with a shared respect for privacy and endurance.",
  },
  "Ox-Tiger": {
    shortLabel: "Steadiness and surge",
    descriptionTemplate:
      "{{A}} moves carefully and methodically; {{B}} moves boldly and dramatically. The connection mixes grounded persistence with sudden pushes, and needs respect for very different tempos.",
  },
  "Pig-Rabbit": {
    shortLabel: "Tender pair",
    descriptionTemplate:
      "Both appreciate comfort, kindness, and small pleasures. The bond feels affectionate, indulgent, and homey, with a shared preference for safety over struggle.",
  },
  "Pig-Rat": {
    shortLabel: "Hustle and heart",
    descriptionTemplate:
      "{{A}} is alert and opportunistic; {{B}} is warm, generous, and pleasure-seeking. The bond can feel like one partner watching the angles while the other holds the softness and goodwill.",
  },
  "Pig-Rooster": {
    shortLabel: "Edge and ease",
    descriptionTemplate:
      "{{A}} is sharp, organised, and critical; {{B}} is gentle, relaxed, and accommodating. The bond blends structure with softness, but must watch for imbalances in effort or tone.",
  },
  "Pig-Snake": {
    shortLabel: "Intensity and ease",
    descriptionTemplate:
      "{{A}} is complex and probing; {{B}} is straightforward, kind, and pleasure-loving. The pairing mixes depth with simplicity, and can feel both intriguing and disorienting.",
  },
  "Pig-Tiger": {
    shortLabel: "Bold and kind",
    descriptionTemplate:
      "{{A}} is fiery and assertive; {{B}} is warm, generous, and pleasure-loving. The pairing mixes drama with sweetness, and can feel like intensity wrapped around a soft core.",
  },
  "Rabbit-Rat": {
    shortLabel: "Sharp and soft",
    descriptionTemplate:
      "{{A}} is quick, social, and opportunistic; {{B}} is gentle, tasteful, and sensitive. This pairing can be quietly complementary, balancing street sense with tact, but sensitive to subtle power plays.",
  },
  "Rabbit-Rooster": {
    shortLabel: "Smooth and sharp-edged",
    descriptionTemplate:
      "{{A}} prefers tact and indirectness; {{B}} prefers bluntness and exactness. The connection is attentive to detail and manners, but sensitive to criticism and tone.",
  },
  "Rabbit-Snake": {
    shortLabel: "Grace and depth",
    descriptionTemplate:
      "{{A}} smooths and soothes; {{B}} watches and analyses. The bond feels elegant and somewhat mysterious, with an awareness of undercurrents beneath a calm surface.",
  },
  "Rabbit-Tiger": {
    shortLabel: "Teeth and velvet",
    descriptionTemplate:
      "{{A}} is outspoken and daring; {{B}} is gentle, diplomatic, and cautious. This pairing mixes courage with tact, and can be powerful when protection and sensitivity work together.",
  },
  "Rat-Rooster": {
    shortLabel: "Street sense and precision",
    descriptionTemplate:
      "{{A}} trusts instinct and timing; {{B}} trusts order and correctness. The connection can be efficient and sharp, but opinionated on both sides about the 'right' way to do things.",
  },
  "Rat-Snake": {
    shortLabel: "Quiet operators",
    descriptionTemplate:
      "{{A}} is nimble and pragmatic; {{B}} is subtle, perceptive, and intense. The connection can be shrewd and private, with a strong sense of reading between the lines.",
  },
  "Rat-Tiger": {
    shortLabel: "Nerves and nerve",
    descriptionTemplate:
      "{{A}} calculates and adapts; {{B}} charges and asserts. The connection feels edgy and energetic, mixing caution with courage, and rarely staying boring for long.",
  },
  "Rooster-Snake": {
    shortLabel: "Focused pair",
    descriptionTemplate:
      "{{A}} offers depth and instinct; {{B}} offers clarity and exactness. The connection can be serious, purposeful, and disciplined, with little interest in doing things halfway.",
  },
  "Rooster-Tiger": {
    shortLabel: "Showdown",
    descriptionTemplate:
      "{{A}} leads from passion; {{B}} leads from precision and principle. The connection can be sharp, outspoken, and confrontational, but also brave and uncompromising in its own way.",
  },
};

export function getChinesePairLines(
  userAAnimal: string,
  userBAnimal: string
): ChinesePairText | null {
  // Normalize input
  const normalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const animalA = normalize(userAAnimal);
  const animalB = normalize(userBAnimal);

  // Create an order-agnostic key for lookup (sorted alphabetically)
  const [a, b] = [animalA, animalB].sort();
  const key = `${a}-${b}`;

  const pair = CHINESE_PAIR_COPY[key];
  if (!pair) {
    // Fallback – always still show A × B in order
    return {
      heading: `${animalA} × ${animalB}`,
      description: "",
    };
  }

  // Fill in A/B placeholders based on *actual* user order
  const description = pair.descriptionTemplate
    .replace(/\{\{A\}\}/g, animalA)
    .replace(/\{\{B\}\}/g, animalB);

  // Heading ALWAYS shows User A first, then User B
  const heading = `${animalA} × ${animalB} — ${pair.shortLabel}`;

  return { heading, description };
}

export type ChinesePairKey = keyof typeof CHINESE_PAIR_COPY;
