-- Create likes table for one-way likes (before mutual match)
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references public.profiles(id) on delete cascade not null,
  to_user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(from_user_id, to_user_id)
);

-- Create indexes for faster queries
create index if not exists likes_from_user_id_idx on public.likes(from_user_id);
create index if not exists likes_to_user_id_idx on public.likes(to_user_id);

-- Enable RLS
alter table public.likes enable row level security;

-- Create policies for likes
create policy "likes_select_own"
  on public.likes for select
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "likes_insert_own"
  on public.likes for insert
  with check (auth.uid() = from_user_id);

create policy "likes_delete_own"
  on public.likes for delete
  using (auth.uid() = from_user_id);

-- Add is_new_match column to conversations table
-- This flag indicates if the conversation was just created from a mutual match
alter table public.conversations 
add column if not exists is_new_match boolean default true;

-- Add index for new_match queries
create index if not exists conversations_is_new_match_idx on public.conversations(is_new_match) where is_new_match = true;

-- Comment: The conversations table already has user1_id and user2_id
-- When a mutual like happens, we create a conversation with both users


