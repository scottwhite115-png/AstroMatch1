// src/lib/match/constants.ts
import type { West, East } from "./types";

export const element: Record<West,"fire"|"earth"|"air"|"water"> = {
  aries:"fire", taurus:"earth", gemini:"air", cancer:"water",
  leo:"fire", virgo:"earth", libra:"air", scorpio:"water",
  sagittarius:"fire", capricorn:"earth", aquarius:"air", pisces:"water"
};

export const modality: Record<West,"cardinal"|"fixed"|"mutable"> = {
  aries:"cardinal", taurus:"fixed", gemini:"mutable", cancer:"cardinal",
  leo:"fixed", virgo:"mutable", libra:"cardinal", scorpio:"fixed",
  sagittarius:"mutable", capricorn:"cardinal", aquarius:"fixed", pisces:"mutable"
};

// Aries..Pisces order (for aspect calc)
export const zodiacOrder: West[] = [
  "aries","taurus","gemini","cancer","leo","virgo",
  "libra","scorpio","sagittarius","capricorn","aquarius","pisces"
];

// Chinese trine sets
export const trines = {
  visionaries: new Set<East>(["rat","dragon","monkey"]),
  strategists: new Set<East>(["ox","snake","rooster"]),
  adventurers: new Set<East>(["tiger","horse","dog"]),
  artists:     new Set<East>(["rabbit","goat","pig"])
};

export const clashes = new Set<string>([
  "rat-horse","ox-goat","tiger-monkey","rabbit-rooster","dragon-dog","snake-pig"
]);

export const allies: Record<East,East[]> = {
  rat:["monkey","dragon"], ox:["snake","rooster"], tiger:["horse","dog"],
  rabbit:["goat","pig"], dragon:["rat","monkey"], snake:["ox","rooster"],
  horse:["tiger","dog"], goat:["rabbit","pig"], monkey:["rat","dragon"],
  rooster:["ox","snake"], dog:["tiger","horse"], pig:["rabbit","goat"]
};

export const yangAnimals = new Set<East>(["rat","tiger","dragon","horse","monkey","dog"]);

