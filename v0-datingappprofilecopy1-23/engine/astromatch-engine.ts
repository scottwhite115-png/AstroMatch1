// astromatch-engine.ts — Final Refined Version (2025)

export type West =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type East =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export type Tier =
  | "Soulmate"
  | "Twin Flame"
  | "Excellent"
  | "Good"
  | "Fair"
  | "Neutral"
  | "Difficult"
  | "Challenging";

export type Aspect =
  | "same"        // Conjunct
  | "trine"
  | "sextile"
  | "square"
  | "semi-sextile"
  | "quincunx"
  | "opposite";

export type Badge = "Magnetic Opposites" | "Opposites Attract — not recommended";

export interface MatchResult {
  tier: Tier;
  color: string;
  score: number;
  badges: Badge[];
  western: {
    aspect: Aspect;
    elements: { a: string; b: string; relation: "same" | "compatible" | "incompatible" };
  };
  chinese: {
    relation:
      | "same-animal"
      | "same-trine"
      | "supportive"
      | "opposite"
      | "damage"
      | "none";
  };
}

// ---------- Western data ----------
const WEST_ELEMENTS: Record<West, "Fire" | "Earth" | "Air" | "Water"> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};

const WEST_COMPAT: Record<West, {
  trine: West[]; sextile: West[]; oppose: West[]; conjunct: West[];
  square: West[]; "semi-sextile": West[]; quincunx: West[];
}> = {
  Aries: { trine:["Leo","Sagittarius"], sextile:["Gemini","Aquarius"], oppose:["Libra"], conjunct:["Aries"], square:["Cancer","Capricorn"], "semi-sextile":["Taurus","Pisces"], quincunx:["Virgo","Scorpio"] },
  Taurus: { trine:["Virgo","Capricorn"], sextile:["Cancer","Pisces"], oppose:["Scorpio"], conjunct:["Taurus"], square:["Leo","Aquarius"], "semi-sextile":["Aries","Gemini"], quincunx:["Libra","Sagittarius"] },
  Gemini: { trine:["Libra","Aquarius"], sextile:["Aries","Leo"], oppose:["Sagittarius"], conjunct:["Gemini"], square:["Virgo","Pisces"], "semi-sextile":["Taurus","Cancer"], quincunx:["Scorpio","Capricorn"] },
  Cancer: { trine:["Scorpio","Pisces"], sextile:["Taurus","Virgo"], oppose:["Capricorn"], conjunct:["Cancer"], square:["Aries","Libra"], "semi-sextile":["Gemini","Leo"], quincunx:["Sagittarius","Aquarius"] },
  Leo: { trine:["Aries","Sagittarius"], sextile:["Gemini","Libra"], oppose:["Aquarius"], conjunct:["Leo"], square:["Taurus","Scorpio"], "semi-sextile":["Cancer","Virgo"], quincunx:["Capricorn","Pisces"] },
  Virgo: { trine:["Taurus","Capricorn"], sextile:["Cancer","Scorpio"], oppose:["Pisces"], conjunct:["Virgo"], square:["Gemini","Sagittarius"], "semi-sextile":["Leo","Libra"], quincunx:["Aries","Aquarius"] },
  Libra: { trine:["Gemini","Aquarius"], sextile:["Leo","Sagittarius"], oppose:["Aries"], conjunct:["Libra"], square:["Cancer","Capricorn"], "semi-sextile":["Virgo","Scorpio"], quincunx:["Taurus","Pisces"] },
  Scorpio: { trine:["Cancer","Pisces"], sextile:["Virgo","Capricorn"], oppose:["Taurus"], conjunct:["Scorpio"], square:["Leo","Aquarius"], "semi-sextile":["Libra","Sagittarius"], quincunx:["Aries","Gemini"] },
  Sagittarius: { trine:["Aries","Leo"], sextile:["Libra","Aquarius"], oppose:["Gemini"], conjunct:["Sagittarius"], square:["Virgo","Pisces"], "semi-sextile":["Scorpio","Capricorn"], quincunx:["Taurus","Cancer"] },
  Capricorn: { trine:["Taurus","Virgo"], sextile:["Scorpio","Pisces"], oppose:["Cancer"], conjunct:["Capricorn"], square:["Aries","Libra"], "semi-sextile":["Sagittarius","Aquarius"], quincunx:["Leo","Gemini"] },
  Aquarius: { trine:["Gemini","Libra"], sextile:["Aries","Sagittarius"], oppose:["Leo"], conjunct:["Aquarius"], square:["Taurus","Scorpio"], "semi-sextile":["Capricorn","Pisces"], quincunx:["Cancer","Virgo"] },
  Pisces: { trine:["Cancer","Scorpio"], sextile:["Taurus","Capricorn"], oppose:["Virgo"], conjunct:["Pisces"], square:["Gemini","Sagittarius"], "semi-sextile":["Aries","Aquarius"], quincunx:["Leo","Libra"] },
};

function westAspect(a: West, b: West): Aspect {
  if (a === b) return "same";
  const row = WEST_COMPAT[a];
  for (const key of Object.keys(row) as Aspect[])
    if ((row as any)[key].includes(b)) return key;
  return "quincunx";
}

function elementRelation(a: West, b: West): "same"|"compatible"|"incompatible" {
  const ea = WEST_ELEMENTS[a], eb = WEST_ELEMENTS[b];
  if (ea === eb) return "same";
  const compatible: Record<string,string[]> = {
    Fire: ["Air"], Air: ["Fire"], Earth: ["Water"], Water: ["Earth"]
  };
  return compatible[ea].includes(eb) ? "compatible" : "incompatible";
}

