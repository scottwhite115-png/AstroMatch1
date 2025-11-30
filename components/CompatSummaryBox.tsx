import React from 'react'
import type { CompatSummary } from '@/lib/buildCompatSummary'

export default function CompatSummaryBox({ summary }: { summary: CompatSummary }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-zinc-800/40 p-3 rounded-lg">
        <div className="text-xs text-white">Core Vibe</div>
        <div className="text-xl font-bold text-white">{summary.coreVibe}%</div>
      </div>
      <div className="bg-zinc-800/40 p-3 rounded-lg">
        <div className="text-xs text-white">Chemistry</div>
        <div className="text-xl font-bold text-white">{summary.chemistry}%</div>
      </div>
      <div className="bg-zinc-800/40 p-3 rounded-lg">
        <div className="text-xs text-white">Communication</div>
        <div className="text-xl font-bold text-white">{summary.communication}%</div>
      </div>
      <div className="bg-zinc-800/40 p-3 rounded-lg">
        <div className="text-xs text-white">Lifestyle</div>
        <div className="text-xl font-bold text-white">{summary.lifestyle}%</div>
      </div>
      <div className="bg-zinc-800/40 p-3 rounded-lg">
        <div className="text-xs text-white">Long Term</div>
        <div className="text-xl font-bold text-white">{summary.longTerm}%</div>
      </div>
      <div className="bg-zinc-800/40 p-3 rounded-lg">
        <div className="text-xs text-white">Growth</div>
        <div className="text-xl font-bold text-white">{summary.growth}%</div>
      </div>
    </div>
  )
}


