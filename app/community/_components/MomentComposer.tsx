'use client';

import { useState, useEffect } from 'react';
import { createOrReplaceMoment } from '@/lib/actions/moments';

export default function MomentComposer({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Dispatch event when focus state changes
    if (isFocused) {
      window.dispatchEvent(new CustomEvent('momentComposerFocused'));
    } else {
      window.dispatchEvent(new CustomEvent('momentComposerBlurred'));
    }
  }, [isFocused]);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      window.dispatchEvent(new CustomEvent('momentComposerBlurred'));
    };
  }, []);

  async function submit() {
    setLoading(true);
    await createOrReplaceMoment(text);
    setLoading(false);
    setIsFocused(false);
    onClose();
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-black p-4">
      <textarea
        className="w-full rounded-xl bg-white/10 p-3 text-sm text-white placeholder:text-white/50"
        placeholder="Share a Moment…"
        rows={4}
        maxLength={400}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ color: 'white' }}
      />

      <div className="mt-3 flex items-center justify-between">
        <button className="text-xs text-white/50">+ Photo</button>
        <button
          onClick={submit}
          disabled={!text || loading}
          className="rounded-lg bg-white px-4 py-2 text-sm text-black"
        >
          Share
        </button>
      </div>
    </div>
  );
}

