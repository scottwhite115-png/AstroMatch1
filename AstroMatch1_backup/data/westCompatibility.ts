// data/westCompatibility.ts

///////////////////////////////
// Types & basic definitions //
///////////////////////////////

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

export type WestElement = "Fire" | "Earth" | "Air" | "Water";

export type WestElementRelationship =
  | "same"
  | "compatible"
  | "semi-compatible"
  | "opposing";

export interface WestCompatibilitySummary {
  signA: WestSign;
  signB: WestSign;
  elementA: WestElement;
  elementB: WestElement;
  elementRelationship: WestElementRelationship;
  elementLabel: string; // e.g. "Opposites: Air × Fire"
  heading: string; // e.g. "Aquarius × Leo — Opposites: Air × Fire"
  blurb: string; // our one-liner
}

const SIGNS_IN_ORDER: WestSign[] = [
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

////////////////////////
// Element assignment //
////////////////////////

export const SIGN_TO_ELEMENT: Record<WestSign, WestElement> = {
  Aries: "Fire",
  Leo: "Fire",
  Sagittarius: "Fire",

  Taurus: "Earth",
  Virgo: "Earth",
  Capricorn: "Earth",

  Gemini: "Air",
  Libra: "Air",
  Aquarius: "Air",

  Cancer: "Water",
  Scorpio: "Water",
  Pisces: "Water",
};

//////////////////////////////
// Element compatibility    //
// (same / compatible etc.) //
//////////////////////////////

export function getElementRelationship(
  a: WestElement,
  b: WestElement
): WestElementRelationship {
  if (a === b) return "same";

  // Compatible: Fire–Air, Earth–Water
  if (
    (a === "Fire" && b === "Air") ||
    (a === "Air" && b === "Fire") ||
    (a === "Earth" && b === "Water") ||
    (a === "Water" && b === "Earth")
  ) {
    return "compatible";
  }

  // Semi-compatible: Fire–Earth, Air–Water
  if (
    (a === "Fire" && b === "Earth") ||
    (a === "Earth" && b === "Fire") ||
    (a === "Air" && b === "Water") ||
    (a === "Water" && b === "Air")
  ) {
    return "semi-compatible";
  }

  // Opposing: Fire–Water, Air–Earth
  return "opposing";
}

export function getElementLabel(
  a: WestElement,
  b: WestElement
): { relationship: WestElementRelationship; label: string } {
  const rel = getElementRelationship(a, b);

  const pairText = `${a} × ${b}`;

  let label: string;
  switch (rel) {
    case "same":
      label = `Same element: ${pairText}`;
      break;
    case "compatible":
      label = `Compatible: ${pairText}`;
      break;
    case "semi-compatible":
      label = `Semi-compatible: ${pairText}`;
      break;
    case "opposing":
    default:
      label = `Opposites: ${pairText}`;
      break;
  }

  return { relationship: rel, label };
}

/////////////////////////////
// West pair blurbs (78x)  //
/////////////////////////////

type WestPairKey = `${WestSign}-${WestSign}`;

// We normalise pairs so Gemini–Aries and Aries–Gemini share one blurb
function normalizeWestPairKey(a: WestSign, b: WestSign): WestPairKey {
  if (a === b) return `${a}-${b}` as WestPairKey;
  const idxA = SIGNS_IN_ORDER.indexOf(a);
  const idxB = SIGNS_IN_ORDER.indexOf(b);
  const [first, second] = idxA <= idxB ? [a, b] : [b, a];
  return `${first}-${second}` as WestPairKey;
}

// 78 unique pairs, in zodiac order.
// Blurbs are written to work regardless of which sign is user A / B.
export const WEST_CONNECTION_BLURBS: Record<WestPairKey, string> = {
  // ♈ Aries row
  "Aries-Aries":
    "Two Aries together create a direct, high-energy connection that moves quickly, reacts fast, and rarely sits still.",
  "Aries-Taurus":
    "This pairing mixes Aries' push with Taurus' patience, giving steady progress but very different speeds around change.",
  "Aries-Gemini":
    "Aries–Gemini is quick, talkative, and restless, with plans and ideas appearing faster than they're finished.",
  "Aries-Cancer":
    "Here, Aries brings heat and Cancer brings feeling, so reactions are strong and tone matters a lot.",
  "Aries-Leo":
    "Aries and Leo form a bold, expressive duo that likes big moves, big feelings, and being fully alive.",
  "Aries-Virgo":
    "This match combines Aries' urgency with Virgo's careful eye, often focusing on fixing problems and getting things done.",
  "Aries-Libra":
    "Aries wants to act; Libra watches the effect on the relationship, making fairness and honesty constant themes.",
  "Aries-Scorpio":
    "Aries–Scorpio is intense and uncompromising, with both signs taking desires, loyalty, and conflict very seriously.",
  "Aries-Sagittarius":
    "Together they create an open, adventurous energy that favours honesty, movement, and trying new things.",
  "Aries-Capricorn":
    "Aries starts and Capricorn sustains, building a results-focused match that cares about goals, work, and outcomes.",
  "Aries-Aquarius":
    "This pairing is edgy and forward-looking, blending Aries' drive with Aquarius' ideas about change and freedom.",
  "Aries-Pisces":
    "Aries–Pisces mixes impulse with sensitivity, so action, inspiration, and feelings can all surge to the surface quickly.",

  // ♉ Taurus row
  "Taurus-Taurus":
    "Two Taurus together create a slow, steady connection that values loyalty, comfort, and familiar routines.",
  "Taurus-Gemini":
    "This pairing mixes Taurus' need for stability with Gemini's changing interests, blending steady habits with a curious, restless mind.",
  "Taurus-Cancer":
    "Taurus–Cancer tends to feel warm and protective, with a strong pull toward home, safety, and emotional security.",
  "Taurus-Leo":
    "Here, Taurus brings solidity and Leo brings showmanship, so loyalty, pride, and mutual respect become big themes.",
  "Taurus-Virgo":
    "Taurus and Virgo form a grounded, practical match that's good at handling real-life tasks, plans, and responsibilities.",
  "Taurus-Libra":
    "This pairing enjoys comfort, beauty, and ease, leaning toward pleasant surroundings, good food, and social charm.",
  "Taurus-Scorpio":
    "Taurus–Scorpio feels deep and private, with strong attachment, clear boundaries, and a serious attitude toward trust.",
  "Taurus-Sagittarius":
    "Here, Taurus wants predictability while Sagittarius wants freedom, creating a mix of solid ground and restless energy.",
  "Taurus-Capricorn":
    "Taurus and Capricorn make a solid earth team, focused on long-term goals, security, and steady progress.",
  "Taurus-Aquarius":
    "This pairing pits Taurus' love of the known against Aquarius' urge for change, creating a fixed but very different outlook on life.",
  "Taurus-Pisces":
    "Taurus–Pisces blends practicality with softness, offering steady support on one side and emotional sensitivity on the other.",

  // ♊ Gemini row
  "Gemini-Gemini":
    "Two Geminis together create a fast, talkative connection that runs on ideas, jokes, and constant mental movement.",
  "Gemini-Cancer":
    "Gemini–Cancer blends quick thinking with strong feeling, so words, tone, and reassurance all carry extra weight.",
  "Gemini-Leo":
    "Gemini and Leo make a bright, social pairing that enjoys humour, play, and shared attention.",
  "Gemini-Virgo":
    "This match combines curious Gemini with precise Virgo, often focusing on information, details, and fixing what isn't working.",
  "Gemini-Libra":
    "Gemini–Libra is an easy air-sign mix that thrives on conversation, social life, and comparing different viewpoints.",
  "Gemini-Scorpio":
    "Here, Gemini's curiosity meets Scorpio's depth, creating a thoughtful connection that looks beneath the surface.",
  "Gemini-Sagittarius":
    "As opposite signs, Gemini and Sagittarius pull each other toward variety, learning, travel, and big questions.",
  "Gemini-Capricorn":
    "Gemini–Capricorn balances flexible thinking with firm structure, aiming to turn ideas into something concrete.",
  "Gemini-Aquarius":
    "This pairing is very mental and future-focused, with plenty of talk about concepts, plans, and how things could be different.",
  "Gemini-Pisces":
    "Gemini–Pisces blends mind and imagination, giving a subtle, changeable connection shaped by stories and moods.",

  // ♋ Cancer row
  "Cancer-Cancer":
    "Two Cancers together create a deeply feeling bond that is nurturing, protective, and very sensitive to atmosphere.",
  "Cancer-Leo":
    "Cancer–Leo combines warmth and pride, with strong reactions to loyalty, attention, and how love is shown.",
  "Cancer-Virgo":
    "This pairing mixes emotional care with practical help, focusing on support, health, and daily life running smoothly.",
  "Cancer-Libra":
    "Cancer–Libra wants a kind, harmonious environment, paying close attention to fairness, tone, and emotional balance.",
  "Cancer-Scorpio":
    "Here, Cancer's feeling meets Scorpio's intensity, forming a private, loyal connection that doesn't do emotions lightly.",
  "Cancer-Sagittarius":
    "Cancer–Sagittarius mixes the need for security with the urge to roam, juggling comfort with honesty and freedom.",
  "Cancer-Capricorn":
    "As opposites, Cancer and Capricorn link emotion with duty, often building serious, long-term structures together.",
  "Cancer-Aquarius":
    "This pairing blends caring Cancer with independent Aquarius, making space, closeness, and timing core themes.",
  "Cancer-Pisces":
    "Cancer–Pisces is a soft water-sign mix that leans into intuition, empathy, and unspoken emotional understanding.",

  // ♌ Leo row
  "Leo-Leo":
    "Two Leos create a vivid, expressive pairing that cares about loyalty, respect, and feeling fully seen.",
  "Leo-Virgo":
    "Leo–Virgo mixes showmanship with refinement, often focusing on improving how things look, work, and feel.",
  "Leo-Libra":
    "This match enjoys romance, style, and social life, with a shared interest in beauty, charm, and good company.",
  "Leo-Scorpio":
    "Leo–Scorpio is a strong-willed pairing where pride and intensity meet, making loyalty and power dynamics impossible to ignore.",
  "Leo-Sagittarius":
    "Leo and Sagittarius form a big-hearted fire duo that loves fun, movement, risk, and open enthusiasm.",
  "Leo-Capricorn":
    "Here, Leo's presence meets Capricorn's ambition, focusing on success, reputation, and long-term goals.",
  "Leo-Aquarius":
    "As opposites, Leo and Aquarius both value individuality, mixing personal expression with bigger ideas and causes.",
  "Leo-Pisces":
    "Leo–Pisces blends drama with sensitivity, giving a creative connection that responds strongly to affection, inspiration, and mood.",

  // ♍ Virgo row
  "Virgo-Virgo":
    "Two Virgos together create a careful, detail-focused bond that pays close attention to work, health, and little improvements.",
  "Virgo-Libra":
    "Virgo–Libra mixes practicality with diplomacy, caring about fairness, manners, and how things are organised.",
  "Virgo-Scorpio":
    "This pairing blends Virgo's analysis with Scorpio's depth, creating a serious vibe that looks for accuracy and real motives.",
  "Virgo-Sagittarius":
    "Virgo–Sagittarius tries to balance planning with openness, mixing order, honesty, and a desire to learn and explore.",
  "Virgo-Capricorn":
    "Virgo and Capricorn form a strong earth team that is organised, hardworking, and serious about commitments and goals.",
  "Virgo-Aquarius":
    "Virgo–Aquarius pairs practical problem-solving with future-minded ideas, often focused on better systems and methods.",
  "Virgo-Pisces":
    "As opposites, Virgo and Pisces blend detail and intuition, working out how to hold both structure and flow at once.",

  // ♎ Libra row
  "Libra-Libra":
    "Two Libras together create a very relationship-focused match that watches balance, tone, and mutual effort closely.",
  "Libra-Scorpio":
    "Libra–Scorpio looks soft on the surface but runs deep, mixing charm with intensity and a strong sense of boundaries.",
  "Libra-Sagittarius":
    "This pairing is friendly and open, mixing social ease with big ideas about truth, fairness, and experience.",
  "Libra-Capricorn":
    "Libra–Capricorn combines charm with restraint, paying attention to image, responsibility, and doing things properly.",
  "Libra-Aquarius":
    "Libra and Aquarius form a social, idealistic match that cares about people, networks, and shared values.",
  "Libra-Pisces":
    "Libra–Pisces is a gentle, artistic pairing, sensitive to mood, aesthetics, kindness, and emotional tone.",

  // ♏ Scorpio row
  "Scorpio-Scorpio":
    "Two Scorpios together create an intense, private connection that takes trust and loyalty very seriously.",
  "Scorpio-Sagittarius":
    "Scorpio–Sagittarius mixes emotional depth with blunt honesty, often pulling toward truth, change, and strong experiences.",
  "Scorpio-Capricorn":
    "This pairing joins Scorpio's intensity with Capricorn's discipline, focusing on power, stability, and long-term outcomes.",
  "Scorpio-Aquarius":
    "Scorpio–Aquarius is a complex mix of passion and distance, caring about truth, autonomy, and what's really going on beneath the surface.",
  "Scorpio-Pisces":
    "Scorpio–Pisces is a deep water match, quiet on the outside but highly sensitive to loyalty, hurt, and emotional honesty.",

  // ♐ Sagittarius row
  "Sagittarius-Sagittarius":
    "Two Sagittarians together create a free-spirited, upbeat bond that craves movement, learning, and room to breathe.",
  "Sagittarius-Capricorn":
    "Sagittarius–Capricorn blends big-picture thinking with realism, focusing on purpose, work, and where things are headed.",
  "Sagittarius-Aquarius":
    "This pairing is independent and future-looking, drawn to new ideas, change, and different ways of living.",
  "Sagittarius-Pisces":
    "Sagittarius–Pisces mixes fire and dreaminess, leaning into belief, story, emotion, and the search for meaning.",

  // ♑ Capricorn row
  "Capricorn-Capricorn":
    "Two Capricorns together create a very serious bond that respects effort, structure, and long-term plans.",
  "Capricorn-Aquarius":
    "Capricorn–Aquarius blends earth and air, focusing on systems, work, and steady but meaningful change.",
  "Capricorn-Pisces":
    "Capricorn–Pisces mixes practicality with sensitivity, caring about security, purpose, and the emotional tone of life.",

  // ♒ Aquarius row
  "Aquarius-Aquarius":
    "Two Aquarians together form an independent, idea-driven match that values space, principles, and mental connection.",
  "Aquarius-Pisces":
    "Aquarius–Pisces blends logic with feeling, focusing on ideals, compassion, and the emotional impact of choices.",

  // ♓ Pisces row
  "Pisces-Pisces":
    "Two Pisces together create a soft, empathic bond that is easily shaped by surroundings, moods, and unspoken feelings.",
};

export function getWestConnectionBlurb(
  signA: WestSign,
  signB: WestSign
): string {
  const key = normalizeWestPairKey(signA, signB);
  return WEST_CONNECTION_BLURBS[key] ?? "";
}

/////////////////////////////////////////
// Main helper for the match engine    //
/////////////////////////////////////////

export function getWestCompatibilitySummary(
  signA: WestSign,
  signB: WestSign
): WestCompatibilitySummary {
  const elementA = SIGN_TO_ELEMENT[signA];
  const elementB = SIGN_TO_ELEMENT[signB];

  const { relationship, label } = getElementLabel(elementA, elementB);

  const heading = `${signA} × ${signB} — ${label}`;
  const blurb = getWestConnectionBlurb(signA, signB);

  return {
    signA,
    signB,
    elementA,
    elementB,
    elementRelationship: relationship,
    elementLabel: label,
    heading,
    blurb,
  };
}

