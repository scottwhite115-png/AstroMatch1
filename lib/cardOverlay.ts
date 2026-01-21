// ================================
// AstroMatch Card Overlay Derivation
// Drop-in helpers for Cursor / TS
// ================================

// ---------- Existing types you shared ----------
export type ChinesePattern =
  | "SAN_HE" | "LIU_HE" | "SAME_SIGN" | "NO_PATTERN"
  | "LIU_CHONG" | "LIU_HAI" | "XING" | "PO";

export interface MatchResult {
  score: number;
  pattern: ChinesePattern;           // NOTE: may be base OR overlay in your union
  patternEmoji: string;
  patternShortLabelEn: string;
  patternFullLabel: string;
  pillLabel: string;
  baseTagline: string;
  chemistryStars: number;
  stabilityStars: number;
}

// ---------- Needed for card logic ----------
export type WesternElementRelation =
  | "SAME"
  | "COMPATIBLE"
  | "SEMI_COMPATIBLE"
  | "NEUTRAL"
  | "CLASH";

export type WestOpposition = "SOFT" | "NEUTRAL" | "HARD" | "OPPOSITION";

// Base pattern is only these four
export type ChineseBasePattern = "SAN_HE" | "LIU_HE" | "SAME_SIGN" | "NO_PATTERN";

// Overlay patterns are these four
export type ChineseOverlayPattern = "LIU_CHONG" | "LIU_HAI" | "XING" | "PO";

export type CardRank =
  | "JOKER"
  | "A" | "K" | "Q" | "J"
  | "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2" | "1";

export type CardSuit = "hearts" | "diamonds" | "spades" | "clubs";

// Secondary pip (trine group)
export type TrinePip = "A" | "B" | "C" | "D";

export interface CardOverlay {
  rank: CardRank;
  suit: CardSuit;
  pip: TrinePip;
  pills: string[];
  edgeStyle: "none" | "warning" | "danger";
}

// ============================================
// 1) Normalization helpers
// ============================================

export function normWestRel(rel: WesternElementRelation): "SAME" | "COMPATIBLE" | "SEMI" | "CLASH" {
  if (rel === "SAME") return "SAME";
  if (rel === "COMPATIBLE") return "COMPATIBLE";
  if (rel === "CLASH") return "CLASH";
  // Treat SEMI_COMPATIBLE and NEUTRAL as SEMI for card ranking
  return "SEMI";
}

export function isOppositeAxis(westOpposition: WestOpposition): boolean {
  return westOpposition === "OPPOSITION";
}

export function isBasePattern(p: ChinesePattern): p is ChineseBasePattern {
  return p === "SAN_HE" || p === "LIU_HE" || p === "SAME_SIGN" || p === "NO_PATTERN";
}

export function isOverlayPattern(p: ChinesePattern): p is ChineseOverlayPattern {
  return p === "LIU_CHONG" || p === "LIU_HAI" || p === "XING" || p === "PO";
}

// If you already have chineseBase and overlays from upstream, use them.
// If not, this attempts a safe best-effort:
// - pattern is treated as base if it matches base enum
// - otherwise base falls back to NO_PATTERN and pattern is treated as an overlay
export function splitBaseAndOverlays(pattern: ChinesePattern, overlaysMaybe?: ChineseOverlayPattern[]): {
  chineseBase: ChineseBasePattern;
  overlays: ChineseOverlayPattern[];
} {
  const overlays: ChineseOverlayPattern[] = Array.isArray(overlaysMaybe) ? overlaysMaybe.slice() : [];
  if (isBasePattern(pattern)) {
    return { chineseBase: pattern, overlays };
  }
  if (isOverlayPattern(pattern) && !overlays.includes(pattern)) overlays.push(pattern);
  return { chineseBase: "NO_PATTERN", overlays };
}

// ============================================
// 2) Suit (semantic) + pip (trine group)
// ============================================

export function deriveCardSuit(chineseBase: ChineseBasePattern, overlays: ChineseOverlayPattern[]): CardSuit {
  if (overlays.includes("LIU_CHONG")) return "spades";
  if (chineseBase === "SAN_HE") return "hearts";
  if (chineseBase === "LIU_HE") return "diamonds";
  return "clubs"; // SAME_SIGN or NO_PATTERN
}

