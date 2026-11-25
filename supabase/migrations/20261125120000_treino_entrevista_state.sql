-- App "treino-entrevista": estado do usuário (perfil, histórico, STAR, kit) como blob JSON.
-- Uma linha por usuário, isolada por RLS. Prefixo treino_ para não colidir com outras apps
-- que compartilhem o mesmo projeto Supabase.

create table if not exists public.treino_entrevista_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.treino_entrevista_state enable row level security;

create policy "treino_select_own" on public.treino_entrevista_state
  for select to authenticated using (auth.uid() = user_id);
create policy "treino_insert_own" on public.treino_entrevista_state
  for insert to authenticated with check (auth.uid() = user_id);
create policy "treino_update_own" on public.treino_entrevista_state
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "treino_delete_own" on public.treino_entrevista_state
  for delete to authenticated using (auth.uid() = user_id);

create or replace function public.treino_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists treino_touch on public.treino_entrevista_state;
create trigger treino_touch before update on public.treino_entrevista_state
  for each row execute function public.treino_touch_updated_at();
