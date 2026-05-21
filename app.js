var SUPABASE_CONFIG = {
  url: 'https://hfijlpjeqagxyvgirkwk.supabase.co',
  key: 'sb_publishable_AIUqdFrAct3bR6y8Y6t1Qw_qNGJ5GHs'
};

var AGROMERCADO_NOMBRES = [
  'Acajutla, mercado de Acajutla',
  'Alcaldia de Mejicanos',
  'Anamoros calle cirilo bonilla umanzor',
  'Apastepeque',
  'Apopa, Parque Central Noe Canjura',
  'Armenia, parque de Armenia',
  'Av 5 de noviembre, contiguo a casa de la cultura de Atiquizaya',
  'Ayutuxtepeque, Plaza Municipal ( Parque Bonanza Agromercado)',
  'Barrio la cruz, km. 121 El Transito',
  'Bo el centro, 6a calle poniente, Juayua',
  'Campo de La Feria San Francisco Gotera',
  'Centro de Gobierno Municipal',
  'Chalchuapa parque central',
  'Chinameca, Parque Central',
  'Ciudad Arce, Parque Central',
  'Ciudad barrios tiangue municipal',
  'Ciudad Delgado, Plaza Monsenor Romero',
  'Cojutepeque, parque Alamedas',
  'Colonia El Palmar',
  'Corinto barrio las delicias',
  'Distrito 2 Nuevo Lourdes (centro lourdes, banco agricola)',
  'El Paraiso, cancha techada de parque municipal',
  'Esquina Cancha Tacon',
  'Frente a la Alcaldia de Suchitoto',
  'Frente a la parroquia Carlos Borromeo',
  'Ilobasco, Parque Central',
  'Ilopango, Esquina Polideportivo Altavista',
  'Ilopango, TICSA',
  'Izalco, Casa Barrientos',
  'Jiquilisco, esquina opuesta a la Alcaldia Municipal de Jiquilisco',
  'Jocoaltique, supermercado los quebrachos',
  'Jocoro Polideportivo Tierra de Fuego',
  'Km 12 Calle Alberto Masferrer , Santo Tomas',
  'Mercado Municipal #5, Final 18 Ave Norte Mercado Municipal #5',
  'Metapan (Mercado municipal exrastro)',
  'Nueva Concepcion parque municipal',
  'Parque Berlin de Ex injuve de Berlin',
  'Parque Central Aguilares',
  'Parque Concordia',
  'Parque de Alcaldia Municipal del Triunfo',
  'Parque Ecologico Olocuilta',
  'Parque Municipal Mario Molina',
  'Parque Rafael Campos, 7a. Calle Poniente, 7a. Calle Oriente',
  'Placita El Calvario',
  'Polideportivo El Congo',
  'Quezaltepeque, Plaza Centenario',
  'San Francisco Menendez (Colonia La Palma)',
  'San Juan Opico, Parque Central',
  'San Marcos, Parque Joyas de Esperanza y Paz',
  'San Martin, Alcaldia de San Martin',
  'San Miguel Centro (Barraza)',
  'San Rafael Cedro',
  'San Vicente, Parque Central',
  'Santa Rosa de Lima, Terminal de Buses Santa Rosa de Lima',
  'Santa Tecla 2',
  'Santa Tecla, Parque Daniel Hernandez ( frente a mezon goya)',
  'Sensuntepeque, Parque Central',
  'Skate Park colonia IVU',
  'Soyapango, Redondel de Unicentro',
  'Zacatecoluca, Plaza Civica',
  'Zaragoza',
  'Zona verde, colonia Las Mercedes 1ra salida hacia el Triunfo( SANTIAGO DE MARIA)'
];

var AGROMERCADOS = AGROMERCADO_NOMBRES.map(function(nombre, index){
  return { nombre: nombre, clave: generarClaveAgromercado(nombre, index) };
});

