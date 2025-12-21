'use client';

import {
  deleteMoment,
  archiveMoment,
  reportMoment,
  blockUser,
} from '@/lib/actions/moments';

export default function MomentMenu({
  isOwner,
  momentId,
  userId,
}: {
  isOwner: boolean;
  momentId: string;
  userId: string;
}) {
  return (
    <div className="rounded-xl bg-black p-2 text-sm text-white">
      {isOwner ? (
        <>
          <button onClick={() => archiveMoment(momentId)}>Archive</button>
          <button onClick={() => deleteMoment(momentId)}>Delete</button>
        </>
      ) : (
        <>
          <button onClick={() => reportMoment(momentId, 'inappropriate')}>
            Report
          </button>
          <button onClick={() => blockUser(userId)}>Block user</button>
        </>
      )}
    </div>
  );
}