// ---------- Chinese data ----------
const TRINES: East[][] = [
  ["Rat","Dragon","Monkey"],
  ["Ox","Snake","Rooster"],
  ["Tiger","Horse","Dog"],
  ["Rabbit","Goat","Pig"],
];

const SUPPORTIVE: [East,East][] = [
  ["Rat","Ox"], ["Tiger","Pig"], ["Rabbit","Dog"],
  ["Dragon","Rooster"], ["Snake","Monkey"], ["Horse","Goat"],
];

const OPPOSITES: [East,East][] = [
  ["Rat","Horse"], ["Ox","Goat"], ["Tiger","Monkey"],
  ["Rabbit","Rooster"], ["Dragon","Dog"], ["Snake","Pig"],
];

const DAMAGES: [East,East][] = [
  ["Rat","Goat"], ["Ox","Horse"], ["Tiger","Snake"],
  ["Rabbit","Dragon"], ["Monkey","Pig"], ["Rooster","Dog"],
];

function sameTrine(a: East,b:East){return TRINES.some(g=>g.includes(a)&&g.includes(b));}
function supportive(a:East,b:East){return SUPPORTIVE.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));}
function oppositeEast(a:East,b:East){return OPPOSITES.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));}
function damageEast(a:East,b:East){return DAMAGES.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));}

// ---------- Tier ranges ----------
const TIER_RANGES: Record<Tier,[number,number]> = {
  Soulmate:[93,100], "Twin Flame":[85,92], Excellent:[75,84],
  Good:[65,74], Fair:[50,64], Neutral:[35,49],
  Difficult:[25,34], Challenging:[0,24],
};

const TIER_COLORS: Record<Tier,string> = {
  Soulmate:"#FFD700",        // Gold
  "Twin Flame":"#F97316",      // AstroMatch orange
  Excellent:"#FF69B4",       // Pink
  Good:"#32CD32",            // Green
  Fair:"#1E90FF",            // Blue
  Neutral:"#00D4FF",         // Electric cyan
  Difficult:"#FF0000",       // Red
  Challenging:"#8B0000",     // Dark Red
};

function midpoint([a,b]:[number,number]){return Math.round((a+b)/2);}
function tinyHash(a:string,b:string){const s=a+"::"+b;let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return (h%7)-3;}

// ---------- Main ----------
export function evaluateMatch(westA:West,eastA:East,westB:West,eastB:East):MatchResult{
  const asp=westAspect(westA,westB);
  const elemRel=elementRelation(westA,westB);
  const sameWest=asp==="same";
  const oppWest=asp==="opposite";
  const sameEast=eastA===eastB;

  const cRel =
    sameEast?"same-animal":
    sameTrine(eastA,eastB)?"same-trine":
    supportive(eastA,eastB)?"supportive":
    oppositeEast(eastA,eastB)?"opposite":
    damageEast(eastA,eastB)?"damage":"none";

  const badges:Badge[]=[];
  if(oppWest||cRel==="opposite")badges.push("Magnetic Opposites");

  // ---------- Tier logic ----------
  const soulmateOK =
    cRel==="same-trine" && elemRel==="same" && !sameWest && !sameEast;

  const twinOK =
    cRel==="same-trine" &&
    (asp==="sextile" || elemRel==="compatible") &&
    !oppWest && !sameEast;

  const excellentOK =
    ((cRel==="same-animal" && elemRel==="same" && !sameWest) ||
     (cRel==="supportive" && elemRel==="same"));

  const neutralOK =
    ((sameWest||oppWest) &&
     (cRel==="same-trine"||cRel==="same-animal"||cRel==="supportive"));

  const fairOK =
    (cRel==="same-trine" &&
     (asp==="square"||asp==="semi-sextile"||asp==="quincunx")) ||
    (cRel==="opposite" &&
     (elemRel==="same"||elemRel==="compatible"));

  const difficultOK =
    (cRel==="opposite" &&
     (asp==="square"||asp==="semi-sextile"||asp==="quincunx"));

  const challengingOK = cRel==="damage";

  let tier:Tier;
  if(soulmateOK) tier="Soulmate";
  else if(twinOK) tier="Twin Flame";
  else if(excellentOK) tier="Excellent";
  else if(neutralOK) tier="Neutral";
  else if(fairOK) tier="Fair";
  else if(difficultOK) tier="Difficult";
  else if(challengingOK) tier="Challenging";
  else {
    const sameTrineFamily = cRel==="same-trine" || cRel==="same-animal";
    if(sameTrineFamily && (asp==="trine" || asp==="sextile" || asp==="same")) tier="Good";
    else if(asp==="trine"||asp==="sextile") tier="Fair";
    else if(asp==="square"||asp==="quincunx"||asp==="semi-sextile") tier="Difficult";
    else tier="Neutral";
  }

  if(tier==="Challenging" && cRel==="opposite")
    badges.push("Opposites Attract — not recommended");

  // ---------- Score ----------
  let score = midpoint(TIER_RANGES[tier]) + tinyHash(`${westA}${eastA}`,`${westB}${eastB}`);
  score = Math.max(0,Math.min(100,score));

  return {
    tier,
    color:TIER_COLORS[tier],
    score,
    badges,
    western:{ aspect:asp, elements:{ a:WEST_ELEMENTS[westA], b:WEST_ELEMENTS[westB], relation:elemRel }},
    chinese:{ relation:cRel as MatchResult["chinese"]["relation"] }
  };
}

// Example test:
// console.log(evaluateMatch("Aquarius","Monkey","Gemini","Rat"));

