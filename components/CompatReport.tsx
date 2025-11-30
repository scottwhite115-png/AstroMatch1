'use client';
import React, { useState, useEffect } from 'react';
import { Person, MatchScore } from '@/lib/engine';
import { buildCompatSummary } from '@/lib/buildCompatSummary';
import CompatSummaryBox from '@/components/CompatSummaryBox';
import { getCompatibilityWithText, type CompatResult } from '@/lib/compatEngine';
import { buildReadableBlurb } from '@/lib/buildReadableBlurb';
import { motion, AnimatePresence } from 'framer-motion';


export default function CompatReport({
  a,
  b,
  result
}: {
  a: Person;
  b: Person;
  result: MatchScore;
}) {
  const [open, setOpen] = useState(false);
  const [compat, setCompat] = useState<CompatResult | null>(null);
  const summary = buildCompatSummary(a, b, result);

  // Load compatibility from parametric engine
  useEffect(() => {
    getCompatibilityWithText(a.western, a.chinese, b.western, b.chinese)
      .then(setCompat)
      .catch(err => {
        console.error('Failed to load compatibility:', err);
      });
  }, [a.western, a.chinese, b.western, b.chinese]);
  
  // Use engine score and label when available
  const score = compat?.score || result.score;
  const label = compat?.label || 'Computing...';
  
  // Fallback to computed blurbs for full text
  const computedBlurbs = buildReadableBlurb(a, b, result);

  const tier =
    score >= 90
      ? 'Exceptional Match'
      : score >= 80
      ? 'Highly Compatible'
      : score >= 70
      ? 'Balanced Compatibility'
      : 'Challenging Match';

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4 space-y-3">
      <div className="text-sm text-gray-600">Compatibility {score}%</div>
      <div className="text-lg font-semibold">
        {tier}
      </div>

      {/* Show themes if available */}
      {compat && compat.themesText.length > 0 && (
        <div className="text-sm text-gray-700">
          <span className="font-medium">Strengths:</span> {compat.themesText.join(', ')}
        </div>
      )}

      {/* Show computed blurbs */}
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
        {computedBlurbs.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>

      {/* Show warnings if available */}
      {compat && compat.warningsText.length > 0 && (
        <div className="text-sm text-orange-600">
          <span className="font-medium">Watch for:</span> {compat.warningsText.join(', ')}
        </div>
      )}

      <div className="text-sm font-medium text-gray-700">
        Overall match: {score}% <span className="text-gray-500">({label})</span>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="text-sm mt-2 text-blue-600 hover:underline"
      >
        {open ? 'Hide Breakdown ▲' : 'View Breakdown ▼'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-2">
              <CompatSummaryBox summary={summary} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


