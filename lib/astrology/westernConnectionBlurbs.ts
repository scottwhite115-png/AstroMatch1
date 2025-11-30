// lib/astrology/westernConnectionBlurbs.ts

export type WesternSign =
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

const WESTERN_SIGNS: WesternSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

// Canonical key so Aries–Taurus and Taurus–Aries both map to "Aries-Taurus"
function makeWesternKey(a: WesternSign, b: WesternSign): string {
  if (a === b) return `${a}-${b}`;
  const ia = WESTERN_SIGNS.indexOf(a);
  const ib = WESTERN_SIGNS.indexOf(b);
  return ia <= ib ? `${a}-${b}` : `${b}-${a}`;
}

// 78 unordered blurbs: one for each unique pair (A-B where A<=B in WESTERN_SIGNS)
export const westernConnectionBlurbs: Record<string, string> = {
  // ---- Aries row ----
  "Aries-Aries":
    "Fiery, fast and competitive; sparks of passion, action and strong wills on both sides.",
  "Aries-Taurus":
    "Impulsive fire meets steady earth; drive and persistence combine in a stubborn, forceful way.",
  "Aries-Gemini":
    "Lively, restless and talkative; quick decisions, quick comebacks and a constant stream of ideas.",
  "Aries-Cancer":
    "Bold, blunt Aries meets protective, feeling-rich Cancer; hot–cold emotional weather.",
  "Aries-Leo":
    "Big, bright fire; dramatic, playful and proud, with a strong appetite for excitement and recognition.",
  "Aries-Virgo":
    "Action-first Aries with detail-focused Virgo; sharp contrast between speed and precision.",
  "Aries-Libra":
    "Independence faces partnership; direct Aries and diplomatic Libra pull between 'me' and 'we'.",
  "Aries-Scorpio":
    "Intense pairing; Aries burns openly, Scorpio burns inwardly, both strong-willed and passionate.",
  "Aries-Sagittarius":
    "Adventurous fire plus fire; blunt honesty, big risks and an appetite for challenge.",
  "Aries-Capricorn":
    "Raw drive meets controlled ambition; Aries pushes doors open, Capricorn builds the long game.",
  "Aries-Aquarius":
    "Rebel energy; bold ideas, impulsive moves, and zero interest in boring routines.",
  "Aries-Pisces":
    "Fiery initiative meets watery sensitivity; strong instincts coloured by shifting moods and impressions.",

  // ---- Taurus row ----
  "Taurus-Taurus":
    "Solid, slow and steady; comfort, routine and loyalty are emphasised strongly on both sides.",
  "Taurus-Gemini":
    "Earth meets air; Taurus anchors while Gemini flits, creating a steady–restless contrast.",
  "Taurus-Cancer":
    "Warm, home-focused energy; Taurus secures the base, Cancer fills it with feeling.",
  "Taurus-Leo":
    "Fixed earth and fixed fire; pride, style and a strong sense of taste and presence.",
  "Taurus-Virgo":
    "Practical and grounded; attention to small details, plans and tangible results.",
  "Taurus-Libra":
    "Love of beauty and ease; aesthetic sense, social grace and a preference for pleasant surroundings.",
  "Taurus-Scorpio":
    "Deep, fixed energy; Taurus holds ground, Scorpio probes depths, both intense and private in different ways.",
  "Taurus-Sagittarius":
    "Comfort versus exploration; Taurus stabilises while Sagittarius ranges widely.",
  "Taurus-Capricorn":
    "Heavy earth emphasis; durable, slow-building energy with a strong work-and-security focus.",
  "Taurus-Aquarius":
    "Stubborn meeting stubborn; Taurus holds to comfort, Aquarius holds to principle and change.",
  "Taurus-Pisces":
    "Soft, gentle blend; Taurus offers calm and consistency, Pisces adds imagination and emotional tone.",

  // ---- Gemini row ----
  "Gemini-Gemini":
    "Double air; talkative, changeable, curious and mentally wired, with many topics and directions.",
  "Gemini-Cancer":
    "Mind meets mood; Gemini analyses and chats, Cancer feels and responds, creating a shifting mix.",
  "Gemini-Leo":
    "Bright, expressive and playful; storytelling, drama and a flair for performance.",
  "Gemini-Virgo":
    "Quick thinking meets careful sorting and organising; a sharp, mentally busy combination.",
  "Gemini-Libra":
    "Sociable air; charm, conversation and a strong focus on people dynamics and ideas.",
  "Gemini-Scorpio":
    "Light versus depth; Gemini skims and samples, Scorpio probes and intensifies.",
  "Gemini-Sagittarius":
    "Axis of exploration; Gemini explores with questions, Sagittarius with beliefs and big pictures.",
  "Gemini-Capricorn":
    "Talkative air with reserved earth; ideas and planning meet discipline and realism.",
  "Gemini-Aquarius":
    "Fast, bright and talkative; lots of mental play, social buzz and shared curiosity about people and ideas.",
  "Gemini-Pisces":
    "Shifting air and shifting water; Gemini's words swirl with Pisces' images and moods.",

  // ---- Cancer row ----
  "Cancer-Cancer":
    "Double water; strong emotional memory, protectiveness and sensitivity on both sides.",
  "Cancer-Leo":
    "Warm and theatrical; Cancer nurtures, Leo shines, both keen on loyalty and heartfelt expression.",
  "Cancer-Virgo":
    "Caring plus practical; Cancer tunes into feelings, Virgo into fixes and supports.",
  "Cancer-Libra":
    "Soft, social mix; sensitivity, politeness and a heightened awareness of atmosphere and harmony.",
  "Cancer-Scorpio":
    "Intense water blend; deep emotional currents, loyalty and a strong pull toward privacy.",
  "Cancer-Sagittarius":
    "Home versus horizon; Cancer orbits familiar ground, Sagittarius points toward the big wide world.",
  "Cancer-Capricorn":
    "Security axis; Cancer protects the inner life, Capricorn structures the outer life.",
  "Cancer-Aquarius":
    "Head meets heart; Aquarius stays conceptual while Cancer feels everything, a vivid emotional–intellectual contrast.",
  "Cancer-Pisces":
    "Gentle, dreamy water mix; strong intuition, fantasy and emotional attunement.",

  // ---- Leo row ----
  "Leo-Leo":
    "Double fire; proud, expressive and dramatic, with a big appetite for attention and affection.",
  "Leo-Virgo":
    "Show meets service; Leo highlights the stage, Virgo focuses on craft and improvement.",
  "Leo-Libra":
    "Stylish and social; charm, aesthetics and relationship energy turned up.",
  "Leo-Scorpio":
    "Intense and magnetic; Leo's visible fire meets Scorpio's hidden depth.",
  "Leo-Sagittarius":
    "Big-hearted fire duo; enthusiasm, humour and a love of adventure and storytelling.",
  "Leo-Capricorn":
    "Status and structure; Leo seeks recognition, Capricorn builds achievement and form.",
  "Leo-Aquarius":
    "Spotlight versus outsider; Leo radiates from the centre, Aquarius from the edge with a quirky twist.",
  "Leo-Pisces":
    "Fiery presence with gentle dreaminess; Leo brings theatre, Pisces brings atmosphere and subtlety.",

  // ---- Virgo row ----
  "Virgo-Virgo":
    "Double earth with a Mercury edge; analytical, precise and habit-focused.",
  "Virgo-Libra":
    "Refined and considerate; attention to balance, detail and social grace.",
  "Virgo-Scorpio":
    "Private and perceptive; Virgo notices facts, Scorpio senses underlying motives.",
  "Virgo-Sagittarius":
    "Practicality meets exploration; Virgo refines, Sagittarius expands.",
  "Virgo-Capricorn":
    "Strong earth emphasis; methodical, responsible and oriented toward concrete goals.",
  "Virgo-Aquarius":
    "Inventive ideas meet careful, detail-driven thinking; sharp contrast in pace and style.",
  "Virgo-Pisces":
    "Axis of order and dream; Virgo organises and critiques, Pisces imagines and drifts.",

  // ---- Libra row ----
  "Libra-Libra":
    "Double Venusian air; charm, negotiation and relationship themes front and centre.",
  "Libra-Scorpio":
    "Surface grace with underlying intensity; Libra balances, Scorpio penetrates.",
  "Libra-Sagittarius":
    "Social and upbeat; Libra mingles, Sagittarius roams widely in ideas and geography.",
  "Libra-Capricorn":
    "Polished meets practical; Libra handles optics and diplomacy, Capricorn handles structure and ambition.",
  "Libra-Aquarius":
    "Airy, social and idealistic; a refined, people-focused connection with a strong sense of fairness.",
  "Libra-Pisces":
    "Romantic and soft-focused; Libra seeks harmony, Pisces adds dreaminess and emotional nuance.",

  // ---- Scorpio row ----
  "Scorpio-Scorpio":
    "Double fixed water; very intense, private and emotionally powerful, with strong will on both sides.",
  "Scorpio-Sagittarius":
    "Depth meets openness; Scorpio focuses inward, Sagittarius looks outward and upward.",
  "Scorpio-Capricorn":
    "Serious and determined; emotional intensity meets long-term strategy and endurance.",
  "Scorpio-Aquarius":
    "Intense depth meets cool distance; Scorpio moves through emotional undercurrents while Aquarius stays detached and analytical.",
  "Scorpio-Pisces":
    "Water-on-water; deep feeling, intuition and a strong inner world, with a pull toward the unseen.",

  // ---- Sagittarius row ----
  "Sagittarius-Sagittarius":
    "Double fire; freedom-loving, straightforward and restless, with a big appetite for experience.",
  "Sagittarius-Capricorn":
    "Expansion meets consolidation; Sagittarius scans horizons, Capricorn builds footholds.",
  "Sagittarius-Aquarius":
    "Independent, future-focused and idealistic; big visions, big debates and a lively, adventurous tone.",
  "Sagittarius-Pisces":
    "Explorer plus dreamer; Sagittarius seeks meaning, Pisces swims in symbols and emotion.",

  // ---- Capricorn row ----
  "Capricorn-Capricorn":
    "Double earth; disciplined, structured and ambitious, with a strong sense of duty.",
  "Capricorn-Aquarius":
    "Saturn-ruled neighbours; Capricorn focuses on form and results, Aquarius on systems and reform.",
  "Capricorn-Pisces":
    "Realism meets softness; Capricorn grounds, Pisces soaks up and imagines.",

  // ---- Aquarius row ----
  "Aquarius-Aquarius":
    "Double Aquarius; ultra-mental, future-oriented and quirky, with a strong streak of individuality on both sides.",
  "Aquarius-Pisces":
    "Dreamy and imaginative; Aquarius thinks in systems while Pisces feels in symbols and moods, creating a soft, other-worldly vibe.",

  // ---- Pisces row ----
  "Pisces-Pisces":
    "Double water; highly sensitive, imaginal and receptive, with strong emotional and intuitive currents.",
};

// Helper to fetch blurbs irrespective of order
export function getWesternConnectionBlurb(
  a: WesternSign,
  b: WesternSign
): string | undefined {
  const key = makeWesternKey(a, b);
  return westernConnectionBlurbs[key];
}