var PRODUCTOS = [
  { key:'arroz', nombre:'Arroz', precio:0.25 },
  { key:'precocido', nombre:'Arroz precocido', precio:0.60 },
  { key:'frijol1', nombre:'Frijol 1 lb', precio:0.70 },
  { key:'frijol4', nombre:'Frijol 4 lb', precio:2.80 },
  { key:'aceite', nombre:'Aceite vegetal 750 ml', precio:1.00 },
  { key:'harina', nombre:'Harina de maiz 820 grs', precio:1.10 }
];

var PRODUCTO_COLUMNAS = {
  arroz: 'arroz',
  precocido: 'arroz_precocido',
  frijol1: 'frijol_1lb',
  frijol4: 'frijol_4lb',
  aceite: 'aceite_750ml',
  harina: 'harina_820grs'
};

var accesoActual = null;
var ACCESS_STORAGE_KEY = 'agromercado_portal_access_v1';

function palabraClave(nombre){
  var ignorar = { EL:true, LA:true, LAS:true, LOS:true, DE:true, DEL:true, BO:true, BARRIO:true, PARQUE:true };
  var palabras = String(nombre || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean);
  return palabras.find(function(p){ return !ignorar[p] && p.length >= 3; }) || palabras[0] || 'AGRO';
}

function generarClaveAgromercado(nombre, index){
  var base = palabraClave(nombre);
  var repetidasAntes = AGROMERCADO_NOMBRES.slice(0, index).filter(function(item){
    return palabraClave(item) === base;
  }).length;
  return base + (repetidasAntes ? String(repetidasAntes + 1) : '') + '2026';
}