// Pip from trine group using chineseLine if you have it.
// If you do not, pass the user's chinese animal and map it directly (recommended).
export function deriveTrinePipFromChineseLine(chineseLine: string): TrinePip {
  const s = (chineseLine || "").toLowerCase();
  if (s.includes("visionar")) return "A";   // Rat/Dragon/Monkey
  if (s.includes("strateg")) return "B";    // Ox/Snake/Rooster
  if (s.includes("adventur")) return "C";   // Tiger/Horse/Dog
  if (s.includes("artist")) return "D";     // Rabbit/Goat/Pig
  return "A";
}

// Optional direct mapping if you have the animal:
export type ChineseAnimal =
  | "rat" | "ox" | "tiger" | "rabbit" | "dragon" | "snake"
  | "horse" | "goat" | "monkey" | "rooster" | "dog" | "pig";

export function deriveTrinePipFromAnimal(animal: ChineseAnimal): TrinePip {
  if (animal === "rat" || animal === "dragon" || animal === "monkey") return "A";
  if (animal === "ox" || animal === "snake" || animal === "rooster") return "B";
  if (animal === "tiger" || animal === "horse" || animal === "dog") return "C";
  return "D"; // rabbit/goat/pig
}

// ============================================
// 3) Rank derivation (FINAL recommended rules)
// ============================================
//
// Priority order:
// 1) LIU_HAI forces 3/2/1 (always below neutral)
// 2) LIU_CHONG: Joker if strong & not same sign & not opposite axis; else 9; weak -> 8
// 3) SAN_HE: A (same element excluding same sign) / K (compatible) / Q (else)
// 4) LIU_HE: Q (same element excluding same sign) / J (compatible) / 10 (else)
// 5) SAME_SIGN: 9 (same element excluding same sign) / 8 (compatible OR same sign) / 7 (else)
// 6) NO_PATTERN: 7 (same element excluding same sign) / 6 (compatible) / 5 (semi OR same sign) / 4 (clash)

export function deriveCardRank(args: {
  chineseBase: ChineseBasePattern;
  overlays: ChineseOverlayPattern[];
  westElemRel: WesternElementRelation;
  sameWestSign: boolean;
  westOpposition: WestOpposition;
}): CardRank {
  const rel = normWestRel(args.westElemRel);
  const opp = isOppositeAxis(args.westOpposition);

  // 1) LIU_HAI forced ranks (3/2/1)
  if (args.overlays.includes("LIU_HAI")) {
    if (rel === "SAME") return "3";
    if (rel === "COMPATIBLE") return "2";
    return "1"; // SEMI or CLASH
  }

  // 2) LIU_CHONG (Magnetic Opposites)
  if (args.overlays.includes("LIU_CHONG")) {
    const strong = rel === "SAME" || rel === "COMPATIBLE";
    if (strong) {
      if (!args.sameWestSign && !opp) return "JOKER";
      return "9";
    }
    return "8"; // SEMI or CLASH
  }

  // 3) SAN_HE
  if (args.chineseBase === "SAN_HE") {
    if (rel === "SAME" && !args.sameWestSign) return "A";
    if (rel === "COMPATIBLE") return "K";
    return "Q";
  }

  // 4) LIU_HE
  if (args.chineseBase === "LIU_HE") {
    if (rel === "SAME" && !args.sameWestSign) return "Q";
    if (rel === "COMPATIBLE") return "J";
    return "10";
  }

  // 5) SAME_SIGN
  if (args.chineseBase === "SAME_SIGN") {
    if (rel === "SAME" && !args.sameWestSign) return "9";
    if (rel === "COMPATIBLE" || args.sameWestSign) return "8";
    return "7";
  }

  // 6) NO_PATTERN (Neutral)
  if (rel === "SAME" && !args.sameWestSign) return "7";
  if (rel === "COMPATIBLE") return "6";
  if (rel === "CLASH") return "4";
  return "5"; // SEMI or sameWestSign
}

// ============================================
// 4) Pills (chips) + edge styling
// ============================================

