// ══ FUNCIONES UTILITARIAS AUXILIARES ══

// ── FUNCIONES DE FECHA ──
window.fechaHoySV = function(){
  try {
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/El_Salvador',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function(part){ map[part.type] = part.value; });
    if (map.year && map.month && map.day) return map.year + '-' + map.month + '-' + map.day;
  } catch(error) {}
  var d = new Date();
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
};

window.fechaHoy = window.fechaHoySV;

window.obtenerFechaHoyISO = window.fechaHoySV;

window.obtenerFechaHoyTexto = function(){
  try {
    return new Intl.DateTimeFormat('es-SV', {
      timeZone: 'America/El_Salvador',
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(new Date());
  } catch(error) {
    return new Date().toLocaleDateString('es-SV', {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  }
};

window.formatearFecha = function(fecha){
  var value = fecha === undefined ? new Date() : fecha;
  var d;
  if (value instanceof Date) {
    d = value;
  } else if (typeof value === 'string') {
    var clean = value.trim();
    if (!clean) d = new Date();
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) return clean;
    else if (/^\d{4}-\d{2}-\d{2}/.test(clean)) {
      var parts = clean.slice(0, 10).split('-').map(Number);
      d = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      d = new Date(clean);
    }
  } else {
    d = new Date(value);
  }
  if (isNaN(d.getTime())) d = new Date();
  var day = String(d.getDate()).padStart(2, '0');
  var month = String(d.getMonth() + 1).padStart(2, '0');
  var year = d.getFullYear();
  return day + '/' + month + '/' + year;
};

window.formatearHora = function(fecha){
  var value = fecha === undefined ? new Date() : fecha;
  var d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) d = new Date();
  return d.toLocaleTimeString('es-SV', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toUpperCase();
};

window.formatearFechaHora = function(fecha, hora){
  return window.formatearFecha(fecha) + (hora ? ' | ' + hora : '');
};

window.formatearFechaVisual = window.formatearFecha;

window.obtenerHoraActual = function(){
  return window.formatearHora(new Date());
};

// ============================================================================
// Helpers globales del sistema (compatibilidad index.html)
// Se definen aqui porque este archivo se carga antes de los scripts inline.
// ============================================================================
if (!window.fechaVistaSistema) {
  window.fechaVistaSistema = function(valor){
    if(!valor) return '';

    if(valor instanceof Date){
      var d = String(valor.getDate()).padStart(2,'0');
      var m = String(valor.getMonth()+1).padStart(2,'0');
      var y = valor.getFullYear();
      return d + '/' + m + '/' + y;
    }

    if(typeof window.formatearFecha === 'function'){
      return window.formatearFecha(valor);
    }

    if(typeof valor === 'string' && valor.includes('-')){
      var p = valor.split('T')[0].split('-');
      if(p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
    }

    return String(valor);
  };
}

if (!window.fechaISOActualSistema) {
  window.fechaISOActualSistema = function(){
    if(typeof window.obtenerFechaHoyISO === 'function') return window.obtenerFechaHoyISO();
    if(typeof window.fechaHoy === 'function') return window.fechaHoy();

    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  };
}

if (!window.horaVistaSistema) {
  window.horaVistaSistema = function(registro){
    if(!registro) return '';
    if(registro.hora) return registro.hora;

    var base = registro.timestamp || registro.ts || registro.creado_en || registro.created_at;
    if(base && typeof window.formatearHora === 'function') return window.formatearHora(base);

    var d = base ? new Date(base) : new Date();
    return d.toLocaleTimeString('es-SV', {
      hour:'2-digit',
      minute:'2-digit',
      hour12:true
    });
  };
}

if (!window.fechaHoraActualVistaSistema) {
  window.fechaHoraActualVistaSistema = function(){
    var ahora = new Date();
    return window.fechaVistaSistema(ahora) + ' ' + window.horaVistaSistema({timestamp: ahora.toISOString()});
  };
}

// Aliases por compatibilidad (llamadas sueltas sin window.)
// eslint-disable-next-line no-var
var fechaVistaSistema = window.fechaVistaSistema;
// eslint-disable-next-line no-var
var fechaISOActualSistema = window.fechaISOActualSistema;
// eslint-disable-next-line no-var
var horaVistaSistema = window.horaVistaSistema;
// eslint-disable-next-line no-var
var fechaHoraActualVistaSistema = window.fechaHoraActualVistaSistema;

// ── FUNCIONES DE MANIPULACIÓN DE VALORES ──
window.n = function(id){ 
  var v = parseFloat((document.getElementById(id)||{}).value); 
  return isNaN(v) ? 0 : v; 
}

window.setVal = function(id, val){ 
  var el = document.getElementById(id); 
  if(el) el.value = val; 
}

window.setMoney = function(id, val){ 
  var el = document.getElementById(id); 
  if(el) el.value = '$' + val.toFixed(2); 
}

window.formatMoney = function(valor){
  valor = parseFloat(valor || 0);
  return '$' + valor.toFixed(2);
};

// ── FUNCIONES DE TEXTO ──
window.removeNumbers = function(text){
  if(typeof text !== 'string') return text;
  // Remove all digits and decimal points, keep letters and special characters
  return text.replace(/[0-9.,]/g, '').trim();
}

// ── FUNCIONES CSV ──
window.parseCsvLine = function(line){
  var result = [], cur = '', inQ = false;
  for(var i = 0; i < line.length; i++){
    var c = line[i];
    if(c === '"'){
      if(inQ && line[i + 1] === '"'){
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
    }
    else if(c === ',' && !inQ){
      result.push(cur.trim());
      cur = '';
    }
    else{
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

window.csvColsToRegistro = function(header, cols){
  function get(names){
    for(var i = 0; i < names.length; i++){
      var idx = header.findIndex(function(h){ 
        return h.toLowerCase().indexOf(names[i].toLowerCase()) >= 0; 
      });
      if(idx >= 0 && cols[idx] !== undefined) 
        return String(cols[idx]).replace(/^"|"$/g, '').trim();
    }
    return '';
  }
  
  return {
    fecha: get(['fecha', 'date']),
    distrito: get(['distrito', 'district']),
    municipio: get(['municipio', 'municipality']),
    agromercado: get(['agromercado', 'agromarket', 'mercado', 'market']),
    banco: get(['banco', 'bank']),
    arroz: parseFloat(get(['arroz', 'rice'])) || 0,
    frijol: parseFloat(get(['frijol', 'beans'])) || 0,
    maiz: parseFloat(get(['maiz', 'corn'])) || 0,
    harina: parseFloat(get(['harina', 'flour'])) || 0,
    aceite: parseFloat(get(['aceite', 'oil'])) || 0,
    azucar: parseFloat(get(['azucar', 'sugar'])) || 0,
    jabon: parseFloat(get(['jabon', 'soap'])) || 0,
    cafe: parseFloat(get(['cafe', 'coffee'])) || 0,
    otros: parseFloat(get(['otros', 'other'])) || 0
  };
}

// ── FUNCIONES DE UI ──
window.showToast = function(msg){
  var t = document.getElementById('save-toast'); 
  t.textContent = msg; 
  t.classList.add('show');
  setTimeout(function(){ 
    t.classList.remove('show'); 
  }, 2400);
}

window.showAlert = function(id, msg, type){
  var el = document.getElementById(id); 
  if(!el) return;
  el.textContent = msg; 
  el.className = 'alert alert-' + (type === 'ok' ? 'ok' : 'err') + ' show';
  setTimeout(function(){ 
    el.classList.remove('show'); 
  }, 3500);
}
