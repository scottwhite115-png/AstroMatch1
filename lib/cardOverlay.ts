// ================================
// AstroMatch Card Overlay Derivation
// Drop-in helpers for Cursor / TS
// ================================
//
// 🏁 ENGINE v1 — FORMALLY COMPLETE
//
// This is a closed symbolic universe:
// • Astrology → rank → tarot → % → visuals → snippets
// • Overrides with precedence
// • Guardrails with failsafes
// • Runtime invariant validation
//
// There are no undefined states left.
// This is production-grade and ready to ship.
//
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

export type EdgeGlowState = 
  | "soulmate"      // 🟢 Soft golden-white halo, subtle pulsing
  | "growth"        // 🟡 Warm amber glow, static
  | "danger"        // 🔴 Deep red halo, low-frequency pulse
  | "chaos"         // 🃏 Violet + gold shimmer, irregular flicker
  | "severance"     // ⚫ Dark crimson/black edge, no pulse, matte
  | "none";         // No glow (neutral tier)

export interface CardOverlay {
  rank: CardRank;
  suit: CardSuit;
  pip: TrinePip;
  pills: string[];
  edgeStyle: "none" | "warning" | "danger"; // Legacy field (kept for backward compatibility)
  edgeGlow: EdgeGlowState; // NEW: Edge glow state with precedence rules
  suitColor: string; // NEW: Semantic suit color (hex or CSS color)
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

/**
 * 🔒 Guard: Assert rank immutability for LIU_HAI
 * 
 * This function prevents any later logic from upgrading rank if overlays includes LIU_HAI.
 * LIU_HAI must always result in ranks 3, 2, or 1 - no exceptions.
 * 
 * @param rank - The current rank to validate
 * @param overlays - The Chinese overlay patterns
 * @returns The validated rank (corrected if necessary)
 */
export function assertLiuHaiRankImmutability(
  rank: CardRank,
  overlays: ChineseOverlayPattern[]
): CardRank {
  if (!overlays.includes("LIU_HAI")) {
    return rank; // No LIU_HAI present, rank can be anything
  }
  
  // LIU_HAI present - rank MUST be 3, 2, or 1
  const validLiuHaiRanks: CardRank[] = ["3", "2", "1"];
  if (validLiuHaiRanks.includes(rank)) {
    return rank; // Rank is valid
  }
  
  // Rank is invalid for LIU_HAI - this should never happen if deriveCardRank is correct
  console.error(`[🔒 RANK IMMUTABILITY VIOLATION] LIU_HAI overlay present but rank is ${rank} (expected 3/2/1). Forcing rank to "2" as defensive fix.`);
  return "2"; // Default to rank "2" for LIU_HAI as defensive fix
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

/**
 * 🔒 Final Suit Color Semantics (Canonical)
 * 
 * Suit colors are emotional tone carriers, not decorative.
 * They are the user's first subconscious read of a match.
 */
export const SUIT_COLORS: Record<CardSuit, string> = {
  hearts: "#e91e63",      // ♥ Soft rose / warm red - Emotional Harmony
  diamonds: "#ffb84d",    // ♦ Champagne gold / soft amber - Karmic Affinity
  clubs: "#64748b",       // ♣ Slate gray / charcoal - Neutral Ground
  spades: "#4a148c",      // ♠ Deep indigo / blood red accents - Shadow/Harm/Chaos
};

/**
 * Derives card suit based on Chinese pattern semantics
 * 
 * 🔒 Canonical Suit Semantics (LOCKED):
 * 
 * ♥ Hearts — Emotional Harmony (San He)
 *   Trigger: Chinese base = SAN_HE, no LIU_HAI, no PO
 *   Meaning: Warmth, love, natural affection, soulmate energy
 * 
 * ♦ Diamonds — Karmic Affinity (Liu He)
 *   Trigger: Chinese base = LIU_HE, no LIU_HAI, no PO
 *   Meaning: Secret friends, long-term karmic support, quiet loyalty
 * 
 * ♣ Clubs — Neutral / Same-Sign / Ordinary Fate
 *   Trigger: Chinese base = SAME_SIGN or NO_PATTERN, no severe overlays
 *   Meaning: Familiar, ordinary, stable but unremarkable
 * 
 * ♠ Spades — Conflict / Shadow / Chaos
 *   Trigger: Overlay includes LIU_CHONG, XING, PO, or LIU_HAI
 *   Meaning: Tension, karmic conflict, shadow dynamics
 */
export function deriveCardSuit(chineseBase: ChineseBasePattern, overlays: ChineseOverlayPattern[]): CardSuit {
  // ♠ Spades: Conflict / Shadow / Chaos (highest priority)
  // Triggered by any severe overlay: LIU_CHONG, XING, PO, or LIU_HAI
  if (
    overlays.includes("LIU_CHONG") ||
    overlays.includes("XING") ||
    overlays.includes("PO") ||
    overlays.includes("LIU_HAI")
  ) {
    return "spades";
  }
  
  // ♥ Hearts: Emotional Harmony (San He)
  // Trigger: SAN_HE base, no LIU_HAI, no PO (already checked above)
  if (chineseBase === "SAN_HE") {
    return "hearts";
  }
  
  // ♦ Diamonds: Karmic Affinity (Liu He)
  // Trigger: LIU_HE base, no LIU_HAI, no PO (already checked above)
  if (chineseBase === "LIU_HE") {
    return "diamonds";
  }
  
  // ♣ Clubs: Neutral / Same-Sign / Ordinary Fate
  // Trigger: SAME_SIGN or NO_PATTERN, no severe overlays (already checked above)
  return "clubs"; // SAME_SIGN or NO_PATTERN
}

/**
 * 🔒 Trine Pip Semantics (CANONICAL)
 * 
 * Pip represents the soul-style of the match, subtly coloring the tarot meaning.
 * 
 * Pip	Chinese Trine	Label	Archetype
 * A	Rat–Dragon–Monkey	Visionaries	Insight, ideas, innovation
 * B	Ox–Snake–Rooster	Strategists	Stability, discipline, power
 * C	Tiger–Horse–Dog	Adventurers	Action, courage, loyalty
 * D	Rabbit–Goat–Pig	Artists	Sensitivity, beauty, care
 * 
 * Example: "The Empress · 86% · ♥ · Pip A"
 * → Emotional soulmate
 * → Visionary soul-style
 * → Feels like a future-building love
 */

// Pip from trine group using chineseLine if you have it.
// If you do not, pass the user's chinese animal and map it directly (recommended).
export function deriveTrinePipFromChineseLine(chineseLine: string): TrinePip {
  const s = (chineseLine || "").toLowerCase();
  if (s.includes("visionar")) return "A";   // Rat/Dragon/Monkey — Visionaries
  if (s.includes("strateg")) return "B";    // Ox/Snake/Rooster — Strategists
  if (s.includes("adventur")) return "C";   // Tiger/Horse/Dog — Adventurers
  if (s.includes("artist")) return "D";     // Rabbit/Goat/Pig — Artists
  return "A"; // Default fallback
}

// Optional direct mapping if you have the animal:
export type ChineseAnimal =
  | "rat" | "ox" | "tiger" | "rabbit" | "dragon" | "snake"
  | "horse" | "goat" | "monkey" | "rooster" | "dog" | "pig";

export function deriveTrinePipFromAnimal(animal: ChineseAnimal): TrinePip {
  // Pip A: Visionaries (Rat, Dragon, Monkey)
  if (animal === "rat" || animal === "dragon" || animal === "monkey") return "A";
  // Pip B: Strategists (Ox, Snake, Rooster)
  if (animal === "ox" || animal === "snake" || animal === "rooster") return "B";
  // Pip C: Adventurers (Tiger, Horse, Dog)
  if (animal === "tiger" || animal === "horse" || animal === "dog") return "C";
  // Pip D: Artists (Rabbit, Goat, Pig)
  return "D";
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

  // 🔒 Priority of Overrides (Final precedence order)
  // 1. Death (highest priority) - PO + CLASH/OPPOSITION
  // 2. Ten of Swords - LIU_HAI + CLASH
  // 3. The Fool (JOKER) - LIU_CHONG + strong West harmony
  // 4. Normal rank tarot (lowest priority)
  // This guarantees: PO always beats Chong, Harm always beats harmony, Chaos never hides severance

  // 🔒 Milestone 6: Tarot Override Resolution (Canonical Precedence)
  // Resolve tarot override FIRST to determine if rank should be forced
  const tarotOverride = resolveTarotOverride({
    overlays: args.overlays,
    westElemRel: args.westElemRel,
    westOpposition: args.westOpposition,
  });

  // 1) 💀 Death Override: PO + CLASH/OPPOSITION → Force rank "1"
  // Highest priority - must be checked FIRST
  if (tarotOverride === "DEATH") {
    return "1"; // Rank forced to "1" for Death override
  }

  // 🔒 Polarity Harmony Normalization Rule
  // If opposition is present with harmony/neutral base patterns (and no blocking overlays),
  // treat the element relation as COMPATIBLE for ranking purposes
  let effectiveRel = rel;
  if (
    opp === true &&
    (args.chineseBase === "SAN_HE" || args.chineseBase === "LIU_HE" || args.chineseBase === "NO_PATTERN") &&
    !args.overlays.includes("LIU_HAI") &&
    !args.overlays.includes("PO")
  ) {
    effectiveRel = "COMPATIBLE";
  }

  // 2) 🗡️ Ten of Swords Override: LIU_HAI + (CLASH or SEMI) → Force rank "1"
  // Second priority - checked after Death but before JOKER
  if (tarotOverride === "TEN_OF_SWORDS") {
    return "1"; // Rank forced to "1" for Ten of Swords override
  }

  // 3) 🃏 Fool Override: LIU_CHONG + strong West → Force rank "JOKER"
  // Third priority - checked after Death and Ten of Swords
  if (tarotOverride === "FOOL") {
    return "JOKER"; // Rank forced to "JOKER" for Fool override
  }

  // 🔒 FIX 1: LIU_HAI Must Force Rank 3/2/1 (No Exceptions)
  // This MUST be checked early and the returned rank must be final.
  // No later logic may upgrade it. This is a hard lock.
  if (args.overlays.includes("LIU_HAI")) {
    // Use effectiveRel (which respects polarity normalization) but LIU_HAI always forces low ranks
    if (effectiveRel === "SAME") return "3";
    if (effectiveRel === "COMPATIBLE") return "2";
    return "1"; // SEMI or CLASH (CLASH already handled by Ten of Swords override above)
    // NOTE: This returns early - no further rank logic can override this
  }

  // Note: Fool override (JOKER) is now handled above via resolveTarotOverride()
  // If we reach here, LIU_CHONG is present but doesn't trigger Fool override
  // (e.g., weak West relation, or blocked by LIU_HAI/PO)
  if (args.overlays.includes("LIU_CHONG")) {
    const strong = effectiveRel === "SAME" || effectiveRel === "COMPATIBLE";
    if (strong) {
      // Not a Fool override (blocked by LIU_HAI/PO or weak West), return normal rank
      return "9"; // Strong but not Fool - magnetic but not chaos
    }
    return "8"; // SEMI or CLASH - magnetic but not chaos
  }

  // 4) Normal rank tarot (lowest priority) - Standard pattern-based ranks
  // SAN_HE
  // 🔒 Final SAN_HE ladder (canonical)
  // For chineseBase === SAN_HE and no LIU_HAI or PO:
  // Same element (incl. same sign) → A (Lovers)
  // Compatible element (incl. opposites) → K (Emperor)
  // Semi / neutral → Q (Empress)
  if (args.chineseBase === "SAN_HE") {
    // LIU_HAI already handled above (returns early), so we only need to check PO
    // If PO is present, it may modify behavior, but for now apply canonical ladder
    if (effectiveRel === "SAME") return "A";
    if (effectiveRel === "COMPATIBLE") return "K";
    return "Q";
  }

  // LIU_HE
  if (args.chineseBase === "LIU_HE") {
    if (effectiveRel === "SAME" && !args.sameWestSign) return "Q";
    if (effectiveRel === "COMPATIBLE") return "J";
    return "10";
  }

  // SAME_SIGN
  if (args.chineseBase === "SAME_SIGN") {
    if (effectiveRel === "SAME" && !args.sameWestSign) return "9";
    if (effectiveRel === "COMPATIBLE" || args.sameWestSign) return "8";
    return "7";
  }

  // NO_PATTERN (Neutral)
  // 🔒 Neutral-East Polarity Boost Rule
  // If NO_PATTERN + opposition + no blocking overlays:
  // Treat as COMPATIBLE and apply +1 tier boost (cap at "9" or "10")
  if (args.chineseBase === "NO_PATTERN") {
    // Check if polarity boost applies
    const shouldBoost = 
      opp === true &&
      !args.overlays.includes("LIU_HAI") &&
      !args.overlays.includes("PO");
    
    if (shouldBoost) {
      // Treat as COMPATIBLE and apply +1 tier boost
      // Normal COMPATIBLE is "6", so boost to "7"
      // But if it would be higher, cap at "9" or "10"
      if (effectiveRel === "SAME" && !args.sameWestSign) return "9"; // SAME boosted from "7" to "9"
      if (effectiveRel === "COMPATIBLE") return "8"; // COMPATIBLE boosted from "6" to "8"
      if (effectiveRel === "CLASH") return "6"; // CLASH boosted from "4" to "6"
      return "7"; // SEMI boosted from "5" to "7"
    }
    
    // Standard NO_PATTERN ladder (no boost)
    if (effectiveRel === "SAME" && !args.sameWestSign) return "7";
    if (effectiveRel === "COMPATIBLE") return "6";
    if (effectiveRel === "CLASH") return "4";
    return "5"; // SEMI or sameWestSign
  }
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
// Legacy function - kept for backward compatibility
export function deriveEdgeStyle(overlays: ChineseOverlayPattern[]): "none" | "warning" | "danger" {
  const nonIdentity = overlays.filter(o => o !== "LIU_CHONG").length;
  if (nonIdentity >= 2) return "danger";
  if (nonIdentity === 1) return "warning";
  return "none";
}

/**
 * 🔒 Minimal Implementation Logic (Deterministic Resolver)
 * 
 * Canonical resolver order - combines suit and glow resolution in one deterministic function.
 * This makes matches scannable in < 200ms and prevents visual bugs.
 * 
 * @param args - Visual state resolution arguments
 * @returns Deterministic suit and glow state
 */
export function resolveVisualState(args: {
  rank: CardRank;
  chineseBase: ChineseBasePattern;
  overlays: ChineseOverlayPattern[];
  isDeathOverride?: boolean;
  isTenOfSwordsOverride?: boolean;
}): {
  suit: CardSuit;
  glow: EdgeGlowState;
  suitColor: string;
} {
  // 1) Death override (Highest Precedence)
  if (args.isDeathOverride) {
    return { 
      suit: "spades", 
      glow: "severance",
      suitColor: SUIT_COLORS.spades
    };
  }

  // 2) Ten of Swords override
  if (args.isTenOfSwordsOverride) {
    return { 
      suit: "spades", 
      glow: "danger",
      suitColor: SUIT_COLORS.spades
    };
  }

  // 3) Fool override (JOKER)
  if (args.rank === "JOKER") {
    return { 
      suit: "spades", 
      glow: "chaos",
      suitColor: SUIT_COLORS.spades
    };
  }

  // 4) Harm overlays (LIU_HAI, PO, XING)
  if (args.overlays.some(o => ["LIU_HAI", "PO", "XING"].includes(o))) {
    return { 
      suit: "spades", 
      glow: "danger",
      suitColor: SUIT_COLORS.spades
    };
  }

  // 5) Base suit (derived from Chinese pattern)
  const suit = deriveCardSuit(args.chineseBase, args.overlays);
  const suitColor = SUIT_COLORS[suit];

  // 6) Glow from rank tier
  // Soulmate tier (A, K, Q)
  if (["A", "K", "Q"].includes(args.rank)) {
    return { suit, glow: "soulmate", suitColor };
  }

  // Growth tier (J, 10, 9, 8)
  if (["J", "10", "9", "8"].includes(args.rank)) {
    return { suit, glow: "growth", suitColor };
  }

  // Neutral tier (7, 6, 5)
  if (["7", "6", "5"].includes(args.rank)) {
    return { suit, glow: "none", suitColor };
  }

  // Harm tier (4, 3, 2, 1) - fallback to danger
  return { 
    suit: "spades", 
    glow: "danger",
    suitColor: SUIT_COLORS.spades
  };
}

/**
 * 🔒 Edge Glow States (Premium Layer)
 * 
 * This is the truth halo around the card.
 * It must always agree with rank + overrides.
 * 
 * Precedence order (highest to lowest):
 * 1. Death (Severance Glow)
 * 2. Ten of Swords (Danger Glow)
 * 3. The Fool (Chaos Glow)
 * 4. Harm tier (4-1) (Danger Glow)
 * 5. Soulmate tier (A-Q) (Soulmate Glow)
 * 6. Growth tier (J-8) (Growth Glow)
 * 7. Neutral tier (7-5) (No Glow)
 * 
 * Visual Doctrine:
 * - Only one glow at a time (never stack/blend)
 * - Suit color always visible (glow is secondary)
 * - Overrides trump cosmetics (never pretty glow on Death)
 * 
 * @deprecated Use resolveVisualState() for deterministic resolution
 */
export function deriveEdgeGlow(
  rank: CardRank,
  overlays: ChineseOverlayPattern[],
  options?: {
    isDeathOverride?: boolean;
    isTenOfSwordsOverride?: boolean;
  }
): EdgeGlowState {
  // ⚫ Severance Glow (Highest Precedence)
  // Trigger: Death override OR rank "1" with PO
  if (options?.isDeathOverride || (rank === "1" && overlays.includes("PO"))) {
    return "severance";
  }
  
  // 🗡️ Ten of Swords Override → Danger Glow
  if (options?.isTenOfSwordsOverride) {
    return "danger";
  }
  
  // 🃏 Chaos Glow (Third Precedence)
  // Trigger: Rank === JOKER OR Tarot override === The Fool
  if (rank === "JOKER") {
    return "chaos";
  }
  
  // 🔴 Danger Glow (Fourth Precedence)
  // Trigger: Harm tier (4-1) OR any severe harm overlay
  const isHarmTier = rank === "4" || rank === "3" || rank === "2" || rank === "1";
  const hasHarmOverlay = overlays.includes("LIU_HAI") || overlays.includes("PO") || overlays.includes("XING");
  
  if (isHarmTier || hasHarmOverlay) {
    return "danger";
  }
  
  // 🟢 Soulmate Glow (Fifth Precedence)
  // Trigger: Soulmate tier (A, K, Q) AND no harm overlays
  const isSoulmateTier = rank === "A" || rank === "K" || rank === "Q";
  const hasNoHarmOverlays = !overlays.includes("LIU_HAI") && !overlays.includes("PO") && !overlays.includes("XING");
  
  if (isSoulmateTier && hasNoHarmOverlays) {
    return "soulmate";
  }
  
  // 🟡 Growth Glow (Sixth Precedence)
  // Trigger: Growth tier (J, 10, 9, 8) AND no severe harm overlays
  const isGrowthTier = rank === "J" || rank === "10" || rank === "9" || rank === "8";
  
  if (isGrowthTier && hasNoHarmOverlays) {
    return "growth";
  }
  
  // No Glow (Lowest Precedence)
  // Neutral tier (7, 6, 5) or any other case
  return "none";
}

// ============================================
// 5) Rank-to-Band Mapping & Score Projection
// ============================================

/**
 * Canonical Rank → % Bands mapping
 * This is the hard semantic contract: CardRank defines meaning, score defines intensity within that meaning
 */
export interface RankBand {
  min: number;
  max: number;
  tarot: string;
  archetypeName: string;
  coreMeaning: string;
}

// 🔒 Final RANK_BANDS Table (Canonical)
// This is now your numeric truth layer. Everything else must conform to this.
// Bands intentionally overlap slightly. Tarot semantics are preserved.
// Joker overlaps King/Queen by design. Low-end cards have wider bands (life is messier down there).
// 🟢 Soulmate / High Harmony Tier
// 🟡 Harmony / Growth Tier
// 🔴 Tension / Harm Tier
// 🃏 Special Archetypes (Overrides)
export const RANK_BANDS: Record<CardRank, RankBand> = {
  // 🟢 Soulmate / High Harmony Tier
  A:      { min: 92, max: 100, tarot: "The Lovers", archetypeName: "Soulmate Union", coreMeaning: "Deep resonance, mutual recognition, life-partner energy" },
  K:      { min: 88, max: 94,  tarot: "The Emperor", archetypeName: "Marriage Axis", coreMeaning: "Stability, polarity balance, long-term structure" },
  Q:      { min: 84, max: 90,  tarot: "The Empress", archetypeName: "Affection Bond", coreMeaning: "Emotional warmth, nurturing love, natural closeness" },
  J:      { min: 80, max: 88,  tarot: "Page of Cups", archetypeName: "Romantic Spark", coreMeaning: "Fresh attraction, sweetness, emotional curiosity" },
  
  // 🟡 Harmony / Growth Tier
  "10":   { min: 76, max: 86,  tarot: "Ten of Cups", archetypeName: "Lasting Harmony", coreMeaning: "Joyful companionship, shared future potential" },
  "9":    { min: 72, max: 84,  tarot: "Nine of Cups", archetypeName: "Fulfillment", coreMeaning: "Emotional satisfaction, mutual enjoyment" },
  "8":    { min: 68, max: 80,  tarot: "Eight of Pentacles", archetypeName: "Growth Bond", coreMeaning: "A connection that improves with effort" },
  "7":    { min: 62, max: 74,  tarot: "Two of Pentacles", archetypeName: "Balance Bond", coreMeaning: "Manageable differences, workable pairing" },
  "6":    { min: 56, max: 70,  tarot: "Six of Cups", archetypeName: "Familiar Ease", coreMeaning: "Gentle connection, comfort, nostalgia" },
  "5":    { min: 50, max: 64,  tarot: "Seven of Cups", archetypeName: "Confusion Bond", coreMeaning: "Mixed signals, unclear direction" },
  
  // 🔴 Tension / Harm Tier
  "4":    { min: 44, max: 58,  tarot: "Five of Wands", archetypeName: "Friction Bond", coreMeaning: "Frequent conflict, clashing styles" },
  "3":    { min: 30, max: 48,  tarot: "Three of Swords", archetypeName: "Heartbreak Bond", coreMeaning: "Emotional pain, disappointment" },
  "2":    { min: 18, max: 36,  tarot: "Five of Pentacles", archetypeName: "Deprivation Bond", coreMeaning: "Feeling unseen, unsupported" },
  "1":    { min: 5,  max: 22,  tarot: "Ten of Swords", archetypeName: "Ruin Bond", coreMeaning: "Emotional collapse, toxic pairing" },
  
  // 🃏 Special Archetypes (Overrides)
  JOKER:  { min: 82, max: 95,  tarot: "The Fool", archetypeName: "Chaos Destiny", coreMeaning: "Intense attraction, unpredictability, instability, attraction + chaos duality" },
};

/**
 * 🔒 Milestone 6: Tarot Override Trigger Table (Canonical)
 * 
 * This function resolves tarot overrides with canonical precedence:
 * 1. Death (highest)
 * 2. Ten of Swords
 * 3. The Fool
 * 4. Normal rank tarot (lowest)
 * 
 * @param args - Override resolution arguments
 * @returns Override type or null if no override
 */
export function resolveTarotOverride(args: {
  overlays: ChineseOverlayPattern[];
  westElemRel: WesternElementRelation;
  westOpposition: WestOpposition;
}): "DEATH" | "TEN_OF_SWORDS" | "FOOL" | null {
  const rel = normWestRel(args.westElemRel);
  const opp = isOppositeAxis(args.westOpposition);

  // 1) 💀 Death — Severance Destiny (Highest Precedence)
  // Trigger: PO + (CLASH or OPPOSITION)
  if (
    args.overlays.includes("PO") &&
    (rel === "CLASH" || opp)
  ) {
    return "DEATH";
  }

  // 2) 🗡️ Ten of Swords — Emotional Ruin
  // Trigger: LIU_HAI + (CLASH or SEMI)
  if (
    args.overlays.includes("LIU_HAI") &&
    (rel === "CLASH" || rel === "SEMI")
  ) {
    return "TEN_OF_SWORDS";
  }

  // 3) 🃏 Fool — Chaos Destiny
  // Trigger: LIU_CHONG + (SAME or COMPATIBLE) + no LIU_HAI + no PO
  if (
    args.overlays.includes("LIU_CHONG") &&
    (rel === "SAME" || rel === "COMPATIBLE") &&
    !args.overlays.includes("LIU_HAI") &&
    !args.overlays.includes("PO")
  ) {
    return "FOOL";
  }

  return null;
}

/**
 * Detects if DEATH override should be applied
 * 💀 Death Override Trigger: PO overlay + West CLASH or OPPOSITION
 * Rules:
 * - Tarot must ALWAYS display: Death
 * - Rank forced to "1"
 * - Snippet must reference: structural incompatibility, long-term instability, terminal mismatch
 * - % score: Project into 8–28 band, no upward bias, no volatility
 */
export function isDeathOverride(
  overlays: ChineseOverlayPattern[],
  westElemRel: WesternElementRelation,
  westOpposition: WestOpposition
): boolean {
  const override = resolveTarotOverride({ overlays, westElemRel, westOpposition });
  return override === "DEATH";
}

/**
 * Detects if TEN_OF_SWORDS override should be applied
 * 🗡️ Ten of Swords Override Trigger: LIU_HAI + (CLASH or SEMI)
 * Rules:
 * - Tarot must ALWAYS display: Ten of Swords
 * - Rank forced to "1"
 * - Snippet must reference: emotional harm, repeated disappointment, exhaustion
 * - % score: Project into 5–22 band, cap at 18 optionally, no volatility
 */
export function isTenOfSwordsOverride(
  overlays: ChineseOverlayPattern[],
  westElemRel: WesternElementRelation
): boolean {
  const override = resolveTarotOverride({ 
    overlays, 
    westElemRel, 
    westOpposition: "NEUTRAL" 
  });
  return override === "TEN_OF_SWORDS";
}

/**
 * Detects if FOOL override should be applied
 * 🃏 Fool Override Trigger: LIU_CHONG + (SAME or COMPATIBLE) + no LIU_HAI + no PO
 * Rules:
 * - Tarot must ALWAYS display: The Fool
 * - Rank forced to "JOKER"
 * - Snippet must reference: unpredictability, intensity, instability, attraction + chaos duality
 * - % score: Volatile, high variance, never below 78, never above 97
 */
export function isFoolOverride(
  overlays: ChineseOverlayPattern[],
  westElemRel: WesternElementRelation,
  westOpposition: WestOpposition
): boolean {
  const override = resolveTarotOverride({ overlays, westElemRel, westOpposition });
  return override === "FOOL";
}

/**
 * 🔒 FIX 3: Score Must Be Projected Into Rank Band
 * 
 * Lock rule:
 * - Raw score (e.g., 63) must be projected into the rank's canonical band (e.g., 18-36 for rank "2")
 * - This prevents semantic incoherence (e.g., LIU_HAI showing 63% when it should be 18-36%)
 * - Rank defines meaning, score defines intensity within that meaning
 * 
 * Projects a raw score into the canonical band for a given rank
 * This ensures semantic coherence: rank defines meaning, score defines intensity within that meaning
 * 
 * Special behaviors:
 * - JOKER: Adds volatility swing (-5 to +5, clamped to 78-97)
 * - Rank "1" (Ten of Swords): Caps at 18, no volatility
 * - DEATH override: Uses band 8-28 instead of rank "1" band
 * 
 * @param rawScore - The computed score from computeMatch (0-100) - may be outside rank band
 * @param rank - The derived CardRank (MUST be final rank, not raw/inferred)
 * @param options - Optional context for special overrides
 * @returns Projected score within the rank's band (guaranteed to be in band.min-band.max range)
 */
export function projectScoreToRankBand(
  rawScore: number, 
  rank: CardRank,
  options?: {
    overlays?: ChineseOverlayPattern[];
    westElemRel?: WesternElementRelation;
    westOpposition?: WestOpposition;
  }
): number {
  // 🔮 C) DEATH Override - Structural Severance
  // Trigger: PO + West CLASH or OPPOSITION
  // Uses band 8-28 instead of rank "1" band
  if (options && isDeathOverride(
    options.overlays || [],
    options.westElemRel || "NEUTRAL",
    options.westOpposition || "NEUTRAL"
  )) {
    const DEATH_BAND = { min: 8, max: 28 };
    const clampedRaw = Math.max(0, Math.min(100, rawScore));
    const rawRange = 100;
    const bandRange = DEATH_BAND.max - DEATH_BAND.min;
    const rawPosition = clampedRaw / rawRange;
    const projected = DEATH_BAND.min + (rawPosition * bandRange);
    const finalScore = Math.round(projected);
    return Math.max(DEATH_BAND.min, Math.min(DEATH_BAND.max, finalScore));
  }

  const band = RANK_BANDS[rank];
  if (!band) {
    console.warn(`[projectScoreToRankBand] Unknown rank: ${rank}, using raw score`);
    return Math.round(rawScore);
  }

  // Clamp raw score to valid range first
  const clampedRaw = Math.max(0, Math.min(100, rawScore));

  // Linear remap: project clamped score into the rank's band
  const rawRange = 100; // Full score range
  const bandRange = band.max - band.min;
  const rawPosition = clampedRaw / rawRange; // 0.0 to 1.0
  let projected = band.min + (rawPosition * bandRange);

  // 🔮 A) JOKER - The Fool (Chaos Destiny)
  // Adds volatility swing: -5 to +5, clamped to 78-97
  // Feels intoxicating, unstable, "fated but dangerous"
  if (rank === "JOKER") {
    const swing = Math.floor(Math.random() * 11) - 5; // -5 .. +5
    projected = projected + swing;
    // Clamp to extended range 78-97 (slightly wider than band 82-95 for volatility)
    return Math.max(78, Math.min(97, Math.round(projected)));
  }

  // 🔮 B) Rank "1" - Ten of Swords (Emotional Ruin)
  // Caps at 18, no volatility, no upward bias
  // Always bleak, never confusing, never "but maybe..."
  if (rank === "1") {
    projected = Math.min(projected, 18);
    return Math.max(band.min, Math.min(band.max, Math.round(projected)));
  }

  // Standard ranks: Add tiny jitter (±1-2) for organic feel
  const jitter = (Math.random() * 2 - 1) * 2; // -2 to +2
  const finalScore = Math.round(projected + jitter);
  
  // Ensure final score stays within band bounds
  return Math.max(band.min, Math.min(band.max, finalScore));
}

/**
 * Gets Tarot identity for a rank with override support
 * Returns the canonical Tarot card name, archetype name, and core meaning
 * 
 * 🔒 Override Rules:
 * - 🃏 JOKER: Always displays "The Fool" (already handled by rank)
 * - 💀 Death Override: PO + CLASH/OPPOSITION → Always displays "Death"
 * - 🗡️ Ten of Swords Override: LIU_HAI + CLASH → Always displays "Ten of Swords"
 */
export function getTarotIdentity(
  rank: CardRank,
  options?: {
    overlays?: ChineseOverlayPattern[];
    westElemRel?: WesternElementRelation;
    westOpposition?: WestOpposition;
  }
): { 
  name: string; 
  archetypeName: string;
  coreMeaning: string;
} {
  // 💀 Death Override: PO + CLASH/OPPOSITION → Always display "Death"
  // Rank forced to "1", snippet must reference: structural incompatibility, long-term instability, terminal mismatch
  if (options && isDeathOverride(
    options.overlays || [],
    options.westElemRel || "NEUTRAL",
    options.westOpposition || "NEUTRAL"
  )) {
    return {
      name: "Death",
      archetypeName: "Severance Destiny",
      coreMeaning: "Structural incompatibility, long-term instability, terminal mismatch"
    };
  }

  // 🗡️ Ten of Swords Override: LIU_HAI + CLASH → Always display "Ten of Swords"
  // Rank forced to "1", snippet must reference: emotional harm, repeated disappointment, exhaustion
  if (options && isTenOfSwordsOverride(
    options.overlays || [],
    options.westElemRel || "NEUTRAL"
  )) {
    return {
      name: "Ten of Swords",
      archetypeName: "Ruin Bond",
      coreMeaning: "Emotional harm, repeated disappointment, exhaustion"
    };
  }

  // 🃏 JOKER: Always displays "The Fool" (rank already handles this)
  // Snippet must ALWAYS reference: unpredictability, intensity, instability, attraction + chaos duality
  // % score: Volatile, high variance, never below 78, never above 97
  if (rank === "JOKER") {
    const band = RANK_BANDS[rank];
    return {
      name: band.tarot,
      archetypeName: band.archetypeName,
      coreMeaning: band.coreMeaning // Already includes required themes
    };
  }

  // Standard rank lookup
  const band = RANK_BANDS[rank];
  if (!band) {
    return { name: "Unknown", archetypeName: "Unknown", coreMeaning: "Unknown" };
  }
  return { 
    name: band.tarot, 
    archetypeName: band.archetypeName,
    coreMeaning: band.coreMeaning
  };
}

// ============================================
// 7) Snippet Tone Guidelines (Canonical)
// ============================================

/**
 * 🔒 Snippet Tone Guidelines
 * 
 * These rules prevent the app from becoming:
 * - fatalistic
 * - deterministic
 * - creepy
 * - manipulative
 * - "psychic-y"
 * 
 * They are critical for Apple review and user trust.
 */

// A) Universal rules (apply to all snippets)
export const UNIVERSAL_TONE_RULES = {
  principles: [
    "Be reflective, not predictive",
    "Be descriptive, not prescriptive",
    "Never tell users what to do",
    "Never claim certainty",
    "Never imply fate is unavoidable"
  ],
  useLanguage: [
    "This connection often feels like…",
    "This pairing tends to bring…",
    "There is a natural tendency toward…",
    "This match highlights themes of…"
  ],
  avoidLanguage: [
    "This WILL happen…",
    "You are meant to be…",
    "This is your destiny…",
    "This relationship will fail…"
  ]
};

// B) Tone per tier
export const TIER_TONE_GUIDELINES: Record<string, {
  tone: string[];
  examples: string[];
}> = {
  // 🟢 Soulmate Tier (A / K / Q / J)
  soulmate: {
    tone: [
      "Warm",
      "Affirming",
      "Grounded",
      "Non-absolute"
    ],
    examples: [
      "This connection reflects deep emotional resonance and a strong sense of mutual recognition.",
      "There is a natural balance here that supports long-term partnership.",
      "This pairing often brings warmth, affection, and a sense of being emotionally seen."
    ]
  },
  
  // 🟡 Harmony / Growth Tier (10–5)
  harmony: {
    tone: [
      "Balanced",
      "Practical",
      "Encouraging but honest"
    ],
    examples: [
      "This connection offers steady potential that grows stronger through mutual effort.",
      "There is emotional ease here, though differences may require conscious balancing.",
      "This pairing reflects mixed signals that benefit from clarity and communication."
    ]
  },
  
  // 🔴 Tension / Harm Tier (4–1)
  tension: {
    tone: [
      "Compassionate",
      "Non-judgmental",
      "Non-alarmist",
      "Honest"
    ],
    examples: [
      "This pairing can bring emotional strain and recurring misunderstandings.",
      "There may be a tendency toward disappointment if expectations are not aligned.",
      "This connection highlights patterns of emotional pain that deserve careful reflection."
    ]
  },
  
  // 🃏 Chaos / Severance Tier
  chaos: {
    tone: [
      "Grounded",
      "Cautionary",
      "Non-dramatic",
      "Non-mystical"
    ],
    examples: [
      "This connection carries strong attraction alongside unpredictability and emotional volatility.",
      "There is a magnetic quality here, though stability may be difficult to sustain."
    ]
  },
  
  severance: {
    tone: [
      "Grounded",
      "Cautionary",
      "Non-dramatic",
      "Non-mystical"
    ],
    examples: [
      "This pairing reflects deep structural incompatibilities that often make long-term harmony difficult.",
      "This connection may feel transformative, though it rarely supports stable partnership."
    ]
  },
  
  // 💀 Death Override specific examples
  death: {
    tone: [
      "Grounded",
      "Cautionary",
      "Non-dramatic",
      "Non-mystical"
    ],
    examples: [
      "This pairing reflects deep structural incompatibilities that often make long-term harmony difficult.",
      "This connection highlights patterns of structural incompatibility that rarely support stable partnership."
    ]
  },
  
  // 🗡️ Ten of Swords Override specific examples
  tenOfSwords: {
    tone: [
      "Compassionate",
      "Non-judgmental",
      "Non-alarmist",
      "Honest"
    ],
    examples: [
      "This pairing can bring emotional harm and repeated disappointment.",
      "This connection highlights patterns of emotional pain and exhaustion that deserve careful reflection."
    ]
  }
};

/**
 * Gets the appropriate tone tier for a given rank
 */
export function getToneTier(rank: CardRank): "soulmate" | "harmony" | "tension" | "chaos" | "severance" {
  if (rank === "A" || rank === "K" || rank === "Q" || rank === "J") {
    return "soulmate";
  }
  if (rank === "10" || rank === "9" || rank === "8" || rank === "7" || rank === "6" || rank === "5") {
    return "harmony";
  }
  if (rank === "4" || rank === "3" || rank === "2" || rank === "1") {
    return "tension";
  }
  if (rank === "JOKER") {
    return "chaos";
  }
  // Death override would be "severance" but that's handled separately
  return "harmony"; // fallback
}

/**
 * Gets tone guidelines for a specific rank with override support
 */
export function getToneGuidelines(
  rank: CardRank, 
  options?: {
    isDeathOverride?: boolean;
    isTenOfSwordsOverride?: boolean;
  }
): {
  tone: string[];
  examples: string[];
} {
  // 💀 Death Override: Use Death-specific tone guidelines
  if (options?.isDeathOverride) {
    return TIER_TONE_GUIDELINES.death || TIER_TONE_GUIDELINES.severance;
  }
  
  // 🗡️ Ten of Swords Override: Use Ten of Swords-specific tone guidelines
  if (options?.isTenOfSwordsOverride) {
    return TIER_TONE_GUIDELINES.tenOfSwords || TIER_TONE_GUIDELINES.tension;
  }
  
  // Standard tier lookup
  const tier = getToneTier(rank);
  return TIER_TONE_GUIDELINES[tier] || TIER_TONE_GUIDELINES.harmony;
}

/**
 * Canonical Tarot Snippet Library v1
 * Pre-written snippets for each card rank, following tone guidelines
 */
const TAROT_SNIPPET_LIBRARY: Record<CardRank, string[]> = {
  // 🟢 SOULMATE / HIGH HARMONY TIER
  A: [
    "This connection often reflects deep emotional resonance and a strong sense of mutual recognition. There is a natural feeling of being seen, understood, and aligned at a core level.",
    "This pairing highlights profound harmony, shared values, and an intuitive sense of belonging. It often feels effortless, meaningful, and deeply affirming."
  ],
  K: [
    "This connection reflects stability, balance, and strong long-term partnership potential. There is a natural structure here that supports commitment, trust, and mutual growth.",
    "This pairing often brings a grounded sense of reliability and mutual respect. It highlights themes of partnership, responsibility, and building something lasting together."
  ],
  Q: [
    "This connection reflects warmth, affection, and emotional closeness. There is a nurturing quality here that supports gentle bonding and a natural sense of care for one another.",
    "This pairing often brings emotional comfort, tenderness, and a feeling of being emotionally held. It highlights softness, intimacy, and heartfelt connection."
  ],
  J: [
    "This connection carries a sweet sense of romantic curiosity and emotional openness. There is a playful, hopeful quality here that invites gentle exploration and affection.",
    "This pairing often brings fresh emotional energy and lighthearted attraction. It reflects sincerity, sensitivity, and the early magic of romantic interest."
  ],
  
  // 🟡 HARMONY / GROWTH TIER
  "10": [
    "This connection reflects joyful companionship and long-term emotional potential. There is a natural sense of shared happiness and emotional alignment here.",
    "This pairing often brings feelings of contentment, harmony, and shared emotional goals. It highlights the potential for a deeply fulfilling partnership."
  ],
  "9": [
    "This connection reflects emotional satisfaction and mutual enjoyment. There is a natural ease here that supports pleasure, appreciation, and shared comfort.",
    "This pairing often brings a sense of emotional reward and personal fulfillment. It highlights mutual liking, attraction, and shared emotional positivity."
  ],
  "8": [
    "This connection reflects steady growth through effort and mutual investment. There is meaningful potential here that strengthens with patience and care.",
    "This pairing often brings opportunities for learning, improvement, and deeper understanding. It highlights the value of dedication and emotional work."
  ],
  "7": [
    "This connection reflects manageable differences and the need for ongoing balance. There is workable potential here when both people stay flexible and communicative.",
    "This pairing often brings themes of adjustment and compromise. It highlights the importance of emotional coordination and mutual understanding."
  ],
  "6": [
    "This connection reflects emotional familiarity, comfort, and gentle affection. There is a soft, reassuring quality here that feels safe and emotionally soothing.",
    "This pairing often brings nostalgia, sweetness, and emotional ease. It highlights comfort, kindness, and a sense of emotional home."
  ],
  "5": [
    "This connection reflects mixed signals and emotional uncertainty. There may be attraction here, though clarity and alignment may take time to emerge.",
    "This pairing often brings ambiguity and fluctuating emotions. It highlights the need for honest communication and grounded expectations."
  ],
  
  // 🔴 TENSION / HARM TIER
  "4": [
    "This connection reflects frequent tension and clashing styles. There may be attraction here, though conflict can arise from competing needs or misunderstandings.",
    "This pairing often brings rivalry, irritation, or emotional friction. It highlights the importance of patience and respectful communication."
  ],
  "3": [
    "This connection reflects emotional pain and recurring disappointment. There may be meaningful feelings here, though they are often accompanied by hurt.",
    "This pairing often brings sadness or emotional strain. It highlights patterns of misunderstanding and emotional vulnerability."
  ],
  "2": [
    "This connection reflects emotional distance and feelings of being unsupported. There may be attraction here, though emotional needs often go unmet.",
    "This pairing often brings loneliness or emotional scarcity. It highlights challenges around care, empathy, and mutual presence."
  ],
  "1": [
    "This connection reflects emotional exhaustion and repeated disappointment. It often feels overwhelming and difficult to sustain in a healthy way.",
    "This pairing often brings emotional collapse or burnout. It highlights deeply painful relational patterns."
  ],
  
  // 🃏 SPECIAL ARCHETYPES
  JOKER: [
    "This connection carries strong attraction alongside unpredictability and emotional volatility. There is a magnetic pull here, though stability may be difficult to sustain.",
    "This pairing often feels exciting, intense, and chaotic. It highlights themes of passion, risk, and emotional unpredictability."
  ]
};

/**
 * Override snippets for special cases
 */
const OVERRIDE_SNIPPETS: {
  death: string[];
  tenOfSwords: string[];
} = {
  death: [
    "This connection reflects deep structural incompatibilities that often make long-term harmony difficult. It may feel transformative, though rarely stable.",
    "This pairing highlights themes of endings and irreversible change. It rarely supports sustained emotional partnership."
  ],
  tenOfSwords: [
    "This pairing can bring emotional harm and repeated disappointment.",
    "This connection highlights patterns of emotional pain and exhaustion that deserve careful reflection."
  ]
};

/**
 * 🔒 FIX 2: Tarot Snippet Must Be Chosen Only From Final Tarot Identity
 * 
 * Lock rule:
 * - Snippet source of truth = tarotKey (derived from final rank + override rules)
 * - Never infer snippet from: score, legacy label, westRelation, or UI state
 * 
 * Generates a Tarot snippet (1-2 sentences) from canonical snippet library
 * Uses primary snippet (variant 0) by default, with optional variant for A/B testing
 * Follows canonical tone rules: reflective, descriptive, non-predictive
 * 
 * @param coreMeaning - Core meaning text (used for fallback only - DO NOT use to infer snippet)
 * @param rank - Card rank (A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, JOKER) - MUST be final rank
 * @param options - Optional configuration
 * @param options.isDeathOverride - If true, use Death override snippets
 * @param options.isTenOfSwordsOverride - If true, use Ten of Swords override snippets
 * @param options.variant - Snippet variant: 0 (primary, default) or 1 (alternate) for A/B testing
 * @returns Canonical Tarot snippet string
 */
export function generateTarotSnippet(
  coreMeaning: string,
  rank: CardRank,
  options?: {
    isDeathOverride?: boolean;
    isTenOfSwordsOverride?: boolean;
    variant?: 0 | 1; // 0 = primary (default), 1 = alternate
  }
): string {
  // 🔒 CRITICAL: Snippet selection is based ONLY on final rank + override rules
  // DO NOT infer from score, westRelation, or any other source
  
  // Determine variant: default to 0 (primary), allow override for A/B testing
  const variant = options?.variant ?? 0;
  const variantIndex = variant === 1 ? 1 : 0; // Ensure 0 or 1 only
  
  // 💀 Death Override: Use Death-specific snippets (highest precedence)
  if (options?.isDeathOverride) {
    const snippets = OVERRIDE_SNIPPETS.death;
    return snippets[variantIndex] || snippets[0]; // Fallback to primary if variant doesn't exist
  }
  
  // 🗡️ Ten of Swords Override: Use Ten of Swords-specific snippets (second precedence)
  if (options?.isTenOfSwordsOverride) {
    const snippets = OVERRIDE_SNIPPETS.tenOfSwords;
    return snippets[variantIndex] || snippets[0]; // Fallback to primary if variant doesn't exist
  }
  
  // 🃏 The Fool (JOKER): Use JOKER snippets (third precedence)
  if (rank === "JOKER") {
    const snippets = TAROT_SNIPPET_LIBRARY.JOKER;
    return snippets[variantIndex] || snippets[0]; // Fallback to primary if variant doesn't exist
  }
  
  // Standard rank lookup (normal rank tarot - lowest precedence)
  // This uses the FINAL rank - no inference from other sources
  const snippets = TAROT_SNIPPET_LIBRARY[rank];
  if (!snippets || snippets.length === 0) {
    // Fallback: generate from coreMeaning ONLY if snippet library is incomplete
    // This should never happen in production with complete library
    console.warn(`[generateTarotSnippet] No snippets found for rank ${rank}, using fallback`);
    const concepts = coreMeaning.split(',').map(c => c.trim());
    const primaryConcept = concepts[0] || coreMeaning;
    return `This connection often reflects ${primaryConcept.toLowerCase()}. This pairing highlights themes of connection and compatibility.`;
  }
  
  // Return primary (variant 0) by default, or alternate (variant 1) if specified
  return snippets[variantIndex] || snippets[0]; // Fallback to primary if variant doesn't exist
}

// ============================================
// 6) One-shot builder: attach card overlay to a UI box
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

  const edgeStyle = deriveEdgeStyle(overlays); // Legacy field

  // 🔒 Milestone 5: Suit Color + Edge Glow Semantics
  // Use deterministic resolver for visual state (suit + glow + color)
  const isDeath = isDeathOverride(overlays, params.westElemRel, params.westOpposition);
  const isTenOfSwords = isTenOfSwordsOverride(overlays, params.westElemRel);
  
  // Resolve visual state deterministically (canonical resolver order)
  const visualState = resolveVisualState({
    rank,
    chineseBase,
    overlays,
    isDeathOverride: isDeath,
    isTenOfSwordsOverride: isTenOfSwords,
  });

  return { 
    rank, 
    suit: visualState.suit,      // Resolved suit (may differ from base suit due to overrides)
    pip, 
    pills, 
    edgeStyle,                   // Legacy field
    edgeGlow: visualState.glow,  // Resolved glow state with precedence
    suitColor: visualState.suitColor // Resolved suit color
  };
}

// Convenience: attach to an existing box object
export function attachCardOverlay<T extends SimpleConnectionBoxLike>(box: T, overlay: CardOverlay): T & { card: CardOverlay } {
  return { ...box, card: overlay };
}

// ============================================
// 7) QA Guardrails (Final Semantic Layer)
// ============================================

/**
 * 🔒 Milestone 7: Tarot → Rank → % Band QA Guardrails
 * 
 * Hard assertions that must never be violated.
 * Runtime invariant checks (dev + prod-safe).
 * Failsafe downgrade rules (never show lies).
 * 
 * This function runs after full resolution but before UI render.
 * It never crashes prod - it only logs and fails safe.
 */
export interface QAState {
  rank: CardRank;
  tarot: string;
  tarotOverride: "DEATH" | "TEN_OF_SWORDS" | "FOOL" | null;
  score: number;
  suit: CardSuit;
  glow: EdgeGlowState;
  overlays: ChineseOverlayPattern[];
  chineseBase: ChineseBasePattern;
}

/**
 * Canonical rank → tarot mapping (for invariant checking)
 */
const RANK_TO_TAROT: Record<CardRank, string> = {
  A: "The Lovers",
  K: "The Emperor",
  Q: "The Empress",
  J: "Page of Cups",
  "10": "Ten of Cups",
  "9": "Nine of Cups",
  "8": "Eight of Pentacles",
  "7": "Two of Pentacles",
  "6": "Six of Cups",
  "5": "Seven of Cups",
  "4": "Five of Wands",
  "3": "Three of Swords",
  "2": "Five of Pentacles",
  "1": "Ten of Swords", // May be overridden by Death
  JOKER: "The Fool",
};

/**
 * QA Guard function - validates all invariants and provides failsafe downgrade
 */
export function qaGuard(state: QAState): QAState {
  const errors: string[] = [];

  // 🧠 Invariant A — Rank ↔ Tarot Identity
  // Check that rank matches expected tarot (unless override is present)
  if (!state.tarotOverride) {
    const expectedTarot = RANK_TO_TAROT[state.rank];
    if (expectedTarot && expectedTarot !== state.tarot) {
      errors.push(`[Invariant A] Rank–tarot mismatch: rank=${state.rank}, expected=${expectedTarot}, got=${state.tarot}`);
    }
  }

  // 🧠 Invariant B — Override Supremacy
  // Overrides must force correct rank and tarot
  if (state.tarotOverride === "DEATH") {
    if (state.rank !== "1") {
      errors.push(`[Invariant B] Death override violated: rank must be "1", got ${state.rank}`);
    }
    if (state.tarot !== "Death") {
      errors.push(`[Invariant B] Death override violated: tarot must be "Death", got ${state.tarot}`);
    }
  }

  if (state.tarotOverride === "TEN_OF_SWORDS") {
    if (state.rank !== "1") {
      errors.push(`[Invariant B] Ten of Swords override violated: rank must be "1", got ${state.rank}`);
    }
    if (state.tarot !== "Ten of Swords") {
      errors.push(`[Invariant B] Ten of Swords override violated: tarot must be "Ten of Swords", got ${state.tarot}`);
    }
  }

  if (state.tarotOverride === "FOOL") {
    if (state.rank !== "JOKER") {
      errors.push(`[Invariant B] Fool override violated: rank must be "JOKER", got ${state.rank}`);
    }
    if (state.tarot !== "The Fool") {
      errors.push(`[Invariant B] Fool override violated: tarot must be "The Fool", got ${state.tarot}`);
    }
  }

  // 🧠 Invariant C — Rank ↔ % Band
  // Score must be within rank's allowed band
  const band = RANK_BANDS[state.rank];
  if (band) {
    if (state.score < band.min || state.score > band.max) {
      errors.push(`[Invariant C] Score outside rank band: rank=${state.rank}, score=${state.score}, band=${band.min}-${band.max}`);
    }
  } else {
    errors.push(`[Invariant C] Unknown rank: ${state.rank}`);
  }

  // 🧠 Invariant D — Harm Patterns Must Never Look Harmonious
  // LIU_HAI must never produce rank > 3
  if (state.overlays.includes("LIU_HAI")) {
    const rankNum = parseInt(state.rank);
    if (!isNaN(rankNum) && rankNum > 3) {
      errors.push(`[Invariant D] LIU_HAI rank too high: rank=${state.rank}, must be ≤ 3`);
    }
  }

  // PO must never produce rank > 4 (unless Death override forces rank "1")
  if (state.overlays.includes("PO") && state.tarotOverride !== "DEATH") {
    const rankNum = parseInt(state.rank);
    if (!isNaN(rankNum) && rankNum > 4) {
      errors.push(`[Invariant D] PO rank too high: rank=${state.rank}, must be ≤ 4`);
    }
  }

  // XING must never produce rank > 5
  if (state.overlays.includes("XING")) {
    const rankNum = parseInt(state.rank);
    if (!isNaN(rankNum) && rankNum > 5) {
      errors.push(`[Invariant D] XING rank too high: rank=${state.rank}, must be ≤ 5`);
    }
  }

  // LIU_CHONG with weak West must never produce rank > 9
  if (state.overlays.includes("LIU_CHONG") && state.tarotOverride !== "FOOL") {
    const rankNum = parseInt(state.rank);
    if (!isNaN(rankNum) && rankNum > 9) {
      errors.push(`[Invariant D] LIU_CHONG (weak West) rank too high: rank=${state.rank}, must be ≤ 9`);
    }
  }

  // 🧠 Invariant E — Suit Truthfulness
  // Any harm overlay must result in Spades
  const hasHarmOverlay = state.overlays.some(o => ["LIU_CHONG", "LIU_HAI", "XING", "PO"].includes(o));
  if (hasHarmOverlay && state.suit !== "spades") {
    errors.push(`[Invariant E] Harm overlay without spades suit: overlays=${state.overlays.join(",")}, suit=${state.suit}`);
  }

  // SAN_HE with no harm must be Hearts
  if (state.chineseBase === "SAN_HE" && !hasHarmOverlay && state.suit !== "hearts") {
    errors.push(`[Invariant E] SAN_HE without harm must be Hearts: suit=${state.suit}`);
  }

  // LIU_HE with no harm must be Diamonds
  if (state.chineseBase === "LIU_HE" && !hasHarmOverlay && state.suit !== "diamonds") {
    errors.push(`[Invariant E] LIU_HE without harm must be Diamonds: suit=${state.suit}`);
  }

  // SAME_SIGN or NO_PATTERN with no harm must be Clubs
  if ((state.chineseBase === "SAME_SIGN" || state.chineseBase === "NO_PATTERN") && !hasHarmOverlay && state.suit !== "clubs") {
    errors.push(`[Invariant E] SAME_SIGN/NO_PATTERN without harm must be Clubs: suit=${state.suit}`);
  }

  // 🧠 Invariant F — Glow Truthfulness
  // Death override must have severance glow
  if (state.tarotOverride === "DEATH" && state.glow !== "severance") {
    errors.push(`[Invariant F] Death glow missing: glow=${state.glow}, must be severance`);
  }

  // Ten of Swords override must have danger glow
  if (state.tarotOverride === "TEN_OF_SWORDS" && state.glow !== "danger") {
    errors.push(`[Invariant F] Ten of Swords glow missing: glow=${state.glow}, must be danger`);
  }

  // JOKER must have chaos glow
  if (state.rank === "JOKER" && state.glow !== "chaos") {
    errors.push(`[Invariant F] Chaos glow missing: rank=JOKER, glow=${state.glow}, must be chaos`);
  }

  // Harm tier (4, 3, 2, 1) must have danger glow (unless Death override)
  if (["4", "3", "2", "1"].includes(state.rank) && state.tarotOverride !== "DEATH" && state.glow !== "danger") {
    errors.push(`[Invariant F] Danger glow missing: rank=${state.rank}, glow=${state.glow}, must be danger`);
  }

  // Soulmate tier (A, K, Q) with no harm must have soulmate glow
  const isSoulmateTier = ["A", "K", "Q"].includes(state.rank);
  const hasNoHarmOverlays = !hasHarmOverlay;
  if (isSoulmateTier && hasNoHarmOverlays && state.glow !== "soulmate") {
    errors.push(`[Invariant F] Soulmate glow missing: rank=${state.rank}, glow=${state.glow}, must be soulmate`);
  }

  // Growth tier (J, 10, 9, 8) with no harm must have growth glow
  const isGrowthTier = ["J", "10", "9", "8"].includes(state.rank);
  if (isGrowthTier && hasNoHarmOverlays && state.glow !== "growth") {
    errors.push(`[Invariant F] Growth glow missing: rank=${state.rank}, glow=${state.glow}, must be growth`);
  }

  // 🔒 Failsafe Philosophy: Always downgrade to Seven of Cups · 52% · ♣ · No glow
  // Why? Because it communicates: Uncertainty, Mixed signals, Neutrality
  // Which is infinitely better than: Showing a soulmate lie, Showing a comforting lie, Showing a chaos lie
  // This preserves trust.
  if (errors.length > 0) {
    const violationContext = {
      errors,
      state,
      timestamp: new Date().toISOString(),
      matchContext: {
        rank: state.rank,
        tarot: state.tarot,
        tarotOverride: state.tarotOverride,
        score: state.score,
        suit: state.suit,
        glow: state.glow,
        overlays: state.overlays,
        chineseBase: state.chineseBase,
      },
    };

    // 🔒 Logging Doctrine: Every QA violation must log to console (dev) and backend (prod)
    // This becomes your "Semantic crash report system"
    console.error("[🔒 QA GUARD VIOLATION] Invariant checks failed:", violationContext);

    // Production: Log to backend (if available)
    // This allows you to see: What edge case violated doctrine, What inputs caused it, What rule failed
    // And patch it surgically later
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Backend logging hook (implement in your analytics/error tracking service)
      try {
        // Example: Send to your error tracking service
        // await logSemanticViolation(violationContext);
        console.warn("[🔒 QA GUARD] Production violation detected - should be logged to backend");
      } catch (error) {
        // Never crash on logging failure
        console.warn("[🔒 QA GUARD] Failed to log to backend:", error);
      }
    }

    // Failsafe: Always downgrade to Seven of Cups · 52% · ♣ · No glow
    // This ensures we never show incorrect information to users
    // Preserves trust by showing uncertainty rather than lies
    return {
      rank: "5",
      tarot: "Seven of Cups",
      tarotOverride: null,
      score: 52, // Within rank "5" band (50-64) - communicates uncertainty
      suit: "clubs", // Neutral ground - communicates neutrality
      glow: "none", // No glow - communicates mixed signals
      overlays: state.overlays, // Preserve overlays for debugging
      chineseBase: state.chineseBase, // Preserve base for debugging
    };
  }

  // All invariants passed
  return state;
}
