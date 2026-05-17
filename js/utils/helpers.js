// ══ FUNCIONES UTILITARIAS AUXILIARES ══

// ── FUNCIONES DE FECHA ──
window.fechaHoy = function(){
  var d = new Date();
  return d.toISOString().split('T')[0];
}

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
    if(c === '"' && (i === 0 || line[i-1] !== ',')){
      inQ = !inQ;
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
