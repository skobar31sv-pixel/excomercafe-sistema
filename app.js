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

var accesoActual = null;

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

function localId(){
  return 'pend-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

function setMessage(id, text, type){
  var el = document.getElementById(id);
  if(!el) return;
  el.textContent = text || '';
  el.className = 'message ' + (type || '');
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
      + '<td>' + p.nombre + '</td>'
      + '<td class="money-cell">' + money(p.precio) + '</td>'
      + '<td><input type="number" min="0" value="0" data-field="anterior" oninput="calcularTotales()"></td>'
      + '<td><input type="number" min="0" value="0" data-field="nuevo" oninput="calcularTotales()"></td>'
      + '<td><input type="number" min="0" value="0" data-field="final" oninput="calcularTotales()"></td>'
      + '<td><input type="number" min="0" value="0" data-field="apartado" oninput="calcularTotales()"></td>'
      + '<td><input type="number" min="0" value="0" data-field="danado" oninput="calcularTotales()"></td>'
      + '<td class="vendido" data-field="vendido">0</td>'
      + '<td class="money-cell dinero" data-field="dinero">$0.00</td>'
      + '</tr>';
  }).join('');
}

function rowValue(row, field){
  var input = row.querySelector('input[data-field="' + field + '"]');
  return n(input && input.value);
}

function calcularProducto(row, prod){
  var vendido = Math.max(0,
    rowValue(row, 'anterior')
    + rowValue(row, 'nuevo')
    - rowValue(row, 'final')
    - rowValue(row, 'apartado')
    - rowValue(row, 'danado')
  );
  var dinero = vendido * prod.precio;
  row.querySelector('.vendido').textContent = vendido;
  row.querySelector('.dinero').textContent = money(dinero);
  return { vendido: vendido, dinero: dinero };
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

function validarAcceso(){
  var agromercado = document.getElementById('access-agromercado').value;
  var clave = String(document.getElementById('access-clave').value || '').trim().toUpperCase();
  var match = AGROMERCADOS.find(function(a){
    return a.nombre === agromercado && a.clave === clave;
  });
  if(!match){
    setMessage('access-message', 'Clave o agromercado incorrecto.', 'error');
    return;
  }
  accesoActual = match;
  document.getElementById('access-panel').classList.add('hidden');
  document.getElementById('sales-form').classList.remove('hidden');
  document.getElementById('agromercado-label').textContent = match.nombre;
  document.getElementById('fecha').value = hoy();
  calcularTotales();
}

function salirPortal(){
  accesoActual = null;
  document.getElementById('sales-form').classList.add('hidden');
  document.getElementById('access-panel').classList.remove('hidden');
  document.getElementById('access-clave').value = '';
}

function leerProductos(){
  var ventasUnidades = {};
  var inventarioInicio = {};
  var inventarioNuevo = {};
  var inventarioFinal = {};
  var apartado = {};
  var danado = {};
  var dineroProductos = {};

  PRODUCTOS.forEach(function(prod){
    var row = document.querySelector('tr[data-prod="' + prod.key + '"]');
    var calc = row ? calcularProducto(row, prod) : { vendido:0, dinero:0 };
    ventasUnidades[prod.key] = calc.vendido;
    inventarioInicio[prod.key] = rowValue(row, 'anterior');
    inventarioNuevo[prod.key] = rowValue(row, 'nuevo');
    inventarioFinal[prod.key] = rowValue(row, 'final');
    apartado[prod.key] = rowValue(row, 'apartado');
    danado[prod.key] = rowValue(row, 'danado');
    dineroProductos[prod.key] = calc.dinero;
  });

  return {
    ventas_unidades: ventasUnidades,
    inventario_inicio: inventarioInicio,
    mercaderia_nueva: inventarioNuevo,
    inventario_final: inventarioFinal,
    apartado: apartado,
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
    renderProductos();
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
});
