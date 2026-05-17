// ══ SISTEMA DE ALMACENAMIENTO ══

// ── SISTEMA CENTRALIZADO DE GESTIÓN DE BANCOS ──
window.bancosSistema = {
  // Lista inicial de bancos con números de cuenta
  bancosIniciales: BANCOS_INICIALES,
  
  // Obtener todos los bancos (solo nombres para selectores)
  obtenerBancos: function() {
    var bancosGuardados = localStorage.getItem('bancos_sistema');
    if (bancosGuardados) {
      var bancos = JSON.parse(bancosGuardados);
      return bancos.map(function(b) { return b.nombre; });
    }
    return this.bancosIniciales.map(function(b) { return b.nombre; });
  },
  
  // Obtener todos los bancos con datos completos
  obtenerBancosConDatos: function() {
    var bancosGuardados = localStorage.getItem('bancos_sistema');
    if (bancosGuardados) {
      return JSON.parse(bancosGuardados);
    }
    return this.bancosIniciales.slice();
  },
  
  // Obtener número de cuenta por nombre de banco
  obtenerCuenta: function(nombreBanco) {
    var bancos = this.obtenerBancosConDatos();
    var banco = bancos.find(function(b) { return b.nombre === nombreBanco; });
    return banco ? banco.cuenta : '';
  },
  
  // Guardar bancos en localStorage
  guardarBancos: function(bancos) {
    localStorage.setItem('bancos_sistema', JSON.stringify(bancos));
  },
  
  // Inicializar sistema (cargar bancos guardados o usar iniciales)
  inicializar: function() {
    var bancosGuardados = localStorage.getItem('bancos_sistema');
    if (!bancosGuardados) {
      // Primera vez que se carga, establecer bancos iniciales
      this.guardarBancos(this.bancosIniciales.slice());
    }
  },
  
  // Agregar nuevo banco
  agregarBanco: function(nombre, cuenta) {
    try {
      var bancos = this.obtenerBancosConDatos();
      
      // Verificar que no exista
      if (bancos.find(function(b) { return b.nombre === nombre; })) {
        return { success: false, mensaje: 'El banco ya existe' };
      }
      
      bancos.push({ nombre: nombre, cuenta: cuenta });
      this.guardarBancos(bancos);
      this.actualizarTodosLosSelectores();
      
      return { success: true, mensaje: 'Banco agregado correctamente' };
    } catch (e) {
      return { success: false, mensaje: 'Error al agregar banco: ' + e.message };
    }
  },
  
  // Editar banco existente
  editarBanco: function(indice, nuevoNombre, nuevaCuenta) {
    try {
      var bancos = this.obtenerBancosConDatos();
      
      if (indice < 0 || indice >= bancos.length) {
        return { success: false, mensaje: 'Índice de banco inválido' };
      }
      
      var bancoAnterior = bancos[indice];
      
      // Verificar que el nuevo nombre no exista (excepto si es el mismo banco)
      if (bancos.find(function(b, i) { return b.nombre === nuevoNombre && i !== indice; })) {
        return { success: false, mensaje: 'Ya existe otro banco con ese nombre' };
      }
      
      var nombreAnterior = bancoAnterior.nombre;
      bancos[indice] = { nombre: nuevoNombre, cuenta: nuevaCuenta };
      
      this.guardarBancos(bancos);
      this.actualizarTodosLosSelectores();
      this.actualizarRegistrosConBancoCambiado(nombreAnterior, nuevoNombre);
      
      return { success: true, mensaje: 'Banco actualizado correctamente' };
    } catch (e) {
      return { success: false, mensaje: 'Error al actualizar banco: ' + e.message };
    }
  },
  
  // Eliminar banco
  eliminarBanco: function(indice) {
    try {
      var bancos = this.obtenerBancosConDatos();
      
      if (indice < 0 || indice >= bancos.length) {
        return { success: false, mensaje: 'Índice de banco inválido' };
      }
      
      var bancoEliminado = bancos[indice];
      bancos.splice(indice, 1);
      this.guardarBancos(bancos);
      this.actualizarTodosLosSelectores();
      this.limpiarRegistrosConBancoEliminado(bancoEliminado.nombre);
      
      return { success: true, mensaje: 'Banco eliminado correctamente' };
    } catch (e) {
      return { success: false, mensaje: 'Error al eliminar banco: ' + e.message };
    }
  },
  
  // Actualizar todos los selectores de bancos en la página
  actualizarTodosLosSelectores: function() {
    var selectores = document.querySelectorAll('select[id*="banco"]');
    var bancos = this.obtenerBancosConDatos();
    
    selectores.forEach(function(selector) {
      var valorActual = selector.value;
      selector.innerHTML = '<option value="">-- Seleccionar Banco --</option>';
      
      bancos.forEach(function(banco) {
        var nombre = typeof banco === 'string' ? banco : banco.nombre;
        var cuenta = typeof banco === 'string' ? '' : (banco.cuenta || '');
        var option = document.createElement('option');
        option.value = nombre;
        option.textContent = cuenta ? (nombre + ' - ' + cuenta) : (nombre + ' - Sin cuenta');
        option.title = option.textContent;
        if (nombre === valorActual) {
          option.selected = true;
        }
        selector.appendChild(option);
      });
    });
  },
  
  // Actualizar registros cuando cambia el nombre de un banco
  actualizarRegistrosConBancoCambiado: function(nombreAnterior, nuevoNombre) {
    try {
      // Actualizar registros de agromercado
      var agroHist = JSON.parse(localStorage.getItem('exc_agro_hist') || '[]');
      agroHist.forEach(function(registro) {
        if (registro.banco === nombreAnterior) {
          registro.banco = nuevoNombre;
        }
      });
      localStorage.setItem('exc_agro_hist', JSON.stringify(agroHist));
      
      // Actualizar registros de bancos
      var bancosHist = JSON.parse(localStorage.getItem('exc_bancos_hist') || '[]');
      bancosHist.forEach(function(registro) {
        if (registro.banco === nombreAnterior) {
          registro.banco = nuevoNombre;
        }
      });
      localStorage.setItem('exc_bancos_hist', JSON.stringify(bancosHist));
      
      // Actualizar otros registros que puedan contener bancos
      // (aquí se pueden agregar más tipos de registros según sea necesario)
      
    } catch (e) {
      console.error('Error actualizando registros con banco cambiado:', e);
    }
  },
  
  // Limpiar registros cuando se elimina un banco
  limpiarRegistrosConBancoEliminado: function(nombreEliminado) {
    try {
      // Actualizar registros de agromercado (dejar en blanco el campo banco)
      var agroHist = JSON.parse(localStorage.getItem('exc_agro_hist') || '[]');
      agroHist.forEach(function(registro) {
        if (registro.banco === nombreEliminado) {
          registro.banco = '';
        }
      });
      localStorage.setItem('exc_agro_hist', JSON.stringify(agroHist));
      
      // Actualizar registros de bancos
      var bancosHist = JSON.parse(localStorage.getItem('exc_bancos_hist') || '[]');
      bancosHist.forEach(function(registro) {
        if (registro.banco === nombreEliminado) {
          registro.banco = '';
        }
      });
      localStorage.setItem('exc_bancos_hist', JSON.stringify(bancosHist));
      
    } catch (e) {
      console.error('Error limpiando registros con banco eliminado:', e);
    }
  }
};

