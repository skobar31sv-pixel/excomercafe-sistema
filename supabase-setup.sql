-- EXCOMERCAFE - tablas necesarias para sincronizacion automatica con Supabase
-- Uso: Supabase > SQL Editor > New query > pegar este archivo > Run.
-- Este script crea tablas compatibles con la app actual y politicas RLS permisivas.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

-- Ventas oficiales aprobadas
create table if not exists public.ventas_agromercado (
  id uuid primary key default gen_random_uuid(),
  local_id text unique not null,
  user_id uuid null,
  fecha date null,
  dia text default '',
  distrito text default '',
  municipio text default '',
  agromercado text default '',
  arroz numeric default 0,
  arroz_precocido numeric default 0,
  frijol_1lb numeric default 0,
  frijol_4lb numeric default 0,
  aceite_750ml numeric default 0,
  harina_820grs numeric default 0,
  inventario_inicial numeric default 0,
  ventas numeric default 0,
  gastos numeric default 0,
  remesa numeric default 0,
  dinero_remesado numeric default 0,
  banco text default '',
  observaciones text default '',
  payload jsonb default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Reportes enviados desde el portal de vendedores, pendientes de revision
create table if not exists public.ventas_agromercado_pendientes (
  id uuid primary key default gen_random_uuid(),
  local_id text unique,
  fecha date null,
  agromercado text default '',
  encargado text default '',
  estado text default 'pendiente',
  ventas numeric default 0,
  gastos numeric default 0,
  remesa numeric default 0,
  payload jsonb default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Movimientos de inventario
create table if not exists public.inventario_movimientos (
  id uuid primary key default gen_random_uuid(),
  local_id text unique not null,
  user_id uuid null,
  fecha date null,
  ubicacion text default '',
  lugar text default '',
  tipo text default '',
  referencia text default '',
  arroz numeric default 0,
  arroz_precocido numeric default 0,
  frijol_1lb numeric default 0,
  frijol_4lb numeric default 0,
  aceite_750ml numeric default 0,
  harina_820grs numeric default 0,
  total numeric default 0,
  observaciones text default '',
  payload jsonb default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Distribucion Tiendona
create table if not exists public.distribucion_tiendona (
  id uuid primary key default gen_random_uuid(),
  local_id text unique not null,
  user_id uuid null,
  fecha date null,
  origen text default 'Tiendona',
  distrito text default '',
  municipio text default '',
  agromercado text default '',
  arroz numeric default 0,
  arroz_precocido numeric default 0,
  frijol_1lb numeric default 0,
  frijol_4lb numeric default 0,
  aceite_750ml numeric default 0,
  harina_820grs numeric default 0,
  total numeric default 0,
  observaciones text default '',
  payload jsonb default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Distribucion CDA
create table if not exists public.distribucion_cda (
  id uuid primary key default gen_random_uuid(),
  local_id text unique not null,
  user_id uuid null,
  fecha date null,
  origen text default 'CDA',
  distrito text default '',
  municipio text default '',
  cda text default '',
  arroz numeric default 0,
  arroz_precocido numeric default 0,
  frijol_1lb numeric default 0,
  frijol_4lb numeric default 0,
  aceite_750ml numeric default 0,
  harina_820grs numeric default 0,
  total numeric default 0,
  observaciones text default '',
  payload jsonb default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Personas / encargados
create table if not exists public.personas_sistema (
  id uuid primary key default gen_random_uuid(),
  local_id text unique not null,
  user_id uuid null,
  nombre text default '',
  cargo text default '',
  telefono text default '',
  agromercado text default '',
  payload jsonb default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Estado de cuadres de bodegas y CDA
create table if not exists public.estado_cuadres (
  id uuid primary key default gen_random_uuid(),
  local_id text unique not null,
  user_id uuid null,
  tipo text not null,
  fecha date null,
  grupo text default '',
  payload jsonb default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Respaldos automaticos completos
create table if not exists public.backups (
  id uuid primary key default gen_random_uuid(),
  local_id text unique not null,
  user_id uuid null,
  creado_en timestamptz not null default now(),
  payload jsonb default '{}'::jsonb,
  actualizado_en timestamptz not null default now()
);

-- Historial de respaldos
create table if not exists public.backup_logs (
  id text primary key,
  user_id uuid null,
  fecha text default '',
  hora text default '',
  origen text default '',
  estado text default '',
  payload jsonb default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Usuarios conectados
create table if not exists public.presence_online (
  id uuid primary key default gen_random_uuid(),
  client_id text unique not null,
  user_id uuid null,
  nombre text default '',
  ultimo_visto timestamptz not null default now(),
  payload jsonb default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Chat
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  client_id text default '',
  user_id uuid null,
  nombre text default '',
  mensaje text default '',
  creado_en timestamptz not null default now(),
  payload jsonb default '{}'::jsonb
);

-- Reparacion para proyectos que ya tenian tablas antiguas.
-- CREATE TABLE IF NOT EXISTS no agrega columnas nuevas a tablas existentes.
alter table public.ventas_agromercado add column if not exists local_id text;
alter table public.ventas_agromercado add column if not exists user_id uuid null;
alter table public.ventas_agromercado add column if not exists fecha date null;
alter table public.ventas_agromercado add column if not exists dia text default '';
alter table public.ventas_agromercado add column if not exists distrito text default '';
alter table public.ventas_agromercado add column if not exists municipio text default '';
alter table public.ventas_agromercado add column if not exists agromercado text default '';
alter table public.ventas_agromercado add column if not exists arroz numeric default 0;
alter table public.ventas_agromercado add column if not exists arroz_precocido numeric default 0;
alter table public.ventas_agromercado add column if not exists frijol_1lb numeric default 0;
alter table public.ventas_agromercado add column if not exists frijol_4lb numeric default 0;
alter table public.ventas_agromercado add column if not exists aceite_750ml numeric default 0;
alter table public.ventas_agromercado add column if not exists harina_820grs numeric default 0;
alter table public.ventas_agromercado add column if not exists inventario_inicial numeric default 0;
alter table public.ventas_agromercado add column if not exists ventas numeric default 0;
alter table public.ventas_agromercado add column if not exists gastos numeric default 0;
alter table public.ventas_agromercado add column if not exists remesa numeric default 0;
alter table public.ventas_agromercado add column if not exists dinero_remesado numeric default 0;
alter table public.ventas_agromercado add column if not exists banco text default '';
alter table public.ventas_agromercado add column if not exists observaciones text default '';
alter table public.ventas_agromercado add column if not exists payload jsonb default '{}'::jsonb;
alter table public.ventas_agromercado add column if not exists creado_en timestamptz not null default now();
alter table public.ventas_agromercado add column if not exists actualizado_en timestamptz not null default now();

alter table public.ventas_agromercado_pendientes add column if not exists local_id text;
alter table public.ventas_agromercado_pendientes add column if not exists fecha date null;
alter table public.ventas_agromercado_pendientes add column if not exists agromercado text default '';
alter table public.ventas_agromercado_pendientes add column if not exists encargado text default '';
alter table public.ventas_agromercado_pendientes add column if not exists estado text default 'pendiente';
alter table public.ventas_agromercado_pendientes add column if not exists ventas numeric default 0;
alter table public.ventas_agromercado_pendientes add column if not exists gastos numeric default 0;
alter table public.ventas_agromercado_pendientes add column if not exists remesa numeric default 0;
alter table public.ventas_agromercado_pendientes add column if not exists payload jsonb default '{}'::jsonb;
alter table public.ventas_agromercado_pendientes add column if not exists creado_en timestamptz not null default now();
alter table public.ventas_agromercado_pendientes add column if not exists actualizado_en timestamptz not null default now();

alter table public.inventario_movimientos add column if not exists local_id text;
alter table public.inventario_movimientos add column if not exists user_id uuid null;
alter table public.inventario_movimientos add column if not exists fecha date null;
alter table public.inventario_movimientos add column if not exists ubicacion text default '';
alter table public.inventario_movimientos add column if not exists lugar text default '';
alter table public.inventario_movimientos add column if not exists tipo text default '';
alter table public.inventario_movimientos add column if not exists referencia text default '';
alter table public.inventario_movimientos add column if not exists arroz numeric default 0;
alter table public.inventario_movimientos add column if not exists arroz_precocido numeric default 0;
alter table public.inventario_movimientos add column if not exists frijol_1lb numeric default 0;
alter table public.inventario_movimientos add column if not exists frijol_4lb numeric default 0;
alter table public.inventario_movimientos add column if not exists aceite_750ml numeric default 0;
alter table public.inventario_movimientos add column if not exists harina_820grs numeric default 0;
alter table public.inventario_movimientos add column if not exists total numeric default 0;
alter table public.inventario_movimientos add column if not exists observaciones text default '';
alter table public.inventario_movimientos add column if not exists payload jsonb default '{}'::jsonb;
alter table public.inventario_movimientos add column if not exists creado_en timestamptz not null default now();
alter table public.inventario_movimientos add column if not exists actualizado_en timestamptz not null default now();

alter table public.distribucion_tiendona add column if not exists local_id text;
alter table public.distribucion_tiendona add column if not exists user_id uuid null;
alter table public.distribucion_tiendona add column if not exists fecha date null;
alter table public.distribucion_tiendona add column if not exists origen text default 'Tiendona';
alter table public.distribucion_tiendona add column if not exists distrito text default '';
alter table public.distribucion_tiendona add column if not exists municipio text default '';
alter table public.distribucion_tiendona add column if not exists agromercado text default '';
alter table public.distribucion_tiendona add column if not exists arroz numeric default 0;
alter table public.distribucion_tiendona add column if not exists arroz_precocido numeric default 0;
alter table public.distribucion_tiendona add column if not exists frijol_1lb numeric default 0;
alter table public.distribucion_tiendona add column if not exists frijol_4lb numeric default 0;
alter table public.distribucion_tiendona add column if not exists aceite_750ml numeric default 0;
alter table public.distribucion_tiendona add column if not exists harina_820grs numeric default 0;
alter table public.distribucion_tiendona add column if not exists total numeric default 0;
alter table public.distribucion_tiendona add column if not exists observaciones text default '';
alter table public.distribucion_tiendona add column if not exists payload jsonb default '{}'::jsonb;
alter table public.distribucion_tiendona add column if not exists creado_en timestamptz not null default now();
alter table public.distribucion_tiendona add column if not exists actualizado_en timestamptz not null default now();

alter table public.distribucion_cda add column if not exists local_id text;
alter table public.distribucion_cda add column if not exists user_id uuid null;
alter table public.distribucion_cda add column if not exists fecha date null;
alter table public.distribucion_cda add column if not exists origen text default 'CDA';
alter table public.distribucion_cda add column if not exists distrito text default '';
alter table public.distribucion_cda add column if not exists municipio text default '';
alter table public.distribucion_cda add column if not exists cda text default '';
alter table public.distribucion_cda add column if not exists arroz numeric default 0;
alter table public.distribucion_cda add column if not exists arroz_precocido numeric default 0;
alter table public.distribucion_cda add column if not exists frijol_1lb numeric default 0;
alter table public.distribucion_cda add column if not exists frijol_4lb numeric default 0;
alter table public.distribucion_cda add column if not exists aceite_750ml numeric default 0;
alter table public.distribucion_cda add column if not exists harina_820grs numeric default 0;
alter table public.distribucion_cda add column if not exists total numeric default 0;
alter table public.distribucion_cda add column if not exists observaciones text default '';
alter table public.distribucion_cda add column if not exists payload jsonb default '{}'::jsonb;
alter table public.distribucion_cda add column if not exists creado_en timestamptz not null default now();
alter table public.distribucion_cda add column if not exists actualizado_en timestamptz not null default now();

alter table public.personas_sistema add column if not exists local_id text;
alter table public.personas_sistema add column if not exists user_id uuid null;
alter table public.personas_sistema add column if not exists nombre text default '';
alter table public.personas_sistema add column if not exists cargo text default '';
alter table public.personas_sistema add column if not exists telefono text default '';
alter table public.personas_sistema add column if not exists agromercado text default '';
alter table public.personas_sistema add column if not exists payload jsonb default '{}'::jsonb;
alter table public.personas_sistema add column if not exists creado_en timestamptz not null default now();
alter table public.personas_sistema add column if not exists actualizado_en timestamptz not null default now();

alter table public.estado_cuadres add column if not exists local_id text;
alter table public.estado_cuadres add column if not exists user_id uuid null;
alter table public.estado_cuadres add column if not exists tipo text default '';
alter table public.estado_cuadres add column if not exists fecha date null;
alter table public.estado_cuadres add column if not exists grupo text default '';
alter table public.estado_cuadres add column if not exists payload jsonb default '{}'::jsonb;
alter table public.estado_cuadres add column if not exists creado_en timestamptz not null default now();
alter table public.estado_cuadres add column if not exists actualizado_en timestamptz not null default now();

alter table public.backups add column if not exists local_id text;
alter table public.backups add column if not exists user_id uuid null;
alter table public.backups add column if not exists creado_en timestamptz not null default now();
alter table public.backups add column if not exists payload jsonb default '{}'::jsonb;
alter table public.backups add column if not exists actualizado_en timestamptz not null default now();

alter table public.backup_logs add column if not exists user_id uuid null;
alter table public.backup_logs add column if not exists fecha text default '';
alter table public.backup_logs add column if not exists hora text default '';
alter table public.backup_logs add column if not exists origen text default '';
alter table public.backup_logs add column if not exists estado text default '';
alter table public.backup_logs add column if not exists payload jsonb default '{}'::jsonb;
alter table public.backup_logs add column if not exists creado_en timestamptz not null default now();
alter table public.backup_logs add column if not exists actualizado_en timestamptz not null default now();

alter table public.presence_online add column if not exists client_id text;
alter table public.presence_online add column if not exists user_id uuid null;
alter table public.presence_online add column if not exists nombre text default '';
alter table public.presence_online add column if not exists ultimo_visto timestamptz not null default now();
alter table public.presence_online add column if not exists payload jsonb default '{}'::jsonb;
alter table public.presence_online add column if not exists creado_en timestamptz not null default now();
alter table public.presence_online add column if not exists actualizado_en timestamptz not null default now();

alter table public.chat_messages add column if not exists client_id text default '';
alter table public.chat_messages add column if not exists user_id uuid null;
alter table public.chat_messages add column if not exists nombre text default '';
alter table public.chat_messages add column if not exists mensaje text default '';
alter table public.chat_messages add column if not exists creado_en timestamptz not null default now();
alter table public.chat_messages add column if not exists payload jsonb default '{}'::jsonb;

create unique index if not exists ventas_agromercado_local_id_uidx on public.ventas_agromercado(local_id);
create unique index if not exists ventas_agromercado_pendientes_local_id_uidx on public.ventas_agromercado_pendientes(local_id);
create unique index if not exists inventario_movimientos_local_id_uidx on public.inventario_movimientos(local_id);
create unique index if not exists distribucion_tiendona_local_id_uidx on public.distribucion_tiendona(local_id);
create unique index if not exists distribucion_cda_local_id_uidx on public.distribucion_cda(local_id);
create unique index if not exists personas_sistema_local_id_uidx on public.personas_sistema(local_id);
create unique index if not exists estado_cuadres_local_id_uidx on public.estado_cuadres(local_id);
create unique index if not exists backups_local_id_uidx on public.backups(local_id);
create unique index if not exists presence_online_client_id_uidx on public.presence_online(client_id);

-- Indices utiles
create index if not exists idx_ventas_agromercado_fecha on public.ventas_agromercado(fecha);
create index if not exists idx_ventas_agromercado_agro_fecha on public.ventas_agromercado(agromercado, fecha);
create index if not exists idx_pendientes_estado on public.ventas_agromercado_pendientes(estado);
create index if not exists idx_pendientes_agro_fecha on public.ventas_agromercado_pendientes(agromercado, fecha);
create index if not exists idx_inventario_fecha on public.inventario_movimientos(fecha);
create index if not exists idx_tiendona_fecha on public.distribucion_tiendona(fecha);
create index if not exists idx_cda_fecha on public.distribucion_cda(fecha);
create index if not exists idx_estado_cuadres_tipo_fecha on public.estado_cuadres(tipo, fecha);
create index if not exists idx_presence_ultimo_visto on public.presence_online(ultimo_visto);
create index if not exists idx_chat_creado_en on public.chat_messages(creado_en);

-- Triggers updated_at
drop trigger if exists set_updated_at_ventas_agromercado on public.ventas_agromercado;
create trigger set_updated_at_ventas_agromercado before update on public.ventas_agromercado for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_ventas_agromercado_pendientes on public.ventas_agromercado_pendientes;
create trigger set_updated_at_ventas_agromercado_pendientes before update on public.ventas_agromercado_pendientes for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_inventario_movimientos on public.inventario_movimientos;
create trigger set_updated_at_inventario_movimientos before update on public.inventario_movimientos for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_distribucion_tiendona on public.distribucion_tiendona;
create trigger set_updated_at_distribucion_tiendona before update on public.distribucion_tiendona for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_distribucion_cda on public.distribucion_cda;
create trigger set_updated_at_distribucion_cda before update on public.distribucion_cda for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_personas_sistema on public.personas_sistema;
create trigger set_updated_at_personas_sistema before update on public.personas_sistema for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_estado_cuadres on public.estado_cuadres;
create trigger set_updated_at_estado_cuadres before update on public.estado_cuadres for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_backups on public.backups;
create trigger set_updated_at_backups before update on public.backups for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_backup_logs on public.backup_logs;
create trigger set_updated_at_backup_logs before update on public.backup_logs for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_presence_online on public.presence_online;
create trigger set_updated_at_presence_online before update on public.presence_online for each row execute function public.set_updated_at();

-- Politicas RLS permisivas para que funcione la app actual con anon/auth.
-- Si luego quieres seguridad por usuario, estas politicas se pueden endurecer.
alter table public.ventas_agromercado enable row level security;
alter table public.ventas_agromercado_pendientes enable row level security;
alter table public.inventario_movimientos enable row level security;
alter table public.distribucion_tiendona enable row level security;
alter table public.distribucion_cda enable row level security;
alter table public.personas_sistema enable row level security;
alter table public.estado_cuadres enable row level security;
alter table public.backups enable row level security;
alter table public.backup_logs enable row level security;
alter table public.presence_online enable row level security;
alter table public.chat_messages enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'ventas_agromercado',
    'ventas_agromercado_pendientes',
    'inventario_movimientos',
    'distribucion_tiendona',
    'distribucion_cda',
    'personas_sistema',
    'estado_cuadres',
    'backups',
    'backup_logs',
    'presence_online',
    'chat_messages'
  ]
  loop
    execute format('drop policy if exists "%s_select_all" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%s_insert_all" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%s_update_all" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%s_delete_all" on public.%I', table_name, table_name);

    execute format('create policy "%s_select_all" on public.%I for select using (true)', table_name, table_name);
    execute format('create policy "%s_insert_all" on public.%I for insert with check (true)', table_name, table_name);
    execute format('create policy "%s_update_all" on public.%I for update using (true) with check (true)', table_name, table_name);
    execute format('create policy "%s_delete_all" on public.%I for delete using (true)', table_name, table_name);
  end loop;
end $$;
