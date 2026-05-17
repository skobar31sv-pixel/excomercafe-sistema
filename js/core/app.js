// ══ NAVEGACIÓN PRINCIPAL DE LA APLICACIÓN ══

// ── NAVEGACIÓN DE PESTAÑAS PRINCIPALES ──
window.switchTab = function(tabId, btn){
  document.querySelectorAll('.tab-content').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
  var tab = document.getElementById(tabId);
  if(tab) tab.classList.add('active');
  if(btn) btn.classList.add('active');
  else{
    document.querySelectorAll('.tab-btn').forEach(function(b){
      if((b.getAttribute('onclick')||'').includes("'"+tabId+"'")) b.classList.add('active');
    });
  }
  // Actualizar resumen si estamos en la pestaña Ingresar Datos
  if(tabId === 'tab-ingresar' && window.actualizarResumenIngresar) window.actualizarResumenIngresar();
  // Actualizar totales generales (safe call)
  if(window.calcularTotalesGenerales) window.calcularTotalesGenerales();
};

// ── NAVEGACIÓN INTERNA DE DATOS Y UBICACIÓN ──
window.mostrarSeccionDatos = function(seccion){
  // Ocultar todas las secciones
  document.querySelectorAll('.seccion-datos').forEach(function(el){
    el.style.display = 'none';
  });
  
  // Mostrar la sección seleccionada
  var seccionEl = document.getElementById('seccion-' + seccion);
  if(seccionEl){
    seccionEl.style.display = 'block';
    
    // Cargar datos específicos de la sección
    switch(seccion){
      case 'distritos':
        if(window.renderDistritos) window.renderDistritos();
        break;
      case 'agromercados':
        if(window.renderAgromercados) window.renderAgromercados();
        break;
      case 'cda':
        if(window.renderCDA) window.renderCDA();
        break;
      case 'personas':
        if(window.renderPersonas) window.renderPersonas();
        break;
      case 'transporte':
        if(window.renderTransporte) window.renderTransporte();
        break;
      case 'bancos':
        if(window.renderBancosDatos) window.renderBancosDatos();
        break;
      case 'departamentos':
        if(window.renderDepartamentos) window.renderDepartamentos();
        break;
    }
    
    // Actualizar botones activos
    document.querySelectorAll('.tabs .tab-btn').forEach(function(b){
      b.classList.remove('active');
    });
    document.querySelectorAll('.tabs .tab-btn').forEach(function(b){
      if((b.getAttribute('onclick')||'').includes("'"+seccion+"'")) b.classList.add('active');
    });
  }
};
