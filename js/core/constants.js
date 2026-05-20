// ══ CONSTANTES Y DATOS FIJOS DEL SISTEMA ══

// Productos del sistema
var PRODUCTOS = ['ab1','ap1','fr1','fr4','ac','ha'];

// Nombres de productos para mostrar
var PRODUCTOS_NOMBRES = ['AB 1lb', 'AP 1lb', 'FR 1lb', 'FR 4lb', 'Aceite', 'Harina'];

// Claves de productos para formularios, precios e inventario
var PRODUCTOS_KEYS = ['ab1', 'ap1', 'fr1', 'fr4', 'ac', 'ha'];

// Precios por unidad de cada producto
var PRECIOS = {
  'ab1':0.25,
  'ap1':0.60,
  'fr1':0.70, 'fr4':2.80,
  'ac':2.00,
  'ha':1.10
};

// Datos de agromercados por distrito
var AGROMERCADOS_DATA = {
  "AHUACHAPAN SUR": [
    {m:"San Francisco Menendez", a:"San Francisco Menendez (Colonia La Palma)"}
  ],
  "AHUACHAPAN CENTRO": [
    {m:"Ahuachapan", a:"Parque Concordia"},
    {m:"Atiquizaya", a:"Av 5 de noviembre, contiguo a casa de la cultura de Atiquizaya"}
  ],
  "SANTA ANA NORTE": [
    {m:"Metapan", a:"Metapan (Mercado municipal exrastro)"}
  ],
  "SANTA ANA CENTRO": [
    {m:"Santa Ana", a:"Colonia El Palmar"},
    {m:"Santa Ana", a:"Skate Park colonia IVU"}
  ],
  "SANTA ANA OESTE": [
    {m:"Chalchuapa", a:"Chalchuapa parque central"}
  ],
  "CHALATENANGO CENTRO": [
    {m:"Nueva Concepcion", a:"Nueva Concepcion parque municipal"},
    {m:"El Paraiso", a:"El Paraiso, cancha techada de parque municipal"}
  ],
  "CHALATENANGO SUR": [
    {m:"Chalatenango", a:"Placita El Calvario"}
  ],
  "SONSONATE OESTE": [
    {m:"Acajutla", a:"Acajutla, mercado de Acajutla"},
    {m:"Juayua", a:"Bo el centro, 6a calle poniente, Juayua"}
  ],
  "SONSONATE ESTE": [
    {m:"Armenia", a:"Armenia, parque de Armenia"},
    {m:"Izalco", a:"Izalco, Casa Barrientos"}
  ],
  "SONSONATE CENTRO": [
    {m:"Sonsonate", a:"Parque Rafael Campos, 7a. Calle Poniente, 7a. Calle Oriente"}
  ],
  "LA LIBERTAD SUR": [
    {m:"Santa Tecla", a:"Santa Tecla, Parque Daniel Hernandez ( frente a mezon goya)"}
  ],
  "LA LIBERTAD CENTRO": [
    {m:"San Juan Opico", a:"San Juan Opico, Parque Central"},
    {m:"Ciudad Arce", a:"Ciudad Arce, Parque Central"}
  ],
  "LA LIBERTAD NORTE": [
    {m:"Quezaltepeque", a:"Quezaltepeque, Plaza Centenario"}
  ],
  "LA LIBERTAD COSTA": [
    {m:"Zaragoza", a:"Zaragoza, entrada principal"},
    {m:"La Libertad", a:"La Libertad, parque central"}
  ],
  "SAN SALVADOR CENTRO": [
    {m:"San Salvador", a:"San Salvador, Plaza Cívica"},
    {m:"San Salvador", a:"San Salvador, Ex Estadio Nacional"},
    {m:"San Salvador", a:"San Salvador, Centro de Gobierno"}
  ],
  "SAN SALVADOR NORTE": [
    {m:"Apopa", a:"Apopa, parque central"},
    {m:"Mejicanos", a:"Mejicanos, parque central"}
  ],
  "SAN SALVADOR ORIENTE": [
    {m:"Ilopango", a:"Ilopango, mercado municipal"},
    {m:"Soyapango", a:"Soyapango, plaza municipal"}
  ],
  "SAN SALVADOR SUR": [
    {m:"San Marcos", a:"San Marcos, parque central"},
    {m:"Santiago Texacuango", a:"Santiago Texacuango, parque central"}
  ],
  "CUSCATLAN CENTRO": [
    {m:"Cojutepeque", a:"Cojutepeque, parque central"}
  ],
  "CUSCATLAN NORTE": [
    {m:"Suchitoto", a:"Suchitoto, parque central"}
  ],
  "LA PAZ CENTRO": [
    {m:"Zacatecoluca", a:"Zacatecoluca, parque central"}
  ],
  "LA PAZ NORTE": [
    {m:"Santiago Nonualco", a:"Santiago Nonualco, parque central"}
  ],
  "CABAÑAS CENTRO": [
    {m:"Sensuntepeque", a:"Sensuntepeque, parque central"}
  ],
  "SAN VICENTE CENTRO": [
    {m:"San Vicente", a:"San Vicente, parque central"}
  ],
  "USULUTAN CENTRO": [
    {m:"Usulutan", a:"Usulutan, parque central"}
  ],
  "USULUTAN COSTA": [
    {m:"Jiquilisco", a:"Jiquilisco, parque central"}
  ],
  "SAN MIGUEL CENTRO": [
    {m:"San Miguel", a:"San Miguel, parque central"}
  ],
  "SAN MIGUEL NORTE": [
    {m:"Chinameca", a:"Chinameca, parque central"}
  ],
  "MORAZAN CENTRO": [
    {m:"San Francisco Gotera", a:"San Francisco Gotera, parque central"}
  ],
  "LA UNION CENTRO": [
    {m:"La Union", a:"La Union, parque central"}
  ]
};