// ── FUNCIONES DE ALMACENAMIENTO DE HISTORIAL ──

// Guardar registro en historial
window.guardarRegistro = function(){
  const banco = document.getElementById('campo-banco')?.value?.trim() || '';
  const ventas = parseFloat(
    (document.getElementById('campo-total-esperado')?.value || '0')
      .replace('$','')
  ) || 0;
  const gastos = parseFloat(
    document.getElementById('campo-gastos')?.value || 0
  ) || 0;
  const remesa = parseFloat(
    document.getElementById('campo-dinero-remesado')?.value || 0
  ) || 0;
  const dineroRemesado = parseFloat(
    document.getElementById('campo-dinero-remesado')?.value || 0
  ) || 0;

  var registro = {
    nombre: (document.getElementById('agro-nombre')||{}).value||'',
    fecha: document.getElementById('agro-fecha').value,
    dia: document.getElementById('agro-dia').value,
    distrito: (document.getElementById('agro-distrito')||{}).value||'',
    municipio: (document.getElementById('agro-municipio')||{}).value||'',
    banco: banco,
    ventas: ventas,
    gastos: gastos,
    remesa: remesa,
    dineroRemesado: dineroRemesado,
    ventas_unidades: {}
  };
  
  PRODUCTOS.forEach(function(p){ registro.ventas_unidades[p] = n(p+'-ven'); });

  var hist = JSON.parse(localStorage.getItem('exc_agro_hist')||'[]');
  hist.unshift(registro);
  localStorage.setItem('exc_agro_hist', JSON.stringify(hist));
  console.log('GUARDADO OK', JSON.parse(localStorage.getItem('exc_agro_hist') || '[]')[0]);
  console.log('VOY A RENDER HISTORIAL');

  requestAnimationFrame(function(){
    renderHistorial?.();
    renderBancos?.();
    actualizarResumenRemesasDia?.();
  });

  renderHistorial?.();
  renderBancos?.();
  actualizarResumenRemesasDia?.();
  calcularTotalesGenerales?.();

  const cont = document.getElementById('historial-registros-content');
  if (cont) cont.style.display = 'block';

  const btn = document.getElementById('btn-toggle-historial-registros');
  if (btn) btn.textContent = '▲';

  showAlert('alert-agro', '✅ Registro guardado correctamente.', 'ok');
};

