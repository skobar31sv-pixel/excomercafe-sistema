-- EXCOMERCAFE - lectura controlada para portal de vendedores
-- Devuelve inventario anterior y mercaderia nueva por producto para un agromercado.

create or replace function public.portal_agromercado_stock(
  p_agromercado text,
  p_fecha date default current_date
)
returns table (
  producto text,
  anterior numeric,
  nuevo numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  prev_payload jsonb;
begin
  select v.payload
    into prev_payload
  from public.ventas_agromercado v
  where v.agromercado = p_agromercado
    and v.fecha < p_fecha
  order by v.fecha desc, v.creado_en desc
  limit 1;

  return query
  with productos(producto, json_key, col_name) as (
    values
      ('arroz', 'arroz', 'arroz'),
      ('precocido', 'precocido', 'arroz_precocido'),
      ('frijol1', 'frijol1', 'frijol_1lb'),
      ('frijol4', 'frijol4', 'frijol_4lb'),
      ('aceite', 'aceite', 'aceite_750ml'),
      ('harina', 'harina', 'harina_820grs')
  ),
  nuevos as (
    select
      coalesce(sum(d.arroz), 0) as arroz,
      coalesce(sum(d.arroz_precocido), 0) as arroz_precocido,
      coalesce(sum(d.frijol_1lb), 0) as frijol_1lb,
      coalesce(sum(d.frijol_4lb), 0) as frijol_4lb,
      coalesce(sum(d.aceite_750ml), 0) as aceite_750ml,
      coalesce(sum(d.harina_820grs), 0) as harina_820grs
    from public.distribucion_tiendona d
    where d.agromercado = p_agromercado
      and d.fecha = p_fecha
  )
  select
    p.producto,
    coalesce((prev_payload->'inventario_final'->>p.json_key)::numeric, 0) as anterior,
    case p.col_name
      when 'arroz' then n.arroz
      when 'arroz_precocido' then n.arroz_precocido
      when 'frijol_1lb' then n.frijol_1lb
      when 'frijol_4lb' then n.frijol_4lb
      when 'aceite_750ml' then n.aceite_750ml
      when 'harina_820grs' then n.harina_820grs
      else 0
    end as nuevo
  from productos p
  cross join nuevos n;
end;
$$;

grant execute on function public.portal_agromercado_stock(text, date) to anon, authenticated;
