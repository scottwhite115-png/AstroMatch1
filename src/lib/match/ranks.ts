// src/lib/match/ranks.ts
import type { Rank } from "./types";

export function rankFromScore(score: number): Rank {
  if (score >= 95) return "soulmate";
  if (score >= 85) return "twin_flame";
  if (score >= 70) return "excellent";
  if (score >= 55) return "good";
  if (score >= 40) return "learning";
  if (score >= 25) return "challenging";
  return "incompatible";
}

export const RANK_META: Record<Rank, {
  label: string; range: string; emoji: string; aura: string; tagline: string;
}> = {
  soulmate:    { label:"Destined Union",  range:"95–100", emoji:"🌠", aura:"Radiant Gold Aura",   tagline:"Two souls born under the same stars — pure harmony." },
  twin_flame:  { label:"Magnetic Synergy",range:"85–94",  emoji:"🔥", aura:"Warm Amber Glow",    tagline:"Intense chemistry — mirror souls learning to dance." },
  excellent:   { label:"Kindred Spirits", range:"70–84",  emoji:"💖", aura:"Bright Rose Gradient",tagline:"Natural flow, laughter, and shared dreams." },
  good:        { label:"Cosmic Companions",range:"55–69", emoji:"🌙", aura:"Calm Lavender Fade", tagline:"Comfortable connection — grows stronger with care." },
  learning:    { label:"Karmic Teachers", range:"40–54",  emoji:"🧭", aura:"Soft Blue Mist",      tagline:"Different rhythms, but lessons meant to be learned." },
  challenging: { label:"Opposite Orbits", range:"25–39",  emoji:"⚡", aura:"Muted Storm Grey",    tagline:"Attraction meets friction — strong sparks, steep lessons." },
  incompatible:{ label:"Crossed Paths",   range:"0–24",   emoji:"💔", aura:"Fading Red Glow",     tagline:"Different worlds. Beautiful encounter, not a journey." }
};

