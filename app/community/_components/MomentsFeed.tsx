'use client';

import { useState, useEffect } from 'react';
import MomentRow from './MomentRow';
import MomentComposer from './MomentComposer';
import { getActiveMoments } from '@/lib/actions/moments';
import { createClient } from '@/lib/supabase/client';

export default function MomentsFeed() {
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useEffect(() => {
    async function loadMoments() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id);
        
        const data = await getActiveMoments(user?.id);
        setMoments(data || []);
      } catch (error) {
        console.error('Error loading moments:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMoments();
  }, []);

  const handleMomentCreated = () => {
    // Reload moments after creating a new one
    async function reload() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const data = await getActiveMoments(user?.id);
      setMoments(data || []);
    }
    reload();
  };

  if (loading) {
    return (
      <section className="w-full">
        <div className="px-4 py-8 text-center text-white/50 text-sm">Loading moments...</div>
      </section>
    );
  }

  return (
    <section className="w-full">
      {/* Top composer entry */}
      <div className="px-4 py-3">
        <button 
          onClick={() => setShowComposer(true)}
          className="w-full rounded-xl bg-white/10 py-3 text-left text-sm text-white/70 hover:bg-white/15 transition-colors"
        >
          + Share a Moment
        </button>
      </div>

      {moments.length === 0 ? (
        <div className="px-4 py-8 text-center text-white/50 text-sm">
          No moments yet. Be the first to share!
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {moments.map((moment) => (
            <MomentRow 
              key={moment.id} 
              moment={moment}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}

      {showComposer && (
        <MomentComposer 
          onClose={() => {
            setShowComposer(false);
            handleMomentCreated();
          }} 
        />
      )}
    </section>
  );
}

