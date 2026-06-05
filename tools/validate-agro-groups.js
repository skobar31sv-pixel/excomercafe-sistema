const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const constants = fs.readFileSync('js/core/constants.js', 'utf8');
const scriptMatch = html.match(/var LISTA_CDA = \[[\s\S]*?window\.actualizarClasificacionAgromercados = function/);
if (!scriptMatch) {
  throw new Error('No se encontro bloque de clasificacion');
}

const code = scriptMatch[0].replace(/window\.actualizarClasificacionAgromercados = function$/, '');
const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(constants, context);
vm.runInContext(code, context);
context.obtenerGrupoCDAParaDestino = context.window.obtenerGrupoCDAParaDestino;
context.obtenerGrupoTiendonaParaDestino = context.window.obtenerGrupoTiendonaParaDestino;

const tests = {
  'tiendona-abajo': [
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
    'EL TRIUNFO',
  ],
  'tiendona-arriba': [
    'SAN FRANCISCO MENENDEZ',
    'SANTA ANA (EL PALMAR)',
    'METAPAN',
    'CHALCHUAPA',
    'EL PARAISO',
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
    'JOCOAITIQUE /MEANGUERA',
    'CHALATENANGO',
    'OLOCUILTA',
    'APASTEPEQUE',
    'CIUDAD BARRIOS',
    'SAN RAFAEL CEDROS',
  ],
  'cda-soyapango': [
    'CIUDAD ARCE',
    'PUERTO DE LA LIBERTAD',
    'ZARAGOZA',
    'SANTA TECLA 2',
    'ATIQUIZAYA',
    'BERLIN',
    'JOCORO',
    'SAN MIGUEL',
    'CORINTO',
    'SAN MIGUEL (BARRAZA)',
    'ANAMOROS',
    'AYUTUXTEPEQUE',
    'SAN JUAN OPICO',
    'SANTO TOMAS',
    'COLON',
    'JUAYUA',
    'SAN VICENTE',
  ],
  'cda-usulutan': [
    'JIQUILISCO',
    'SANTIAGO DE MARIA',
    'EL TRANSITO',
    'SANTA ROSA DE LIMA',
    'SAN FRANCISCO GOTERA',
    'USULUTAN',
  ],
};

function actualGroup(name) {
  const cda = context.window.obtenerGrupoCDAParaDestino(name);
  if (cda) return `cda-${cda}`;
  const tiendona = context.window.obtenerGrupoTiendonaParaDestino(name);
  if (tiendona) return `tiendona-${tiendona}`;
  return 'sin-clasificar';
}

const failures = [];
Object.entries(tests).forEach(([expected, names]) => {
  names.forEach((name) => {
    const actual = actualGroup(name);
    if (actual !== expected) failures.push({ name, expected, actual });
  });
});

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}

const orderFailures = [];
[
  ['tiendona-abajo', context.window.ordenarDestinosTiendona],
  ['tiendona-arriba', context.window.ordenarDestinosTiendona],
  ['cda-soyapango', context.window.ordenarDestinosCDA],
  ['cda-usulutan', context.window.ordenarDestinosCDA],
].forEach(([group, sorter]) => {
  const original = context.AGROMERCADOS_GRUPOS_OFICIALES[group] || [];
  const sorted = original.slice().sort(sorter);
  if (JSON.stringify(original) !== JSON.stringify(sorted)) {
    orderFailures.push({ group, original, sorted });
  }
});

if (orderFailures.length) {
  console.error(JSON.stringify(orderFailures, null, 2));
  process.exit(1);
}

console.log('clasificacion y orden ok', Object.values(tests).flat().length, 'destinos');
