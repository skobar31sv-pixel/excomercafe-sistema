-- Limpia el sistema de recuperacion de contrasena que ya no se usara.
-- No toca ventas, inventario, distribuciones, personas, chat ni respaldos.

drop function if exists public.password_reset_status(uuid, text);
drop function if exists public.approve_password_reset(uuid);
drop function if exists public.complete_password_reset(uuid, text, text);

do $$
begin
  if to_regclass('public.password_reset_requests') is not null then
    drop policy if exists password_reset_insert_anon on public.password_reset_requests;
    drop policy if exists password_reset_admin_select on public.password_reset_requests;
  end if;
end $$;

drop index if exists public.password_reset_one_open_per_email_idx;
drop index if exists public.password_reset_requests_estado_idx;

drop table if exists public.password_reset_requests cascade;

select pg_notify('pgrst', 'reload schema');