// Renderizar historial
window.renderHistorial = function(){
  console.log('RENDER HISTORIAL EJECUTADO');
  console.log('tbody existe?', !!document.getElementById('tbody-historial'));
  var hist = JSON.parse(localStorage.getItem('exc_agro_hist')||'[]');
  var tbody = document.getElementById('tbody-historial');
  if(!hist.length){
    tbody.innerHTML='<tr><td colspan="16" style="text-align:center;color:var(--muted);padding:20px;font-style:italic;">Sin registros guardados aún.</td></tr>';
    console.log('HTML NUEVO:', tbody.innerHTML.slice(0,200));
    return;
  }
  
  var html = '';
  hist.forEach(function(registro, i){
    html += '<tr>'+
      '<td>'+registro.fecha+'</td>'+
      '<td>'+registro.dia+'</td>'+
      '<td>'+registro.distrito+'</td>'+
      '<td>'+registro.municipio+'</td>'+
      '<td>'+registro.nombre+'</td>'+
      '<td>'+(registro.ventas_unidades&&registro.ventas_unidades.ab1||0)+'</td>'+
      '<td>'+(registro.ventas_unidades&&registro.ventas_unidades.ap1||0)+'</td>'+
      '<td>'+(registro.ventas_unidades&&registro.ventas_unidades.fr1||0)+'</td>'+
      '<td>'+(registro.ventas_unidades&&registro.ventas_unidades.fr4||0)+'</td>'+
      '<td>'+(registro.ventas_unidades&&registro.ventas_unidades.ac||0)+'</td>'+
      '<td>'+(registro.ventas_unidades&&registro.ventas_unidades.ha||0)+'</td>'+
      '<td>'+formatMoney(registro.ventas)+'</td>'+
      '<td>'+formatMoney(registro.gastos)+'</td>'+
      '<td>'+formatMoney(registro.remesa)+'</td>'+
      '<td>'+registro.banco+'</td>'+
      '<td>'+
        '<button class="btn btn-sm btn-primary" onclick="editarRegistro('+i+')">✏️</button> '+
        '<button class="btn btn-sm btn-danger" onclick="eliminarRegistro('+i+')">🗑️</button>'+
      '</td>'+
    '</tr>';
  });
  tbody.innerHTML = html;
  console.log('HTML NUEVO:', tbody.innerHTML.slice(0,200));
};

