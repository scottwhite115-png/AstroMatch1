// src/lib/match/engine.ts
import { element, modality, zodiacOrder, trines, clashes, allies, yangAnimals } from "./constants";
import { weights } from "./weights";
import { rankFromScore } from "./ranks";
import { composeTheme } from "./themes";
import type { Fusion, MatchResult } from "./types";

function aspect(a: keyof typeof element, b: keyof typeof element) {
  const da = zodiacOrder.indexOf(a), db = zodiacOrder.indexOf(b);
  let d = Math.abs(da - db);
  d = Math.min(d, 12 - d);
  if (d === 4) return "trine";
  if (d === 2 || d === 10) return "sextile";
  if (d === 6) return "opposition";
  if (d === 3 || d === 9) return "square";
  return "other";
}

function sameTrine(ea: string, eb: string) {
  return (trines.visionaries.has(ea as any) && trines.visionaries.has(eb as any))
      || (trines.strategists.has(ea as any) && trines.strategists.has(eb as any))
      || (trines.adventurers.has(ea as any) && trines.adventurers.has(eb as any))
      || (trines.artists.has(ea as any)     && trines.artists.has(eb as any));
}

export function scorePair(a: Fusion, b: Fusion): MatchResult {
  const reasons: string[] = [];
  let s = 0;

  // --- Western layer
  const ea = element[a.west], eb = element[b.west];
  if (ea === eb) { s += weights.sameElement; reasons.push("Same element"); }
  else if ((ea==="air"&&eb==="fire")||(ea==="fire"&&eb==="air")||(ea==="earth"&&eb==="water")||(ea==="water"&&eb==="earth")) {
    s += weights.complementaryElements; reasons.push("Complementary elements");
  } else {
    const samePolarity = (["air","fire"].includes(ea) && ["air","fire"].includes(eb)) ||
                         (["earth","water"].includes(ea) && ["earth","water"].includes(eb));
    s += samePolarity ? weights.neutralElements : weights.tenseElements;
    reasons.push(samePolarity ? "Neutral element mix" : "Tense element mix");
  }

  const ma = modality[a.west], mb = modality[b.west];
  if (ma === mb) {
    if (ma === "mutable") { s += weights.modalitySameMutable; reasons.push("Same modality (mutable)"); }
    else if (ma === "cardinal") { s += weights.modalitySameCardinal; reasons.push("Same modality (cardinal)"); }
    else { s += weights.modalitySameFixed; reasons.push("Same modality (fixed caution)"); }
  } else { s += weights.modalityComplementary; reasons.push("Complementary modalities"); }

  const asp = aspect(a.west, b.west);
  if (asp === "trine") { s += weights.aspectTrine; reasons.push("Trine aspect"); }
  else if (asp === "sextile") { s += weights.aspectSextile; reasons.push("Sextile aspect"); }
  else if (asp === "opposition") { s += weights.aspectOpposition; reasons.push("Opposition polarity"); }
  else if (asp === "square") { s += weights.aspectSquare; reasons.push("Square tension"); }

  // --- Chinese layer
  const ae = a.east, be = b.east;
  if (sameTrine(ae, be)) { s += weights.sameTrine; reasons.push("Same Chinese trine"); }
  else {
    const friendly =
      (trines.visionaries.has(ae as any) && trines.adventurers.has(be as any)) ||
      (trines.adventurers.has(ae as any) && trines.visionaries.has(be as any)) ||
      (trines.strategists.has(ae as any) && trines.artists.has(be as any)) ||
      (trines.artists.has(ae as any)     && trines.strategists.has(be as any));
    if (friendly) { s += weights.friendlyTrines; reasons.push("Friendly trines"); }
  }

  if (allies[ae]?.includes(be)) { s += weights.animalAlliesPrimary; reasons.push("Animal allies"); }
  if (allies[be]?.includes(ae)) { s += weights.animalAlliesSecondary; } // asym bonus

  if (clashes.has(`${ae}-${be}`) || clashes.has(`${be}-${ae}`)) {
    s += weights.animalClash; reasons.push("Animal clash");
  }

  if (yangAnimals.has(ae) && yangAnimals.has(be)) {
    s += weights.highTempoBothYang; reasons.push("High-tempo synergy");
  }

  // --- Cross modifiers (viewer's west element × partner trine family)
  if (element[a.west] === "air" && trines.visionaries.has(be as any)) s += weights.airUserVisionaryPartner;
  if (element[a.west] === "fire" && trines.visionaries.has(be as any)) s += weights.fireUserVisionaryPartner;
  if (element[a.west] === "water" && trines.artists.has(be as any))    s += weights.waterUserArtistPartner;
  if (element[a.west] === "earth" && trines.strategists.has(be as any))s += weights.earthUserStrategistPartner;

  // (optional) known hard cross patterns → weights.hardCrossPenalty
  // Example: very private Water × performative Rooster
  if ((element[a.west] === "water" || element[b.west] === "water") && (ae === "rooster" || be === "rooster")) {
    s += weights.hardCrossPenalty; reasons.push("Hard cross (privacy vs performance)");
  }

  const score = Math.max(0, Math.min(100, Math.round(s)));
  const rank = rankFromScore(score);
  const theme = composeTheme(reasons);

  return { score, rank, reasons, theme, tags: [ea, eb, ae, be, asp] };
}

