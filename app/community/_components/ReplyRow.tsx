import { formatDistanceToNow } from 'date-fns';

type ReplyRowProps = {
  reply: {
    id: string;
    content: string;
    userId: string;
    createdAt: Date;
  };
};

export default function ReplyRow({ reply }: ReplyRowProps) {
  const timeAgo = formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true });
  
  return (
    <div className="flex gap-3 pl-6">
      <div className="h-7 w-7 rounded-full bg-white/20" />
      <div className="flex-1">
        <p className="text-xs text-white/80">
          {reply.content}
        </p>
        <div className="mt-1 text-[11px] text-white/40">{timeAgo}</div>
      </div>
    </div>
  );
}

