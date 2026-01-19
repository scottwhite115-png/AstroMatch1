-- Add zodiac and birthdate fields to profiles table

-- Add date_of_birth column if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'profiles' 
                 and column_name = 'date_of_birth') then
    alter table public.profiles add column date_of_birth date;
  end if;
end $$;

-- Add zodiac_sign column if it doesn't exist (stores calculated sidereal sign)
do $$
begin
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'profiles' 
                 and column_name = 'zodiac_sign') then
    alter table public.profiles alter column zodiac_sign type text;
    comment on column public.profiles.zodiac_sign is 'Sidereal zodiac sign calculated from date_of_birth';
  end if;
end $$;

-- Add chinese_zodiac column if it doesn't exist (stores calculated chinese animal)
do $$
begin
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'profiles' 
                 and column_name = 'chinese_zodiac') then
    alter table public.profiles alter column chinese_zodiac type text;
    comment on column public.profiles.chinese_zodiac is 'Chinese zodiac animal calculated from date_of_birth';
  end if;
end $$;

-- Create index on date_of_birth for efficient queries
create index if not exists profiles_date_of_birth_idx on public.profiles(date_of_birth) 
where date_of_birth is not null;

-- Create a function to calculate and update zodiac signs from birthdate
-- This will be called from your Next.js app when users enter their birthdate
create or replace function public.update_zodiac_signs()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Note: Actual zodiac calculation should be done in your Next.js app
  -- using the match-engine.ts module for accuracy
  -- This trigger just ensures the fields exist
  return new;
end;
$$;

-- Create trigger to update zodiac signs when birthdate changes
drop trigger if exists update_zodiac_signs_trigger on public.profiles;
create trigger update_zodiac_signs_trigger
  before insert or update of date_of_birth on public.profiles
  for each row
  execute function public.update_zodiac_signs();

-- Add comment to the table
comment on table public.profiles is 'User profiles with astrology compatibility data';