// Eliminar registro del historial
window.eliminarRegistro = function(index){
  if(!confirm('¿Seguro que deseas eliminar este registro?')) return;
  
  var hist = JSON.parse(localStorage.getItem('exc_agro_hist')||'[]');
  if(index < 0 || index >= hist.length) return;
  
  var registroEliminado = hist[index];
  hist.splice(index, 1);
  localStorage.setItem('exc_agro_hist', JSON.stringify(hist));
  
  // Actualizar inventario (devolver productos)
  if(registroEliminado.ventas_unidades){
    try{
      var inventario = JSON.parse(localStorage.getItem('inventario-data')||'[]');
      Object.keys(registroEliminado.ventas_unidades).forEach(function(producto){
        var item = inventario.find(function(i){ return i.producto === producto; });
        if(item){
          item.cantidad += registroEliminado.ventas_unidades[producto];
        }
      });
      localStorage.setItem('inventario-data', JSON.stringify(inventario));
    } catch(e){
      console.error('Error actualizando inventario:', e);
    }
  }
  
  renderHistorial();
  renderBancos();
  showToast('🗑️ Registro eliminado');
};

// Limpiar todo el historial
window.limpiarHistorial = function(){
  if(!confirm('¿Eliminar todo el historial? Esta acción no se puede deshacer.')) return;
  localStorage.removeItem('exc_agro_hist');
  renderHistorial();
  renderBancos();
  showToast('🗑️ Historial eliminado');
};

// Guardar edición inline
window.guardarEdicionInline = function(index){
  var hist = JSON.parse(localStorage.getItem('exc_agro_hist')||'[]');
  if(index < 0 || index >= hist.length) return;
  
  // Obtener valores editados
  var registro = hist[index];
  registro.fecha = document.getElementById('edit-fecha-' + index).value;
  registro.distrito = document.getElementById('edit-distrito-' + index).value;
  registro.municipio = document.getElementById('edit-municipio-' + index).value;
  registro.nombre = document.getElementById('edit-agromercado-' + index).value;
  registro.banco = document.getElementById('edit-banco-' + index).value;
  registro.ventas = parseFloat(document.getElementById('edit-ventas-' + index).value) || 0;
  registro.gastos = parseFloat(document.getElementById('edit-gastos-' + index).value) || 0;
  
  // Actualizar ventas_unidades
  registro.ventas_unidades = {};
  var productosKeys = PRODUCTOS_KEYS;
  productosKeys.forEach(function(key){
    var valor = parseInt(document.getElementById('edit-' + key + '-' + index).value) || 0;
    if(valor > 0) registro.ventas_unidades[key] = valor;
  });
  
  // Guardar cambios
  hist[index] = registro;
  localStorage.setItem('exc_agro_hist', JSON.stringify(hist));
  
  // Actualizar inventario
  actualizarInventarioDesdeRegistro(registro, true); // true = edición
  
  renderHistorial();
  renderBancos();
  showToast('✅ Registro actualizado');
};

// ── FUNCIONES DE ALMACENAMIENTO DE INVENTARIO ──

// Actualizar inventario desde un registro
window.actualizarInventarioDesdeRegistro = function(registro, esEdicion){
  try{
    var inventario = JSON.parse(localStorage.getItem('inventario-data')||'[]');
    
    // Si es edición, primero revertir los cambios anteriores
    if(esEdicion && registro.ventas_unidades_anterior){
      Object.keys(registro.ventas_unidades_anterior).forEach(function(producto){
        var item = inventario.find(function(i){ return i.producto === producto; });
        if(item){
          item.cantidad += registro.ventas_unidades_anterior[producto];
        }
      });
    }
    
    // Descontar las ventas actuales del inventario
    if(registro.ventas_unidades){
      Object.keys(registro.ventas_unidades).forEach(function(producto){
        var item = inventario.find(function(i){ return i.producto === producto; });
        if(item){
          item.cantidad -= registro.ventas_unidades[producto];
          if(item.cantidad < 0) item.cantidad = 0;
        }
      });
    }
    
    localStorage.setItem('inventario-data', JSON.stringify(inventario));
  } catch(e){
    console.error('Error actualizando inventario:', e);
  }
};