// Bancos iniciales del sistema
var BANCOS_INICIALES = [
  { nombre: "Banco Agrícola", cuenta: "560-005547-0" },
  { nombre: "BAC Credomatic", cuenta: "200992790" },
  { nombre: "Banco Cuscatlán", cuenta: "0405-01747" },
  { nombre: "Banco Davivienda", cuenta: "000-00000-0" },
  { nombre: "Banco Promérica", cuenta: "000-00000-0" }
];

// Días de la semana
function diasSemana(){return ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];}

// Variable de compatibilidad para código existente
var BANCOS_LIST = [];

// ══ CATÁLOGO MAESTRO DE LOCALIDADES ══
// Fuente única de datos para Distrito → Municipio → Agromercado
var LOCALIDADES_MASTER = [];

// Datos de Distribución Tiendona
var TIENDONA_DATOS = {
  'DESCARGAS TIENDONA - ABAJO': [
    'SANTA ANA (IVU)',
    'NUEVA CONCEPCION',
    'ARMENIA',
    'SAN MARTIN',
    'ILOPANGO (ALTAVISTA)',
    'LA UNION',
    'SONSONATE',
    'AGUILARES',
    'SUCHITOTO',
    'EL CONGO',
    'EL TRIUNFO'
  ],
  'DESCARGAS TIENDONA - ARRIBA': [
    'SAN FRANCISCO MENENDEZ',
    'SANTA ANA (EL PALMAR)',
    'METAPAN',
    'CHALCHUAPA',
    'EL PARAÍSO',
    'ACAJUTLA',
    'IZALCO',
    'SANTA TECLA',
    'QUEZALTEPEQUE',
    'MEJICANOS',
    'CIUDAD DELGADO',
    'APOPA',
    'ILOPANGO (TICSA)',
    'SOYAPANGO',
    'AHUACHAPAN',
    'SAN MARCOS',
    'COJUTEPEQUE',
    'SENSUNTEPEQUE',
    'ILOBASCO',
    'ZACATECOLUCA',
    'CHINAMECA',
    'JOCOAITIQUE / MEANGUERA',
    'CHALATENANGO',
    'OLOCUILTA',
    'APASTEPEQUE',
    'CIUDAD BARRIOS',
    'SAN RAFAEL CEDROS'
  ]
};

// Generar LOCALIDADES_MASTER a partir de AGROMERCADOS_DATA
function generarLocalidadesMaster(){
  LOCALIDADES_MASTER = [];
  
  // Convertir AGROMERCADOS_DATA a formato unificado
  Object.keys(AGROMERCADOS_DATA).forEach(function(distrito){
    AGROMERCADOS_DATA[distrito].forEach(function(entry){
      LOCALIDADES_MASTER.push({
        tipo: 'AGROMERCADO',
        grupo: 'AGROMERCADO',
        distrito: distrito,
        municipio: entry.m,
        agromercado: entry.a
      });
    });
  });
  
  // Agregar datos de TIENDONA
  Object.keys(TIENDONA_DATOS).forEach(function(grupo){
    TIENDONA_DATOS[grupo].forEach(function(lugar){
      LOCALIDADES_MASTER.push({
        tipo: 'TIENDONA',
        grupo: grupo,
        distrito: '',
        municipio: '',
        agromercado: lugar
      });
    });
  });
  
  return LOCALIDADES_MASTER;
}

// Inicializar catálogo
generarLocalidadesMaster();

// Funciones helper para filtrar localidades
window.obtenerDistritos = function(tipo){
  tipo = tipo || 'AGROMERCADO';
  var distritos = [];
  LOCALIDADES_MASTER.forEach(function(item){
    if(item.tipo === tipo && distritos.indexOf(item.distrito) === -1){
      distritos.push(item.distrito);
    }
  });
  return distritos.sort();
};

window.obtenerGrupos = function(tipo){
  var grupos = [];
  LOCALIDADES_MASTER.forEach(function(item){
    if(item.tipo === tipo && grupos.indexOf(item.grupo) === -1){
      grupos.push(item.grupo);
    }
  });
  return grupos.sort();
};

window.obtenerMunicipios = function(distrito, tipo){
  tipo = tipo || 'AGROMERCADO';
  var municipios = [];
  LOCALIDADES_MASTER.forEach(function(item){
    if(item.distrito === distrito && item.tipo === tipo && municipios.indexOf(item.municipio) === -1){
      municipios.push(item.municipio);
    }
  });
  return municipios.sort();
};

window.obtenerAgromercados = function(distrito, municipio, tipo){
  tipo = tipo || 'AGROMERCADO';
  var agromercados = [];
  LOCALIDADES_MASTER.forEach(function(item){
    if(item.distrito === distrito && item.municipio === municipio && item.tipo === tipo){
      if(agromercados.indexOf(item.agromercado) === -1){
        agromercados.push(item.agromercado);
      }
    }
  });
  return agromercados.sort();
};
