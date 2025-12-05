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
    shortLabel: "All gas, no brakes",
    description: "Two Aries light up fast with passion, honesty, and instinct. There's big chemistry and a low tolerance for boredom, but also ego clashes and impulsive decisions.",
  },
  "Aries-Taurus": {
    shortLabel: "Spark meets stillness",
    description: "Aries wants speed and change; Taurus wants calm and security. Taurus can ground Aries and make life more stable, while Aries pushes Taurus to move and take risks.",
  },
  "Aries-Gemini": {
    shortLabel: "Quick and curious",
    description: "Both signs thrive on movement and novelty. Aries brings drive and blunt courage; Gemini brings ideas, humour, and mental agility.",
  },
  "Aries-Cancer": {
    shortLabel: "Heat and shell",
    description: "Aries is direct and confrontational; Cancer is protective and sensitive. There's care here, but it demands extra patience and emotional skill to avoid constant misunderstandings.",
  },
  "Aries-Leo": {
    shortLabel: "Big, bright energy",
    description: "Leo and Aries share boldness, passion, and forward momentum. The connection feels confident and lively, though clashes around ego and control are part of the package.",
  },
  "Aries-Virgo": {
    shortLabel: "Plan vs. impulse",
    description: "Virgo wants to analyse and improve; Aries wants to act now. The pairing is useful and productive when criticism and defensiveness are kept in check.",
  },
  "Aries-Libra": {
    shortLabel: "Me and we",
    description: "Libra seeks partnership and fairness; Aries seeks autonomy and direct action. The attraction is strong but so is the polarity.",
  },
  "Aries-Scorpio": {
    shortLabel: "Depth vs. blaze",
    description: "Scorpio moves slowly and intensely; Aries moves quickly and openly. The attraction can be strong, but so are power struggles.",
  },
  "Aries-Sagittarius": {
    shortLabel: "Adventure fire",
    description: "Both signs are bold, straightforward, and restless. Aries supplies raw drive; Sagittarius offers optimism and a bigger vision.",
  },
  "Aries-Capricorn": {
    shortLabel: "Plan vs. push",
    description: "Capricorn prefers strategy and delayed gratification; Aries prefers action and fast results. They're strong as a team on shared goals, but romance can feel like constant negotiation.",
  },
  "Aries-Aquarius": {
    shortLabel: "Rebel alliance",
    description: "Aquarius and Aries both value independence and directness. Aries brings courage and immediate action; Aquarius brings strategy and long-range vision.",
  },
  "Aries-Pisces": {
    shortLabel: "Dream and drive",
    description: "Pisces moves through intuition and emotion; Aries through direct action. Aries can protect and energise Pisces; Pisces can soften Aries and add empathy.",
  },
  "Taurus-Taurus": {
    shortLabel: "Slow and sure",
    description: "Two Taureans build a stable, comfort-focused life with strong loyalty and physical affection. The risk is stubborn stand-offs and getting fixed in routines.",
  },
  "Gemini-Taurus": {
    shortLabel: "Body vs. buzz",
    description: "Taurus seeks calm, tangible pleasures; Gemini seeks variety and mental stimulation. It works if Taurus accepts change and Gemini respects Taurus' need to slow down.",
  },
  "Cancer-Taurus": {
    shortLabel: "Home-builders",
    description: "Both value safety, loyalty, and emotional security. Cancer contributes nurturing and sensitivity; Taurus offers patience, reliability, and practical support.",
  },
  "Leo-Taurus": {
    shortLabel: "Fixed pride",
    description: "Leo wants expression and recognition; Taurus wants calm and consistency. It can be affectionate but stubborn, with neither quick to compromise.",
  },
  "Taurus-Virgo": {
    shortLabel: "Practical builders",
    description: "Virgo and Taurus share a love of the tangible and reliable. Taurus provides patience and stability; Virgo provides refinement and problem-solving.",
  },
  "Libra-Taurus": {
    shortLabel: "Venus in two modes",
    description: "Both signs are Venus-ruled and enjoy beauty, comfort, and relationships. Taurus leans into sensual stability; Libra into charm and social harmony.",
  },
  "Scorpio-Taurus": {
    shortLabel: "Possession and surrender",
    description: "Both signs are fixed and focused on security, but in different realms. Taurus cares about material and bodily comfort; Scorpio about emotional and psychological bonds.",
  },
  "Sagittarius-Taurus": {
    shortLabel: "Wander vs. nest",
    description: "Sagittarius wants exploration and open horizons; Taurus wants a secure, predictable base. There's learning here, but everyday compatibility can be tricky.",
  },
  "Capricorn-Taurus": {
    shortLabel: "Slow build",
    description: "Both signs value stability, loyalty, and tangible progress. Taurus offers patience and pleasure; Capricorn offers ambition and structure.",
  },
  "Aquarius-Taurus": {
    shortLabel: "Future vs. familiar",
    description: "Aquarius is drawn to the unconventional; Taurus to the tried-and-true. The pairing can be rich and frustrating, often arguing about what 'security' really means.",
  },
  "Pisces-Taurus": {
    shortLabel: "Dreams with soil",
    description: "Taurus offers stability and practical care; Pisces offers imagination, sensitivity, and emotional colour. The relationship often feels gentle and quietly secure.",
  },
  "Gemini-Gemini": {
    shortLabel: "Mirror minds",
    description: "Two Geminis create a lively, talkative, and changeable bond. There's no shortage of topics, jokes, or social plans, but emotional grounding can be thin.",
  },
  "Cancer-Gemini": {
    shortLabel: "Head meets heart",
    description: "Gemini leads with words and ideas; Cancer leads with feelings and tone. Misunderstandings appear when Cancer takes everything to heart and Gemini treats emotion like just another topic.",
  },
  "Gemini-Leo": {
    shortLabel: "Playful and expressive",
    description: "This pairing is socially bright and mentally stimulating. Gemini adds wit and variety; Leo adds heart and theatrical flair.",
  },
  "Gemini-Virgo": {
    shortLabel: "Thinking in detail",
    description: "Both are mentally active and curious, but they move differently: Gemini explores widely while Virgo refines deeply.",
  },
  "Gemini-Libra": {
    shortLabel: "Social flow",
    description: "Libra and Gemini easily fill space with conversation and ideas. Gemini brings humour and variety; Libra brings tact and a feel for balance.",
  },
  "Gemini-Scorpio": {
    shortLabel: "X-ray vs. snapshot",
    description: "Scorpio wants depth and consistency; Gemini wants movement and variety. Fascination is possible, but so is mutual mistrust.",
  },
  "Gemini-Sagittarius": {
    shortLabel: "Student and teacher, both ways",
    description: "Both are curious and freedom-loving, but Sagittarius seeks overarching meaning while Gemini collects facts and stories. They can be great travel or debate partners.",
  },
  "Capricorn-Gemini": {
    shortLabel: "Results vs. options",
    description: "Capricorn measures by outcomes; Gemini by experiences and connections. Respect can exist, but everyday rhythm and priorities often clash.",
  },
  "Aquarius-Gemini": {
    shortLabel: "Ideas on ideas",
    description: "Both signs thrive on conversation and mental stimulation. Gemini offers flexibility and social variety; Aquarius offers perspective, eccentricity, and a cause-driven streak.",
  },
  "Gemini-Pisces": {
    shortLabel: "Waves and words",
    description: "Pisces senses, Gemini explains. Gemini can help Pisces sort and name feelings; Pisces helps Gemini feel beyond the rational.",
  },
  "Cancer-Cancer": {
    shortLabel: "Mirror feelings",
    description: "Two Cancers create a deeply sensitive, intuitive bond. They understand each other's need for emotional safety and home, but they can spiral into shared moods or avoidance.",
  },
  "Cancer-Leo": {
    shortLabel: "Heart and care",
    description: "Cancer wants emotional security; Leo wants recognition. Leo brings warmth and confidence; Cancer brings tenderness and intuitive care.",
  },
  "Cancer-Virgo": {
    shortLabel: "Practical care",
    description: "Cancer nurtures with feeling; Virgo nurtures with action and analysis. Together they create a thoughtful, supportive bond focused on care and improvement.",
  },
  "Cancer-Libra": {
    shortLabel: "Manners and mood",
    description: "Libra reads the room; Cancer feels the room. Cancer can find Libra too detached or people-pleasing; Libra can find Cancer too moody or personal.",
  },
  "Cancer-Scorpio": {
    shortLabel: "Deep tide",
    description: "Scorpio and Cancer both value emotional loyalty and privacy. Cancer offers care and softness; Scorpio offers depth and staying power.",
  },
  "Cancer-Sagittarius": {
    shortLabel: "Hearth vs. horizon",
    description: "Cancer seeks emotional continuity and home; Sagittarius seeks growth through movement and change. This pairing requires unusually high maturity to balance both needs.",
  },
  "Cancer-Capricorn": {
    shortLabel: "Roof and roots",
    description: "Capricorn and Cancer mirror themes of work and home, public and private. Capricorn focuses on responsibility and achievement; Cancer on care and emotional safety.",
  },
  "Aquarius-Cancer": {
    shortLabel: "Detachment vs. closeness",
    description: "Cancer wants emotional reassurance and homey bonding; Aquarius wants space and connection through ideas or shared causes. This match requires conscious, ongoing translation between head and heart.",
  },
  "Cancer-Pisces": {
    shortLabel: "Safe tide",
    description: "Both are compassionate and emotionally tuned-in. Cancer brings protection and memory; Pisces brings imagination and spiritual or artistic depth.",
  },
  "Leo-Leo": {
    shortLabel: "Double fire",
    description: "Two Leos create a warm, expressive, and drama-filled bond. Both understand the need for attention and appreciation, but sharing the spotlight requires maturity.",
  },
  "Leo-Virgo": {
    shortLabel: "Stage and precision",
    description: "Leo wants expression and recognition; Virgo wants refinement and usefulness. Virgo helps Leo edit their act; Leo helps Virgo shine more openly.",
  },
  "Leo-Libra": {
    shortLabel: "Charming and social",
    description: "Both enjoy romance, beauty, and social life. Leo brings warmth and theatrical flair; Libra adds elegance and a talent for smoothing edges.",
  },
  "Leo-Scorpio": {
    shortLabel: "Power faces",
    description: "Leo wants to be seen; Scorpio wants to see what's hidden. Both have strong pride and dislike feeling controlled. The connection can be sexy and dramatic, but who holds power becomes a recurring theme.",
  },
  "Leo-Sagittarius": {
    shortLabel: "Festival energy",
    description: "Sagittarius and Leo share enthusiasm, warmth, and a taste for drama. Leo offers loyalty and heart; Sagittarius offers humour and adventure.",
  },
  "Capricorn-Leo": {
    shortLabel: "Status and stage",
    description: "Leo wants recognition and heart connection; Capricorn wants respect and tangible success. Together they can be a visible, effective pair.",
  },
  "Aquarius-Leo": {
    shortLabel: "Star and satellite",
    description: "Aquarius and Leo sit opposite each other. Leo brings personal passion and visibility; Aquarius brings group focus and objectivity.",
  },
  "Leo-Pisces": {
    shortLabel: "Stage and dream",
    description: "Leo wants visible expression and clear recognition; Pisces wants subtle emotional and imaginative connection. The dynamic is romantic but can be ungrounded without practical agreements.",
  },
  "Virgo-Virgo": {
    shortLabel: "Double precision",
    description: "Two Virgos build a thoughtful, organised, and often self-critical bond. They understand each other's need for order and improvement, but can spiral into mutual nitpicking.",
  },
  "Libra-Virgo": {
    shortLabel: "Curator and critic",
    description: "Libra wants harmony and aesthetics; Virgo wants functionality and improvement. The match is workable but requires both to tolerate critique.",
  },
  "Scorpio-Virgo": {
    shortLabel: "Strategic support",
    description: "Virgo and Scorpio both notice what others miss. Virgo brings analysis and practical solutions; Scorpio brings insight and emotional focus.",
  },
  "Sagittarius-Virgo": {
    shortLabel: "Story vs. spreadsheet",
    description: "Virgo wants detail and precision; Sagittarius wants broad strokes and possibility. Respect for each other's role is essential if this is going to work.",
  },
  "Capricorn-Virgo": {
    shortLabel: "Competent duo",
    description: "Capricorn and Virgo both appreciate reliability and effort. Virgo handles details; Capricorn handles long-term direction.",
  },
  "Aquarius-Virgo": {
    shortLabel: "Theory and method",
    description: "Aquarius imagines new systems; Virgo refines existing ones. The bond is mentally rich and useful, though emotional intimacy must be built consciously.",
  },
  "Pisces-Virgo": {
    shortLabel: "Chaos and order",
    description: "Pisces and Virgo mirror each other's blind spots and strengths. Virgo brings analysis, boundaries, and practicality; Pisces brings compassion, intuition, and surrender.",
  },
  "Libra-Libra": {
    shortLabel: "Mirror of charm",
    description: "Two Libras usually get along smoothly and share a taste for beauty, fairness, and partnership. The downside is indecision and conflict avoidance, with issues swept under the rug.",
  },
  "Libra-Scorpio": {
    shortLabel: "Smooth vs. intense",
    description: "Libra prefers diplomacy; Scorpio prefers emotional truth, even if it's messy. Attraction can be high, but the emotional cost often is too.",
  },
  "Libra-Sagittarius": {
    shortLabel: "Light and bright",
    description: "Both signs enjoy social life, ideas, and a measure of freedom. Libra brings charm and relational awareness; Sagittarius brings honesty and adventure.",
  },
  "Capricorn-Libra": {
    shortLabel: "Image and structure",
    description: "Capricorn focuses on status and responsibility; Libra on relationships and presentation. Together they can form a capable, outwardly polished duo.",
  },
  "Aquarius-Libra": {
    shortLabel: "Diplomat and reformer",
    description: "Both care about fairness and social dynamics. Libra handles one-on-one harmony; Aquarius looks at broader systems.",
  },
  "Libra-Pisces": {
    shortLabel: "Romantic haze",
    description: "Pisces brings sensitivity and imagination; Libra brings charm and a love of partnership. The relationship can feel poetic and gentle, but it risks indecision and avoidance.",
  },
  "Scorpio-Scorpio": {
    shortLabel: "Intensity mirrored",
    description: "Two Scorpios create a powerful, private, and emotionally charged relationship. They understand each other's need for depth and loyalty, but also share jealousy and a tendency to hold grudges.",
  },
  "Sagittarius-Scorpio": {
    shortLabel: "Secrets vs. bluntness",
    description: "Scorpio is private and strategic; Sagittarius is open and straightforward. There's potential for growth, but it often feels like work.",
  },
  "Capricorn-Scorpio": {
    shortLabel: "Serious alliance",
    description: "Both signs are determined and future-oriented. Scorpio brings emotional depth and focus; Capricorn brings structure, ambition, and steadiness.",
  },
  "Aquarius-Scorpio": {
    shortLabel: "Fixed intensity",
    description: "Both are fixed signs with strong opinions, but express it differently. Scorpio operates emotionally and instinctively; Aquarius intellectually and idealistically.",
  },
  "Pisces-Scorpio": {
    shortLabel: "Mystic waters",
    description: "Scorpio and Pisces both tune into the unseen. Pisces brings compassion and imagination; Scorpio brings focus and emotional courage.",
  },
  "Sagittarius-Sagittarius": {
    shortLabel: "Two wild cards",
    description: "Two Sagittarians create a high-energy, exploratory relationship. Shared humour, bluntness, and love of space abound. Commitment and consistency are the main challenges.",
  },
  "Capricorn-Sagittarius": {
    shortLabel: "Vision and structure",
    description: "Sagittarius dreams big and pushes outward; Capricorn builds and contains. Together they can achieve a lot—Sagittarius opens doors, Capricorn keeps them stable.",
  },
  "Aquarius-Sagittarius": {
    shortLabel: "Big sky thinkers",
    description: "Aquarius and Sagittarius both look beyond the here-and-now. Sagittarius brings humour, adventure, and a quest for meaning; Aquarius brings innovation and concern for the bigger picture.",
  },
  "Pisces-Sagittarius": {
    shortLabel: "Faith and fantasy",
    description: "Both are idealistic and drawn to meaning beyond the material. Sagittarius seeks truth out there; Pisces feels it in here.",
  },
  "Capricorn-Capricorn": {
    shortLabel: "Double duty",
    description: "Two Capricorns create a highly responsible, goal-focused partnership. They respect each other's work ethic and resilience, but tenderness can fall to the bottom of the list.",
  },
  "Aquarius-Capricorn": {
    shortLabel: "Old rule, new rule",
    description: "Capricorn embodies tradition and hierarchy; Aquarius challenges systems and norms. Together they can reform or reinforce structures, depending on their dynamic.",
  },
  "Capricorn-Pisces": {
    shortLabel: "Form and feeling",
    description: "Pisces brings compassion, creativity, and emotional nuance; Capricorn brings containment, stability, and realism. The match can be quietly powerful and supportive.",
  },
  "Aquarius-Aquarius": {
    shortLabel: "Echo chamber of ideas",
    description: "Two Aquarians create a mentally electric, unusual, and often friend-based bond. Shared values of autonomy and authenticity are strong. The risk is drifting into parallel lives with lots of theory and not enough emotional anchoring.",
  },
  "Aquarius-Pisces": {
    shortLabel: "Cosmos and ocean",
    description: "Pisces feels into the collective; Aquarius thinks about it. Pisces brings compassion and softness; Aquarius brings clarity and distance.",
  },
  "Pisces-Pisces": {
    shortLabel: "Double dream",
    description: "Two Pisceans create a sensitive, intuitive, and often otherworldly bond. The empathy is deep, but so is the temptation to escape reality together.",
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