// ── FUNCIONES DE ALMACENAMIENTO DE FORMULARIOS ──

// Guardar datos del formulario actual
window.guardarLocal = function(){
  var data = { nombre: (document.getElementById('agro-nombre')||{}).value||'',
               fecha: document.getElementById('agro-fecha').value,
               gastos: document.getElementById('campo-gastos').value,
               distrito: (document.getElementById('agro-distrito')||{}).value||'',
               municipio: (document.getElementById('agro-municipio')||{}).value||'',
               banco: (document.getElementById('agro-banco')||{}).value||''
             };
  PRODUCTOS.forEach(function(p){
    ['ini','ven','fal','dan'].forEach(function(f){
      data[p+'_'+f] = (document.getElementById(p+'-'+f)||{}).value||0;
    });
  });
  localStorage.setItem('exc_agro_form', JSON.stringify(data));
};

// Cargar datos guardados del formulario
window.cargarLocal = function(){
  var raw = localStorage.getItem('exc_agro_form');
  if(!raw) return;
  try{
    var data = JSON.parse(raw);
    Object.keys(data).forEach(function(k){
      var el = document.getElementById(k);
      if(el) el.value = data[k];
    });
  } catch(e){ console.error('Error cargando datos locales:', e); }
};

// ── SISTEMA DE INVENTARIO CENTRALIZADO ──

window.MAPA_PRODUCTOS_INVENTARIO = {
  ab1: 'arroz',
  ap1: 'precocido',
  fr1: 'frijol1',
  fr4: 'frijol4',
  ac: 'aceite',
  ha: 'harina',

  arroz: 'arroz',
  precocido: 'precocido',
  frijol1: 'frijol1',
  frijol4: 'frijol4',
  aceite: 'aceite',
  harina: 'harina'
};

window.normalizarProductoInventario = function(producto){
  return window.MAPA_PRODUCTOS_INVENTARIO[producto] || producto;
};

// Obtener inventario actual completo
window.obtenerInventarioActual = function() {
  try {
    return JSON.parse(localStorage.getItem('inventario-data') || '[]');
  } catch (e) {
    console.error('Error al obtener inventario actual:', e);
    return [];
  }
};

// Obtener stock por ubicación específica
window.obtenerStockPorUbicacion = function(ubicacion) {
  try {
    var inventario = JSON.parse(localStorage.getItem('inventario-data') || '[]');
    var inventarioUbicacion = inventario.filter(function(item) {
      return item.ubicacion === ubicacion;
    });
    
    // Agrupar por lugar si hay múltiples registros
    var stockPorLugar = {};
    inventarioUbicacion.forEach(function(item) {
      var lugar = item.lugar || 'Sin especificar';
      if (!stockPorLugar[lugar]) {
        stockPorLugar[lugar] = {
          arroz: 0,
          precocido: 0,
          frijol1: 0,
          frijol4: 0,
          aceite: 0,
          harina: 0
        };
      }
      
      stockPorLugar[lugar].arroz += (item.arroz || 0);
      stockPorLugar[lugar].precocido += (item.precocido || 0);
      stockPorLugar[lugar].frijol1 += (item.frijol1 || 0);
      stockPorLugar[lugar].frijol4 += (item.frijol4 || 0);
      stockPorLugar[lugar].aceite += (item.aceite || 0);
      stockPorLugar[lugar].harina += (item.harina || 0);
    });
    
    return stockPorLugar;
  } catch (e) {
    console.error('Error al obtener stock por ubicación:', e);
    return {};
  }
};

// Obtener stock de un producto específico en una ubicación
window.obtenerStockProducto = function(ubicacion, producto) {
  try {
    producto = normalizarProductoInventario(producto);
    var stockPorLugar = window.obtenerStockPorUbicacion(ubicacion);
    var totalStock = 0;
    
    // Sumar stock de todos los lugares en la ubicación
    Object.keys(stockPorLugar).forEach(function(lugar) {
      totalStock += (stockPorLugar[lugar][producto] || 0);
    });
    
    return totalStock;
  } catch (e) {
    console.error('Error al obtener stock de producto:', e);
    return 0;
  }
};

