// eastWestHelpers.ts - Shared types and helpers for East/West zodiac systems

export type East = "Rat"|"Ox"|"Tiger"|"Rabbit"|"Dragon"|"Snake"|"Horse"|"Goat"|"Monkey"|"Rooster"|"Dog"|"Pig";
export type West = "Aries"|"Taurus"|"Gemini"|"Cancer"|"Leo"|"Virgo"|"Libra"|"Scorpio"|"Sagittarius"|"Capricorn"|"Aquarius"|"Pisces";
export type Element = "Fire"|"Earth"|"Air"|"Water";

// Legacy aliases for backwards compatibility
export type WestSign = West;
export type EastAnimal = East;

export const TRINES: East[][] = [
  ["Rat","Dragon","Monkey"],
  ["Ox","Snake","Rooster"],
  ["Tiger","Horse","Dog"],
  ["Rabbit","Goat","Pig"],
];

export const SECRET_FRIEND: Record<East, East> = {
  Rat:"Ox", Ox:"Rat", Tiger:"Pig", Pig:"Tiger",
  Rabbit:"Dog", Dog:"Rabbit", Dragon:"Rooster", Rooster:"Dragon",
  Snake:"Monkey", Monkey:"Snake", Horse:"Goat", Goat:"Horse",
};

const CLASH = new Set([
  "Rat-Horse","Horse-Rat","Ox-Goat","Goat-Ox",
  "Tiger-Monkey","Monkey-Tiger","Rabbit-Rooster","Rooster-Rabbit",
  "Dragon-Dog","Dog-Dragon","Snake-Pig","Pig-Snake",
]);

const CYCLE: East[] = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];

export const areAdjacent = (a:East,b:East) => {
  const i = CYCLE.indexOf(a), j = CYCLE.indexOf(b);
  return j === (i+1)%12 || j === (i+11)%12;
};
export const sameTrine = (a:East,b:East) => TRINES.some(t => t.includes(a) && t.includes(b));
export const secretFriends = (a:East,b:East) => SECRET_FRIEND[a] === b;
export const isClash = (a:East,b:East) => CLASH.has(`${a}-${b}`);

export function pairKey(e1:Element, e2:Element){ return `${e1}-${e2}` as const; }


