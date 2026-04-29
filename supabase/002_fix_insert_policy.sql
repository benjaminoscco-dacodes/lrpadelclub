-- Si al enviar el formulario ves error de permisos / RLS (403), ejecuta esto en SQL Editor.
-- Sustituye la política anterior por una que permite INSERT a cualquier rol con permiso en la tabla.

drop policy if exists "anon puede insertar envíos" on public.form_submissions;

create policy "insert desde sitio web"
  on public.form_submissions
  for insert
  with check (true);