function hoy(){
  var d = new Date();
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function fechaVista(value){
  var parts = String(value || '').split('-');
  return parts.length === 3 ? parts[2] + '/' + parts[1] + '/' + parts[0] : value;
}

function n(value){
  var num = Number(value);
  return isFinite(num) ? num : 0;
}

function money(value){
  return '$' + n(value).toFixed(2);
}

function clearZero(input){
  if(input && String(input.value) === '0') input.value = '';
}

function restoreZero(input){
  if(input && String(input.value).trim() === '') input.value = '0';
}

function normalizarTexto(value){
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function leerPersonasSistema(){
  try{
    var data = JSON.parse(localStorage.getItem('personas-data') || '[]');
    return Array.isArray(data) ? data : [];
  }catch(e){
    return [];
  }
}

async function leerPersonasSistemaSupabase(){
  try{
    var response = await fetch(SUPABASE_CONFIG.url + '/rest/v1/personas_sistema?select=nombre,cargo,telefono,agromercado,payload&order=actualizado_en.desc&limit=1000', {
      headers: {
        apikey: SUPABASE_CONFIG.key,
        Authorization: 'Bearer ' + SUPABASE_CONFIG.key
      }
    });
    if(!response.ok) return [];
    var rows = await response.json();
    return (rows || []).map(function(row){
      return Object.assign({}, row.payload || {}, {
        nombre: row.nombre || (row.payload && row.payload.nombre) || '',
        cargo: row.cargo || (row.payload && row.payload.cargo) || '',
        telefono: row.telefono || (row.payload && row.payload.telefono) || '',
        agromercado: row.agromercado || (row.payload && row.payload.agromercado) || ''
      });
    });
  }catch(e){
    return [];
  }
}

function buscarEncargadoEnPersonas(personas, agromercado){
  var objetivo = normalizarTexto(agromercado);
  if(!objetivo) return '';
  var match = personas.find(function(persona){
    return normalizarTexto(persona.agromercado || persona.agromercadoAsignado || persona.mercado) === objetivo;
  });
  return match ? String(match.nombre || '').trim() : '';
}

async function encargadoPorAgromercado(agromercado){
  var local = buscarEncargadoEnPersonas(leerPersonasSistema(), agromercado);
  if(local) return local;
  return buscarEncargadoEnPersonas(await leerPersonasSistemaSupabase(), agromercado);
}

async function aplicarEncargadoAgromercado(agromercado){
  var input = document.getElementById('encargado');
  if(!input) return;
  var encargado = await encargadoPorAgromercado(agromercado);
  input.value = encargado;
  input.placeholder = encargado ? 'Encargado asignado' : 'Sin encargado asignado en Personas';
}

function localId(){
  return 'pend-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

function setMessage(id, text, type){
  var el = document.getElementById(id);
  if(!el) return;
  el.textContent = text || '';
  el.className = 'message ' + (type || '');
}

function guardarAccesoPortal(agromercado, clave){
  try{
    localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify({
      agromercado: agromercado || '',
      clave: clave || '',
      guardado_en: new Date().toISOString()
    }));
  }catch(e){}
}

function leerAccesoPortal(){
  try{
    var data = JSON.parse(localStorage.getItem(ACCESS_STORAGE_KEY) || 'null');
    return data && data.agromercado && data.clave ? data : null;
  }catch(e){
    return null;
  }
}

function limpiarAccesoPortal(){
  try{ localStorage.removeItem(ACCESS_STORAGE_KEY); }catch(e){}
}

function llenarAgromercados(){
  var select = document.getElementById('access-agromercado');
  if(!select) return;
  select.innerHTML = '<option value="">Seleccione...</option>' + AGROMERCADOS.map(function(a){
    return '<option value="' + a.nombre + '">' + a.nombre + '</option>';
  }).join('');
}

function renderProductos(){
  var body = document.getElementById('productos-body');
  if(!body) return;
  body.innerHTML = PRODUCTOS.map(function(p){
    return '<tr data-prod="' + p.key + '">'
      + '<td data-label="Producto">' + p.nombre + '</td>'
      + '<td data-label="Inv. anterior"><input class="readonly-field" type="number" value="0" data-field="anterior" readonly></td>'
      + '<td data-label="Mercaderia nueva"><input class="readonly-field" type="number" value="0" data-field="nuevo" readonly></td>'
      + '<td data-label="Venta"><input type="number" min="0" value="0" data-field="venta" inputmode="numeric" onfocus="clearZero(this)" onblur="restoreZero(this);calcularTotales()" oninput="calcularTotales()"></td>'
      + '<td data-label="Faltante"><input type="number" min="0" value="0" data-field="faltante" inputmode="numeric" onfocus="clearZero(this)" onblur="restoreZero(this);calcularTotales()" oninput="calcularTotales()"></td>'
      + '<td data-label="Danado"><input type="number" min="0" value="0" data-field="danado" inputmode="numeric" onfocus="clearZero(this)" onblur="restoreZero(this);calcularTotales()" oninput="calcularTotales()"></td>'
      + '<td data-label="Inv. final"><input class="readonly-field" type="number" value="0" data-field="final" readonly></td>'
      + '<td data-label="Total dinero" class="money-cell dinero" data-field="dinero">$0.00</td>'
      + '</tr>';
  }).join('');
}

function rowValue(row, field){
  var input = row.querySelector('input[data-field="' + field + '"]');
  return n(input && input.value);
}

function setRowValue(row, field, value){
  var input = row && row.querySelector('input[data-field="' + field + '"]');
  if(input) input.value = String(n(value));
}

function calcularProducto(row, prod){
  var venta = rowValue(row, 'venta');
  var final = rowValue(row, 'anterior') + rowValue(row, 'nuevo') - venta - rowValue(row, 'faltante') - rowValue(row, 'danado');
  var dinero = venta * prod.precio;
  setRowValue(row, 'final', final);
  row.querySelector('.dinero').textContent = money(dinero);
  return { vendido: venta, dinero: dinero, final: final };
}

function calcularTotales(){
  var total = 0;
  PRODUCTOS.forEach(function(prod){
    var row = document.querySelector('tr[data-prod="' + prod.key + '"]');
    if(!row) return;
    total += calcularProducto(row, prod).dinero;
  });
  var gastos = n(document.getElementById('gastos') && document.getElementById('gastos').value);
  document.getElementById('total-ventas').textContent = money(total);
  document.getElementById('total-gastos').textContent = money(gastos);
  document.getElementById('total-remesa').textContent = money(total - gastos);
}

async function validarAcceso(){
  var agromercado = document.getElementById('access-agromercado').value;
  var clave = String(document.getElementById('access-clave').value || '').trim().toUpperCase();
  var match = AGROMERCADOS.find(function(a){
    return a.nombre === agromercado && a.clave === clave;
  });
  if(!match){
    setMessage('access-message', 'Clave o agromercado incorrecto.', 'error');
    limpiarAccesoPortal();
    return;
  }
  accesoActual = match;
  guardarAccesoPortal(agromercado, clave);
  document.getElementById('access-panel').classList.add('hidden');
  document.getElementById('sales-form').classList.remove('hidden');
  document.getElementById('agromercado-label').textContent = match.nombre;
  document.getElementById('fecha').value = hoy();
  await aplicarEncargadoAgromercado(match.nombre);
  await cargarValoresInicialesAgromercado(match.nombre);
  calcularTotales();
}

function salirPortal(){
  accesoActual = null;
  limpiarAccesoPortal();
  document.getElementById('sales-form').classList.add('hidden');
  document.getElementById('access-panel').classList.remove('hidden');
  document.getElementById('access-clave').value = '';
}

async function restaurarAccesoGuardado(){
  var access = leerAccesoPortal();
  if(!access) return;
  var agroEl = document.getElementById('access-agromercado');
  var claveEl = document.getElementById('access-clave');
  if(!agroEl || !claveEl) return;
  agroEl.value = access.agromercado;
  claveEl.value = access.clave;
  await validarAcceso();
}

function imprimirHojaVendedor(){
  calcularTotales();
  window.print();
}

function productoValueFromPayload(map, key){
  return n(map && map[key]);
}

function aplicarValoresProducto(key, anterior, nuevo){
  var row = document.querySelector('tr[data-prod="' + key + '"]');
  if(!row) return;
  setRowValue(row, 'anterior', anterior);
  setRowValue(row, 'nuevo', nuevo);
  calcularProducto(row, PRODUCTOS.find(function(p){ return p.key === key; }) || { precio:0 });
}

async function fetchSupabase(path){
  var response = await fetch(SUPABASE_CONFIG.url + path, {
    headers: {
      apikey: SUPABASE_CONFIG.key,
      Authorization: 'Bearer ' + SUPABASE_CONFIG.key
    }
  });
  if(!response.ok) return null;
  return response.json();
}

async function cargarValoresInicialesRpc(agromercado, fecha){
  var response = await fetch(SUPABASE_CONFIG.url + '/rest/v1/rpc/portal_agromercado_stock', {
    method: 'POST',
    headers: {
      apikey: SUPABASE_CONFIG.key,
      Authorization: 'Bearer ' + SUPABASE_CONFIG.key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ p_agromercado: agromercado, p_fecha: fecha })
  });
  if(!response.ok) return false;
  var rows = await response.json();
  (rows || []).forEach(function(row){
    aplicarValoresProducto(row.producto, row.anterior || 0, row.nuevo || 0);
  });
  return Array.isArray(rows);
}

async function cargarValoresInicialesAgromercado(agromercado){
  var fecha = hoy();
  var anteriores = {};
  var nuevos = {};

  try{
    if(await cargarValoresInicialesRpc(agromercado, fecha)) return;
  }catch(e){}

  try{
    var prevRows = await fetchSupabase('/rest/v1/ventas_agromercado?select=payload,fecha,creado_en&agromercado=eq.' + encodeURIComponent(agromercado) + '&fecha=lt.' + encodeURIComponent(fecha) + '&order=fecha.desc,creado_en.desc&limit=1');
    var prevPayload = prevRows && prevRows[0] && prevRows[0].payload ? prevRows[0].payload : null;
    PRODUCTOS.forEach(function(prod){
      anteriores[prod.key] = productoValueFromPayload(prevPayload && prevPayload.inventario_final, prod.key);
    });
  }catch(e){}

  try{
    var distRows = await fetchSupabase('/rest/v1/distribucion_tiendona?select=arroz,arroz_precocido,frijol_1lb,frijol_4lb,aceite_750ml,harina_820grs,payload&agromercado=eq.' + encodeURIComponent(agromercado) + '&fecha=eq.' + encodeURIComponent(fecha) + '&limit=1000');
    (distRows || []).forEach(function(row){
      PRODUCTOS.forEach(function(prod){
        var col = PRODUCTO_COLUMNAS[prod.key];
        nuevos[prod.key] = n(nuevos[prod.key]) + n(row[col]);
      });
    });
  }catch(e){}

  PRODUCTOS.forEach(function(prod){
    aplicarValoresProducto(prod.key, anteriores[prod.key] || 0, nuevos[prod.key] || 0);
  });
}

function leerProductos(){
  var ventasUnidades = {};
  var inventarioInicio = {};
  var inventarioNuevo = {};
  var inventarioFinal = {};
  var faltante = {};
  var danado = {};
  var dineroProductos = {};

  PRODUCTOS.forEach(function(prod){
    var row = document.querySelector('tr[data-prod="' + prod.key + '"]');
    var calc = row ? calcularProducto(row, prod) : { vendido:0, dinero:0 };
    ventasUnidades[prod.key] = calc.vendido;
    inventarioInicio[prod.key] = rowValue(row, 'anterior');
    inventarioNuevo[prod.key] = rowValue(row, 'nuevo');
    inventarioFinal[prod.key] = rowValue(row, 'final');
    faltante[prod.key] = rowValue(row, 'faltante');
    danado[prod.key] = rowValue(row, 'danado');
    dineroProductos[prod.key] = calc.dinero;
  });

  return {
    ventas_unidades: ventasUnidades,
    inventario_inicio: inventarioInicio,
    mercaderia_nueva: inventarioNuevo,
    inventario_final: inventarioFinal,
    faltante: faltante,
    apartado: faltante,
    danado: danado,
    dinero_productos: dineroProductos
  };
}

async function supabaseInsert(row){
  var response = await fetch(SUPABASE_CONFIG.url + '/rest/v1/ventas_agromercado_pendientes', {
    method: 'POST',
    headers: {
      apikey: SUPABASE_CONFIG.key,
      Authorization: 'Bearer ' + SUPABASE_CONFIG.key,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify([row])
  });
  if(!response.ok){
    var data = await response.json().catch(function(){ return null; });
    throw new Error((data && data.message) || response.status + ' ' + response.statusText);
  }
}

async function enviarControl(event){
  event.preventDefault();
  if(!accesoActual) return;
  setMessage('submit-message', 'Enviando...', '');
  calcularTotales();
  var productos = leerProductos();
  var ventas = PRODUCTOS.reduce(function(acc, prod){
    return acc + n(productos.dinero_productos[prod.key]);
  }, 0);
  var gastos = n(document.getElementById('gastos').value);
  var payload = Object.assign({
    id: localId(),
    fecha: document.getElementById('fecha').value,
    agromercado: accesoActual.nombre,
    nombre: accesoActual.nombre,
    encargado: document.getElementById('encargado').value.trim(),
    banco: document.getElementById('banco').value,
    ventas: ventas,
    gastos: gastos,
    remesa: ventas - gastos,
    dineroRemesado: ventas - gastos,
    observaciones: document.getElementById('observaciones').value.trim(),
    origen: 'portal-agromercado'
  }, productos);

  var row = {
    local_id: payload.id,
    fecha: payload.fecha,
    agromercado: payload.agromercado,
    encargado: payload.encargado,
    estado: 'pendiente',
    ventas: payload.ventas,
    gastos: payload.gastos,
    remesa: payload.remesa,
    payload: payload
  };

  try{
    await supabaseInsert(row);
    setMessage('submit-message', 'Enviado. Queda pendiente de revision.', 'ok');
    document.getElementById('sales-form').reset();
    document.getElementById('fecha').value = hoy();
    if(accesoActual) await aplicarEncargadoAgromercado(accesoActual.nombre);
    renderProductos();
    if(accesoActual) await cargarValoresInicialesAgromercado(accesoActual.nombre);
    calcularTotales();
  }catch(error){
    setMessage('submit-message', 'No se pudo enviar: ' + error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('fecha-visible').textContent = fechaVista(hoy());
  llenarAgromercados();
  renderProductos();
  var fecha = document.getElementById('fecha');
  if(fecha) fecha.value = hoy();
  restaurarAccesoGuardado();
});
