// data/connectionBoxWest.ts

import type { WestSign } from "@/lib/westernZodiac";
import { WEST_SIGN_ELEMENT } from "@/lib/westernZodiac";
import { getElementCompatibilityDescription } from "./elementCompatibility";

export type ConnectionBoxWestEntry = {
  tagline: string;       // e.g. 'A meeting of minds'
  description: string;   // e.g. 'Communicative, curious, and light-hearted.'
  elementLabel: string;  // e.g. 'Same element: Air × Air'
};

export const connectionBoxWest: Record<string, ConnectionBoxWestEntry> = {
  "Aries-Aries": {
    tagline: "All gas, no brakes",
    description: "Two Aries together create a direct, high-energy connection that moves quickly, reacts fast, and rarely sits still.",
    elementLabel: "Same element: Fire × Fire",
  },
  "Aries-Taurus": {
    tagline: "Drive meets stability",
    description: "This pairing mixes Aries' push with Taurus' patience, giving steady progress but very different speeds around change.",
    elementLabel: "Semi-compatible: Fire × Earth",
  },
  "Aries-Gemini": {
    tagline: "Fast and curious",
    description: "Aries–Gemini is quick, talkative, and restless, with plans and ideas appearing faster than they're finished.",
    elementLabel: "Compatible: Fire × Air",
  },
  "Aries-Cancer": {
    tagline: "Fire and feeling",
    description: "Here, Aries brings heat and Cancer brings feeling, so reactions are strong and tone matters a lot.",
    elementLabel: "Mismatch: Fire × Water",
  },
  "Aries-Leo": {
    tagline: "Big energy",
    description: "Aries and Leo form a bold, expressive duo that likes big moves, big feelings, and being fully alive.",
    elementLabel: "Same element: Fire × Fire",
  },
  "Aries-Virgo": {
    tagline: "Action and analysis",
    description: "This match combines Aries' urgency with Virgo's careful eye, often focusing on fixing problems and getting things done.",
    elementLabel: "Semi-compatible: Fire × Earth",
  },
  "Aries-Libra": {
    tagline: "Opposites in balance",
    description: "Aries wants to act; Libra watches the effect on the relationship, making fairness and honesty constant themes.",
    elementLabel: "Opposites: Fire × Air",
  },
  "Aries-Scorpio": {
    tagline: "Intense and uncompromising",
    description: "Aries–Scorpio is intense and uncompromising, with both signs taking desires, loyalty, and conflict very seriously.",
    elementLabel: "Mismatch: Fire × Water",
  },
  "Aries-Sagittarius": {
    tagline: "Adventurous and bold",
    description: "Together they create an open, adventurous energy that favours honesty, movement, and trying new things.",
    elementLabel: "Same element: Fire × Fire",
  },
  "Aries-Capricorn": {
    tagline: "Ambition with friction",
    description: "Aries starts and Capricorn sustains, building a results-focused match that cares about goals, work, and outcomes.",
    elementLabel: "Semi-compatible: Fire × Earth",
  },
  "Aries-Aquarius": {
    tagline: "Rebel spark",
    description: "This pairing is edgy and forward-looking, blending Aries' drive with Aquarius' ideas about change and freedom.",
    elementLabel: "Compatible: Fire × Air",
  },
  "Aries-Pisces": {
    tagline: "Action and empathy",
    description: "Aries–Pisces mixes impulse with sensitivity, so action, inspiration, and feelings can all surge to the surface quickly.",
    elementLabel: "Mismatch: Fire × Water",
  },
  "Taurus-Taurus": {
    tagline: "Calm and steady",
    description: "Two Taurus together create a slow, steady connection that values loyalty, comfort, and familiar routines.",
    elementLabel: "Same element: Earth × Earth",
  },
  "Gemini-Taurus": {
    tagline: "Ground and air",
    description: "This pairing mixes Taurus' need for stability with Gemini's changing interests, blending steady habits with a curious, restless mind.",
    elementLabel: "Semi-compatible: Earth × Air",
  },
  "Cancer-Taurus": {
    tagline: "Cozy and caring",
    description: "Taurus–Cancer tends to feel warm and protective, with a strong pull toward home, safety, and emotional security.",
    elementLabel: "Compatible: Earth × Water",
  },
  "Leo-Taurus": {
    tagline: "Fixed tastes",
    description: "Here, Taurus brings solidity and Leo brings showmanship, so loyalty, pride, and mutual respect become big themes.",
    elementLabel: "Semi-compatible: Earth × Fire",
  },
  "Taurus-Virgo": {
    tagline: "Practical and grounded",
    description: "Taurus and Virgo form a grounded, practical match that's good at handling real-life tasks, plans, and responsibilities.",
    elementLabel: "Same element: Earth × Earth",
  },
  "Libra-Taurus": {
    tagline: "Tasteful but indecisive",
    description: "This pairing enjoys comfort, beauty, and ease, leaning toward pleasant surroundings, good food, and social charm.",
    elementLabel: "Semi-compatible: Earth × Air",
  },
  "Scorpio-Taurus": {
    tagline: "Deep and intense",
    description: "Taurus–Scorpio feels deep and private, with strong attachment, clear boundaries, and a serious attitude toward trust.",
    elementLabel: "Opposites: Earth × Water",
  },
  "Sagittarius-Taurus": {
    tagline: "Comfort vs. freedom",
    description: "Here, Taurus wants predictability while Sagittarius wants freedom, creating a mix of solid ground and restless energy.",
    elementLabel: "Semi-compatible: Earth × Fire",
  },
  "Capricorn-Taurus": {
    tagline: "Long-game builders",
    description: "Taurus and Capricorn make a solid earth team, focused on long-term goals, security, and steady progress.",
    elementLabel: "Same element: Earth × Earth",
  },
  "Aquarius-Taurus": {
    tagline: "Solid vs. disruptive",
    description: "This pairing pits Taurus' love of the known against Aquarius' urge for change, creating a fixed but very different outlook on life.",
    elementLabel: "Semi-compatible: Earth × Air",
  },
  "Pisces-Taurus": {
    tagline: "Soft and supportive",
    description: "Taurus–Pisces blends practicality with softness, offering steady support on one side and emotional sensitivity on the other.",
    elementLabel: "Compatible: Earth × Water",
  },
  "Gemini-Gemini": {
    tagline: "Words and motion",
    description: "Two Geminis together create a fast, talkative connection that runs on ideas, jokes, and constant mental movement.",
    elementLabel: "Same element: Air × Air",
  },
  "Cancer-Gemini": {
    tagline: "Mind and mood",
    description: "Gemini–Cancer blends quick thinking with strong feeling, so words, tone, and reassurance all carry extra weight.",
    elementLabel: "Semi-compatible: Air × Water",
  },
  "Gemini-Leo": {
    tagline: "Playful and expressive",
    description: "Gemini and Leo make a bright, social pairing that enjoys humour, play, and shared attention.",
    elementLabel: "Compatible: Air × Fire",
  },
  "Gemini-Virgo": {
    tagline: "Thinking in detail",
    description: "This match combines curious Gemini with precise Virgo, often focusing on information, details, and fixing what isn't working.",
    elementLabel: "Semi-compatible: Air × Earth",
  },
  "Gemini-Libra": {
    tagline: "Social and smooth",
    description: "Gemini–Libra is an easy air-sign mix that thrives on conversation, social life, and comparing different viewpoints.",
    elementLabel: "Same element: Air × Air",
  },
  "Gemini-Scorpio": {
    tagline: "Light vs. depth",
    description: "Here, Gemini's curiosity meets Scorpio's depth, creating a thoughtful connection that looks beneath the surface.",
    elementLabel: "Semi-compatible: Air × Water",
  },
  "Gemini-Sagittarius": {
    tagline: "Opposite explorers",
    description: "As opposite signs, Gemini and Sagittarius pull each other toward variety, learning, travel, and big questions.",
    elementLabel: "Opposites: Air × Fire",
  },
  "Capricorn-Gemini": {
    tagline: "Ideas and structure",
    description: "Gemini–Capricorn balances flexible thinking with firm structure, aiming to turn ideas into something concrete.",
    elementLabel: "Semi-compatible: Air × Earth",
  },
  "Aquarius-Gemini": {
    tagline: "Mental spark",
    description: "This pairing is very mental and future-focused, with plenty of talk about concepts, plans, and how things could be different.",
    elementLabel: "Same element: Air × Air",
  },
  "Gemini-Pisces": {
    tagline: "Imagination and spin",
    description: "Gemini–Pisces blends mind and imagination, giving a subtle, changeable connection shaped by stories and moods.",
    elementLabel: "Semi-compatible: Air × Water",
  },
  "Cancer-Cancer": {
    tagline: "Deep water",
    description: "Two Cancers together create a deeply feeling bond that is nurturing, protective, and very sensitive to atmosphere.",
    elementLabel: "Same element: Water × Water",
  },
  "Cancer-Leo": {
    tagline: "Heart and show",
    description: "Cancer–Leo combines warmth and pride, with strong reactions to loyalty, attention, and how love is shown.",
    elementLabel: "Mismatch: Water × Fire",
  },
  "Cancer-Virgo": {
    tagline: "Caring in practice",
    description: "This pairing mixes emotional care with practical help, focusing on support, health, and daily life running smoothly.",
    elementLabel: "Compatible: Water × Earth",
  },
  "Cancer-Libra": {
    tagline: "Harmony and home",
    description: "Cancer–Libra wants a kind, harmonious environment, paying close attention to fairness, tone, and emotional balance.",
    elementLabel: "Semi-compatible: Water × Air",
  },
  "Cancer-Scorpio": {
    tagline: "Intense and private",
    description: "Here, Cancer's feeling meets Scorpio's intensity, forming a private, loyal connection that doesn't do emotions lightly.",
    elementLabel: "Same element: Water × Water",
  },
  "Cancer-Sagittarius": {
    tagline: "Nest vs. open road",
    description: "Cancer–Sagittarius mixes the need for security with the urge to roam, juggling comfort with honesty and freedom.",
    elementLabel: "Mismatch: Water × Fire",
  },
  "Cancer-Capricorn": {
    tagline: "Opposites that build",
    description: "As opposites, Cancer and Capricorn link emotion with duty, often building serious, long-term structures together.",
    elementLabel: "Opposites: Water × Earth",
  },
  "Aquarius-Cancer": {
    tagline: "Feeling vs. distance",
    description: "This pairing blends caring Cancer with independent Aquarius, making space, closeness, and timing core themes.",
    elementLabel: "Semi-compatible: Water × Air",
  },
  "Cancer-Pisces": {
    tagline: "Soft and intuitive",
    description: "Cancer–Pisces is a soft water-sign mix that leans into intuition, empathy, and unspoken emotional understanding.",
    elementLabel: "Same element: Water × Water",
  },
  "Leo-Leo": {
    tagline: "Big personalities",
    description: "Two Leos create a vivid, expressive pairing that cares about loyalty, respect, and feeling fully seen.",
    elementLabel: "Same element: Fire × Fire",
  },
  "Leo-Virgo": {
    tagline: "Show and service",
    description: "Leo–Virgo mixes showmanship with refinement, often focusing on improving how things look, work, and feel.",
    elementLabel: "Semi-compatible: Fire × Earth",
  },
  "Leo-Libra": {
    tagline: "Charming and social",
    description: "This match enjoys romance, style, and social life, with a shared interest in beauty, charm, and good company.",
    elementLabel: "Compatible: Fire × Air",
  },
  "Leo-Scorpio": {
    tagline: "Intense and dramatic",
    description: "Leo–Scorpio is a strong-willed pairing where pride and intensity meet, making loyalty and power dynamics impossible to ignore.",
    elementLabel: "Mismatch: Fire × Water",
  },
  "Leo-Sagittarius": {
    tagline: "Fire on fire",
    description: "Leo and Sagittarius form a big-hearted fire duo that loves fun, movement, risk, and open enthusiasm.",
    elementLabel: "Same element: Fire × Fire",
  },
  "Capricorn-Leo": {
    tagline: "Pride and strategy",
    description: "Here, Leo's presence meets Capricorn's ambition, focusing on success, reputation, and long-term goals.",
    elementLabel: "Semi-compatible: Fire × Earth",
  },
  "Aquarius-Leo": {
    tagline: "Bold and unconventional",
    description: "As opposites, Leo and Aquarius both value individuality, mixing personal expression with bigger ideas and causes.",
    elementLabel: "Opposites: Fire × Air",
  },
  "Leo-Pisces": {
    tagline: "Drama and dream",
    description: "Leo–Pisces blends drama with sensitivity, giving a creative connection that responds strongly to affection, inspiration, and mood.",
    elementLabel: "Mismatch: Fire × Water",
  },
  "Virgo-Virgo": {
    tagline: "Refined and particular",
    description: "Two Virgos together create a careful, detail-focused bond that pays close attention to work, health, and little improvements.",
    elementLabel: "Same element: Earth × Earth",
  },
  "Libra-Virgo": {
    tagline: "Considerate but indecisive",
    description: "Virgo–Libra mixes practicality with diplomacy, caring about fairness, manners, and how things are organised.",
    elementLabel: "Semi-compatible: Earth × Air",
  },
  "Scorpio-Virgo": {
    tagline: "Strategic and serious",
    description: "This pairing blends Virgo's analysis with Scorpio's depth, creating a serious vibe that looks for accuracy and real motives.",
    elementLabel: "Compatible: Earth × Water",
  },
  "Sagittarius-Virgo": {
    tagline: "Detail vs. big picture",
    description: "Virgo–Sagittarius tries to balance planning with openness, mixing order, honesty, and a desire to learn and explore.",
    elementLabel: "Semi-compatible: Earth × Fire",
  },
  "Capricorn-Virgo": {
    tagline: "Quietly powerful",
    description: "Virgo and Capricorn form a strong earth team that is organised, hardworking, and serious about commitments and goals.",
    elementLabel: "Same element: Earth × Earth",
  },
  "Aquarius-Virgo": {
    tagline: "Systems and ideas",
    description: "Virgo–Aquarius pairs practical problem-solving with future-minded ideas, often focused on better systems and methods.",
    elementLabel: "Semi-compatible: Earth × Air",
  },
  "Pisces-Virgo": {
    tagline: "Opposite healers",
    description: "As opposites, Virgo and Pisces blend detail and intuition, working out how to hold both structure and flow at once.",
    elementLabel: "Opposites: Earth × Water",
  },
  "Libra-Libra": {
    tagline: "Charming mirrors",
    description: "Two Libras together create a very relationship-focused match that watches balance, tone, and mutual effort closely.",
    elementLabel: "Same element: Air × Air",
  },
  "Libra-Scorpio": {
    tagline: "Smooth and intense",
    description: "Libra–Scorpio looks soft on the surface but runs deep, mixing charm with intensity and a strong sense of boundaries.",
    elementLabel: "Semi-compatible: Air × Water",
  },
  "Libra-Sagittarius": {
    tagline: "Light and open",
    description: "This pairing is friendly and open, mixing social ease with big ideas about truth, fairness, and experience.",
    elementLabel: "Compatible: Air × Fire",
  },
  "Capricorn-Libra": {
    tagline: "Style and structure",
    description: "Libra–Capricorn combines charm with restraint, paying attention to image, responsibility, and doing things \"properly.\"",
    elementLabel: "Semi-compatible: Air × Earth",
  },
  "Aquarius-Libra": {
    tagline: "Social and idealistic",
    description: "Libra and Aquarius form a social, idealistic match that cares about people, networks, and shared values.",
    elementLabel: "Same element: Air × Air",
  },
  "Libra-Pisces": {
    tagline: "Soft and romantic",
    description: "Libra–Pisces is a gentle, artistic pairing, sensitive to mood, aesthetics, kindness, and emotional tone.",
    elementLabel: "Semi-compatible: Air × Water",
  },
  "Scorpio-Scorpio": {
    tagline: "All or nothing",
    description: "Two Scorpios together create an intense, private connection that takes trust and loyalty very seriously.",
    elementLabel: "Same element: Water × Water",
  },
  "Sagittarius-Scorpio": {
    tagline: "Edgy and honest",
    description: "Scorpio–Sagittarius mixes emotional depth with blunt honesty, often pulling toward truth, change, and strong experiences.",
    elementLabel: "Mismatch: Water × Fire",
  },
  "Capricorn-Scorpio": {
    tagline: "Focused and formidable",
    description: "This pairing joins Scorpio's intensity with Capricorn's discipline, focusing on power, stability, and long-term outcomes.",
    elementLabel: "Compatible: Water × Earth",
  },
  "Aquarius-Scorpio": {
    tagline: "Intensity vs. detachment",
    description: "Scorpio–Aquarius is a complex mix of passion and distance, caring about truth, autonomy, and what's really going on beneath the surface.",
    elementLabel: "Semi-compatible: Water × Air",
  },
  "Pisces-Scorpio": {
    tagline: "Deep water connection",
    description: "Scorpio–Pisces is a deep water match, quiet on the outside but highly sensitive to loyalty, hurt, and emotional honesty.",
    elementLabel: "Same element: Water × Water",
  },
  "Sagittarius-Sagittarius": {
    tagline: "Wild at heart",
    description: "Two Sagittarians together create a free-spirited, upbeat bond that craves movement, learning, and room to breathe.",
    elementLabel: "Same element: Fire × Fire",
  },
  "Capricorn-Sagittarius": {
    tagline: "Risk and responsibility",
    description: "Sagittarius–Capricorn blends big-picture thinking with realism, focusing on purpose, work, and where things are headed.",
    elementLabel: "Semi-compatible: Fire × Earth",
  },
  "Aquarius-Sagittarius": {
    tagline: "Open and future-minded",
    description: "This pairing is independent and future-looking, drawn to new ideas, change, and different ways of living.",
    elementLabel: "Compatible: Fire × Air",
  },
  "Pisces-Sagittarius": {
    tagline: "Faith and feeling",
    description: "Sagittarius–Pisces mixes fire and dreaminess, leaning into belief, story, emotion, and the search for meaning.",
    elementLabel: "Mismatch: Fire × Water",
  },
  "Capricorn-Capricorn": {
    tagline: "Builders and planners",
    description: "Two Capricorns together create a very serious bond that respects effort, structure, and long-term plans.",
    elementLabel: "Same element: Earth × Earth",
  },
  "Aquarius-Capricorn": {
    tagline: "Cool and strategic",
    description: "Capricorn–Aquarius blends earth and air, focusing on systems, work, and steady but meaningful change.",
    elementLabel: "Semi-compatible: Earth × Air",
  },
  "Capricorn-Pisces": {
    tagline: "Ground and tide",
    description: "Capricorn–Pisces mixes practicality with sensitivity, caring about security, purpose, and the emotional tone of life.",
    elementLabel: "Compatible: Earth × Water",
  },
  "Aquarius-Aquarius": {
    tagline: "Unconventional duo",
    description: "Two Aquarians together form an independent, idea-driven match that values space, principles, and mental connection.",
    elementLabel: "Same element: Air × Air",
  },
  "Aquarius-Pisces": {
    tagline: "Logic and feeling",
    description: "Aquarius–Pisces blends logic with feeling, focusing on ideals, compassion, and the emotional impact of choices.",
    elementLabel: "Semi-compatible: Air × Water",
  },
  "Pisces-Pisces": {
    tagline: "Deep and diffuse",
    description: "Two Pisces together create a soft, empathic bond that is easily shaped by surroundings, moods, and unspoken feelings.",
    elementLabel: "Same element: Water × Water",
  },
};

function westPairKey(a: WestSign, b: WestSign): string {
  const [x, y] = [a, b].sort();
  return `${x}-${y}`;
}

export function getConnectionBoxWestEntry(
  a: WestSign,
  b: WestSign
): ConnectionBoxWestEntry | null {
  try {
    const entry = connectionBoxWest[westPairKey(a, b)];
    if (!entry) return null;
    
    // Get elements for both signs
    const elementA = WEST_SIGN_ELEMENT[a];
    const elementB = WEST_SIGN_ELEMENT[b];
    
    if (!elementA || !elementB) {
      console.warn('[getConnectionBoxWestEntry] Missing element for signs:', a, b, 'elements:', elementA, elementB);
      return entry; // Return entry without element description
    }
    
    // Get element compatibility description
    const elementDescription = getElementCompatibilityDescription(elementA, elementB);
    
    // Return entry with element-based description
    return {
      ...entry,
      description: elementDescription || entry.description, // Fallback to original if not found
    };
  } catch (error) {
    console.error('[getConnectionBoxWestEntry] Error:', error instanceof Error ? error.message : String(error), 'for signs:', a, b);
    return null;
  }
}