export function buildPills(args: {
  chineseBase: ChineseBasePattern;
  overlays: ChineseOverlayPattern[];
  westElemRel: WesternElementRelation;
  sameWestSign: boolean;
  westOpposition: WestOpposition;
}): string[] {
  const pills: string[] = [];

  // Base family pill
  if (args.chineseBase === "SAN_HE") pills.push("San He");
  else if (args.chineseBase === "LIU_HE") pills.push("Secret Friends");
  else if (args.chineseBase === "SAME_SIGN") pills.push("Same Sign");
  else pills.push("Neutral");

  // Overlay pills
  if (args.overlays.includes("LIU_CHONG")) pills.push("Six Conflicts");
  if (args.overlays.includes("LIU_HAI")) pills.push("Six Harms");
  if (args.overlays.includes("XING")) pills.push("Punishment");
  if (args.overlays.includes("PO")) pills.push("Breakpoint");

  // West relation pill
  const rel = normWestRel(args.westElemRel);
  pills.push(
    rel === "SAME" ? "Same Element" :
    rel === "COMPATIBLE" ? "Compatible" :
    rel === "CLASH" ? "Clash" :
    "Semi"
  );

  if (args.sameWestSign) pills.push("Same Western Sign");
  if (isOppositeAxis(args.westOpposition)) pills.push("Opposite Axis");

  return pills;
}

// Edge style: warn on overlay presence excluding LIU_CHONG (identity) unless you prefer otherwise
export function deriveEdgeStyle(overlays: ChineseOverlayPattern[]): "none" | "warning" | "danger" {
  const nonIdentity = overlays.filter(o => o !== "LIU_CHONG").length;
  if (nonIdentity >= 2) return "danger";
  if (nonIdentity === 1) return "warning";
  return "none";
}

// ============================================
// 5) One-shot builder: attach card overlay to a UI box
// ============================================

// Minimal interface for whatever UI box you are attaching to.
// You mentioned SimpleConnectionBox earlier; here's a compatible subset.
export interface SimpleConnectionBoxLike {
  score: number;
  pattern?: ChinesePattern;
  chineseLine?: string;
  matchLabel?: string;
  chemistryStars?: number;
  stabilityStars?: number;
}

export function buildCardOverlay(params: {
  box: SimpleConnectionBoxLike;
  // Prefer passing these explicitly (best). If you don't have them, you can use splitBaseAndOverlays on box.pattern.
  chineseBase?: ChineseBasePattern;
  overlays?: ChineseOverlayPattern[];
  // Required contextual inputs
  westElemRel: WesternElementRelation;
  sameWestSign: boolean;
  westOpposition: WestOpposition;
  // Pip source: choose one
  trinePipFromAnimal?: ChineseAnimal;   // best if available
}): CardOverlay {
  const baseAndOverlays = params.chineseBase
    ? { chineseBase: params.chineseBase, overlays: params.overlays ?? [] }
    : splitBaseAndOverlays(params.box.pattern ?? "NO_PATTERN", params.overlays);

  const chineseBase = baseAndOverlays.chineseBase;
  const overlays = baseAndOverlays.overlays;

  const rank = deriveCardRank({
    chineseBase,
    overlays,
    westElemRel: params.westElemRel,
    sameWestSign: params.sameWestSign,
    westOpposition: params.westOpposition,
  });

  const suit = deriveCardSuit(chineseBase, overlays);

  const pip =
    params.trinePipFromAnimal
      ? deriveTrinePipFromAnimal(params.trinePipFromAnimal)
      : deriveTrinePipFromChineseLine(params.box.chineseLine ?? "");

  const pills = buildPills({
    chineseBase,
    overlays,
    westElemRel: params.westElemRel,
    sameWestSign: params.sameWestSign,
    westOpposition: params.westOpposition,
  });

  const edgeStyle = deriveEdgeStyle(overlays);

  return { rank, suit, pip, pills, edgeStyle };
}

// Convenience: attach to an existing box object
export function attachCardOverlay<T extends SimpleConnectionBoxLike>(box: T, overlay: CardOverlay): T & { card: CardOverlay } {
  return { ...box, card: overlay };
}
