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
  { key:'frijol4', nombre:'Frijol 4 lb', precio:0.70 },
  { key:'aceite', nombre:'Aceite vegetal 750 ml', precio:2.00 },
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
var PENDING_STORAGE_KEY = 'agromercado_portal_pending_v1';
var hojaBloqueada = false;
var refreshTimer = null;
var refreshRunning = false;
var REFRESH_MS = 20000;

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

function fechaSeleccionada(){
  var fecha = document.getElementById('fecha');
  return (fecha && fecha.value) || hoy();
}

function guardarPendienteLocal(agromercado, fecha){
  try{
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify({
      agromercado: agromercado || '',
      fecha: fecha || fechaSeleccionada(),
      guardado_en: new Date().toISOString()
    }));
  }catch(e){}
}

function leerPendienteLocal(agromercado, fecha){
  try{
    var data = JSON.parse(localStorage.getItem(PENDING_STORAGE_KEY) || 'null');
    return data && data.agromercado === agromercado && String(data.fecha || '').slice(0,10) === String(fecha || fechaSeleccionada()).slice(0,10) ? data : null;
  }catch(e){
    return null;
  }
}

function limpiarPendienteLocal(){
  try{ localStorage.removeItem(PENDING_STORAGE_KEY); }catch(e){}
}

