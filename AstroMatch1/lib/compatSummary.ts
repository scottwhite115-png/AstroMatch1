import { MatchScore, Person } from '@/lib/engine'

export type CompatSummary = {
  coreVibe: number
  chemistry: number
  communication: number
  lifestyle: number
  longTerm: number
  growth: number
}

export function buildCompatSummary(a: Person, b: Person, r: MatchScore): CompatSummary {
  const w = r.breakdown.western
  const e = r.breakdown.eastern

  return {
    coreVibe: w,
    chemistry: Math.round((w + e) / 2),
    communication: w,
    lifestyle: e,
    longTerm: Math.round(e * 0.9 + w * 0.1),
    growth: Math.round(e * 0.8 + w * 0.2),
  }
}


