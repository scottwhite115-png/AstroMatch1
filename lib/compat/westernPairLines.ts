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

export interface WesternPairText {
  heading: string;
  description: string;
}

type WesternPairCopy = {
  shortLabel: string;
  descriptionTemplate: string; // uses {{A}} and {{B}} placeholders
};

// Canonical key: order-agnostic (sorted alphabetically)
const WESTERN_PAIR_COPY: Record<string, WesternPairCopy> = {
  // SAME SIGN PAIRS
  "Aquarius-Aquarius": {
    shortLabel: "Mirror match",
    descriptionTemplate:
      "Both value independence, ideas, and doing life their own way. The bond can feel like a meeting of equals and close friends, but it needs warmth and presence so it doesn't drift into cool distance.",
  },
  "Aries-Aries": {
    shortLabel: "Double fire starter",
    descriptionTemplate:
      "Bothc lead with energy, directness, and a drive to act. The connection feels fast, honest, and competitive, with plenty of sparks—both exciting and combative.",
  },
  "Cancer-Cancer": {
    shortLabel: "Double sanctuary",
    descriptionTemplate:
      "Both are deeply feeling, protective, and home-focused. The bond can feel nurturing and emotionally safe, though it may amplify moods if boundaries aren't balanced.",
  },
  "Capricorn-Capricorn": {
    shortLabel: "Mutual respect",
    descriptionTemplate:
      "Both are disciplined, goal-oriented, and pragmatic. The connection feels steady, reliable, and focused on building something lasting—though warmth needs tending.",
  },
  "Gemini-Gemini": {
    shortLabel: "Double quick",
    descriptionTemplate:
      "Both are curious, talkative, and mentally restless. The bond feels lively and stimulating, full of ideas and variety, but can scatter if nothing grounds it.",
  },
  "Leo-Leo": {
    shortLabel: "Shared spotlight",
    descriptionTemplate:
      "Both are expressive, proud, and drawn to attention. The connection feels dramatic and generous when egos align, but competitive when both want center stage.",
  },
  "Libra-Libra": {
    shortLabel: "Harmonious mirror",
    descriptionTemplate:
      "Both value balance, beauty, and partnership. The bond feels gracious and socially smooth, though decisions can stall when both defer or overthink.",
  },
  "Pisces-Pisces": {
    shortLabel: "Shared dreamworld",
    descriptionTemplate:
      "Both are sensitive, imaginative, and emotionally permeable. The connection feels intuitive and deeply empathetic, but needs grounding so feelings don't blur into confusion.",
  },
  "Sagittarius-Sagittarius": {
    shortLabel: "Double wanderer",
    descriptionTemplate:
      "Both are optimistic, restless, and truth-seeking. The bond feels adventurous and open-minded, with room to roam—but may lack anchor if neither commits to staying put.",
  },
  "Scorpio-Scorpio": {
    shortLabel: "Intense mirror",
    descriptionTemplate:
      "Both are passionate, probing, and drawn to emotional depth. The connection feels powerful and magnetic, with trust as its anchor and control as its risk.",
  },
  "Taurus-Taurus": {
    shortLabel: "Steady ground",
    descriptionTemplate:
      "Both value stability, comfort, and sensory pleasure. The bond feels solid, loyal, and built to last, though stubbornness can dig in when change is needed.",
  },
  "Virgo-Virgo": {
    shortLabel: "Mutual precision",
    descriptionTemplate:
      "Both are detail-oriented, practical, and improvement-focused. The connection feels efficient and thoughtful, but can tip into overthinking or criticism if perfection becomes the standard.",
  },

  // DIFFERENT SIGN PAIRS (alphabetically sorted)
  "Aquarius-Aries": {
    shortLabel: "Fast, forward energy",
    descriptionTemplate:
      "{{A}} thinks ahead and breaks patterns; {{B}} acts fast and fearlessly. Together this is a direct, high-tempo match that runs on honesty, momentum, and trying new things.",
  },
  "Aquarius-Cancer": {
    shortLabel: "Head and heart",
    descriptionTemplate:
      "{{A}} leans on logic and distance; {{B}} leads with feeling and care. The match can feel like two different languages at first, but it's rich when ideas and emotions learn to coexist.",
  },
  "Aquarius-Capricorn": {
    shortLabel: "Rebel and realist",
    descriptionTemplate:
      "{{A}} questions systems; {{B}} works them. The connection mixes idealism with pragmatism, and it's strongest when vision and discipline are treated as a team, not a clash.",
  },
  "Aquarius-Gemini": {
    shortLabel: "Shared wavelength",
    descriptionTemplate:
      "{{A}} brings originality; {{B}} brings quick wit and curiosity. Conversation rarely runs dry here, and the bond feels light, clever, and mentally alive when you're both engaged.",
  },
  "Aquarius-Leo": {
    shortLabel: "Magnetic opposites",
    descriptionTemplate:
      "{{A}} brings edge and individuality; {{B}} brings warmth and presence. Together this feels bold and hard to ignore, with both wanting to shine in their own way.",
  },
  "Aquarius-Libra": {
    shortLabel: "Social idealists",
    descriptionTemplate:
      "{{A}} stands for principles; {{B}} seeks harmony and fairness. Together you get a sociable, people-focused match that likes good conversation, shared causes, and a sense of style.",
  },
  "Aquarius-Pisces": {
    shortLabel: "Logic and feeling",
    descriptionTemplate:
      "{{A}} brings clear, future-focused thinking; {{B}} adds sensitivity and imagination. Together you mix ideas with feeling in a gentle, creative way.",
  },
  "Aquarius-Sagittarius": {
    shortLabel: "Big-picture adventurers",
    descriptionTemplate:
      "{{A}} brings vision and originality; {{B}} brings candour and restlessness. This pairing feels open, future-oriented, and drawn to exploring new ideas, places, and ways of living.",
  },
  "Aquarius-Scorpio": {
    shortLabel: "Intense meets detached",
    descriptionTemplate:
      "{{A}} values freedom and perspective; {{B}} wants depth and emotional truth. The pull can be strong and intriguing, but it works best when neither side tries to control the other's way of caring.",
  },
  "Aquarius-Taurus": {
    shortLabel: "Change meets stability",
    descriptionTemplate:
      "{{A}} pushes for innovation; {{B}} holds steady and builds what lasts. The connection feels like a tug-of-war between comfort and change, but also a chance to blend vision with reliability.",
  },
  "Aquarius-Virgo": {
    shortLabel: "Problem-solvers",
    descriptionTemplate:
      "{{A}} sees the big picture and new angles; {{B}} sees details and practical steps. The connection feels analytical and improvement-focused, best when criticism turns into collaboration.",
  },
  "Aries-Cancer": {
    shortLabel: "Fire and water",
    descriptionTemplate:
      "{{A}} leads with action and directness; {{B}} leads with feeling and care. The bond mixes impulse with sensitivity—passionate when balanced, but easily bruised when tempos clash.",
  },
  "Aries-Capricorn": {
    shortLabel: "Sprint and marathon",
    descriptionTemplate:
      "{{A}} wants immediate action; {{B}} prefers steady, calculated progress. The connection can be productive when urgency meets strategy, but tense when pace and patience don't align.",
  },
  "Aries-Gemini": {
    shortLabel: "Fast friends",
    descriptionTemplate:
      "{{A}} brings boldness and drive; {{B}} brings wit and variety. Together this feels lively, playful, and quick-moving, with plenty of ideas and not much hesitation.",
  },
  "Aries-Leo": {
    shortLabel: "Double blaze",
    descriptionTemplate:
      "{{A}} starts fires; {{B}} shines bright. The connection feels passionate, confident, and full of energy—magnetic when aligned, but competitive when both want to lead.",
  },
  "Aries-Libra": {
    shortLabel: "Bold meets balanced",
    descriptionTemplate:
      "{{A}} charges forward; {{B}} weighs options and seeks harmony. The dynamic pulls between decisive action and thoughtful diplomacy—exciting when it balances, frustrating when it clashes.",
  },
  "Aries-Pisces": {
    shortLabel: "Fire and mist",
    descriptionTemplate:
      "{{A}} is direct and fast-moving; {{B}} is sensitive and fluid. The pairing mixes courage with compassion, but needs care so assertiveness doesn't overwhelm or confusion doesn't slow momentum.",
  },
  "Aries-Sagittarius": {
    shortLabel: "Adventure ready",
    descriptionTemplate:
      "{{A}} brings intensity and initiative; {{B}} brings optimism and range. Together this feels fearless, forward-moving, and ready for whatever's next—best when freedom is mutual.",
  },
  "Aries-Scorpio": {
    shortLabel: "Force meets depth",
    descriptionTemplate:
      "{{A}} acts on impulse; {{B}} acts with intensity. The bond is passionate and magnetic, but also prone to power struggles if honesty and trust aren't consistently tended.",
  },
  "Aries-Taurus": {
    shortLabel: "Rush and root",
    descriptionTemplate:
      "{{A}} moves fast and takes risks; {{B}} moves slowly and builds security. The connection stretches both—dynamic when respected, stubborn when neither gives ground.",
  },
  "Aries-Virgo": {
    shortLabel: "Action meets analysis",
    descriptionTemplate:
      "{{A}} leaps before looking; {{B}} looks carefully before stepping. The pairing can be effective when speed and precision collaborate, but tense when impulse meets criticism.",
  },
  "Cancer-Capricorn": {
    shortLabel: "Private and public",
    descriptionTemplate:
      "{{A}} nurtures at home; {{B}} builds in the world. The connection balances softness with structure, emotion with ambition—complementary when both feel valued, strained when work and care compete.",
  },
  "Cancer-Gemini": {
    shortLabel: "Depth and lightness",
    descriptionTemplate:
      "{{A}} feels deeply and holds close; {{B}} thinks quickly and moves often. The bond can blend emotional warmth with mental stimulation, but risks misalignment when one needs grounding and the other needs space.",
  },
  "Cancer-Leo": {
    shortLabel: "Warmth and radiance",
    descriptionTemplate:
      "{{A}} nurtures quietly; {{B}} shines openly. Together this can feel generous and affectionate, with {{A}} supporting and {{B}} celebrating—but attention and reassurance need to flow both ways.",
  },
  "Cancer-Libra": {
    shortLabel: "Care meets grace",
    descriptionTemplate:
      "{{A}} protects and feels; {{B}} harmonizes and considers. The pairing blends emotional depth with social ease, but can stall when moodiness meets indecision.",
  },
  "Cancer-Pisces": {
    shortLabel: "Emotional flow",
    descriptionTemplate:
      "{{A}} protects and nurtures; {{B}} dreams and empathizes. The connection feels tender, intuitive, and emotionally rich—safe when boundaries are clear, overwhelming when feelings flood.",
  },
  "Cancer-Sagittarius": {
    shortLabel: "Home and horizon",
    descriptionTemplate:
      "{{A}} seeks safety and closeness; {{B}} seeks freedom and adventure. The dynamic stretches between roots and wings—enriching when balanced, isolating when needs diverge.",
  },
  "Cancer-Scorpio": {
    shortLabel: "Deep waters",
    descriptionTemplate:
      "{{A}} nurtures with feeling; {{B}} connects with intensity. The bond feels emotionally profound and fiercely loyal, built on trust and vulnerability when fear doesn't close either heart.",
  },
  "Cancer-Taurus": {
    shortLabel: "Comfort and care",
    descriptionTemplate:
      "{{A}} offers emotional warmth; {{B}} offers steadiness and sensory comfort. Together this feels stable, tender, and deeply invested in building a secure, beautiful home life.",
  },
  "Cancer-Virgo": {
    shortLabel: "Tender and practical",
    descriptionTemplate:
      "{{A}} leads with emotion and care; {{B}} leads with help and precision. The connection blends nurturing with service, creating a supportive bond when critique doesn't turn into coldness.",
  },
  "Capricorn-Gemini": {
    shortLabel: "Steady meets scattered",
    descriptionTemplate:
      "{{A}} commits and builds; {{B}} explores and adapts. The pairing blends discipline with curiosity, effective when structure supports variety—strained when seriousness meets restlessness.",
  },
  "Capricorn-Leo": {
    shortLabel: "Authority and stage",
    descriptionTemplate:
      "{{A}} earns respect through discipline; {{B}} commands it with presence. The connection can be powerful and ambitious, but needs room for both achievement and recognition.",
  },
  "Capricorn-Libra": {
    shortLabel: "Structure meets style",
    descriptionTemplate:
      "{{A}} focuses on goals and results; {{B}} focuses on balance and relationships. The bond can blend ambition with grace, but differs on whether to prioritize work or harmony.",
  },
  "Capricorn-Pisces": {
    shortLabel: "Ground and dream",
    descriptionTemplate:
      "{{A}} builds with discipline; {{B}} flows with imagination. Together this can blend structure with vision—practical when {{A}} anchors and {{B}} inspires, strained when reality and fantasy don't meet.",
  },
  "Capricorn-Sagittarius": {
    shortLabel: "Climb and roam",
    descriptionTemplate:
      "{{A}} commits to the mountain; {{B}} chases the horizon. The connection blends ambition with optimism, effective when plans allow for freedom—tense when duty and adventure pull apart.",
  },
  "Capricorn-Scorpio": {
    shortLabel: "Power and control",
    descriptionTemplate:
      "{{A}} builds authority; {{B}} wields intensity. The bond feels serious, strategic, and formidable when trust is solid, but heavy when control or secrecy takes over.",
  },
  "Capricorn-Taurus": {
    shortLabel: "Builders",
    descriptionTemplate:
      "{{A}} plans for the long term; {{B}} values what lasts. Together this feels grounded, loyal, and committed to creating something stable and valuable—patient when progress is respected.",
  },
  "Capricorn-Virgo": {
    shortLabel: "Practical partners",
    descriptionTemplate:
      "{{A}} sets the structure; {{B}} refines the details. The connection feels efficient, reliable, and improvement-focused—strong when criticism stays constructive.",
  },
  "Gemini-Leo": {
    shortLabel: "Wit meets warmth",
    descriptionTemplate:
      "{{A}} brings cleverness and variety; {{B}} brings confidence and generosity. The bond feels social, playful, and expressive—lively when both feel seen and entertained.",
  },
  "Gemini-Libra": {
    shortLabel: "Air signs align",
    descriptionTemplate:
      "{{A}} brings mental speed; {{B}} brings social grace. Together this feels light, communicative, and intellectually engaged—flowing when variety and harmony coexist.",
  },
  "Gemini-Pisces": {
    shortLabel: "Mind and mood",
    descriptionTemplate:
      "{{A}} thinks and talks; {{B}} feels and imagines. The pairing blends logic with intuition, stimulating when curiosity meets empathy—confusing when words and emotions don't sync.",
  },
  "Gemini-Sagittarius": {
    shortLabel: "Curious opposites",
    descriptionTemplate:
      "{{A}} explores through ideas; {{B}} explores through experience. The connection feels restless, open-minded, and drawn to learning—exciting when freedom and honesty flow both ways.",
  },
  "Gemini-Scorpio": {
    shortLabel: "Light meets shadow",
    descriptionTemplate:
      "{{A}} skims surfaces with curiosity; {{B}} dives deep with intensity. The dynamic can be intriguing and magnetic, but tense when {{A}} feels probed and {{B}} feels trivialized.",
  },
  "Gemini-Taurus": {
    shortLabel: "Quick and slow",
    descriptionTemplate:
      "{{A}} moves mentally fast; {{B}} moves physically steady. The bond mixes stimulation with stability, complementary when pace is respected—frustrated when change and comfort clash.",
  },
  "Gemini-Virgo": {
    shortLabel: "Mental match",
    descriptionTemplate:
      "{{A}} explores and questions; {{B}} analyzes and refines. Together this feels intellectually alive and detail-aware, productive when curiosity and critique balance—tense when overthinking spirals.",
  },
  "Leo-Libra": {
    shortLabel: "Charm and confidence",
    descriptionTemplate:
      "{{A}} shines boldly; {{B}} smooths socially. The pairing feels warm, gracious, and people-focused—harmonious when admiration flows and neither compromises too much for peace.",
  },
  "Leo-Pisces": {
    shortLabel: "Radiance and empathy",
    descriptionTemplate:
      "{{A}} leads with presence; {{B}} leads with feeling. The connection blends drama with sensitivity—powerful when {{A}} protects and {{B}} softens, strained when pride meets withdrawal.",
  },
  "Leo-Sagittarius": {
    shortLabel: "Fire and fire",
    descriptionTemplate:
      "{{A}} shines with drama; {{B}} moves with adventure. Together this feels passionate, optimistic, and larger than life—best when both have room to express and explore without competing.",
  },
  "Leo-Scorpio": {
    shortLabel: "Heat and intensity",
    descriptionTemplate:
      "{{A}} demands recognition; {{B}} demands depth. The bond is magnetic and powerful, with strong attraction and equally strong will—thriving on loyalty, strained by control.",
  },
  "Leo-Taurus": {
    shortLabel: "Pride and stubbornness",
    descriptionTemplate:
      "{{A}} wants to shine; {{B}} wants to stay steady. The connection mixes generosity with loyalty, but both can dig in when challenged—strong when values align, stuck when neither budges.",
  },
  "Leo-Virgo": {
    shortLabel: "Stage and service",
    descriptionTemplate:
      "{{A}} seeks applause; {{B}} seeks usefulness. The pairing blends warmth with precision, effective when {{A}} appreciates help and {{B}} offers admiration—tense when criticism dims the spotlight.",
  },
  "Libra-Pisces": {
    shortLabel: "Soft and softer",
    descriptionTemplate:
      "{{A}} seeks balance and beauty; {{B}} seeks empathy and imagination. The bond feels gentle, artistic, and emotionally attuned—flowing when boundaries hold, blurry when neither leads.",
  },
  "Libra-Sagittarius": {
    shortLabel: "Social and free",
    descriptionTemplate:
      "{{A}} values partnership and fairness; {{B}} values honesty and space. The connection feels open, optimistic, and culturally curious—harmonious when commitment doesn't cage adventure.",
  },
  "Libra-Scorpio": {
    shortLabel: "Surface and depth",
    descriptionTemplate:
      "{{A}} seeks harmony and diplomacy; {{B}} seeks truth and intensity. The dynamic pulls between charm and confrontation—fascinating when both are willing to go beyond comfort zones.",
  },
  "Libra-Taurus": {
    shortLabel: "Beauty lovers",
    descriptionTemplate:
      "{{A}} loves balance and aesthetics; {{B}} loves comfort and sensory pleasure. Together this feels refined, affectionate, and drawn to beauty—solid when decisions don't stall on indecision or stubbornness.",
  },
  "Libra-Virgo": {
    shortLabel: "Grace and precision",
    descriptionTemplate:
      "{{A}} weighs options socially; {{B}} weighs details practically. The pairing blends thoughtfulness with analysis, effective when care and critique support each other—strained when perfection becomes the enemy of peace.",
  },
  "Pisces-Sagittarius": {
    shortLabel: "Dream and wander",
    descriptionTemplate:
      "{{A}} flows with feeling; {{B}} roams with optimism. The bond feels open-hearted and exploratory, blending empathy with adventure—harmonious when both respect emotional and physical freedom.",
  },
  "Pisces-Scorpio": {
    shortLabel: "Soul connection",
    descriptionTemplate:
      "{{A}} feels and empathizes; {{B}} probes and transforms. The connection is deeply emotional, intuitive, and intense—powerful when trust flows, overwhelming when boundaries dissolve or secrecy builds.",
  },
  "Pisces-Taurus": {
    shortLabel: "Gentle and grounded",
    descriptionTemplate:
      "{{A}} dreams and feels; {{B}} builds and stabilizes. Together this blends sensitivity with security, creating a tender, sensory-rich bond when {{A}} inspires and {{B}} anchors.",
  },
  "Pisces-Virgo": {
    shortLabel: "Chaos and order",
    descriptionTemplate:
      "{{A}} dissolves boundaries; {{B}} draws them clearly. The connection blends empathy with service, compassion with practicality—complementary when {{A}} softens and {{B}} organizes, tense when vagueness meets criticism.",
  },
  "Sagittarius-Scorpio": {
    shortLabel: "Light and shadow",
    descriptionTemplate:
      "{{A}} seeks truth openly; {{B}} seeks truth deeply. The pairing mixes honesty with intensity, adventure with depth—magnetic when curiosity meets passion, strained when bluntness triggers secrecy.",
  },
  "Sagittarius-Taurus": {
    shortLabel: "Roam and root",
    descriptionTemplate:
      "{{A}} craves freedom and exploration; {{B}} craves stability and comfort. The connection stretches between movement and stillness—enriching when both make space, frustrating when adventure meets resistance.",
  },
  "Sagittarius-Virgo": {
    shortLabel: "Vision and detail",
    descriptionTemplate:
      "{{A}} sees the big picture and possibilities; {{B}} sees the flaws and fixes. The bond blends optimism with analysis—productive when encouragement meets precision, tense when carelessness meets criticism.",
  },
  "Scorpio-Taurus": {
    shortLabel: "Fixed intensity",
    descriptionTemplate:
      "{{A}} craves emotional depth; {{B}} craves physical security. The connection feels magnetic, loyal, and possessive—powerful when trust is mutual, destructive when control or jealousy takes over.",
  },
  "Scorpio-Virgo": {
    shortLabel: "Depth and discipline",
    descriptionTemplate:
      "{{A}} probes motives; {{B}} refines methods. Together this feels focused, purposeful, and intensely committed—strong when precision meets passion, strained when critique feels like exposure.",
  },
  "Taurus-Virgo": {
    shortLabel: "Earth signs unite",
    descriptionTemplate:
      "{{A}} values stability and pleasure; {{B}} values order and usefulness. The bond feels practical, reliable, and quietly supportive—solid when both appreciate effort and results.",
  },
};

export function getWesternPairLines(
  userASign: string,
  userBSign: string
): WesternPairText | null {
  // Normalize input
  const normalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const signA = normalize(userASign);
  const signB = normalize(userBSign);

  // Create an order-agnostic key for lookup (sorted alphabetically)
  const [a, b] = [signA, signB].sort();
  const key = `${a}-${b}`;

  const pair = WESTERN_PAIR_COPY[key];
  if (!pair) {
    // Fallback – always still show A × B in order
    return {
      heading: `${signA} × ${signB}`,
      description: "",
    };
  }

  // Fill in A/B placeholders based on *actual* user order
  const description = pair.descriptionTemplate
    .replace(/\{\{A\}\}/g, signA)
    .replace(/\{\{B\}\}/g, signB);

  // Heading ALWAYS shows User A first, then User B
  const heading = `${signA} × ${signB} — ${pair.shortLabel}`;

  return { heading, description };
}

export type WesternPairKey = keyof typeof WESTERN_PAIR_COPY;
