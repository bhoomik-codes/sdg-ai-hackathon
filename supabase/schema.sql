-- Shared, fictional judge-demo data only. Do not store personal or NGO identity data here.
create table if not exists public.commons_records (
  id text primary key,
  kind text not null check (kind in ('listing', 'request')),
  data jsonb not null,
  created_at timestamptz not null default now(),
  constraint commons_record_id_matches_data check (data ->> 'id' = id)
);

alter table public.commons_records enable row level security;
revoke all on table public.commons_records from anon, authenticated;
grant select, insert, update, delete on table public.commons_records to anon;

drop policy if exists "Public judge demo can read shared records" on public.commons_records;
create policy "Public judge demo can read shared records"
  on public.commons_records for select to anon using (true);

drop policy if exists "Public judge demo can add shared records" on public.commons_records;
create policy "Public judge demo can add shared records"
  on public.commons_records for insert to anon with check (true);

drop policy if exists "Public judge demo can update shared records" on public.commons_records;
create policy "Public judge demo can update shared records"
  on public.commons_records for update to anon using (true) with check (true);

drop policy if exists "Public judge demo can reset shared records" on public.commons_records;
create policy "Public judge demo can reset shared records"
  on public.commons_records for delete to anon using (true);

create or replace function public.reset_commons_demo(p_records jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.commons_records;
  insert into public.commons_records (id, kind, data)
  select record.id, record.kind, record.data
  from pg_catalog.jsonb_to_recordset(p_records) as record(id text, kind text, data jsonb);
end;
$$;

revoke all on function public.reset_commons_demo(jsonb) from public, anon, authenticated;
grant execute on function public.reset_commons_demo(jsonb) to anon;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'commons_records'
  ) then
    alter publication supabase_realtime add table public.commons_records;
  end if;
end
$$;
