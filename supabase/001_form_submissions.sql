-- Opción A: una sola tabla para todos los formularios del sitio.
-- Ejecutar en Supabase → SQL Editor → Run.

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  form_key text not null,
  payload jsonb not null default '{}'::jsonb,
  email text,
  name text
);

comment on table public.form_submissions is 'Envíos desde el sitio web; payload flexible por form_key.';

create index if not exists form_submissions_form_key_idx on public.form_submissions (form_key);
create index if not exists form_submissions_created_at_idx on public.form_submissions (created_at desc);

alter table public.form_submissions enable row level security;

-- Inserción desde el navegador (rol anon vía API). Sin TO anon: aplica a todos los roles con GRANT insert.
drop policy if exists "anon puede insertar envíos" on public.form_submissions;
drop policy if exists "insert desde sitio web" on public.form_submissions;
create policy "insert desde sitio web"
  on public.form_submissions
  for insert
  with check (true);

-- La lectura en el panel de Supabase usa el rol de servicio / bypass del dashboard;
-- no habilitamos SELECT para anon.

grant usage on schema public to anon;
grant insert on table public.form_submissions to anon;
