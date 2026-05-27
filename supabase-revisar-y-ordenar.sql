-- Revision segura de Supabase para EXCOMERCAFE.
-- Este archivo NO borra ventas, inventario, distribuciones, usuarios ni reportes.
-- Ejecuta primero las consultas de REVISION. Despues, si todo se ve bien,
-- puedes ejecutar la limpieza final de recuperacion de contrasena.

-- 1) Ver todas las tablas publicas.
select
  table_name as tabla
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE'
order by table_name;

-- 2) Ver funciones publicas que pueden haber quedado viejas.
select
  p.proname as funcion,
  pg_get_function_arguments(p.oid) as argumentos
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.proname;

-- 3) Tablas que SI usa el sistema actual y conviene conservar.
with tablas_necesarias(tabla, uso) as (
  values
    ('ventas_agromercado', 'Ventas aprobadas de agromercados'),
    ('ventas_agromercado_pendientes', 'Reportes enviados por vendedores pendientes/rechazados'),
    ('inventario_movimientos', 'Centro de inventario'),
    ('distribucion_tiendona', 'Distribucion Tiendona hacia agromercados'),
    ('distribucion_cda', 'Distribucion CDA'),
    ('estado_cuadres', 'Estados guardados de cuadre/reportes'),
    ('personas_sistema', 'Gestion de personas y encargados'),
    ('presence_online', 'Usuarios conectados'),
    ('chat_messages', 'Chat interno'),
    ('backup_logs', 'Historial de respaldos'),
    ('backups', 'Respaldos completos si la tabla existe')
)
select
  n.tabla,
  case when t.table_name is null then 'NO EXISTE' else 'EXISTE' end as estado,
  n.uso
from tablas_necesarias n
left join information_schema.tables t
  on t.table_schema = 'public'
 and t.table_name = n.tabla
order by n.tabla;

-- 4) Objetos que ya no usa la app: recuperacion de contrasena.
-- Si aparecen aqui, se pueden borrar.
select 'tabla' as tipo, 'password_reset_requests' as nombre
where to_regclass('public.password_reset_requests') is not null
union all
select 'funcion', p.proname || '(' || pg_get_function_arguments(p.oid) || ')'
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'password_reset_status',
    'approve_password_reset',
    'complete_password_reset'
  );

-- 5) Limpieza final de lo que ya quitamos del codigo.
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