// Validar si hay stock disponible
window.validarStockDisponible = function(ubicacion, producto, cantidad) {
  try {
    producto = normalizarProductoInventario(producto);
    var stockActual = window.obtenerStockProducto(ubicacion, producto);
    return stockActual >= cantidad;
  } catch (e) {
    console.error('Error al validar stock disponible:', e);
    return false;
  }
};

// Generar resumen visual de inventario por ubicación
window.actualizarResumenVisual = function() {
  try {
    var container = document.getElementById('resumen-inventario-visual');
    if (!container) return;
    
    var ubicaciones = ['bodega-local', 'agromercados', 'cda', 'otros'];
    var productos = ['arroz', 'precocido', 'frijol1', 'frijol4', 'aceite', 'harina'];
    var nombresProductos = ['Arroz', 'Arroz Precocido', 'Frijol 1 Lb', 'Frijol 4 Lb', 'Aceite 750 ML', 'Harina 820 GRS'];
    
    var html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;">';
    
    ubicaciones.forEach(function(ubicacion) {
      var stockPorLugar = window.obtenerStockPorUbicacion(ubicacion);
      var tieneStock = Object.keys(stockPorLugar).length > 0;
      
      if (!tieneStock) {
        html += '<div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:6px;padding:12px;"><div style="font-weight:600;color:#6c757d;margin-bottom:8px;">' + getNombreUbicacion(ubicacion) + '</div><div style="color:#adb5bd;font-size:0.9rem;">Sin stock registrado</div></div>';
        return;
      }
      
      html += '<div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:6px;padding:12px;">';
      html += '<div style="font-weight:600;color:#495057;margin-bottom:8px;">' + getNombreUbicacion(ubicacion) + '</div>';
      
      productos.forEach(function(producto, index) {
        var total = 0;
        Object.keys(stockPorLugar).forEach(function(lugar) {
          total += (stockPorLugar[lugar][producto] || 0);
        });
        
        if (total > 0) {
          html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #e9ecef;font-size:0.85rem;">';
          html += '<span style="color:#6c757d;">' + nombresProductos[index] + '</span>';
          html += '<span style="font-weight:500;color:#495057;">' + total + '</span>';
          html += '</div>';
        }
      });
      
      html += '</div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
    
  } catch (e) {
    console.error('Error al actualizar resumen visual:', e);
  }
};

// Obtener nombre descriptivo de ubicación
function getNombreUbicacion(ubicacion) {
  var nombres = {
    'bodega-local': '🏠 Bodega Local',
    'agromercados': '🌾 Agromercados',
    'cda': '🏢 CDA',
    'otros': '📍 Otros'
  };
  return nombres[ubicacion] || ubicacion;
}

// Registrar movimiento de inventario
window.registrarMovimientoInventario = function(movimiento) {
  try {
    movimiento.arroz = movimiento.arroz || movimiento.ab1 || 0;
    movimiento.precocido = movimiento.precocido || movimiento.ap1 || 0;
    movimiento.frijol1 = movimiento.frijol1 || movimiento.fr1 || 0;
    movimiento.frijol4 = movimiento.frijol4 || movimiento.fr4 || 0;
    movimiento.aceite = movimiento.aceite || movimiento.ac || 0;
    movimiento.harina = movimiento.harina || movimiento.ha || 0;

    // Validar estructura del movimiento
    var camposRequeridos = ['id', 'fecha', 'ubicacion', 'lugar', 'tipo', 'referencia'];
    var camposFaltantes = [];
    
    camposRequeridos.forEach(function(campo) {
      if (!movimiento[campo]) {
        camposFaltantes.push(campo);
      }
    });
    
    if (camposFaltantes.length > 0) {
      console.error('Movimiento inválido - campos faltantes:', camposFaltantes);
      return { success: false, mensaje: 'Campos requeridos faltantes: ' + camposFaltantes.join(', ') };
    }
    
    // Validar que tenga al menos un producto
    var productos = ['arroz', 'precocido', 'frijol1', 'frijol4', 'aceite', 'harina'];
    var tieneProductos = productos.some(function(producto) {
      return movimiento[producto] !== undefined && movimiento[producto] !== 0;
    });
    
    if (!tieneProductos) {
      console.error('Movimiento inválido - no tiene productos');
      return { success: false, mensaje: 'El movimiento debe incluir al menos un producto' };
    }
    
    // Leer inventario actual
    var inventario = JSON.parse(localStorage.getItem('inventario-data') || '[]');
    
    // Agregar el nuevo movimiento
    inventario.push({
      id: movimiento.id,
      fecha: movimiento.fecha,
      ubicacion: movimiento.ubicacion,
      lugar: movimiento.lugar || 'Sin especificar',
      arroz: movimiento.arroz || 0,
      precocido: movimiento.precocido || 0,
      frijol1: movimiento.frijol1 || 0,
      frijol4: movimiento.frijol4 || 0,
      aceite: movimiento.aceite || 0,
      harina: movimiento.harina || 0,
      total: Math.abs((movimiento.arroz || 0) + (movimiento.precocido || 0) + (movimiento.frijol1 || 0) + (movimiento.frijol4 || 0) + (movimiento.aceite || 0) + (movimiento.harina || 0)),
      observaciones: movimiento.tipo + ' - ' + movimiento.referencia,
      timestamp: new Date().toISOString()
    });
    
    // Guardar inventario actualizado
    localStorage.setItem('inventario-data', JSON.stringify(inventario));
    
    return { success: true, mensaje: 'Movimiento registrado correctamente' };
    
  } catch (e) {
    console.error('Error al registrar movimiento de inventario:', e);
    return { success: false, mensaje: 'Error al registrar movimiento: ' + e.message };
  }
};

// ── FUNCIONES DE MIGRACIÓN ──

// Migrar registros antiguos
window.migrateOldRecords = function(){
  try{
    var hist = JSON.parse(localStorage.getItem('exc_agro_hist')||'[]');
    var inventario = JSON.parse(localStorage.getItem('inventario-data')||'[]');
    var needsUpdate = false;
    
    // Migrar historial
    hist.forEach(function(registro){
      if(registro.ventas_unidades && registro.ventas_unidades.fr20){
        registro.ventas_unidades.fr4 = registro.ventas_unidades.fr20;
        delete registro.ventas_unidades.fr20;
        needsUpdate = true;
      }
    });
    
    // Migrar inventario
    inventario.forEach(function(item){
      if(item.producto === 'fr20'){
        item.producto = 'fr4';
        needsUpdate = true;
      }
    });
    
    if(needsUpdate){
      localStorage.setItem('exc_agro_hist', JSON.stringify(hist));
      localStorage.setItem('inventario-data', JSON.stringify(inventario));
      // console.log('Registros migrados de fr20 a fr4');
    }
  } catch(e){
    console.error('Error en migración:', e);
  }
};

// ── WRAPPER PARA REFRESCO DE HISTORIAL ──

(function(){
  const guardarOriginal = window.guardarRegistro;

  window.guardarRegistro = function(){
    if (typeof guardarOriginal === 'function') {
      guardarOriginal.apply(this, arguments);
    }

    setTimeout(function(){
      if (typeof renderHistorial === 'function') renderHistorial();
      if (typeof renderBancos === 'function') renderBancos();
      if (typeof actualizarResumenRemesasDia === 'function') actualizarResumenRemesasDia();
      if (typeof calcularTotalesGenerales === 'function') calcularTotalesGenerales();

      const cont = document.getElementById('historial-registros-content');
      if (cont) cont.style.display = 'block';

      const btn = document.getElementById('btn-toggle-historial-registros');
      if (btn) btn.textContent = '▲';

      const icon = document.getElementById('historial-toggle-icon');
      if (icon) icon.textContent = '▲';
    }, 80);
  };
})();