function setHojaBloqueada(locked, info){
  hojaBloqueada = !!locked;
  var form = document.getElementById('sales-form');
  if(form) form.classList.toggle('is-locked', hojaBloqueada);
  document.querySelectorAll('#sales-form input, #sales-form select, #sales-form textarea').forEach(function(el){
    el.disabled = hojaBloqueada && el.id !== 'fecha';
  });
  document.querySelectorAll('#sales-form button.primary').forEach(function(btn){
    btn.disabled = hojaBloqueada;
  });
  if(hojaBloqueada){
    var fecha = info && info.fecha ? (' del ' + fechaVista(info.fecha)) : '';
    var aprobado = info && (info.tipo === 'aprobado' || String(info.estado || '').toLowerCase() === 'aprobado');
    setMessage('submit-message', aprobado
      ? 'Reporte aprobado' + fecha + '. Ya no se puede enviar otro reporte para esa fecha.'
      : 'Reporte enviado y pendiente de revision' + fecha + '. No se puede editar ni enviar otro para esa fecha hasta que sea aprobado o rechazado.', 'ok');
  }else{
    var msg = document.getElementById('submit-message');
    if(msg && /Reporte (enviado y pendiente|aprobado)/i.test(msg.textContent || '')) setMessage('submit-message', '', '');
  }
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

function marcarErrorInventario(row, hasError){
  if(!row) return;
  row.classList.toggle('row-error', !!hasError);
  var finalInput = row.querySelector('input[data-field="final"]');
  if(finalInput) finalInput.classList.toggle('input-error', !!hasError);
}

function calcularProducto(row, prod){
  var venta = rowValue(row, 'venta');
  var final = rowValue(row, 'anterior') + rowValue(row, 'nuevo') - venta - rowValue(row, 'faltante') - rowValue(row, 'danado');
  var dinero = venta * prod.precio;
  setRowValue(row, 'final', final);
  marcarErrorInventario(row, final < 0);
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

function validarInventarioDisponible(){
  var errores = [];
  PRODUCTOS.forEach(function(prod){
    var row = document.querySelector('tr[data-prod="' + prod.key + '"]');
    if(!row) return;
    var calc = calcularProducto(row, prod);
    if(calc.final < 0){
      errores.push(prod.nombre + ': ' + calc.final);
    }
  });
  if(errores.length){
    setMessage('submit-message', 'No se puede enviar: hay ventas/faltantes/dañado mayores al inventario disponible. Revisa las casillas en rojo.', 'error');
    alert('No se puede enviar el reporte. Inventario negativo en:\n\n' + errores.join('\n'));
    return false;
  }
  return true;
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
  await refrescarHojaVendedor(true);
  iniciarAutoRefresh();
}

function salirPortal(){
  accesoActual = null;
  detenerAutoRefresh();
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
  var win = window.open('', '_blank');
  if(!win){
    window.print();
    return;
  }
  win.document.write(buildPrintHtml());
  win.document.close();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines){
  var words = String(text || '').split(/\s+/);
  var line = '';
  var lines = 0;
  for(var i = 0; i < words.length; i++){
    var test = line ? line + ' ' + words[i] : words[i];
    if(ctx.measureText(test).width > maxWidth && line){
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = words[i];
      lines++;
      if(maxLines && lines >= maxLines) return;
    }else{
      line = test;
    }
  }
  if(line) ctx.fillText(line, x, y);
}

function reporteCanvas(){
  calcularTotales();
  var canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1320;
  var ctx = canvas.getContext('2d');
  var fecha = document.getElementById('fecha') ? document.getElementById('fecha').value : hoy();
  var encargado = document.getElementById('encargado') ? document.getElementById('encargado').value : '';
  var banco = document.getElementById('banco') ? document.getElementById('banco').value : '';
  var gastos = n(document.getElementById('gastos') && document.getElementById('gastos').value);
  var observaciones = document.getElementById('observaciones') ? document.getElementById('observaciones').value : '';
  var x = 42;
  var y = 36;
  var contentW = 916;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#17456b';
  ctx.fillRect(x, y, contentW, 86);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Arial';
  ctx.fillText('EXCOMERCAFE SA DE CV', x + 18, y + 30);
  ctx.font = 'bold 31px Arial';
  ctx.fillText('Control de venta en agro-mercado', x + 18, y + 65);
  ctx.font = 'bold 25px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(fechaVista(fecha), x + contentW - 24, y + 55);
  ctx.textAlign = 'left';

  y += 112;
  function box(label, value, bx, by, bw, bh){
    ctx.strokeStyle = '#777';
    ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = '#444';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(label, bx + 8, by + 18);
    ctx.fillStyle = '#111';
    ctx.font = '15px Arial';
    wrapText(ctx, String(value || ''), bx + 8, by + 40, bw - 16, 18, 2);
  }
  box('AGROMERCADO', accesoActual ? accesoActual.nombre : '', x, y, 430, 60);
  box('ENCARGADO', encargado, x + 438, y, 250, 60);
  box('BANCO', banco || 'Pendiente', x + 696, y, 220, 60);

  y += 82;
  var cols = [230, 105, 115, 85, 90, 90, 105, 96];
  var headers = ['Producto','Inv. ant.','Merc. nueva','Venta','Faltante','Danado','Inv. final','Total'];
  var rowH = 42;
  var cx = x;
  ctx.fillStyle = '#e8eef5';
  ctx.fillRect(x, y, contentW, rowH);
  ctx.strokeStyle = '#777';
  ctx.font = 'bold 13px Arial';
  headers.forEach(function(h, i){
    ctx.strokeRect(cx, y, cols[i], rowH);
    ctx.fillStyle = '#111';
    ctx.textAlign = i === 0 ? 'left' : 'center';
    ctx.fillText(h, i === 0 ? cx + 8 : cx + cols[i] / 2, y + 26);
    cx += cols[i];
  });
  ctx.textAlign = 'left';
  y += rowH;
  PRODUCTOS.forEach(function(prod){
    var row = document.querySelector('tr[data-prod="' + prod.key + '"]');
    var values = [prod.nombre, rowValue(row, 'anterior'), rowValue(row, 'nuevo'), rowValue(row, 'venta'), rowValue(row, 'faltante'), rowValue(row, 'danado'), rowValue(row, 'final'), row ? row.querySelector('.dinero').textContent : '$0.00'];
    cx = x;
    ctx.font = '13px Arial';
    values.forEach(function(v, i){
      ctx.strokeRect(cx, y, cols[i], rowH);
      ctx.fillStyle = '#111';
      ctx.textAlign = i === 0 ? 'left' : 'center';
      ctx.fillText(String(v), i === 0 ? cx + 8 : cx + cols[i] / 2, y + 26);
      cx += cols[i];
    });
    ctx.textAlign = 'left';
    y += rowH;
  });

  var totalW = contentW / 3;
  ['Ventas','Gastos','Remesa'].forEach(function(label, i){
    var id = i === 0 ? 'total-ventas' : (i === 1 ? 'total-gastos' : 'total-remesa');
    var value = document.getElementById(id).textContent;
    var bx = x + i * totalW;
    ctx.strokeRect(bx, y, totalW, 66);
    ctx.fillStyle = '#444';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(label.toUpperCase(), bx + 10, y + 22);
    ctx.fillStyle = '#111';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(value, bx + 10, y + 50);
  });
  y += 88;
  box('OBSERVACIONES', observaciones || 'Sin observaciones', x, y, contentW, 105);
  return canvas;
}

async function enviarReporteWhatsApp(){
  var canvas = reporteCanvas();
  var blob = await new Promise(function(resolve){ canvas.toBlob(resolve, 'image/png', 0.95); });
  var file = new File([blob], 'reporte-agromercado.png', { type:'image/png' });
  if(navigator.canShare && navigator.canShare({ files:[file] }) && navigator.share){
    await navigator.share({ files:[file], title:'Reporte agromercado', text:'Reporte EXCOMERCAFE' });
    return;
  }
  var url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  window.open('https://wa.me/50379285503', '_blank');
  setMessage('submit-message', 'Se abrió la imagen y WhatsApp. Adjunta la imagen al chat.', 'ok');
}

function htmlEscape(value){
  return String(value == null ? '' : value)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function buildPrintHtml(){
  var fecha = document.getElementById('fecha') ? document.getElementById('fecha').value : hoy();
  var encargado = document.getElementById('encargado') ? document.getElementById('encargado').value : '';
  var banco = document.getElementById('banco') ? document.getElementById('banco').value : '';
  var gastos = n(document.getElementById('gastos') && document.getElementById('gastos').value);
  var observaciones = document.getElementById('observaciones') ? document.getElementById('observaciones').value : '';
  var rows = PRODUCTOS.map(function(prod){
    var row = document.querySelector('tr[data-prod="' + prod.key + '"]');
    return '<tr>'
      + '<td>' + htmlEscape(prod.nombre) + '</td>'
      + '<td>' + rowValue(row, 'anterior') + '</td>'
      + '<td>' + rowValue(row, 'nuevo') + '</td>'
      + '<td>' + rowValue(row, 'venta') + '</td>'
      + '<td>' + rowValue(row, 'faltante') + '</td>'
      + '<td>' + rowValue(row, 'danado') + '</td>'
      + '<td>' + rowValue(row, 'final') + '</td>'
      + '<td>' + htmlEscape(row ? row.querySelector('.dinero').textContent : '$0.00') + '</td>'
      + '</tr>';
  }).join('');

  return '<!doctype html><html><head><meta charset="utf-8"><title>Hoja digital del vendedor</title>'
    + '<style>'
    + '@page{size:letter;margin:0.32in;}'
    + '*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#111;margin:0;font-size:10px;}'
    + '.head{display:flex;justify-content:space-between;align-items:flex-start;background:#17456b;color:#fff;padding:10px 12px;margin-bottom:8px;}'
    + '.head span{display:block;font-size:14px;font-weight:800;letter-spacing:.08em}.head h1{margin:2px 0 0;font-size:20px;line-height:1.05}.date{font-size:18px;font-weight:800;}'
    + '.meta{display:grid;grid-template-columns:1.8fr 1fr .9fr;gap:6px;margin-bottom:8px}.box{border:1px solid #999;padding:5px;min-height:28px}.box b{display:block;font-size:8px;text-transform:uppercase;color:#444;margin-bottom:2px;}'
    + 'table{width:100%;border-collapse:collapse;font-size:9px;}th{background:#e8eef5;}th,td{border:1px solid #777;padding:4px;text-align:center;}td:first-child{text-align:left;font-weight:700;}'
    + '.totals{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #777;border-top:0;margin-bottom:8px}.totals div{padding:6px;border-right:1px solid #777}.totals div:last-child{border-right:0}.totals b{display:block;font-size:8px;color:#444}.totals strong{font-size:16px;}'
    + '.obs{border:1px solid #999;min-height:44px;padding:5px;white-space:pre-wrap}.actions{margin-top:8px;text-align:center}@media print{.actions{display:none}}'
    + '</style></head><body>'
    + '<div class="head"><div><span>EXCOMERCAFE SA DE CV</span><h1>Control de venta en agro-mercado</h1></div><div class="date">' + htmlEscape(fechaVista(fecha)) + '</div></div>'
    + '<div class="meta">'
    + '<div class="box"><b>Agromercado</b>' + htmlEscape(accesoActual ? accesoActual.nombre : '') + '</div>'
    + '<div class="box"><b>Encargado</b>' + htmlEscape(encargado) + '</div>'
    + '<div class="box"><b>Banco</b>' + htmlEscape(banco || 'Pendiente') + '</div>'
    + '</div>'
    + '<table><thead><tr><th>Producto</th><th>Inv. ant.</th><th>Merc. nueva</th><th>Venta</th><th>Faltante</th><th>Danado</th><th>Inv. final</th><th>Total dinero</th></tr></thead><tbody>' + rows + '</tbody></table>'
    + '<div class="totals"><div><b>Ventas</b><strong>' + htmlEscape(document.getElementById('total-ventas').textContent) + '</strong></div><div><b>Gastos</b><strong>' + htmlEscape(document.getElementById('total-gastos').textContent) + '</strong></div><div><b>Remesa</b><strong>' + htmlEscape(document.getElementById('total-remesa').textContent) + '</strong></div></div>'
    + '<div class="box"><b>Observaciones</b><div class="obs">' + htmlEscape(observaciones) + '</div></div>'
    + '<div class="actions"><button onclick="window.print()">Imprimir</button></div>'
    + '<script>window.onload=function(){setTimeout(function(){window.print();},150)};<\/script>'
    + '</body></html>';
}

async function revisarBloqueoPendiente(agromercado, fecha){
  fecha = fecha || fechaSeleccionada();
  var local = leerPendienteLocal(agromercado, fecha);
  try{
    var existente = await buscarReportePorFecha(agromercado, fecha);
    if(existente){
      guardarPendienteLocal(agromercado, fecha);
      setHojaBloqueada(true, existente);
      return;
    }else{
      if(local) limpiarPendienteLocal();
      setHojaBloqueada(false);
      return;
    }
  }catch(e){}

  if(local) setHojaBloqueada(true, local);
  else setHojaBloqueada(false);
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

async function buscarReportePorFecha(agromercado, fecha){
  fecha = String(fecha || fechaSeleccionada()).slice(0,10);
  var queryAgro = encodeURIComponent(agromercado);
  var queryFecha = encodeURIComponent(fecha);
  var pending = await fetchSupabase('/rest/v1/ventas_agromercado_pendientes?select=fecha,agromercado,estado,creado_en&agromercado=eq.' + queryAgro + '&fecha=eq.' + queryFecha + '&estado=eq.pendiente&limit=1');
  if(pending && pending.length) return Object.assign({ tipo:'pendiente' }, pending[0]);
  var approved = await fetchSupabase('/rest/v1/ventas_agromercado?select=fecha,agromercado,creado_en&agromercado=eq.' + queryAgro + '&fecha=eq.' + queryFecha + '&limit=1');
  if(approved && approved.length) return Object.assign({ tipo:'aprobado' }, approved[0]);
  return null;
}

function payloadHistorial(row){
  if(!row) return {};
  if(row.payload && typeof row.payload === 'object') return row.payload;
  if(row.payload && typeof row.payload === 'string'){
    try{ return JSON.parse(row.payload); }catch(e){ return {}; }
  }
  return {};
}

function historialMapValue(map, key){
  if(!map) return 0;
  var aliases = {
    arroz:['arroz','ab1'],
    precocido:['precocido','ap1'],
    frijol1:['frijol1','fr1'],
    frijol4:['frijol4','fr4'],
    aceite:['aceite','ac'],
    harina:['harina','ha']
  };
  var keys = aliases[key] || [key];
  for(var i = 0; i < keys.length; i++){
    if(map[keys[i]] != null) return n(map[keys[i]]);
  }
  return 0;
}

function historialProductosHtml(payload, row){
  var unidades = payload.ventas_unidades || {};
  var inicio = payload.inventario_inicio || {};
  var nuevo = payload.mercaderia_nueva || {};
  var final = payload.inventario_final || {};
  var faltante = payload.faltante || payload.apartado || {};
  var danado = payload.danado || {};
  var dinero = payload.dinero_productos || {};
  return '<div class="history-table-wrap"><table class="history-table"><thead><tr>'
    + '<th>Producto</th><th>Anterior</th><th>Nueva</th><th>Venta</th><th>Faltante</th><th>Danado</th><th>Final</th><th>Dinero</th>'
    + '</tr></thead><tbody>'
    + PRODUCTOS.map(function(prod){
      var vendido = historialMapValue(unidades, prod.key);
      var dineroProducto = dinero && dinero[prod.key] != null ? n(dinero[prod.key]) : vendido * prod.precio;
      return '<tr>'
        + '<td>' + htmlEscape(prod.nombre) + '</td>'
        + '<td>' + historialMapValue(inicio, prod.key) + '</td>'
        + '<td>' + historialMapValue(nuevo, prod.key) + '</td>'
        + '<td>' + vendido + '</td>'
        + '<td>' + historialMapValue(faltante, prod.key) + '</td>'
        + '<td>' + historialMapValue(danado, prod.key) + '</td>'
        + '<td>' + historialMapValue(final, prod.key) + '</td>'
        + '<td>' + money(dineroProducto) + '</td>'
        + '</tr>';
    }).join('')
    + '</tbody></table></div>';
}

function renderHistorialVentas(rows){
  var cont = document.getElementById('historial-ventas');
  var status = document.getElementById('historial-status');
  if(status) status.textContent = (rows || []).length ? (rows.length + ' reporte(s)') : 'Sin reportes';
  if(!cont) return;
  if(!rows || !rows.length){
    cont.innerHTML = '<div class="history-empty">No hay ventas registradas todavia para este agromercado.</div>';
    return;
  }
  cont.innerHTML = rows.map(function(row){
    var payload = payloadHistorial(row);
    var estado = String(row.estado || 'aprobado').toLowerCase();
    var banco = payload.banco || row.banco || 'Pendiente';
    var ventas = row.ventas != null ? row.ventas : payload.ventas;
    var gastos = row.gastos != null ? row.gastos : payload.gastos;
    var remesa = row.remesa != null ? row.remesa : payload.remesa;
    var obs = payload.observaciones || row.observaciones || '';
    return '<article class="history-item">'
      + '<div class="history-head"><div><strong>' + htmlEscape(fechaVista(row.fecha || payload.fecha || '')) + '</strong>'
      + '<small>Encargado: ' + htmlEscape(row.encargado || payload.encargado || 'Sin nombre') + '</small></div>'
      + '<span class="history-status ' + htmlEscape(estado) + '">' + htmlEscape(estado) + '</span></div>'
      + '<div class="history-metrics">'
      + '<div><span>Ventas</span><b>' + money(ventas) + '</b></div>'
      + '<div><span>Gastos</span><b>' + money(gastos) + '</b></div>'
      + '<div><span>Remesa</span><b>' + money(remesa) + '</b></div>'
      + '<div><span>Banco</span><b>' + htmlEscape(banco) + '</b></div>'
      + '</div>'
      + historialProductosHtml(payload, row)
      + '<div class="history-obs"><b>Observaciones:</b> ' + htmlEscape(obs || 'Sin observaciones') + '</div>'
      + '</article>';
  }).join('');
}

async function cargarHistorialVentas(agromercado){
  var status = document.getElementById('historial-status');
  if(status) status.textContent = 'Cargando...';
  try{
    var official = await fetchSupabase('/rest/v1/ventas_agromercado?select=fecha,agromercado,ventas,gastos,remesa,banco,observaciones,payload,creado_en&agromercado=eq.' + encodeURIComponent(agromercado) + '&order=fecha.desc,creado_en.desc&limit=50');
    var pending = await fetchSupabase('/rest/v1/ventas_agromercado_pendientes?select=fecha,agromercado,encargado,estado,ventas,gastos,remesa,payload,creado_en&agromercado=eq.' + encodeURIComponent(agromercado) + '&order=creado_en.desc&limit=50');
    var rows = [];
    (official || []).forEach(function(row){
      rows.push(Object.assign({ estado:'aprobado', historial_tipo:'oficial' }, row));
    });
    (pending || []).forEach(function(row){
      rows.push(Object.assign({ historial_tipo:'revision' }, row));
    });
    rows.sort(function(a, b){
      return String(b.fecha || '').localeCompare(String(a.fecha || '')) || String(b.creado_en || '').localeCompare(String(a.creado_en || ''));
    });
    renderHistorialVentas(rows.slice(0, 50));
  }catch(error){
    if(status) status.textContent = 'Error';
    var cont = document.getElementById('historial-ventas');
    if(cont) cont.innerHTML = '<div class="history-empty">No se pudo cargar el historial.</div>';
  }
}

async function refrescarPortalManual(){
  if(!accesoActual) return;
  var btn = (typeof event !== 'undefined' && event && event.currentTarget) ? event.currentTarget : null;
  if(btn) btn.disabled = true;
  setMessage('submit-message', 'Actualizando inventario e historial...', '');
  try{
    await refrescarHojaVendedor(false);
    setMessage('submit-message', 'Actualizado', 'ok');
    setTimeout(function(){
      var msg = document.getElementById('submit-message');
      if(msg && msg.textContent === 'Actualizado') setMessage('submit-message', '', '');
    }, 2200);
  }catch(error){
    setMessage('submit-message', 'No se pudo actualizar: ' + (error.message || error), 'error');
  }finally{
    if(btn) btn.disabled = false;
  }
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
  var fecha = fechaSeleccionada();
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

async function refrescarHojaVendedor(silent){
  if(!accesoActual || refreshRunning) return;
  refreshRunning = true;
  try{
    var fechaHoy = fechaSeleccionada();
    var fechaInput = document.getElementById('fecha');
    var fechaVisible = document.getElementById('fecha-visible');
    if(fechaInput && !fechaInput.value) fechaInput.value = fechaHoy;
    if(fechaVisible) fechaVisible.textContent = fechaVista(fechaHoy);

    if(!silent) setMessage('access-message', '', '');
    await aplicarEncargadoAgromercado(accesoActual.nombre);
    await cargarValoresInicialesAgromercado(accesoActual.nombre);
    calcularTotales();
    await cargarHistorialVentas(accesoActual.nombre);
    await revisarBloqueoPendiente(accesoActual.nombre, fechaHoy);
  }catch(error){
    if(!silent) setMessage('submit-message', 'No se pudo refrescar automaticamente. Reintentando...', 'error');
  }finally{
    refreshRunning = false;
  }
}

function iniciarAutoRefresh(){
  detenerAutoRefresh();
  refreshTimer = setInterval(function(){
    refrescarHojaVendedor(true);
  }, REFRESH_MS);
}

function detenerAutoRefresh(){
  if(refreshTimer){
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
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
  if(hojaBloqueada){
    setMessage('submit-message', 'Ya existe un reporte para esta fecha de este agromercado.', 'error');
    return;
  }
  setMessage('submit-message', 'Enviando...', '');
  calcularTotales();
  if(!validarInventarioDisponible()) return;
  var fechaReporte = document.getElementById('fecha').value;
  try{
    var existente = await buscarReportePorFecha(accesoActual.nombre, fechaReporte);
    if(existente){
      setHojaBloqueada(true, existente);
      setMessage('submit-message', 'Ya existe un reporte para el ' + fechaVista(fechaReporte) + '. Selecciona otra fecha si necesitas enviar otro dia.', 'error');
      return;
    }
  }catch(errorValidacion){
    setMessage('submit-message', 'No se pudo verificar si ya existe reporte para esta fecha. Intenta actualizar.', 'error');
    return;
  }
  var productos = leerProductos();
  var ventas = PRODUCTOS.reduce(function(acc, prod){
    return acc + n(productos.dinero_productos[prod.key]);
  }, 0);
  var gastos = n(document.getElementById('gastos').value);
  var payload = Object.assign({
    id: localId(),
    fecha: fechaReporte,
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
    guardarPendienteLocal(accesoActual.nombre, payload.fecha);
    setHojaBloqueada(true, { fecha: payload.fecha });
    calcularTotales();
    await cargarHistorialVentas(accesoActual.nombre);
    await refrescarHojaVendedor(true);
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
  if(fecha){
    fecha.addEventListener('change', function(){
      if(document.getElementById('fecha-visible')) document.getElementById('fecha-visible').textContent = fechaVista(fecha.value || hoy());
      refrescarHojaVendedor(false);
    });
  }
  restaurarAccesoGuardado();
});
