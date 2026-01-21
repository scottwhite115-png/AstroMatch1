// /lib/getMatchCard.ts
import { explainMatchAndScore, pairKey, type West, type East } from "@/lib/matchEngine";
import { INSIGHT_OVERRIDES } from "@/data/insight_overrides";
import { autoInsight } from "@/lib/insight";
import { tierFromScore } from "@/engine/thresholds";
import { TIER_LABEL, type Tier } from "@/engine/labels";

export interface MatchCardPayload {
  score: number;
  rankLabel: string;
  rankKey: string;
  emoji: string;
  colorRgb: string;
  connectionLabel: string;
  tier: Tier;

  // Signs (decorate in UI as you like)
  aWest: West; aEast: East; bWest: West; bEast: East;

  // Copy
  insight: string;           // Insight tone (override if available)
  east_relation: string;
  east_summary: string;
  west_relation: string;
  west_summary: string;
}

export function getMatchCard(aWest: West, aEast: East, bWest: West, bEast: East): MatchCardPayload {
  const res = explainMatchAndScore(aWest, aEast, bWest, bEast);
  const key = pairKey(aWest, aEast, bWest, bEast);
  const ov = INSIGHT_OVERRIDES[key];

  // Only use override when it matches computed top tier
  const useOverride = ov && (ov.rank === res.rankKey);
  const tier = tierFromScore(res.score);

  return {
    score: res.score,
    rankLabel: TIER_LABEL[tier],
    rankKey: res.rankKey,
    emoji: res.emoji,
    colorRgb: res.colorRgb,
    connectionLabel: res.connectionLabel,
    tier,
    aWest, aEast, bWest, bEast,
    insight: useOverride ? ov!.insight : autoInsight(res),
    east_relation: res.east_relation,
    east_summary: res.east_summary,
    west_relation: res.west_relation,
    west_summary: res.west_summary,
  };
}

