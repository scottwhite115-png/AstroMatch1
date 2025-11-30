alter table public.profiles
add column if not exists auth_provider text,
add column if not exists email text;

-- constrain provider to known values
do $$
begin
  if not exists (
    select 1 from information_schema.constraint_column_usage 
    where table_schema = 'public' and table_name = 'profiles' and constraint_name = 'profiles_auth_provider_check'
  ) then
    alter table public.profiles
    add constraint profiles_auth_provider_check
    check (auth_provider is null or auth_provider in ('email','google','apple','facebook'));
  end if;
end $$;


