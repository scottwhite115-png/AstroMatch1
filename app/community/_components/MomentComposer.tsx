'use client';

import { useState } from 'react';
import { createOrReplaceMoment } from '@/lib/actions/moments';

export default function MomentComposer({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    await createOrReplaceMoment(text);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-black p-4">
      <textarea
        className="w-full rounded-xl bg-white/10 p-3 text-sm text-white"
        placeholder="Share a Moment…"
        rows={4}
        maxLength={400}
        value={text}
        onChange={(e) => setText(e.target.value)}
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

