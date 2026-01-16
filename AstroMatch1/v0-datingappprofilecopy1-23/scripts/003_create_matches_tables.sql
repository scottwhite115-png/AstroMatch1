-- Create matches table for storing user matches
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  matched_user_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, matched_user_id)
);

-- Create index for faster queries
create index if not exists matches_user_id_idx on public.matches(user_id);
create index if not exists matches_matched_user_id_idx on public.matches(matched_user_id);
create index if not exists matches_status_idx on public.matches(status);

-- Enable RLS
alter table public.matches enable row level security;

-- Create policies for matches
create policy "matches_select_own"
  on public.matches for select
  using (auth.uid() = user_id or auth.uid() = matched_user_id);

create policy "matches_insert_own"
  on public.matches for insert
  with check (auth.uid() = user_id);

create policy "matches_update_own"
  on public.matches for update
  using (auth.uid() = user_id or auth.uid() = matched_user_id);

-- Create blocked users table
create table if not exists public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  blocked_user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, blocked_user_id)
);

-- Create index for faster queries
create index if not exists blocked_users_user_id_idx on public.blocked_users(user_id);

-- Enable RLS
alter table public.blocked_users enable row level security;

-- Create policies for blocked users
create policy "blocked_users_select_own"
  on public.blocked_users for select
  using (auth.uid() = user_id);

create policy "blocked_users_insert_own"
  on public.blocked_users for insert
  with check (auth.uid() = user_id);

create policy "blocked_users_delete_own"
  on public.blocked_users for delete
  using (auth.uid() = user_id);

-- Create conversations table for messaging
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references public.profiles(id) on delete cascade not null,
  user2_id uuid references public.profiles(id) on delete cascade not null,
  last_message_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user1_id, user2_id)
);

-- Create index for faster queries
create index if not exists conversations_user1_id_idx on public.conversations(user1_id);
create index if not exists conversations_user2_id_idx on public.conversations(user2_id);

-- Enable RLS
alter table public.conversations enable row level security;

-- Create policies for conversations
create policy "conversations_select_participant"
  on public.conversations for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);

create policy "conversations_insert_participant"
  on public.conversations for insert
  with check (auth.uid() = user1_id or auth.uid() = user2_id);

-- Create messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_sender_id_idx on public.messages(sender_id);

-- Enable RLS
alter table public.messages enable row level security;

-- Create policies for messages
create policy "messages_select_participant"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where id = messages.conversation_id
      and (user1_id = auth.uid() or user2_id = auth.uid())
    )
  );

create policy "messages_insert_own"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "messages_update_participant"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations
      where id = messages.conversation_id
      and (user1_id = auth.uid() or user2_id = auth.uid())
    )
  );

-- Create notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('match', 'message', 'like')) not null,
  content jsonb,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_read_idx on public.notifications(read);

-- Enable RLS
alter table public.notifications enable row level security;

-- Create policies for notifications
create policy "notifications_select_own"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications_update_own"
  on public.notifications for update
  using (auth.uid() = user_id);

