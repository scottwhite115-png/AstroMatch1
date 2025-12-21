'use client';

import { useState } from 'react';
import ReplyRow from './ReplyRow';
import MomentMenu from './MomentMenu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toggleReaction } from '@/lib/actions/moments';

type MomentRowProps = {
  moment: {
    id: string;
    expiresAt: Date;
    userId: string;
    content: string;
    imageUrl?: string | null;
    createdAt: Date;
    replies: Array<{
      id: string;
      content: string;
      userId: string;
      createdAt: Date;
    }>;
    reactions: Array<{
      id: string;
      userId: string;
    }>;
    user: {
      id: string;
      display_name: string | null;
      western_sign: string | null;
      chinese_sign: string | null;
      photo_url?: string | null;
    };
  };
  currentUserId?: string;
};

export default function MomentRow({ moment, currentUserId }: MomentRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [reactions, setReactions] = useState(moment.reactions || []);
  const isFading =
    new Date(moment.expiresAt).getTime() - Date.now() < 1000 * 60 * 60 * 48;
  const isOwner = currentUserId === moment.userId;
  
  const handleReaction = async () => {
    await toggleReaction(moment.id);
    // Optimistically update - in production you'd refetch
    const hasReaction = reactions.some(r => r.userId === currentUserId);
    if (hasReaction) {
      setReactions(reactions.filter(r => r.userId !== currentUserId));
    } else {
      setReactions([...reactions, { id: '', userId: currentUserId || '' }]);
    }
  };

  const hasReaction = currentUserId ? reactions.some(r => r.userId === currentUserId) : false;
  const timeAgo = formatDistanceToNow(new Date(moment.createdAt), { addSuffix: true });

  // Get sign emoji/abbreviation
  const getSignDisplay = () => {
    const signs = [];
    if (moment.user.western_sign) {
      const signMap: Record<string, string> = {
        'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
        'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
        'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
      };
      signs.push(signMap[moment.user.western_sign] || moment.user.western_sign.substring(0, 2));
    }
    if (moment.user.chinese_sign) {
      signs.push('☽'); // Moon symbol as placeholder for Chinese sign
    }
    return signs.length > 0 ? signs.join(' ') : '';
  };

  return (
    <article className={cn(
      "w-full px-4 py-4 transition-opacity",
      isFading && "opacity-50"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {moment.user.photo_url ? (
            <img 
              src={moment.user.photo_url} 
              alt={moment.user.display_name || 'User'}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-white/20" />
          )}
          <div className="text-sm text-white">
            <span className="font-medium">{moment.user.display_name || 'Anonymous'}</span>
            {getSignDisplay() && (
              <span className="ml-2 text-white/50">{getSignDisplay()}</span>
            )}
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-white/50 hover:text-white transition-colors"
          >
            ⋯
          </button>
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-50">
                <MomentMenu
                  isOwner={isOwner}
                  momentId={moment.id}
                  userId={moment.userId}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <p className="mt-3 text-sm leading-relaxed text-white/90">
        {moment.content}
      </p>

      {/* Optional image */}
      {moment.imageUrl && (
        <img 
          src={moment.imageUrl} 
          alt="Moment"
          className="mt-3 h-48 w-full rounded-xl object-cover bg-white/10"
        />
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between text-xs text-white/50">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleReaction}
            className={hasReaction ? 'text-red-400' : ''}
          >
            ♡ {reactions.length}
          </button>
          <button>💬 {moment.replies?.length || 0}</button>
        </div>
        <span>{timeAgo}</span>
      </div>

      {/* Replies */}
      {moment.replies && moment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {moment.replies.map((reply) => (
            <ReplyRow key={reply.id} reply={reply} />
          ))}
        </div>
      )}
    </article>
  );
}

