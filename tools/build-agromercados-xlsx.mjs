import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const groups = {
  "TIENDONA ARRIBA": [
    "Acajutla, mercado de Acajutla",
    "Alcaldia de Mejicanos",
    "Apastepeque",
    "Apopa, Parque Central Noe Canjura",
    "Chalchuapa parque central",
    "Chinameca, Parque Central",
    "Ciudad barrios tiangue municipal",
    "Ciudad Delgado, Plaza Monsenor Romero",
    "Cojutepeque, parque Alamedas",
    "Colonia El Palmar",
    "El Paraiso, cancha techada de parque municipal",
    "Ilobasco, Parque Central",
    "Ilopango, TICSA",
    "Izalco, Casa Barrientos",
    "Jocoaltique, supermercado los quebrachos",
    "Metapan (Mercado municipal exrastro)",
    "Parque Concordia",
    "Parque Ecologico Olocuilta",
    "Placita El Calvario",
    "Quezaltepeque, Plaza Centenario",
    "San Francisco Menendez (Colonia La Palma)",
    "San Marcos, Parque Joyas de Esperanza y Paz",
    "San Rafael Cedro",
    "Santa Tecla, Parque Daniel Hernandez ( frente a mezon goya)",
    "Sensuntepeque, Parque Central",
    "Soyapango, Redondel de Unicentro",
    "Zacatecoluca, Plaza Civica"
  ],
  "TIENDONA ABAJO": [
    "Armenia, parque de Armenia",
    "Frente a la Alcaldia de Suchitoto",
    "Frente a la parroquia Carlos Borromeo",
    "Ilopango, Esquina Polideportivo Altavista",
    "Nueva Concepcion parque municipal",
    "Parque Central Aguilares",
    "Parque Rafael Campos, 7a. Calle Poniente, 7a. Calle Oriente",
    "Polideportivo El Congo",
    "San Martin, Alcaldia de San Martin",
    "Skate Park colonia IVU"
  ],
  "CDA SOYAPANGO": [
    "Av 5 de noviembre, contiguo a casa de la cultura de Atiquizaya",
    "Ayutuxtepeque, Plaza Municipal ( Parque Bonanza Agromercado)",
    "Bo el centro, 6a calle poniente, Juayua",
    "Ciudad Arce, Parque Central",
    "Esquina Cancha Tacon",
    "Km 12 Calle Alberto Masferrer , Santo Tomas",
    "Parque Municipal Mario Molina",
    "San Juan Opico, Parque Central",
    "San Vicente, Parque Central",
    "Santa Tecla 2",
    "Zaragoza"
  ],
  "CDA USULUTAN": [
    "Anamoros calle cirilo bonilla umanzor",
    "Barrio la cruz, km. 121 El Transito",
    "Campo de La Feria San Francisco Gotera",
    "Centro de Gobierno Municipal",
    "Corinto barrio las delicias",
    "Jiquilisco, esquina opuesta a la Alcaldia Municipal de Jiquilisco",
    "Jocoro Polideportivo Tierra de Fuego",
    "Mercado Municipal #5, Final 18 Ave Norte Mercado Municipal #5",
    "Parque Berlin de Ex injuve de Berlin",
    "Parque de Alcaldia Municipal del Triunfo",
    "San Miguel Centro (Barraza)",
    "Santa Rosa de Lima, Terminal de Buses Santa Rosa de Lima",
    "Zona verde, colonia Las Mercedes 1ra salida hacia el Triunfo( SANTIAGO DE MARIA)"
  ]
};

for (const key of Object.keys(groups)) {
  groups[key].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
}

const workbook = Workbook.create();
const resumen = workbook.worksheets.add("Resumen");
const datos = workbook.worksheets.add("Agromercados");

resumen.showGridLines = false;
datos.showGridLines = false;

resumen.getRange("A1:D1").merge();
resumen.getRange("A1").values = [["Agromercados por Ubicacion"]];
resumen.getRange("A1").format = {
  fill: "#17456B",
  font: { bold: true, color: "#FFFFFF", size: 16 },
  horizontalAlignment: "center"
};

const summaryRows = [["Seccion", "Cantidad"]];
for (const [section, names] of Object.entries(groups)) summaryRows.push([section, names.length]);
summaryRows.push(["TOTAL", Object.values(groups).reduce((sum, names) => sum + names.length, 0)]);
resumen.getRangeByIndexes(2, 0, summaryRows.length, 2).values = summaryRows;
resumen.getRangeByIndexes(2, 0, 1, 2).format = {
  fill: "#D9EAF7",
  font: { bold: true, color: "#0F2F4D" }
};
resumen.getRangeByIndexes(2 + summaryRows.length - 1, 0, 1, 2).format = {
  fill: "#E8F5E9",
  font: { bold: true, color: "#14532D" }
};
resumen.getRange("A:A").format.columnWidthPx = 230;
resumen.getRange("B:B").format.columnWidthPx = 90;

const rows = [["Seccion", "Orden", "Agromercado"]];
for (const [section, names] of Object.entries(groups)) {
  names.forEach((name, index) => rows.push([section, index + 1, name]));
}

datos.getRangeByIndexes(0, 0, rows.length, 3).values = rows;
datos.getRange("A1:C1").format = {
  fill: "#17456B",
  font: { bold: true, color: "#FFFFFF" }
};
datos.getRange("A:A").format.columnWidthPx = 180;
datos.getRange("B:B").format.columnWidthPx = 70;
datos.getRange("C:C").format.columnWidthPx = 520;
datos.getRangeByIndexes(1, 0, rows.length - 1, 3).format = {
  wrapText: true,
  verticalAlignment: "top"
};
datos.freezePanes.freezeRows(1);

const outDir = path.resolve("outputs", "agromercados");
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, "agromercados-preview.txt"), rows.map((r) => r.join("\t")).join("\n"));

const inspected = await workbook.inspect({
  kind: "table",
  range: "Agromercados!A1:C20",
  include: "values",
  tableMaxRows: 20,
  tableMaxCols: 3
});
console.log(inspected.ndjson);

await workbook.render({ sheetName: "Agromercados", range: "A1:C25", scale: 1, format: "png" });

const output = await SpreadsheetFile.exportXlsx(workbook);
const outPath = path.join(outDir, "agromercados_por_ubicacion.xlsx");
await output.save(outPath);
console.log(outPath);
