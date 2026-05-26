import XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import downloadFiles from "./downloadFiles";

/**
 * Genera un Excel estilizado y autoajustado con xlsx-populate y lo descarga.
 * @param {Array} rows - Fuente de datos (array de objetos)
 * @param {Array} properties - Propiedades a extraer en orden (array de strings)
 * @param {Array} headers - Encabezados para la primera fila (array de strings)
 */
export default function exportExcel(rows, properties, headers) {
  XlsxPopulate.fromBlankAsync()
    .then(workbook => {
      const sheet = workbook.sheet(0).name("Data");

      // Escribir encabezados y aplicar formato
      headers.forEach((header, i) => {
        const cell = sheet.cell(1, i + 1);
        cell.value(header)
          .style({
            bold: true,
            fill: "0070C0",
            fontColor: "FFFFFF"
          });
      });

      // Escribir los datos
      rows.forEach((row, rIdx) => {
        properties.forEach((prop, cIdx) => {
          sheet.cell(rIdx + 2, cIdx + 1).value(row[prop]);
        });
      });

      // Autofit columnas (calculando el máximo largo de dato por columna)
      headers.forEach((header, cIdx) => {
        const col = cIdx + 1;
        let maxLen = header.toString().length;
        rows.forEach(row => {
          const val = row[properties[cIdx]];
          maxLen = Math.max(
            maxLen,
            val !== undefined && val !== null ? val.toString().length : 0
          );
        });
        // Ajusta un poco más para padding visual
        sheet.column(col).width(Math.min(maxLen + 2, 40));
      });

      // Salida como base64 para descarga directa
      return workbook.outputAsync("base64");
    })
    .then(base64String => {
      downloadFiles([
        {
          base64: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64String}`,
          title: `export_${Date.now()}.xlsx`,
        },
      ]);
    })
    .catch(err => {
      console.error("Error generando el Excel:", err);
    });
}