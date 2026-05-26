import Excel from "xlsx-populate/browser/xlsx-populate";
import api from "../../Sources/Api";
import { format } from "date-fns";

const headers = [
  "Tribunal",
  "Carátula",
  "Cuaderno",
  "RIT Causa",
  "Procedimiento",
  "Fecha Retiro",
  "Nombre Cliente",
  "RUT Cliente",
  "Cliente Masivo",
  "RUT Cliente Masivo",
  "Fecha presentación a notificar",
  "Folio presentación",
  "Fecha resolución",
  "Folio resolución",
  "Nombre Contraparte",
  "RUT Contraparte",
  "Es Aval",
  "Domicilio Contraparte",
  "Persona Jdca Contraparte",
  "RUT P. Jdca. Contraparte",
  "Sector Jurisdicción",
  "Capital adeudado",
];

export async function downloadGeneralImportXLSX() {
  const workbook = await Excel.fromBlankAsync();

  const sheet = workbook.sheet(0).name("Importacion");

  const charWidthFactor = 1.2;

  headers.forEach((header, index) => {
    const headCell = sheet.cell(1, index + 1);

    headCell.value(header);
    headCell.style("bold", true);
    sheet.column(index + 1).width(header.length * charWidthFactor);
    headCell.style("fill", {
      type: "pattern",
      pattern: "darkDown",
      foreground: {
        rgb: "CFE2F3",
      },
      border: true,
      background: {
        theme: 3,
        tint: 0.4,
      },
    });
  });

  const sectors = await api
    .get("/users/sectors")
    .then((res) => res.data.map((x) => x.name));

  for (let i = 2; i <= 1000; i++) {
    const cell = sheet.cell(i, 21);
    cell.dataValidation('"' + sectors.join(",") + '"');
  }

  for (let i = 2; i <= 1000; i++) {
    const cell = sheet.cell(i, 17);
    cell.dataValidation('"SI,NO"');
  }

  for (let i = 2; i <= 1000; i++) {
    const cell = sheet.cell(i, 5);
    cell.dataValidation('"Ordinario,Ejecutivo,Arrendamiento,Voluntarios"');
  }

  const sheetBlob = await workbook.outputAsync("blob");

  const url = window.URL.createObjectURL(sheetBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Formato-Importacion.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

export async function importGeneralXLSX(file) {
  const workbook = await Excel.fromDataAsync(file);
  const sheet = workbook.sheet(0);

  const currentSheetHeaders = [];
  const data = [];

  for (let i = 1; i <= headers.length; i++) {
    const cell = sheet.cell(1, i);
    if (headers.includes(cell.value().trim()))
      currentSheetHeaders.push({ name: cell.value().trim(), index: i });
  }

  let noData = 0;

  if (
    headers.every((x) => currentSheetHeaders.map((y) => y.name).includes(x))
  ) {
    for (let i = 1; i <= 1000; i++) {
      const row = sheet.row(i + 1);

      const dataRow = {};

      for (let j = 1; j <= currentSheetHeaders.length; j++) {
        const cell = row.cell(currentSheetHeaders[j - 1].index);
        dataRow[currentSheetHeaders[j - 1].name] = cell.value();
      }

      if (
        Object.values(dataRow).every(
          (x) => x === null || x === undefined || x === ""
        )
      ) {
        noData++;
        if (noData > 5) {
          break;
        }
        continue;
      }

      data.push(dataRow);
    }

    return data;
  } else {
    throw new Error(
      "Los encabezados del archivo no coinciden con los esperados."
    );
  }
}

const headersSecond = [
  "RIT Causa",
  "Fecha Retiro",
  "Fecha Diligencia",
  "Hora Diligencia",
  "Resultado diligencia",
  "Vecinos/Residentes",
  "Fecha Cedula Espera",
  "Hora Cedula Espera",
];

export async function downloadSecondImportXLSX() {
  const workbook = await Excel.fromBlankAsync();

  const dateSheet = workbook.addSheet("ListaDatos");
  const sheet = workbook.sheet(0).name("Importacion");

  const charWidthFactor = 1.2;

  dateSheet.hidden(true);

  headersSecond.forEach((header, index) => {
    const headCell = sheet.cell(1, index + 1);

    headCell.value(header);
    headCell.style("bold", true);
    sheet.column(index + 1).width(header.length * charWidthFactor);
    headCell.style("fill", {
      type: "pattern",
      pattern: "darkDown",
      foreground: {
        rgb: "CFE2F3",
      },
      border: true,
      background: {
        theme: 3,
        tint: 0.4,
      },
    });
  });

  const diligencesPending = await api.get("/diligences").then((res) => {
    return res.data.filter((x) => x.diligenceresultunique === "pendiente");
  });

  diligencesPending.forEach((diligence, i) => {
    sheet.cell(i+2, 1).value(diligence.rit);
    sheet
      .cell(i+2, 2)
      .value(format(new Date(diligence.withdrawldate), "dd-MM-yyyy"));
  });

  const diligenceResults = await api
    .get("/diligences/results")
    .then((res) =>
      res.data.map((x) => x.name).filter((x) => x !== "Pendiente")
    );

  diligenceResults.forEach((valor, index) => {
    dateSheet.cell(`A${index + 1}`).value(valor);
  });

  for (let i = 2; i <= 1000; i++) {
    const cell = sheet.cell(i, 5);
    cell.dataValidation({
      type: "list",

      formula1: `ListaDatos!$A$1:$A$${diligenceResults.length}`,
      allowBlank: true,
      showDropDown: true,
      error: "Valor no válido",
      errorTitle: "Error de Entrada",
      errorStyle: "stop",
      prompt: "Seleccione una opción de la lista",
      promptTitle: "Resultado diligencia",
    });
  }

  for (let i = 2; i <= 1000; i++) {
    const cell = sheet.cell(i, 6);
    cell.dataValidation('"' + ["Vecinos", "Residentes", "NA"].join(",") + '"');
  }

  const sheetBlob = await workbook.outputAsync("blob");

  const url = window.URL.createObjectURL(sheetBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Formato-Importacion-Diligencias.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

export async function importSecondXLSX(file) {
  const workbook = await Excel.fromDataAsync(file);
  const sheet = workbook.sheet(0);

  const currentSheetHeaders = [];
  const data = [];

  for (let i = 1; i <= headersSecond.length; i++) {
    const cell = sheet.cell(1, i);
    if (headersSecond.includes(cell.value().trim()))
      currentSheetHeaders.push({ name: cell.value(), index: i });
  }

  let noData = 0;

  if (
    headersSecond.every((x) =>
      currentSheetHeaders.map((y) => y.name).includes(x)
    )
  ) {
    for (let i = 1; i <= 1000; i++) {
      const row = sheet.row(i + 1);

      const dataRow = {};

      for (let j = 1; j <= currentSheetHeaders.length; j++) {
        const cell = row.cell(currentSheetHeaders[j - 1].index);
        dataRow[currentSheetHeaders[j - 1].name] = cell.value();
      }

      if (
        Object.values(dataRow).every(
          (x) => x === null || x === undefined || x === ""
        )
      ) {
        noData++;
        if (noData > 5) {
          break;
        }
        continue;
      }

      data.push(dataRow);
    }

    return data;
  } else {
    throw new Error(
      "Los encabezados del archivo no coinciden con los esperados."
    );
  }
}
