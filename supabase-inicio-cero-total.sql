-- EXCOMERCAFE - INICIO CERO TOTAL
-- Ejecutar completo en Supabase SQL Editor.
--
-- Borra TODOS los registros de trabajo de la app:
-- ventas, reportes pendientes, inventario, distribuciones, cuadres,
-- personas, chat, presencia y respaldos remotos.
--
-- No borra usuarios de Supabase Authentication.
-- Si tambien quieres borrar usuarios de inicio de sesion:
-- Dashboard Supabase > Authentication > Users > Delete users.

begin;

do $$
declare
  t text;
  tablas text[] := array[
    'ventas_agromercado_pendientes',
    'ventas_agromercado',
    'inventario_movimientos',
    'distribucion_tiendona',
    'distribucion_cda',
    'estado_cuadres',
    'personas_sistema',
    'presence_online',
    'chat_messages',
    'backup_logs',
    'backups'
  ];
begin
  foreach t in array tablas loop
    if to_regclass('public.' || t) is not null then
      execute format('truncate table public.%I restart identity cascade', t);
    end if;
  end loop;
end $$;

commit;
